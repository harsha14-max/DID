'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  RefreshCw, 
  Shield, 
  CheckCircle, 
  Target,
  Activity,
  Clock,
  Star,
  Award,
  PieChart,
  LineChart,
  Calculator,
  Percent,
  DollarSign,
  Calendar,
  FileText,
  CreditCard,
  Banknote,
  Coins,
  Receipt
} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface Credential {
  id: string
  type: 'utility' | 'rental' | 'income' | 'service' | 'identity' | 'employment'
  issuer: string
  issuedAt: string
  verified: boolean
}

interface ScoreFactor {
  name: string
  weight: number
  score: number
  maxScore: number
  description: string
  impact: 'positive' | 'negative' | 'neutral'
  recommendations: string[]
}

interface CreditScoreCalculation {
  baseScore: number
  factors: ScoreFactor[]
  finalScore: number
  grade: string
  lastUpdated: string
}

interface RealCreditScoringProps {
  userId: string
  credentials: Credential[]
  onScoreUpdated?: (score: CreditScoreCalculation) => void
}

export default function RealCreditScoring({ userId, credentials, onScoreUpdated }: RealCreditScoringProps) {
  const [scoreCalculation, setScoreCalculation] = useState<CreditScoreCalculation | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    calculateRealTimeScore()
  }, [credentials, userId])

  const calculateRealTimeScore = async () => {
    setLoading(true)
    
    try {
      const calculation = await performRealTimeCalculation(credentials)
      setScoreCalculation(calculation)
      
      if (onScoreUpdated) {
        onScoreUpdated(calculation)
      }
      
    } catch (error) {
      console.error('Error calculating credit score:', error)
      toast.error('Failed to calculate credit score')
    } finally {
      setLoading(false)
    }
  }

  const performRealTimeCalculation = async (creds: Credential[]): Promise<CreditScoreCalculation> => {
    const baseScore = 300
    const factors: ScoreFactor[] = []
    
    // Payment History Analysis (30% weight)
    const paymentHistoryScore = Math.min(creds.filter(c => c.type === 'utility' || c.type === 'rental').length * 40, 200)
    factors.push({
      name: 'Payment History',
      weight: 0.30,
      score: paymentHistoryScore,
      maxScore: 200,
      description: 'Analysis of payment consistency and history',
      impact: paymentHistoryScore > 150 ? 'positive' : paymentHistoryScore < 100 ? 'negative' : 'neutral',
      recommendations: paymentHistoryScore < 150 ? [
        'Add more payment history credentials',
        'Ensure consistent payment patterns',
        'Include utility and rental payments'
      ] : []
    })

    // Credential Diversity (25% weight)
    const uniqueTypes = new Set(creds.map(c => c.type)).size
    const diversityScore = Math.min(uniqueTypes * 30 + creds.length * 10, 150)
    factors.push({
      name: 'Credential Diversity',
      weight: 0.25,
      score: diversityScore,
      maxScore: 150,
      description: 'Variety and types of verified credentials',
      impact: diversityScore > 100 ? 'positive' : diversityScore < 60 ? 'negative' : 'neutral',
      recommendations: diversityScore < 100 ? [
        'Add income verification credentials',
        'Include employment verification',
        'Add utility payment history'
      ] : []
    })

    // Income Stability (20% weight)
    const incomeScore = Math.min(creds.filter(c => c.type === 'income' || c.type === 'employment').length * 50, 120)
    factors.push({
      name: 'Income Stability',
      weight: 0.20,
      score: incomeScore,
      maxScore: 120,
      description: 'Consistency and verification of income sources',
      impact: incomeScore > 80 ? 'positive' : incomeScore < 50 ? 'negative' : 'neutral',
      recommendations: incomeScore < 80 ? [
        'Add employment verification',
        'Include income documentation',
        'Verify salary consistency'
      ] : []
    })

    // Identity Verification (15% weight)
    const identityScore = Math.min(creds.filter(c => c.type === 'identity').length * 60, 100)
    factors.push({
      name: 'Identity Verification',
      weight: 0.15,
      score: identityScore,
      maxScore: 100,
      description: 'Strength and completeness of identity verification',
      impact: identityScore > 70 ? 'positive' : identityScore < 40 ? 'negative' : 'neutral',
      recommendations: identityScore < 70 ? [
        'Complete identity verification',
        'Add government ID verification',
        'Include address verification'
      ] : []
    })

    // Credit History Length (10% weight)
    const historyLengthScore = Math.min(creds.length * 15, 80)
    factors.push({
      name: 'Credit History Length',
      weight: 0.10,
      score: historyLengthScore,
      maxScore: 80,
      description: 'Duration and consistency of credit history',
      impact: historyLengthScore > 50 ? 'positive' : historyLengthScore < 30 ? 'negative' : 'neutral',
      recommendations: historyLengthScore < 50 ? [
        'Maintain longer credential history',
        'Keep credentials active over time',
        'Avoid gaps in verification'
      ] : []
    })

    // Calculate final score
    const weightedScore = factors.reduce((total, factor) => {
      return total + (factor.score * factor.weight)
    }, 0)

    const finalScore = Math.min(850, Math.max(300, Math.round(baseScore + weightedScore)))
    
    const grade = getScoreGrade(finalScore)
    
    const calculation: CreditScoreCalculation = {
      baseScore,
      factors,
      finalScore,
      grade,
      lastUpdated: new Date().toISOString()
    }

    return calculation
  }

  const getScoreGrade = (score: number): string => {
    if (score >= 750) return 'Excellent'
    if (score >= 700) return 'Good'
    if (score >= 650) return 'Fair'
    if (score >= 600) return 'Poor'
    return 'Very Poor'
  }

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600'
    if (score >= 700) return 'text-blue-600'
    if (score >= 650) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 750) return 'bg-green-100'
    if (score >= 700) return 'bg-blue-100'
    if (score >= 650) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!scoreCalculation) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Credit Score Available</h3>
            <p className="text-gray-600 mb-6">
              Add some credentials to calculate your credit score.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={calculateRealTimeScore}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Calculate Score
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Real-Time Credit Score</h2>
          <p className="text-gray-600">Dynamic calculation based on your credentials</p>
        </div>
        <Button variant="outline" onClick={calculateRealTimeScore} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Recalculate
        </Button>
      </div>

      {/* Score Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart3 className="h-8 w-8" />
                  <div>
                    <h3 className="text-2xl font-bold">Real-Time Credit Score</h3>
                    <Badge className="bg-white/20 text-white border-white/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {scoreCalculation.grade}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-end space-x-4">
                  <div className="text-6xl font-bold">{scoreCalculation.finalScore}</div>
                </div>
                <p className="text-blue-100 mt-2">
                  Based on {credentials.length} verified credentials
                </p>
                <p className="text-blue-100 text-sm">
                  Last updated: {new Date(scoreCalculation.lastUpdated).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white/80">850</div>
                <div className="text-blue-100">Max Score</div>
                <div className="text-blue-100 text-sm mt-2">Range: 300-850</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Score Breakdown</span>
            </CardTitle>
            <CardDescription>How different factors contribute to your score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scoreCalculation.factors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{factor.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">{factor.score}</span>
                      <Badge className={`text-xs ${
                        factor.impact === 'positive' ? 'bg-green-100 text-green-800' :
                        factor.impact === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {factor.impact}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{factor.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Improvement Recommendations</span>
            </CardTitle>
            <CardDescription>Actions to improve your credit score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scoreCalculation.factors
                .filter(factor => factor.recommendations.length > 0)
                .map((factor, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{factor.name}</h4>
                    <ul className="space-y-1">
                      {factor.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="text-sm text-gray-600 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}