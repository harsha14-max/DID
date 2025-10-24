// =====================================================
// credX Platform - VC Operations Hub Dashboard
// =====================================================
// Comprehensive VC issuance and management system dashboard

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CreditCard, 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign, 
  Activity, 
  Clock, 
  CheckCircle, 
  RefreshCw, 
  Download, 
  Eye, 
  BarChart3, 
  Award,
  Shield,
  Zap,
  Star,
  FileCheck,
  Timer,
  CheckCircle2,
  XCircle,
  ClipboardList,
  FileSpreadsheet,
  ExternalLink,
  Calendar,
  X
} from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function CreditIdentityDashboard() {
  const [dashboardData, setDashboardData] = useState({
    // VC Issuance Metrics
    pendingVerifications: 23,
    approvalRate: 87.5,
    avgProcessingTime: 2.3,
    issuanceQueue: 15,
    
    // Verification Workflow Status
    documentsAwaitingReview: 18,
    slaCompliance: 94.2,
    qualityMetrics: 96.8,
    teamPerformance: 89.3,
    
    // System Health
    totalVCs: 1247,
    activeUsers: 892,
    loanApplications: 156,
    avgCreditScore: 642,
    revenue: 12450,
    systemHealth: 98,
    
    // Real-time Activity
    recentActivity: [
      {
        id: '1',
        type: 'user_submission',
        title: 'Sarah submitted hosting payment proofs',
        description: 'Document type: Utility Bill - Amount: $89.99',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        icon: FileText,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        priority: 'high'
      },
      {
        id: '2',
        type: 'verification_action',
        title: 'Admin approved utility bill verification',
        description: 'User: john.doe@example.com - VC Type: Payment History',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        priority: 'medium'
      },
      {
        id: '3',
        type: 'vc_issuance',
        title: 'Issued Service Completion VC to Sarah',
        description: 'Template: Service Completion v2.1 - Expires: 6 months',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        icon: Award,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        priority: 'high'
      },
      {
        id: '4',
        type: 'system_event',
        title: 'Auto-issued 15 VCs from ticket resolutions',
        description: 'Trigger: Ticket Resolution - Template: Service Completion',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        icon: Zap,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        priority: 'low'
      },
      {
        id: '5',
        type: 'verification_action',
        title: 'Rejected income verification - insufficient documentation',
        description: 'User: jane.smith@example.com - Reason: Missing employer letter',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        priority: 'medium'
      }
    ]
  })

  const [applications, setApplications] = useState<any[]>([])
  const [loadingApplications, setLoadingApplications] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [showZKPModal, setShowZKPModal] = useState(false)

  // Approve application and add loan amount to user wallet
  const approveApplication = async (applicationId: string) => {
    try {
      console.log('Starting approval process for application:', applicationId)
      
      // First, get the application details
      const { data: application, error: fetchError } = await supabase
        .from('credit_applications')
        .select('*')
        .eq('id', applicationId)
        .single()

      if (fetchError || !application) {
        console.error('Error fetching application:', fetchError)
        toast.error('Failed to fetch application details')
        return
      }

      console.log('Application details:', application)

      // Update application status to approved
      const { error: updateError } = await supabase
        .from('credit_applications')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', applicationId)

      if (updateError) {
        console.error('Error approving application:', updateError)
        toast.error('Failed to approve application')
        return
      }

      // Loan approval - increment wallet balance
      const loanAmount = parseFloat(application.loan_amount) || 0
      console.log(`Approving loan application for $${loanAmount}`)

      // Increment user's wallet balance
      // First, get the current balance
      console.log('Fetching current wallet balance for user:', application.user_id)
      
      const { data: currentWallet, error: fetchWalletError } = await supabase
        .from('customer_wallets')
        .select('balance')
        .eq('user_id', application.user_id)
        .eq('wallet_type', 'primary')
        .single()

      if (fetchWalletError) {
        console.error('Error fetching wallet:', fetchWalletError)
        toast.error('Failed to fetch wallet balance')
        return
      }

      console.log('Current wallet balance:', currentWallet?.balance)
      
      const currentBalance = parseFloat(currentWallet?.balance || '0')
      const newBalance = currentBalance + loanAmount
      
      console.log(`Updating wallet: ${currentBalance} + ${loanAmount} = ${newBalance}`)

      // Update the wallet balance
      const { error: walletError } = await supabase
        .from('customer_wallets')
        .update({ 
          balance: newBalance.toString()
        })
        .eq('user_id', application.user_id)
        .eq('wallet_type', 'primary')

      if (walletError) {
        console.error('Error updating wallet balance:', walletError)
        toast.error('Failed to update wallet balance')
        return
      }

      console.log(`Successfully added $${loanAmount} to user's wallet (new balance: $${newBalance})`)

      // Create notification for the user
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: application.user_id,
          type: 'approval_request',
          title: 'Loan Application Approved! 🎉',
          message: `Your loan application for $${loanAmount} has been approved and is now available in your account.`,
          data: {
            loan_amount: loanAmount,
            application_id: applicationId,
            status: 'approved'
          }
        })

      if (notificationError) {
        console.error('Error creating notification:', notificationError)
        // Don't fail the whole process for notification error
      }

      toast.success(`Loan approved! $${loanAmount} is now available in customer's account`)
      loadApplications() // Reload applications
    } catch (error) {
      console.error('Error approving application:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      toast.error('Failed to approve application')
    }
  }

  // Reject application
  const rejectApplication = async (applicationId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('credit_applications')
        .update({ 
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', applicationId)

      if (error) {
        console.error('Error rejecting application:', error)
        toast.error('Failed to reject application')
        return
      }

      toast.success('Application rejected')
      loadApplications() // Reload applications
    } catch (error) {
      console.error('Error rejecting application:', error)
      toast.error('Failed to reject application')
    }
  }

  // Load applications from Supabase
  const loadApplications = async () => {
    try {
      setLoadingApplications(true)
      
      // Fetch loan applications - simple query first to show all applications
      const { data: applicationsData, error } = await supabase
        .from('credit_applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error loading applications:', error)
        toast.error('Failed to load applications')
        return
      }

      console.log('Loaded applications:', applicationsData) // Debug log
      setApplications(applicationsData || [])
    } catch (error) {
      console.error('Error loading applications:', error)
      toast.error('Failed to load applications')
    } finally {
      setLoadingApplications(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setLoading(true)
    toast.promise(
      new Promise(resolve => setTimeout(() => {
        setDashboardData(prev => ({
          ...prev,
          pendingVerifications: prev.pendingVerifications + Math.floor(Math.random() * 5) - 2,
          approvalRate: Math.min(100, Math.max(0, prev.approvalRate + (Math.random() * 10) - 5)),
          avgProcessingTime: Math.max(0.5, prev.avgProcessingTime + (Math.random() * 2) - 1),
          issuanceQueue: prev.issuanceQueue + Math.floor(Math.random() * 3) - 1,
          documentsAwaitingReview: prev.documentsAwaitingReview + Math.floor(Math.random() * 3) - 1,
          slaCompliance: Math.min(100, Math.max(0, prev.slaCompliance + (Math.random() * 5) - 2.5)),
          qualityMetrics: Math.min(100, Math.max(0, prev.qualityMetrics + (Math.random() * 3) - 1.5)),
          teamPerformance: Math.min(100, Math.max(0, prev.teamPerformance + (Math.random() * 5) - 2.5))
        }))
        resolve('Refreshed!')
      }, 1500)),
      {
        loading: 'Refreshing VC operations data...',
        success: 'VC operations data refreshed!',
        error: 'Failed to refresh data.',
      }
    ).finally(() => setLoading(false))
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive" className="bg-red-100 text-red-700">High Priority</Badge>
      case 'medium': return <Badge variant="warning" className="bg-yellow-100 text-yellow-700">Medium Priority</Badge>
      case 'low': return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Low Priority</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_submission': return <FileText className="h-4 w-4 text-blue-600" />
      case 'verification_action': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'vc_issuance': return <Award className="h-4 w-4 text-purple-600" />
      case 'system_event': return <Zap className="h-4 w-4 text-yellow-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">VC Operations Hub</h2>
          <p className="text-gray-600 mt-1">Comprehensive Verifiable Credential issuance and management system</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* VC Issuance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.pendingVerifications}</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Awaiting review
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FileCheck className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.approvalRate}%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.3% this week
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.avgProcessingTime}h</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Timer className="h-3 w-3 mr-1" />
                  Target: 2h
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Issuance Queue</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.issuanceQueue}</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  Auto-processing
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <ClipboardList className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Workflow Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileCheck className="h-5 w-5 mr-2" />
              Verification Workflow Status
            </CardTitle>
            <CardDescription>Current document review and processing metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Documents Awaiting Review</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={(dashboardData.documentsAwaitingReview / 25) * 100} className="w-20" />
                <span className="text-sm font-bold">{dashboardData.documentsAwaitingReview}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">SLA Compliance</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={dashboardData.slaCompliance} className="w-20" />
                <span className="text-sm font-bold">{dashboardData.slaCompliance}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Star className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium">Quality Metrics</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={dashboardData.qualityMetrics} className="w-20" />
                <span className="text-sm font-bold">{dashboardData.qualityMetrics}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <Users className="h-4 w-4 text-yellow-600" />
                </div>
                <span className="text-sm font-medium">Team Performance</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={dashboardData.teamPerformance} className="w-20" />
                <span className="text-sm font-bold">{dashboardData.teamPerformance}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              System Overview
            </CardTitle>
            <CardDescription>Platform performance and user metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total VCs Issued</span>
              <span className="text-sm font-bold">{dashboardData.totalVCs.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Users</span>
              <span className="text-sm font-bold">{dashboardData.activeUsers.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Loan Applications</span>
              <span className="text-sm font-bold">{dashboardData.loanApplications}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Avg Credit Score</span>
              <span className="text-sm font-bold">{dashboardData.avgCreditScore}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Monthly Revenue</span>
              <span className="text-sm font-bold">${dashboardData.revenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Health</span>
              <div className="flex items-center space-x-2">
                <Progress value={dashboardData.systemHealth} className="w-20" />
                <span className="text-sm font-bold">{dashboardData.systemHealth}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <FileSpreadsheet className="h-5 w-5 mr-2" />
                Loan Applications
              </CardTitle>
              <CardDescription>Recent loan applications submitted from customer portal</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadApplications} disabled={loadingApplications}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingApplications ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingApplications ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No applications found</p>
                  <p className="text-sm">Loan applications will appear here when submitted</p>
                </div>
              ) : (
                applications.map((application, index) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {application.loan_purpose || 'Personal Loan'} Application
                        </h4>
                        <p className="text-sm text-gray-600">
                          Amount: ${application.loan_amount || 'N/A'} • 
                          User ID: {application.user_id?.substring(0, 8)}...
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted: {new Date(application.created_at).toLocaleString()}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {application.zkp_proof && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              ZKP Attached
                            </Badge>
                          )}
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            Score Threshold: {application.score_threshold}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={application.status === 'approved' ? 'default' : application.status === 'rejected' ? 'destructive' : 'secondary'}
                        className={
                          application.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {application.status || 'pending'}
                      </Badge>
                      {application.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => approveApplication(application.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => rejectApplication(application.id, 'Insufficient credit score')}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {application.zkp_proof && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(application)
                            setShowZKPModal(true)
                          }}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ZKP Modal */}
      {showZKPModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">ZKP Proof Details</h3>
              <Button variant="ghost" onClick={() => setShowZKPModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Application ID</label>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedApplication.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Loan Amount</label>
                      <p className="text-lg font-semibold">${selectedApplication.loan_amount}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Loan Purpose</label>
                      <p className="text-sm">{selectedApplication.loan_purpose}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Score Threshold</label>
                      <p className="text-sm">{selectedApplication.score_threshold}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ZKP Proof Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">ZKP Proof</label>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedApplication.zkp_proof}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Lender DID</label>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedApplication.lender_did}</p>
                    </div>
                  </div>
                  
                  {selectedApplication.metadata && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Application Metadata</label>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                        {JSON.stringify(selectedApplication.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowZKPModal(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => approveApplication(selectedApplication.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Application
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Real-time Activity Feed
          </CardTitle>
          <CardDescription>Live VC operations and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-full ${activity.bgColor}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    {getPriorityBadge(activity.priority)}
                  </div>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common VC operations and management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <FileCheck className="h-6 w-6" />
              <span className="text-sm">Review Documents</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Award className="h-6 w-6" />
              <span className="text-sm">Issue VC</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">User Profiles</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}