'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  CreditCard, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Download, 
  RefreshCw,
  DollarSign,
  Calendar,
  Building,
  User,
  FileText,
  Shield,
  Target,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Banknote,
  Coins,
  Receipt,
  Calculator,
  Percent,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  HelpCircle,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface DigitalWalletLoanApplicationsProps {
  userId: string
}

export default function DigitalWalletLoanApplications({ userId }: DigitalWalletLoanApplicationsProps) {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [newApplication, setNewApplication] = useState({
    lender_did: '',
    loan_amount: '',
    loan_purpose: '',
    score_threshold: 650,
    metadata: {}
  })

  useEffect(() => {
    fetchApplications()
  }, [userId])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/credit/applications?user_id=${userId}`)
      const data = await response.json()
      
      setApplications(data.applications || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error('Failed to load loan applications')
    } finally {
      setLoading(false)
    }
  }

  const createApplication = async () => {
    try {
      const response = await fetch('/api/credit/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          lender_did: newApplication.lender_did,
          loan_amount: parseFloat(newApplication.loan_amount),
          loan_purpose: newApplication.loan_purpose,
          score_threshold: newApplication.score_threshold,
          zkp_proof: 'mock_zkp_proof_' + Date.now(),
          metadata: newApplication.metadata
        })
      })

      if (response.ok) {
        toast.success('Loan application submitted successfully!')
        setShowCreateModal(false)
        setNewApplication({
          lender_did: '',
          loan_amount: '',
          loan_purpose: '',
          score_threshold: 650,
          metadata: {}
        })
        fetchApplications()
      } else {
        toast.error('Failed to submit loan application')
      }
    } catch (error) {
      console.error('Error creating application:', error)
      toast.error('Failed to submit loan application')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'verified': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle
      case 'pending': return Clock
      case 'rejected': return XCircle
      case 'verified': return CheckCircle2
      default: return AlertCircle
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
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
          <h2 className="text-3xl font-bold text-gray-900">Loan Applications</h2>
          <p className="text-gray-600">Apply for loans using Zero-Knowledge Proofs</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">
                  {applications.filter(app => app.status === 'approved').length}
                </p>
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
                <p className="text-3xl font-bold text-yellow-600">
                  {applications.filter(app => app.status === 'pending').length}
                </p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(applications.reduce((sum, app) => sum + (app.loan_amount || 0), 0))}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {applications.map((application, index) => {
            const StatusIcon = getStatusIcon(application.status)
            
            return (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Loan Application</h4>
                          <p className="text-sm text-gray-600">#{application.id.slice(-8)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(application.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {application.status}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedApplication(application)}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Amount:</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(application.loan_amount || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Purpose:</span>
                        <span className="font-medium text-gray-900">{application.loan_purpose || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Applied:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(application.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Score Threshold:</span>
                        <span className="font-medium text-gray-900">{application.score_threshold}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {applications.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Loan Applications</h3>
            <p className="text-gray-600 mb-6">
              You haven't submitted any loan applications yet. Apply for a loan using your verified credentials.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Apply for Your First Loan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Application Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">New Loan Application</h2>
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="lender_did">Lender DID</Label>
                <Input
                  id="lender_did"
                  placeholder="did:bank:chase"
                  value={newApplication.lender_did}
                  onChange={(e) => setNewApplication(prev => ({ ...prev, lender_did: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="loan_amount">Loan Amount ($)</Label>
                <Input
                  id="loan_amount"
                  type="number"
                  placeholder="5000"
                  value={newApplication.loan_amount}
                  onChange={(e) => setNewApplication(prev => ({ ...prev, loan_amount: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="loan_purpose">Loan Purpose</Label>
                <Textarea
                  id="loan_purpose"
                  placeholder="Personal loan for home improvement"
                  value={newApplication.loan_purpose}
                  onChange={(e) => setNewApplication(prev => ({ ...prev, loan_purpose: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="score_threshold">Minimum Credit Score</Label>
                <Input
                  id="score_threshold"
                  type="number"
                  placeholder="650"
                  value={newApplication.score_threshold}
                  onChange={(e) => setNewApplication(prev => ({ ...prev, score_threshold: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4 pt-6">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={createApplication}>
                <Shield className="h-4 w-4 mr-2" />
                Submit Application
              </Button>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Application Details</h2>
              <Button variant="ghost" onClick={() => setSelectedApplication(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Loan Application #{selectedApplication.id.slice(-8)}</h3>
                  <Badge className={getStatusColor(selectedApplication.status)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {selectedApplication.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Loan Amount</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(selectedApplication.loan_amount || 0)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Purpose</label>
                  <p className="text-sm text-gray-900">{selectedApplication.loan_purpose || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Applied Date</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedApplication.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Score Threshold</label>
                  <p className="text-sm text-gray-900">{selectedApplication.score_threshold}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">ZKP Proof</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <code className="text-sm text-gray-700">{selectedApplication.zkp_proof}</code>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Proof
                </Button>
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Verify
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
