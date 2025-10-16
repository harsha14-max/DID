// =====================================================
// BSM Platform - Customer Credit Score Component
// =====================================================
// Component for displaying and managing credit scores in the customer portal

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  BarChart3, 
  Award, 
  AlertTriangle,
  CheckCircle,
  Info,
  Calculator,
  History,
  Target,
  Zap
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { 
  CreditScoreProps,
  CreditScoreCalculation,
  ScoreBreakdown,
  VerifiableCredential
} from '@/types/credit'
import { creditScoringAlgorithm } from '@/components/shared/credit/CreditScoringAlgorithm'
import { vcIssuer } from '@/components/shared/credit/VCIssuer'

export default function CreditScore({ userId, showBreakdown, onScoreCalculated }: CreditScoreProps) {
  const [currentScore, setCurrentScore] = useState<number>(300)
  const [scoreCalculation, setScoreCalculation] = useState<CreditScoreCalculation | null>(null)
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null)
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([])
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [scoreHistory, setScoreHistory] = useState<Array<{ score: number; date: string }>>([])

  useEffect(() => {
    loadCreditData()
  }, [userId])

  const loadCreditData = async () => {
    try {
      setLoading(true)
      
      // Load user's credentials
      const userCredentials = await vcIssuer.getUserCredentials(userId)
      setCredentials(userCredentials)
      
      // Calculate current score
      await calculateScore(userCredentials)
      
      // Load score history (mock data for now)
      setScoreHistory([
        { score: 320, date: '2024-01-01' },
        { score: 350, date: '2024-01-15' },
        { score: 380, date: '2024-02-01' },
        { score: 420, date: '2024-02-15' },
        { score: 450, date: '2024-03-01' },
        { score: 480, date: '2024-03-15' },
        { score: currentScore, date: new Date().toISOString().split('T')[0] }
      ])
    } catch (error) {
      console.error('Error loading credit data:', error)
      toast.error('Failed to load credit data')
    } finally {
      setLoading(false)
    }
  }

  const calculateScore = async (userCredentials?: VerifiableCredential[]) => {
    try {
      setCalculating(true)
      
      const credentialsToUse = userCredentials || credentials
      
      // Validate credentials
      const { valid, invalid } = creditScoringAlgorithm.validateCredentials(credentialsToUse)
      
      if (valid.length === 0) {
        toast.error('No valid credentials found for score calculation')
        return
      }
      
      // Calculate score
      const calculation = creditScoringAlgorithm.calculateScore(valid)
      const breakdown = creditScoringAlgorithm.calculateScoreBreakdown(valid)
      
      setScoreCalculation(calculation)
      setScoreBreakdown(breakdown)
      setCurrentScore(calculation.final_score)
      
      if (onScoreCalculated) {
        onScoreCalculated(calculation.final_score)
      }
      
      toast.success('Credit score calculated successfully')
    } catch (error) {
      console.error('Error calculating score:', error)
      toast.error('Failed to calculate credit score')
    } finally {
      setCalculating(false)
    }
  }

  const getScoreInterpretation = (score: number) => {
    return creditScoringAlgorithm.getScoreInterpretation(score)
  }

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600'
    if (score >= 700) return 'text-blue-600'
    if (score >= 650) return 'text-yellow-600'
    if (score >= 600) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreProgressColor = (score: number) => {
    if (score >= 750) return 'bg-green-500'
    if (score >= 700) return 'bg-blue-500'
    if (score >= 650) return 'bg-yellow-500'
    if (score >= 600) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getScoreChange = () => {
    if (scoreHistory.length < 2) return 0
    const current = scoreHistory[scoreHistory.length - 1].score
    const previous = scoreHistory[scoreHistory.length - 2].score
    return current - previous
  }

  const scoreChange = getScoreChange()
  const interpretation = getScoreInterpretation(currentScore)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Credit Score</h2>
          <p className="text-gray-600">Your sovereign credit score based on verifiable credentials</p>
        </div>
        <Button 
          onClick={() => calculateScore()} 
          disabled={calculating}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${calculating ? 'animate-spin' : ''}`} />
          {calculating ? 'Calculating...' : 'Recalculate'}
        </Button>
      </div>

      {/* Main Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Current Credit Score
          </CardTitle>
          <CardDescription>
            Calculated from your verifiable credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score Display */}
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(currentScore)}`}>
                  {currentScore}
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge 
                    variant="outline" 
                    className={`${getScoreColor(currentScore)} border-current`}
                  >
                    {interpretation.category}
                  </Badge>
                  {scoreChange !== 0 && (
                    <div className={`flex items-center gap-1 text-sm ${
                      scoreChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {scoreChange > 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {Math.abs(scoreChange)} points
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{interpretation.description}</p>
              </div>

              {/* Score Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>300</span>
                  <span>850</span>
                </div>
                <Progress 
                  value={((currentScore - 300) / (850 - 300)) * 100} 
                  className="h-3"
                />
              </div>

              {/* Score Range Indicators */}
              <div className="grid grid-cols-5 gap-2 text-xs">
                <div className="text-center">
                  <div className="w-full h-2 bg-red-200 rounded mb-1"></div>
                  <span className="text-red-600">300-599</span>
                </div>
                <div className="text-center">
                  <div className="w-full h-2 bg-orange-200 rounded mb-1"></div>
                  <span className="text-orange-600">600-649</span>
                </div>
                <div className="text-center">
                  <div className="w-full h-2 bg-yellow-200 rounded mb-1"></div>
                  <span className="text-yellow-600">650-699</span>
                </div>
                <div className="text-center">
                  <div className="w-full h-2 bg-blue-200 rounded mb-1"></div>
                  <span className="text-blue-600">700-749</span>
                </div>
                <div className="text-center">
                  <div className="w-full h-2 bg-green-200 rounded mb-1"></div>
                  <span className="text-green-600">750-850</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs defaultValue="breakdown" className="space-y-4">
        <TabsList>
          <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
          <TabsTrigger value="factors">Contributing Factors</TabsTrigger>
          <TabsTrigger value="history">Score History</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-4">
          {scoreBreakdown && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Score Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Payment History</span>
                      <span className="text-sm font-bold">{scoreBreakdown.payment_history}</span>
                    </div>
                    <Progress value={(scoreBreakdown.payment_history / 200) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Service Completion</span>
                      <span className="text-sm font-bold">{scoreBreakdown.service_completion}</span>
                    </div>
                    <Progress value={(scoreBreakdown.service_completion / 150) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Identity Verification</span>
                      <span className="text-sm font-bold">{scoreBreakdown.identity_verification}</span>
                    </div>
                    <Progress value={(scoreBreakdown.identity_verification / 75) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Credit Utilization</span>
                      <span className="text-sm font-bold">{scoreBreakdown.credit_utilization}</span>
                    </div>
                    <Progress value={(scoreBreakdown.credit_utilization / 50) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Credit History Length</span>
                      <span className="text-sm font-bold">{scoreBreakdown.credit_history_length}</span>
                    </div>
                    <Progress value={(scoreBreakdown.credit_history_length / 50) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">New Credit Inquiries</span>
                      <span className="text-sm font-bold">{scoreBreakdown.new_credit_inquiries}</span>
                    </div>
                    <Progress value={(scoreBreakdown.new_credit_inquiries / 25) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Credentials</span>
                    <Badge variant="outline">{credentials.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Valid Credentials</span>
                    <Badge variant="outline">
                      {credentials.filter(c => !c.is_revoked).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Score Range</span>
                    <Badge variant="outline">300-850</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Updated</span>
                    <Badge variant="outline">
                      {scoreCalculation ? formatDate(scoreCalculation.calculation_date) : 'Never'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="factors" className="space-y-4">
          {scoreCalculation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contributing Factors</CardTitle>
                <CardDescription>
                  Detailed breakdown of what affects your credit score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scoreCalculation.contributing_factors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          factor.factor_type === 'positive' ? 'bg-green-100' : 
                          factor.factor_type === 'negative' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          {factor.factor_type === 'positive' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : factor.factor_type === 'negative' ? (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          ) : (
                            <Info className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium capitalize">
                            {factor.factor_name.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-600">{factor.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          factor.impact_score >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {factor.impact_score >= 0 ? '+' : ''}{factor.impact_score}
                        </p>
                        <p className="text-xs text-gray-500">
                          Weight: {Math.round(factor.weight * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Score History</CardTitle>
              <CardDescription>
                Track your credit score over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scoreHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <History className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{formatDate(entry.date)}</p>
                        <p className="text-sm text-gray-600">
                          {getScoreInterpretation(entry.score).category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getScoreColor(entry.score)}`}>
                        {entry.score}
                      </p>
                      {index > 0 && (
                        <p className={`text-xs ${
                          entry.score > scoreHistory[index - 1].score ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {entry.score > scoreHistory[index - 1].score ? '+' : ''}
                          {entry.score - scoreHistory[index - 1].score}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Improvement Recommendations</CardTitle>
              <CardDescription>
                Tips to improve your credit score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentScore < 600 && (
                  <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <Target className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">Build Credit History</p>
                      <p className="text-sm text-red-700">
                        Complete more services and maintain good payment history to build your credit profile.
                      </p>
                    </div>
                  </div>
                )}
                
                {credentials.filter(c => c.credential_type === 'payment_history').length === 0 && (
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Add Payment History</p>
                      <p className="text-sm text-yellow-700">
                        Establish payment history by completing utility payments or other recurring services.
                      </p>
                    </div>
                  </div>
                )}
                
                {credentials.filter(c => c.credential_type === 'identity_verification').length === 0 && (
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Verify Identity</p>
                      <p className="text-sm text-blue-700">
                        Complete identity verification to increase your credit score and unlock more opportunities.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Maintain Good Standing</p>
                    <p className="text-sm text-green-700">
                      Continue completing services with high ratings to maintain and improve your credit score.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
