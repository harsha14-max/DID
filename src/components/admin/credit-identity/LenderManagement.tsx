// =====================================================
// BSM Platform - Admin Lender Management Component
// =====================================================
// Component for managing trusted lenders in the admin portal

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
  Building2, 
  Users, 
  Activity,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Clock,
  Shield,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  Filter,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { 
  TrustedIssuer, 
  LenderManagementProps,
  CreditApplication,
  LenderAnalytics
} from '@/types/credit'

export default function LenderManagement({ userId, onLenderUpdated }: LenderManagementProps) {
  
  const [lenders, setLenders] = useState<TrustedIssuer[]>([])
  const [applications, setApplications] = useState<CreditApplication[]>([])
  const [analytics, setAnalytics] = useState<LenderAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLender, setSelectedLender] = useState<TrustedIssuer | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  // Form state for creating/editing lenders
  const [formData, setFormData] = useState({
    issuer_name: '',
    issuer_type: 'bank',
    issuer_description: '',
    contact_email: '',
    issuer_did: ''
  })

  useEffect(() => {
    loadLenderData()
  }, [])

  const loadLenderData = async () => {
    try {
      setLoading(true)
      
      // Load trusted lenders
      const lendersData = await fetch('/api/credit/trusted-issuers')
        .then(res => res.json())
      setLenders(lendersData || [])

      // Load credit applications
      const applicationsData = await fetch('/api/credit/applications')
        .then(res => res.json())
      setApplications(applicationsData || [])

      // Load analytics
      const analyticsData = await fetch('/api/credit/lender-analytics')
        .then(res => res.json())
      setAnalytics(analyticsData)

    } catch (error) {
      console.error('Error loading lender data:', error)
      toast.error('Failed to load lender data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLender = async () => {
    try {
      const response = await fetch('/api/credit/trusted-issuers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          approved_by: userId,
          is_approved: true
        })
      })

      if (response.ok) {
        toast.success('Lender created successfully!')
        setShowCreateModal(false)
        setFormData({
          issuer_name: '',
          issuer_type: 'bank',
          issuer_description: '',
          contact_email: '',
          issuer_did: ''
        })
        loadLenderData()
        onLenderUpdated?.()
      } else {
        throw new Error('Failed to create lender')
      }
    } catch (error) {
      console.error('Error creating lender:', error)
      toast.error('Failed to create lender')
    }
  }

  const handleApproveLender = async (lenderId: string) => {
    try {
      const response = await fetch(`/api/credit/trusted-issuers/${lenderId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approved_by: userId,
          is_approved: true
        })
      })

      if (response.ok) {
        toast.success('Lender approved successfully!')
        loadLenderData()
        onLenderUpdated?.()
      } else {
        throw new Error('Failed to approve lender')
      }
    } catch (error) {
      console.error('Error approving lender:', error)
      toast.error('Failed to approve lender')
    }
  }

  const handleRejectLender = async (lenderId: string) => {
    try {
      const response = await fetch(`/api/credit/trusted-issuers/${lenderId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approved_by: userId,
          is_approved: false
        })
      })

      if (response.ok) {
        toast.success('Lender rejected successfully!')
        loadLenderData()
        onLenderUpdated?.()
      } else {
        throw new Error('Failed to reject lender')
      }
    } catch (error) {
      console.error('Error rejecting lender:', error)
      toast.error('Failed to reject lender')
    }
  }

  const handleDeleteLender = async (lenderId: string) => {
    if (!confirm('Are you sure you want to delete this lender?')) return

    try {
      const response = await fetch(`/api/credit/trusted-issuers/${lenderId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Lender deleted successfully!')
        loadLenderData()
        onLenderUpdated?.()
      } else {
        throw new Error('Failed to delete lender')
      }
    } catch (error) {
      console.error('Error deleting lender:', error)
      toast.error('Failed to delete lender')
    }
  }

  const filteredLenders = lenders.filter(lender => {
    const matchesSearch = lender.issuer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lender.issuer_did.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'approved' && lender.is_approved) ||
                         (filterStatus === 'pending' && !lender.is_approved)
    const matchesType = filterType === 'all' || lender.issuer_type === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus
    return matchesStatus
  })

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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lender Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage trusted lenders and credit applications</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Lender</span>
          </Button>
          <Button variant="outline" onClick={loadLenderData} className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Lenders</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalLenders}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Applications</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.activeApplications}</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Approval Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.approvalRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Volume</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${analytics.totalVolume}</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="lenders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lenders">Lenders</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Lenders Tab */}
        <TabsContent value="lenders" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search lenders..."
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
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="type-filter">Type:</Label>
              <select
                id="type-filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All</option>
                <option value="bank">Bank</option>
                <option value="utility">Utility</option>
                <option value="telecom">Telecom</option>
                <option value="government">Government</option>
                <option value="bsm_platform">BSM Platform</option>
              </select>
            </div>
          </div>

          {/* Lenders List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLenders.map((lender) => (
              <Card key={lender.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{lender.issuer_name}</CardTitle>
                    <Badge variant={lender.is_approved ? "default" : "secondary"}>
                      {lender.is_approved ? 'Approved' : 'Pending'}
                    </Badge>
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
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedLender(lender)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedLender(lender)
                          setShowEditModal(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!lender.is_approved && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApproveLender(lender.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleRejectLender(lender.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteLender(lender.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Application #{application.id.slice(0, 8)}
                        </h3>
                        <Badge variant={
                          application.status === 'approved' ? 'default' :
                          application.status === 'rejected' ? 'destructive' :
                          'secondary'
                        }>
                          {application.status}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <p><strong>Lender:</strong> {application.lender_did}</p>
                        <p><strong>Amount:</strong> ${application.loan_amount}</p>
                        <p><strong>Purpose:</strong> {application.loan_purpose}</p>
                        <p><strong>Score Threshold:</strong> {application.score_threshold}</p>
                        <p><strong>Created:</strong> {new Date(application.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lender Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average Response Time</span>
                    <span className="font-semibold">2.3 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
                    <span className="font-semibold">4.2/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                    <span className="font-semibold text-green-600">+15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Month</span>
                    <span className="font-semibold text-red-600">-3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">YTD Growth</span>
                    <span className="font-semibold text-green-600">+28%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Lender Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Lender</CardTitle>
              <CardDescription>Create a new trusted lender</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="issuer_name">Lender Name</Label>
                <Input
                  id="issuer_name"
                  value={formData.issuer_name}
                  onChange={(e) => setFormData({ ...formData, issuer_name: e.target.value })}
                  placeholder="Enter lender name"
                />
              </div>
              <div>
                <Label htmlFor="issuer_type">Lender Type</Label>
                <select
                  id="issuer_type"
                  value={formData.issuer_type}
                  onChange={(e) => setFormData({ ...formData, issuer_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="bank">Bank</option>
                  <option value="utility">Utility</option>
                  <option value="telecom">Telecom</option>
                  <option value="government">Government</option>
                  <option value="bsm_platform">BSM Platform</option>
                </select>
              </div>
              <div>
                <Label htmlFor="issuer_did">DID</Label>
                <Input
                  id="issuer_did"
                  value={formData.issuer_did}
                  onChange={(e) => setFormData({ ...formData, issuer_did: e.target.value })}
                  placeholder="Enter DID identifier"
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="Enter contact email"
                />
              </div>
              <div>
                <Label htmlFor="issuer_description">Description</Label>
                <Textarea
                  id="issuer_description"
                  value={formData.issuer_description}
                  onChange={(e) => setFormData({ ...formData, issuer_description: e.target.value })}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateLender}>
                  Create Lender
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

