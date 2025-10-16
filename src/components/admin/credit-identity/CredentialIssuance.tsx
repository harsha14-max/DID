// =====================================================
// BSM Platform - Admin Credential Issuance Component
// =====================================================
// Component for issuing verifiable credentials in the admin portal

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
  Award, 
  Users, 
  Activity,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Clock,
  Shield
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { 
  VerifiableCredential, 
  CredentialType, 
  CredentialIssuanceProps,
  ServiceCompletionData,
  PaymentHistoryData,
  UtilityPaymentData,
  IdentityVerificationData
} from '@/types/credit'
import { vcIssuer } from '@/components/shared/credit/VCIssuer'

export default function CredentialIssuance({ userId, onCredentialIssued }: CredentialIssuanceProps) {
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCredential, setSelectedCredential] = useState<VerifiableCredential | null>(null)
  const [statistics, setStatistics] = useState({
    total_credentials: 0,
    active_credentials: 0,
    revoked_credentials: 0,
    expired_credentials: 0,
    by_type: {} as Record<CredentialType, number>,
    issued_today: 0,
    issued_this_week: 0,
    issued_this_month: 0
  })

  // Form states for different credential types
  const [serviceCompletionForm, setServiceCompletionForm] = useState({
    service: '',
    rating: 5,
    completed_at: new Date().toISOString(),
    ticket_id: '',
    resolution_time: 0
  })

  const [paymentHistoryForm, setPaymentHistoryForm] = useState({
    months_paid: 12,
    total_amount: 0,
    average_amount: 0,
    last_payment_date: new Date().toISOString(),
    payment_frequency: 'monthly' as 'monthly' | 'quarterly' | 'annually'
  })

  const [utilityPaymentForm, setUtilityPaymentForm] = useState({
    utility_type: 'electricity' as 'electricity' | 'water' | 'gas' | 'internet' | 'phone',
    months_paid: 12,
    average_amount: 0,
    last_payment_date: new Date().toISOString(),
    provider_name: ''
  })

  const [identityVerificationForm, setIdentityVerificationForm] = useState({
    verification_method: 'government_id' as 'government_id' | 'biometric' | 'social_security',
    verified_at: new Date().toISOString(),
    verification_level: 'basic' as 'basic' | 'enhanced' | 'premium',
    issuing_authority: ''
  })

  useEffect(() => {
    loadCredentials()
    loadStatistics()
  }, [])

  const loadCredentials = async () => {
    try {
      setLoading(true)
      const data = await vcIssuer.getCredentialsByIssuer('did:bsm:issuer:bsm-platform')
      setCredentials(data)
    } catch (error) {
      console.error('Error loading credentials:', error)
      toast.error('Failed to load credentials')
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const stats = await vcIssuer.getCredentialStatistics()
      setStatistics(stats)
    } catch (error) {
      console.error('Error loading statistics:', error)
    }
  }

  const handleIssueServiceCompletionCredential = async () => {
    try {
      if (!userId) {
        toast.error('User ID is required')
        return
      }

      const credential = await vcIssuer.issueServiceCompletionCredential(userId, serviceCompletionForm)
      
      toast.success('Service completion credential issued successfully')
      setCredentials(prev => [credential, ...prev])
      
      if (onCredentialIssued) {
        onCredentialIssued(credential)
      }

      // Reset form
      setServiceCompletionForm({
        service: '',
        rating: 5,
        completed_at: new Date().toISOString(),
        ticket_id: '',
        resolution_time: 0
      })

      loadStatistics()
    } catch (error) {
      console.error('Error issuing service completion credential:', error)
      toast.error('Failed to issue credential')
    }
  }

  const handleIssuePaymentHistoryCredential = async () => {
    try {
      if (!userId) {
        toast.error('User ID is required')
        return
      }

      const credential = await vcIssuer.issuePaymentHistoryCredential(userId, paymentHistoryForm)
      
      toast.success('Payment history credential issued successfully')
      setCredentials(prev => [credential, ...prev])
      
      if (onCredentialIssued) {
        onCredentialIssued(credential)
      }

      // Reset form
      setPaymentHistoryForm({
        months_paid: 12,
        total_amount: 0,
        average_amount: 0,
        last_payment_date: new Date().toISOString(),
        payment_frequency: 'monthly'
      })

      loadStatistics()
    } catch (error) {
      console.error('Error issuing payment history credential:', error)
      toast.error('Failed to issue credential')
    }
  }

  const handleIssueUtilityPaymentCredential = async () => {
    try {
      if (!userId) {
        toast.error('User ID is required')
        return
      }

      const credential = await vcIssuer.issueUtilityPaymentCredential(userId, utilityPaymentForm)
      
      toast.success('Utility payment credential issued successfully')
      setCredentials(prev => [credential, ...prev])
      
      if (onCredentialIssued) {
        onCredentialIssued(credential)
      }

      // Reset form
      setUtilityPaymentForm({
        utility_type: 'electricity',
        months_paid: 12,
        average_amount: 0,
        last_payment_date: new Date().toISOString(),
        provider_name: ''
      })

      loadStatistics()
    } catch (error) {
      console.error('Error issuing utility payment credential:', error)
      toast.error('Failed to issue credential')
    }
  }

  const handleIssueIdentityVerificationCredential = async () => {
    try {
      if (!userId) {
        toast.error('User ID is required')
        return
      }

      const credential = await vcIssuer.issueIdentityVerificationCredential(userId, identityVerificationForm)
      
      toast.success('Identity verification credential issued successfully')
      setCredentials(prev => [credential, ...prev])
      
      if (onCredentialIssued) {
        onCredentialIssued(credential)
      }

      // Reset form
      setIdentityVerificationForm({
        verification_method: 'government_id',
        verified_at: new Date().toISOString(),
        verification_level: 'basic',
        issuing_authority: ''
      })

      loadStatistics()
    } catch (error) {
      console.error('Error issuing identity verification credential:', error)
      toast.error('Failed to issue credential')
    }
  }

  const handleRevokeCredential = async (credentialId: string) => {
    try {
      await vcIssuer.revokeCredential(credentialId, 'Revoked by admin')
      toast.success('Credential revoked successfully')
      
      // Update local state
      setCredentials(prev => prev.map(cred => 
        cred.id === credentialId ? { ...cred, is_revoked: true, revocation_reason: 'Revoked by admin' } : cred
      ))
      
      loadStatistics()
    } catch (error) {
      console.error('Error revoking credential:', error)
      toast.error('Failed to revoke credential')
    }
  }

  const filteredCredentials = credentials.filter(credential => 
    credential.credential_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    credential.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    credential.issuer_did.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCredentialTypeIcon = (type: CredentialType) => {
    switch (type) {
      case 'service_completion':
        return <Award className="h-4 w-4 text-blue-500" />
      case 'payment_history':
        return <FileText className="h-4 w-4 text-green-500" />
      case 'utility_payment':
        return <Shield className="h-4 w-4 text-purple-500" />
      case 'identity_verification':
        return <Users className="h-4 w-4 text-orange-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Credential Issuance</h2>
          <p className="text-gray-600">Issue verifiable credentials to users</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credentials</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total_credentials}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.active_credentials} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issued Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.issued_today}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.issued_this_week} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revoked</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.revoked_credentials}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.expired_credentials} expired
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.issued_this_month}</div>
            <p className="text-xs text-muted-foreground">
              New credentials issued
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="issue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="issue">Issue Credentials</TabsTrigger>
          <TabsTrigger value="list">Credential List</TabsTrigger>
          <TabsTrigger value="details">Credential Details</TabsTrigger>
        </TabsList>

        <TabsContent value="issue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Service Completion Credential */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-500" />
                  Service Completion Credential
                </CardTitle>
                <CardDescription>
                  Issue credential for completed services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="service">Service Type</Label>
                  <Input
                    id="service"
                    value={serviceCompletionForm.service}
                    onChange={(e) => setServiceCompletionForm(prev => ({ ...prev, service: e.target.value }))}
                    placeholder="e.g., Technical Support"
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={serviceCompletionForm.rating}
                    onChange={(e) => setServiceCompletionForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="ticket_id">Ticket ID (Optional)</Label>
                  <Input
                    id="ticket_id"
                    value={serviceCompletionForm.ticket_id}
                    onChange={(e) => setServiceCompletionForm(prev => ({ ...prev, ticket_id: e.target.value }))}
                    placeholder="e.g., TKT-12345"
                  />
                </div>
                <div>
                  <Label htmlFor="resolution_time">Resolution Time (hours)</Label>
                  <Input
                    id="resolution_time"
                    type="number"
                    value={serviceCompletionForm.resolution_time}
                    onChange={(e) => setServiceCompletionForm(prev => ({ ...prev, resolution_time: parseInt(e.target.value) }))}
                  />
                </div>
                <Button 
                  onClick={handleIssueServiceCompletionCredential}
                  className="w-full"
                  disabled={!serviceCompletionForm.service}
                >
                  Issue Service Completion Credential
                </Button>
              </CardContent>
            </Card>

            {/* Payment History Credential */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  Payment History Credential
                </CardTitle>
                <CardDescription>
                  Issue credential for payment history
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="months_paid">Months Paid</Label>
                  <Input
                    id="months_paid"
                    type="number"
                    value={paymentHistoryForm.months_paid}
                    onChange={(e) => setPaymentHistoryForm(prev => ({ ...prev, months_paid: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="total_amount">Total Amount</Label>
                  <Input
                    id="total_amount"
                    type="number"
                    value={paymentHistoryForm.total_amount}
                    onChange={(e) => setPaymentHistoryForm(prev => ({ ...prev, total_amount: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="average_amount">Average Amount</Label>
                  <Input
                    id="average_amount"
                    type="number"
                    value={paymentHistoryForm.average_amount}
                    onChange={(e) => setPaymentHistoryForm(prev => ({ ...prev, average_amount: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="payment_frequency">Payment Frequency</Label>
                  <select
                    id="payment_frequency"
                    value={paymentHistoryForm.payment_frequency}
                    onChange={(e) => setPaymentHistoryForm(prev => ({ ...prev, payment_frequency: e.target.value as any }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
                <Button 
                  onClick={handleIssuePaymentHistoryCredential}
                  className="w-full"
                >
                  Issue Payment History Credential
                </Button>
              </CardContent>
            </Card>

            {/* Utility Payment Credential */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Utility Payment Credential
                </CardTitle>
                <CardDescription>
                  Issue credential for utility payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="utility_type">Utility Type</Label>
                  <select
                    id="utility_type"
                    value={utilityPaymentForm.utility_type}
                    onChange={(e) => setUtilityPaymentForm(prev => ({ ...prev, utility_type: e.target.value as any }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="electricity">Electricity</option>
                    <option value="water">Water</option>
                    <option value="gas">Gas</option>
                    <option value="internet">Internet</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="provider_name">Provider Name</Label>
                  <Input
                    id="provider_name"
                    value={utilityPaymentForm.provider_name}
                    onChange={(e) => setUtilityPaymentForm(prev => ({ ...prev, provider_name: e.target.value }))}
                    placeholder="e.g., City Utilities"
                  />
                </div>
                <div>
                  <Label htmlFor="utility_months_paid">Months Paid</Label>
                  <Input
                    id="utility_months_paid"
                    type="number"
                    value={utilityPaymentForm.months_paid}
                    onChange={(e) => setUtilityPaymentForm(prev => ({ ...prev, months_paid: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="utility_average_amount">Average Amount</Label>
                  <Input
                    id="utility_average_amount"
                    type="number"
                    value={utilityPaymentForm.average_amount}
                    onChange={(e) => setUtilityPaymentForm(prev => ({ ...prev, average_amount: parseFloat(e.target.value) }))}
                  />
                </div>
                <Button 
                  onClick={handleIssueUtilityPaymentCredential}
                  className="w-full"
                  disabled={!utilityPaymentForm.provider_name}
                >
                  Issue Utility Payment Credential
                </Button>
              </CardContent>
            </Card>

            {/* Identity Verification Credential */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  Identity Verification Credential
                </CardTitle>
                <CardDescription>
                  Issue credential for identity verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="verification_method">Verification Method</Label>
                  <select
                    id="verification_method"
                    value={identityVerificationForm.verification_method}
                    onChange={(e) => setIdentityVerificationForm(prev => ({ ...prev, verification_method: e.target.value as any }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="government_id">Government ID</option>
                    <option value="biometric">Biometric</option>
                    <option value="social_security">Social Security</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="verification_level">Verification Level</Label>
                  <select
                    id="verification_level"
                    value={identityVerificationForm.verification_level}
                    onChange={(e) => setIdentityVerificationForm(prev => ({ ...prev, verification_level: e.target.value as any }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="basic">Basic</option>
                    <option value="enhanced">Enhanced</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="issuing_authority">Issuing Authority</Label>
                  <Input
                    id="issuing_authority"
                    value={identityVerificationForm.issuing_authority}
                    onChange={(e) => setIdentityVerificationForm(prev => ({ ...prev, issuing_authority: e.target.value }))}
                    placeholder="e.g., Department of Motor Vehicles"
                  />
                </div>
                <Button 
                  onClick={handleIssueIdentityVerificationCredential}
                  className="w-full"
                  disabled={!identityVerificationForm.issuing_authority}
                >
                  Issue Identity Verification Credential
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search credentials by type, user ID, or issuer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Credentials Table */}
          <Card>
            <CardHeader>
              <CardTitle>Issued Credentials</CardTitle>
              <CardDescription>
                All verifiable credentials issued by the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCredentials.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No credentials found
                    </div>
                  ) : (
                    filteredCredentials.map((credential) => (
                      <div
                        key={credential.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getCredentialTypeIcon(credential.credential_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 capitalize">
                                {credential.credential_type.replace('_', ' ')}
                              </p>
                              <Badge 
                                variant={credential.is_revoked ? "destructive" : "default"}
                                className={credential.is_revoked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                              >
                                {credential.is_revoked ? (
                                  <>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Revoked
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Active
                                  </>
                                )}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              User: {credential.user_id}
                            </p>
                            <p className="text-xs text-gray-400">
                              Issued: {formatDate(credential.issued_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCredential(credential)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!credential.is_revoked && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeCredential(credential.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedCredential ? (
            <Card>
              <CardHeader>
                <CardTitle>Credential Details</CardTitle>
                <CardDescription>
                  Detailed information about the selected credential
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Credential Type</label>
                    <p className="text-sm text-gray-900 capitalize">
                      {selectedCredential.credential_type.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">User ID</label>
                    <p className="text-sm text-gray-900">{selectedCredential.user_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Issuer DID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedCredential.issuer_did}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Badge 
                      variant={selectedCredential.is_revoked ? "destructive" : "default"}
                      className={selectedCredential.is_revoked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                    >
                      {selectedCredential.is_revoked ? 'Revoked' : 'Active'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Issued At</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedCredential.issued_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Expires At</label>
                    <p className="text-sm text-gray-900">
                      {selectedCredential.expires_at ? formatDate(selectedCredential.expires_at) : 'Never'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Credential Data</label>
                  <pre className="text-sm text-gray-900 bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(selectedCredential.credential_data, null, 2)}
                  </pre>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Proof Signature</label>
                  <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded break-all">
                    {selectedCredential.proof_signature}
                  </p>
                </div>

                {selectedCredential.is_revoked && selectedCredential.revocation_reason && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Revocation Reason</label>
                    <p className="text-sm text-gray-900">{selectedCredential.revocation_reason}</p>
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCredential(null)}
                  >
                    Close
                  </Button>
                  {!selectedCredential.is_revoked && (
                    <Button
                      variant="destructive"
                      onClick={() => handleRevokeCredential(selectedCredential.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Revoke Credential
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Credential Selected</h3>
                  <p className="text-gray-500">
                    Select a credential from the list to view its details
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

