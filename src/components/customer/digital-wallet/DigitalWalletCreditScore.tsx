'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Home,
  Briefcase,
  Settings,
  Building,
  User,
  Award,
  Target,
  Activity,
  Clock,
  Star,
  Eye,
  Download,
  Share2,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  HelpCircle,
  PieChart,
  LineChart
} from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface DigitalWalletCreditScoreProps {
  userId: string
}

export default function DigitalWalletCreditScore({ userId }: DigitalWalletCreditScoreProps) {
  const [scoreData, setScoreData] = useState({
    currentScore: 680,
    previousScore: 665,
    scoreChange: 15,
    scoreBreakdown: {
      payment_history: 85,
      service_completion: 92,
      identity_verification: 78,
      credit_utilization: 65,
      credit_history_length: 45,
      new_credit_inquiries: 90
    },
    contributingFactors: [] as any[],
    history: [] as any[],
    recommendations: [] as any[]
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchScoreData()
  }, [userId])

  const fetchScoreData = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/credit/scoring?user_id=${userId}`)
      const data = await response.json()
      
      if (data.scoreCalculation) {
        setScoreData(prev => ({
          ...prev,
          currentScore: data.scoreCalculation.final_score,
          contributingFactors: data.scoreCalculation.contributing_factors || [],
          scoreBreakdown: data.scoreBreakdown || prev.scoreBreakdown,
          history: data.history || []
        }))
      }

      // Mock recommendations
      setScoreData(prev => ({
        ...prev,
        recommendations: [
          {
            id: '1',
            title: 'Add Utility Payment History',
            description: 'Adding 6+ months of utility payments can increase your score by 20-30 points',
            impact: 'High',
            effort: 'Low',
            icon: Zap,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
          },
          {
            id: '2',
            title: 'Complete Employment Verification',
            description: 'Verify your employment status to strengthen your credit profile',
            impact: 'Medium',
            effort: 'Low',
            icon: Briefcase,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
          },
          {
            id: '3',
            title: 'Add Rental Payment History',
            description: 'Include rental payment history to demonstrate consistent payment behavior',
            impact: 'High',
            effort: 'Medium',
            icon: Home,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
          }
        ]
      }))

    } catch (error) {
      console.error('Error fetching score data:', error)
      toast.error('Failed to load credit score data')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchScoreData()
    setRefreshing(false)
    toast.success('Credit score refreshed')
  }

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600'
    if (score >= 700) return 'text-blue-600'
    if (score >= 650) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreCategory = (score: number) => {
    if (score >= 750) return 'Excellent'
    if (score >= 700) return 'Good'
    if (score >= 650) return 'Fair'
    if (score >= 600) return 'Poor'
    return 'Very Poor'
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Credit Score Analysis</h2>
          <p className="text-gray-600">Detailed breakdown of your credit profile</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Score
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
                    <h3 className="text-2xl font-bold">Current Credit Score</h3>
                    <Badge className="bg-white/20 text-white border-white/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {getScoreCategory(scoreData.currentScore)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-end space-x-4">
                  <div className="text-6xl font-bold">{scoreData.currentScore}</div>
                  <div className="flex items-center space-x-2 mb-2">
                    {scoreData.scoreChange > 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-300" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-300" />
                    )}
                    <span className={`text-lg font-semibold ${
                      scoreData.scoreChange > 0 ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {scoreData.scoreChange > 0 ? '+' : ''}{scoreData.scoreChange}
                    </span>
                    <span className="text-blue-100 text-sm">vs last month</span>
                  </div>
                </div>
                <p className="text-blue-100 mt-2">
                  Based on {scoreData.contributingFactors.length} contributing factors
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
              {Object.entries(scoreData.scoreBreakdown).map(([factor, score]) => (
                <div key={factor} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {factor.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{score}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Contributing Factors</span>
            </CardTitle>
            <CardDescription>Recent changes affecting your score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scoreData.contributingFactors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      factor.impact_score > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {factor.impact_score > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {factor.factor_name.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-600">{factor.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold ${
                      factor.impact_score > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {factor.impact_score > 0 ? '+' : ''}{factor.impact_score}
                    </span>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Score Improvement Recommendations</span>
            </CardTitle>
            <CardDescription>Actions you can take to improve your credit score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scoreData.recommendations.map((rec, index) => {
                const Icon = rec.icon
                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 ${rec.bgColor} rounded-lg flex items-center justify-center`}>
                            <Icon className={`h-6 w-6 ${rec.color}`} />
                          </div>
                          <Badge className={getImpactColor(rec.impact)}>
                            {rec.impact} Impact
                          </Badge>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-2">{rec.title}</h4>
                        <p className="text-sm text-gray-600 mb-4">{rec.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {rec.effort} Effort
                          </Badge>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-1" />
                            Get Started
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Score History */}
      {scoreData.history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LineChart className="h-5 w-5" />
                <span>Score History</span>
              </CardTitle>
              <CardDescription>Your credit score over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scoreData.history.slice(0, 5).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Score Calculation</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(entry.calculated_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{entry.score}</p>
                      <p className="text-xs text-gray-500">{entry.calculation_method}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
