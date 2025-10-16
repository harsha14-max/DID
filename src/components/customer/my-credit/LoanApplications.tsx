// =====================================================
// BSM Platform - Customer Loan Applications Component
// =====================================================
// Component for managing loan applications in the customer portal

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  DollarSign, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Shield,
  TrendingUp,
  Building2,
  CreditCard,
  Target,
  Zap,
  RefreshCw,
  Download,
  Upload,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { 
  CreditApplication, 
  LoanApplicationsProps,
  ZKPProof,
  TrustedIssuer
} from '@/types/credit'
import { zkpGenerator } from '@/components/shared/credit/ZKPGenerator'

export default function LoanApplications({ userId, onApplicationSubmitted }: LoanApplicationsProps) {
  
  const [applications, setApplications] = useState<CreditApplication[]>([])
  const [lenders, setLenders] = useState<TrustedIssuer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedApplication, setSelectedApplication] = useState<CreditApplication | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [generatingProof, setGeneratingProof] = useState(false)

  // Form state for creating applications
  const [formData, setFormData] = useState({
    lender_did: '',
    loan_amount: '',
    loan_purpose: '',
    score_threshold: 650
  })

  useEffect(() => {
    loadApplicationData()
  }, [userId])

  const loadApplicationData = async () => {
    try {
      setLoading(true)
      
      // Load user's applications
      const applicationsData = await fetch(`/api/credit/applications?user_id=${userId}`)
        .then(res => res.json())
      setApplications(applicationsData || [])

      // Load available lenders
      const lendersData = await fetch('/api/credit/trusted-issuers?is_approved=true')
        .then(res => res.json())
      setLenders(lendersData || [])

    } catch (error) {
      console.error('Error loading application data:', error)
      toast.error('Failed to load application data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateApplication = async () => {
    try {
      setGeneratingProof(true)
      
      // Generate ZKP proof for the application
      const proofData = await zkpGenerator.generateScoreProof({
        user_id: userId,
        score_threshold: formData.score_threshold,
        loan_amount: parseFloat(formData.loan_amount)
      })

      const applicationData = {
        user_id: userId,
        lender_did: formData.lender_did,
        zkp_proof: proofData.proof,
        score_threshold: formData.score_threshold,
        loan_amount: parseFloat(formData.loan_amount),
        loan_purpose: formData.loan_purpose,
        status: 'pending'
      }

      const response = await fetch('/api/credit/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      })

      if (response.ok) {
        toast.success('Loan application submitted successfully!')
        setShowCreateModal(false)
        setFormData({
          lender_did: '',
          loan_amount: '',
          loan_purpose: '',
          score_threshold: 650
        })
        loadApplicationData()
        onApplicationSubmitted?.()
      } else {
        throw new Error('Failed to submit application')
      }
    } catch (error) {
      console.error('Error creating application:', error)
      toast.error('Failed to submit loan application')
    } finally {
      setGeneratingProof(false)
    }
  }

  const handleCancelApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to cancel this application?')) return

    try {
      const response = await fetch(`/api/credit/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      })

      if (response.ok) {
        toast.success('Application cancelled successfully!')
        loadApplicationData()
      } else {
        throw new Error('Failed to cancel application')
      }
    } catch (error) {
      console.error('Error cancelling application:', error)
      toast.error('Failed to cancel application')
    }
  }

  const handleDownloadApplication = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/credit/applications/${applicationId}/export`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `loan-application-${applicationId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Application downloaded successfully!')
    } catch (error) {
      console.error('Error downloading application:', error)
      toast.error('Failed to download application')
    }
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.loan_purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.lender_did.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default'
      case 'rejected': return 'destructive'
      case 'pending': return 'secondary'
      case 'expired': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'expired': return <AlertCircle className="h-4 w-4 text-gray-600" />
      default: return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Loan Applications</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your credit applications and track their status</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Application</span>
          </Button>
          <Button variant="outline" onClick={loadApplicationData} className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{applications.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {applications.filter(app => app.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {applications.filter(app => app.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${applications.reduce((sum, app) => sum + (app.loan_amount || 0), 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="lenders">Available Lenders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="status-filter">Status:</Label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Applications List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Application #{application.id.slice(0, 8)}
                        </h3>
                        <Badge variant={getStatusColor(application.status)}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1">{application.status}</span>
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <p><strong>Lender:</strong> {application.lender_did}</p>
                          <p><strong>Amount:</strong> ${application.loan_amount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p><strong>Purpose:</strong> {application.loan_purpose}</p>
                          <p><strong>Score Threshold:</strong> {application.score_threshold}</p>
                        </div>
                        <div>
                          <p><strong>Created:</strong> {new Date(application.created_at).toLocaleDateString()}</p>
                          {application.verified_at && (
                            <p><strong>Verified:</strong> {new Date(application.verified_at).toLocaleDateString()}</p>
                          )}
                        </div>
                        <div>
                          {application.approved_at && (
                            <p><strong>Approved:</strong> {new Date(application.approved_at).toLocaleDateString()}</p>
                          )}
                          {application.rejected_at && (
                            <p><strong>Rejected:</strong> {new Date(application.rejected_at).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      {application.rejection_reason && (
                        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                          <p className="text-sm text-red-600 dark:text-red-400">
                            <strong>Rejection Reason:</strong> {application.rejection_reason}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadApplication(application.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {application.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelApplication(application.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Lenders Tab */}
        <TabsContent value="lenders" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lenders.map((lender) => (
              <Card key={lender.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{lender.issuer_name}</CardTitle>
                    <Badge variant="default">Available</Badge>
                  </div>
                  <CardDescription>{lender.issuer_type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>DID:</strong> {lender.issuer_did}</p>
                    <p><strong>Email:</strong> {lender.contact_email}</p>
                    {lender.issuer_description && (
                      <p><strong>Description:</strong> {lender.issuer_description}</p>
                    )}
                  </div>
                  <div className="pt-2">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setFormData({ ...formData, lender_did: lender.issuer_did })
                        setShowCreateModal(true)
                      }}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Trends</CardTitle>
                <CardDescription>Your application patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Application trend chart would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success Rate</CardTitle>
                <CardDescription>Your application success rate by lender</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Overall Success Rate</span>
                    <span className="font-semibold text-green-600">75%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average Response Time</span>
                    <span className="font-semibold">3.2 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Best Performing Lender</span>
                    <span className="font-semibold">Credit Union A</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Application Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>New Loan Application</CardTitle>
              <CardDescription>Submit a new credit application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="lender_did">Lender</Label>
                <select
                  id="lender_did"
                  value={formData.lender_did}
                  onChange={(e) => setFormData({ ...formData, lender_did: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select a lender</option>
                  {lenders.map((lender) => (
                    <option key={lender.id} value={lender.issuer_did}>
                      {lender.issuer_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="loan_amount">Loan Amount</Label>
                <Input
                  id="loan_amount"
                  type="number"
                  value={formData.loan_amount}
                  onChange={(e) => setFormData({ ...formData, loan_amount: e.target.value })}
                  placeholder="Enter loan amount"
                />
              </div>
              <div>
                <Label htmlFor="loan_purpose">Loan Purpose</Label>
                <Textarea
                  id="loan_purpose"
                  value={formData.loan_purpose}
                  onChange={(e) => setFormData({ ...formData, loan_purpose: e.target.value })}
                  placeholder="Describe the purpose of the loan"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="score_threshold">Minimum Score Threshold</Label>
                <Input
                  id="score_threshold"
                  type="number"
                  value={formData.score_threshold}
                  onChange={(e) => setFormData({ ...formData, score_threshold: parseInt(e.target.value) })}
                  placeholder="Enter minimum score threshold"
                />
              </div>
              <div className="flex items-center justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateApplication}
                  disabled={generatingProof || !formData.lender_did || !formData.loan_amount}
                >
                  {generatingProof ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Proof...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

