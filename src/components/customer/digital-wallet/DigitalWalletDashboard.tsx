'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Plus, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Home,
  Briefcase,
  DollarSign,
  Activity,
  Clock,
  Star,
  Eye,
  Download,
  Share2,
  Settings,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Target,
  Award,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Smartphone,
  Laptop,
  Globe,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  Wallet,
  Banknote,
  Coins,
  Receipt,
  CreditCard as CreditCardIcon,
  Smartphone as SmartphoneIcon,
  Laptop as LaptopIcon,
  Globe as GlobeIcon,
  Building as BuildingIcon,
  User as UserIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  FileText as FileTextIcon,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Wallet as WalletIcon,
  Banknote as BanknoteIcon,
  Coins as CoinsIcon,
  Receipt as ReceiptIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface DigitalWalletDashboardProps {
  userId: string
}

export default function DigitalWalletDashboard({ userId }: DigitalWalletDashboardProps) {
  const [walletData, setWalletData] = useState({
    creditScore: 680,
    scoreChange: +15,
    totalCredentials: 8,
    loanEligibility: 85,
    identityStrength: 92,
    recentActivity: [] as any[],
    credentials: [] as any[],
    quickStats: {
      totalApplications: 3,
      approvedLoans: 1,
      pendingVerifications: 2,
      activeCredentials: 6
    }
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchWalletData()
  }, [userId])

  const fetchWalletData = async () => {
    try {
      setLoading(true)
      
      // Fetch credit score
      const scoreResponse = await fetch(`/api/credit/scoring?user_id=${userId}`)
      const scoreData = await scoreResponse.json()
      
      // Fetch credentials
      const credentialsResponse = await fetch(`/api/credit/credentials?user_id=${userId}`)
      const credentialsData = await credentialsResponse.json()
      
      // Fetch DID
      const didResponse = await fetch(`/api/credit/dids?user_id=${userId}`)
      const didData = await didResponse.json()
      
      // Fetch loan applications
      const applicationsResponse = await fetch(`/api/credit/applications?user_id=${userId}`)
      const applicationsData = await applicationsResponse.json()

      setWalletData(prev => ({
        ...prev,
        creditScore: scoreData.scoreCalculation?.final_score || 680,
        scoreChange: scoreData.scoreCalculation?.contributing_factors?.reduce((sum: number, factor: any) => sum + factor.impact_score, 0) || 15,
        totalCredentials: credentialsData.credentials?.length || 8,
        credentials: credentialsData.credentials || [],
        recentActivity: [
          {
            id: '1',
            type: 'credential_issued',
            title: 'Utility Payment Verified',
            description: 'Comcast utility payment credential issued',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            icon: Zap,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
          },
          {
            id: '2',
            type: 'score_updated',
            title: 'Credit Score Updated',
            description: 'Score increased by 15 points',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
          },
          {
            id: '3',
            type: 'loan_approved',
            title: 'Loan Application Approved',
            description: '$5,000 personal loan approved',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
          }
        ]
      }))

    } catch (error) {
      console.error('Error fetching wallet data:', error)
      toast.error('Failed to load wallet data')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchWalletData()
    setRefreshing(false)
    toast.success('Wallet data refreshed')
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

  const credentialTypes = [
    { type: 'utility', icon: Zap, label: 'Utility', count: 2, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { type: 'rental', icon: Home, label: 'Rental', count: 1, color: 'text-green-600', bgColor: 'bg-green-100' },
    { type: 'income', icon: Briefcase, label: 'Income', count: 1, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { type: 'service', icon: Settings, label: 'Service', count: 4, color: 'text-orange-600', bgColor: 'bg-orange-100' }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
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
          <h2 className="text-3xl font-bold text-gray-900">Your Sovereign Wallet</h2>
          <p className="text-gray-600">Manage your digital identity and credit profile</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Credential
          </Button>
        </div>
      </div>

      {/* Hero Credit Score Section */}
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
                  <Shield className="h-8 w-8" />
                  <div>
                    <h3 className="text-2xl font-bold">Credit Score</h3>
                    <Badge className="bg-white/20 text-white border-white/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Identity
                    </Badge>
                  </div>
                </div>
                <div className="flex items-end space-x-4">
                  <div className="text-6xl font-bold">{walletData.creditScore}</div>
                  <div className="flex items-center space-x-2 mb-2">
                    {walletData.scoreChange > 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-300" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-300" />
                    )}
                    <span className={`text-lg font-semibold ${
                      walletData.scoreChange > 0 ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {walletData.scoreChange > 0 ? '+' : ''}{walletData.scoreChange}
                    </span>
                  </div>
                </div>
                <p className="text-blue-100 mt-2">
                  {getScoreCategory(walletData.creditScore)} Credit Rating
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white/80">850</div>
                <div className="text-blue-100">Max Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Button className="h-16 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Add Credentials</div>
              <div className="text-sm text-gray-600">Verify new information</div>
            </div>
          </div>
        </Button>
        <Button className="h-16 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300 transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Apply for Loan</div>
              <div className="text-sm text-gray-600">Get pre-approved</div>
            </div>
          </div>
        </Button>
        <Button className="h-16 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-300 transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">View Analytics</div>
              <div className="text-sm text-gray-600">Detailed insights</div>
            </div>
          </div>
        </Button>
      </motion.div>

      {/* Financial Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Credentials</p>
                <p className="text-3xl font-bold text-gray-900">{walletData.totalCredentials}</p>
                <p className="text-xs text-gray-500 mt-1">Active verifications</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Loan Eligibility</p>
                <p className="text-3xl font-bold text-gray-900">{walletData.loanEligibility}%</p>
                <Progress value={walletData.loanEligibility} className="mt-2" />
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Identity Strength</p>
                <p className="text-3xl font-bold text-gray-900">{walletData.identityStrength}%</p>
                <Progress value={walletData.identityStrength} className="mt-2" />
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Applications</p>
                <p className="text-3xl font-bold text-gray-900">{walletData.quickStats.totalApplications}</p>
                <p className="text-xs text-gray-500 mt-1">Pending review</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Credential Cards Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Your Credentials</span>
            </CardTitle>
            <CardDescription>Verifiable credentials in your digital wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {credentialTypes.map((credType, index) => {
                const Icon = credType.icon
                return (
                  <motion.div
                    key={credType.type}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group"
                  >
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 ${credType.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon className={`h-6 w-6 ${credType.color}`} />
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{credType.label}</h4>
                        <p className="text-2xl font-bold text-gray-900 mb-2">{credType.count}</p>
                        <p className="text-sm text-gray-600">Active credentials</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity & Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Your latest wallet activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {walletData.recentActivity.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-8 h-8 ${activity.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Quick Insights</span>
            </CardTitle>
            <CardDescription>Tips to improve your credit profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Score Improvement</h4>
                    <p className="text-sm text-blue-700">Add utility payment history to boost your score by 20+ points</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900">Identity Verification</h4>
                    <p className="text-sm text-green-700">Complete employment verification to strengthen your profile</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-900">Loan Eligibility</h4>
                    <p className="text-sm text-purple-700">You're eligible for loans up to $15,000 with current score</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
