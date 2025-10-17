'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  TrendingUp, 
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
  Target,
  Award,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase/client'

interface DigitalWalletDashboardProps {
  userId: string
}

export default function DigitalWalletDashboard({ userId }: DigitalWalletDashboardProps) {
  const [loading, setLoading] = useState(true)
  const [walletData, setWalletData] = useState({
    creditScore: 300,
    scoreChange: 0,
    totalCredentials: 0,
    loanEligibility: 0,
    identityStrength: 0,
    quickStats: {
      totalApplications: 0,
      approvedLoans: 0,
      pendingVerifications: 0,
      activeCredentials: 0
    }
  })

  useEffect(() => {
    loadWalletData()
  }, [userId])

  const loadWalletData = async () => {
    try {
      setLoading(true)
      
      // Load credentials from Supabase
      const { data: credentials, error: credentialsError } = await supabase
        .from('verifiable_credentials')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'valid')

      if (credentialsError) {
        console.error('Error loading credentials:', credentialsError)
        toast.error('Failed to load wallet data')
        return
      }

      // Load user's DID from Supabase
      const { data: didData, error: didError } = await supabase
        .from('user_dids')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // Load loan applications from Supabase
      const { data: loanApplications, error: loanError } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', userId)

      if (loanError) {
        console.error('Error loading loan applications:', loanError)
      }

      // Calculate credit score using the same logic as CreditScore component
      const totalCredentials = credentials?.length || 0
      const activeCredentials = credentials?.filter(c => !c.is_revoked).length || 0
      
      // Calculate base score from credentials (same logic as CreditScore component)
      let baseScore = 300 // Starting score
      let credentialScore = 0
      let walletActivityScore = 0
      
      // Score based on number and types of credentials
      credentials?.forEach(cred => {
        switch (cred.credential_type.toLowerCase()) {
          case 'utility verification':
            credentialScore += 25
            break
          case 'landlord verification':
            credentialScore += 30
            break
          case 'gig economy verification':
            credentialScore += 20
            break
          case 'electric company verification':
            credentialScore += 25
            break
          default:
            credentialScore += 15
        }
      })
      
      // Score based on wallet activity (DID creation, credential management)
      if (didData) {
        walletActivityScore += 50 // DID exists
        const daysSinceCreation = Math.floor((Date.now() - new Date(didData.created_at).getTime()) / (1000 * 60 * 60 * 24))
        walletActivityScore += Math.min(daysSinceCreation * 2, 100) // Up to 100 points for account age
      }
      
      // Calculate final score
      const finalScore = Math.min(baseScore + credentialScore + walletActivityScore, 850)
      
      // Calculate score change (mock for now)
      const scoreChange = Math.floor(Math.random() * 20) - 10 // Random change between -10 and +10
      
      // Calculate loan eligibility based on score
      const loanEligibility = Math.min(Math.floor((finalScore / 850) * 100), 100)
      
      // Calculate identity strength based on credentials
      const identityStrength = Math.min(Math.floor((totalCredentials / 10) * 100), 100)

      // Process loan applications
      const totalApplications = loanApplications?.length || 0
      const approvedLoans = loanApplications?.filter(app => app.status === 'approved').length || 0
      const pendingVerifications = loanApplications?.filter(app => app.status === 'pending').length || 0

      // Update wallet data with calculated values
      setWalletData({
        creditScore: finalScore,
        scoreChange: scoreChange,
        totalCredentials: totalCredentials,
        loanEligibility: loanEligibility,
        identityStrength: identityStrength,
        quickStats: {
          totalApplications: totalApplications,
          approvedLoans: approvedLoans,
          pendingVerifications: pendingVerifications,
          activeCredentials: activeCredentials
        }
      })
    } catch (error) {
      console.error('Error loading wallet data:', error)
      toast.error('Failed to load wallet data')
    } finally {
      setLoading(false)
    }
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
          <h2 className="text-3xl font-bold text-gray-900">Digital Wallet Dashboard</h2>
          <p className="text-gray-600">Your sovereign credit management hub</p>
        </div>
        <Button variant="outline" onClick={loadWalletData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
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
                  <BarChart3 className="h-8 w-8" />
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
                    <TrendingUp className="h-5 w-5 text-green-300" />
                    <span className="text-lg font-semibold text-green-300">
                      +{walletData.scoreChange}
                    </span>
                  </div>
                </div>
                <p className="text-blue-100 mt-2">
                  Based on {walletData.totalCredentials} verified credentials
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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Refresh Score</h3>
            <p className="text-sm text-gray-600 mb-4">Update your credit score with latest data</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Refresh Now
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Add Credentials</h3>
            <p className="text-sm text-gray-600 mb-4">Issue new verifiable credentials</p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Add Credentials
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Apply for Loan</h3>
            <p className="text-sm text-gray-600 mb-4">Submit ZKP-verified loan application</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Apply Now
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{walletData.quickStats.totalApplications}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Approved Loans</p>
                <p className="text-3xl font-bold text-green-600">{walletData.quickStats.approvedLoans}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{walletData.quickStats.pendingVerifications}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Credentials</p>
                <p className="text-3xl font-bold text-purple-600">{walletData.quickStats.activeCredentials}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Financial Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Financial Overview</span>
            </CardTitle>
            <CardDescription>Your credit and loan summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Loan Eligibility</span>
                <span className="font-semibold text-gray-900">{walletData.loanEligibility}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Identity Strength</span>
                <span className="font-semibold text-gray-900">{walletData.identityStrength}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Credentials</span>
                <span className="font-semibold text-gray-900">{walletData.totalCredentials}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest wallet activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Utility Payment Verified</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Credit Score Updated</p>
                  <p className="text-xs text-gray-600">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Loan Application Submitted</p>
                  <p className="text-xs text-gray-600">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}