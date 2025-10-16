// =====================================================
// credX Platform - User Approval Component
// =====================================================
// Dedicated approval chamber for user document submissions

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield,
  RefreshCw,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  Download,
  Filter,
  MoreHorizontal
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface UserSubmission {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  submissionDate: string
  documents: {
    id: string
    type: string
    status: 'pending' | 'approved' | 'rejected' | 'under_review'
    submittedAt: string
    reviewedAt?: string
    reviewer?: string
    notes?: string
    fileUrl?: string
  }[]
  creditScore: number
  totalVCs: number
  riskFactors: string[]
  priority: 'urgent' | 'high' | 'medium' | 'low'
  lastActivity: string
}

interface ApprovalAction {
  submissionId: string
  documentId: string
  action: 'approve' | 'reject' | 'request_more_info'
  notes?: string
}

export default function UserApproval() {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [selectedSubmission, setSelectedSubmission] = useState<UserSubmission | null>(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [approvalAction, setApprovalAction] = useState<ApprovalAction>({
    submissionId: '',
    documentId: '',
    action: 'approve',
    notes: ''
  })

  useEffect(() => {
    // Simulate fetching user submissions
    const timer = setTimeout(() => {
      setSubmissions([
        {
          id: 'sub-001',
          userId: 'user-001',
          userName: 'John Doe',
          userEmail: 'john.doe@example.com',
          userPhone: '+1 (555) 123-4567',
          submissionDate: '2024-01-15T10:30:00Z',
          documents: [
            {
              id: 'doc-001',
              type: 'Income Verification',
              status: 'pending',
              submittedAt: '2024-01-15T10:30:00Z',
              fileUrl: '/api/documents/income_proof_john.pdf',
              notes: 'Salary slip and bank statement provided'
            },
            {
              id: 'doc-002',
              type: 'Utility Bill',
              status: 'pending',
              submittedAt: '2024-01-15T10:35:00Z',
              fileUrl: '/api/documents/utility_bill_john.pdf',
              notes: 'Electricity bill for last 3 months'
            }
          ],
          creditScore: 720,
          totalVCs: 8,
          riskFactors: ['New user', 'Limited credit history'],
          priority: 'high',
          lastActivity: '2024-01-15T10:35:00Z'
        },
        {
          id: 'sub-002',
          userId: 'user-002',
          userName: 'Jane Smith',
          userEmail: 'jane.smith@example.com',
          userPhone: '+1 (555) 987-6543',
          submissionDate: '2024-01-14T14:20:00Z',
          documents: [
            {
              id: 'doc-003',
              type: 'Employment Letter',
              status: 'pending',
              submittedAt: '2024-01-14T14:20:00Z',
              fileUrl: '/api/documents/employment_jane.pdf',
              notes: 'Employment verification letter'
            }
          ],
          creditScore: 650,
          totalVCs: 5,
          riskFactors: [],
          priority: 'medium',
          lastActivity: '2024-01-14T14:20:00Z'
        },
        {
          id: 'sub-003',
          userId: 'user-003',
          userName: 'Alice Johnson',
          userEmail: 'alice.j@example.com',
          userPhone: '+1 (555) 456-7890',
          submissionDate: '2024-01-13T09:15:00Z',
          documents: [
            {
              id: 'doc-004',
              type: 'Bank Statement',
              status: 'under_review',
              submittedAt: '2024-01-13T09:15:00Z',
              fileUrl: '/api/documents/bank_statement_alice.pdf',
              notes: 'Bank statement for last 6 months',
              reviewedAt: '2024-01-13T11:30:00Z',
              reviewer: 'Admin Bob'
            }
          ],
          creditScore: 780,
          totalVCs: 12,
          riskFactors: [],
          priority: 'low',
          lastActivity: '2024-01-13T11:30:00Z'
        },
        {
          id: 'sub-004',
          userId: 'user-004',
          userName: 'Mike Brown',
          userEmail: 'mike.brown@example.com',
          userPhone: '+1 (555) 321-9876',
          submissionDate: '2024-01-12T16:45:00Z',
          documents: [
            {
              id: 'doc-005',
              type: 'Rental History',
              status: 'rejected',
              submittedAt: '2024-01-12T16:45:00Z',
              fileUrl: '/api/documents/rental_history_mike.pdf',
              notes: 'Lease agreement and rental receipts',
              reviewedAt: '2024-01-12T18:20:00Z',
              reviewer: 'Admin Alice'
            }
          ],
          creditScore: 580,
          totalVCs: 3,
          riskFactors: ['Low credit score', 'Recent late payments'],
          priority: 'urgent',
          lastActivity: '2024-01-12T18:20:00Z'
        }
      ])
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          submission.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          submission.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const hasPendingDocs = submission.documents.some(doc => doc.status === 'pending')
    const hasUnderReviewDocs = submission.documents.some(doc => doc.status === 'under_review')
    
    let matchesStatus = true
    if (filterStatus === 'pending') matchesStatus = hasPendingDocs
    else if (filterStatus === 'under_review') matchesStatus = hasUnderReviewDocs
    else if (filterStatus === 'completed') matchesStatus = !hasPendingDocs && !hasUnderReviewDocs
    
    const matchesPriority = filterPriority === 'all' || submission.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleApprovalAction = (action: ApprovalAction) => {
    toast.promise(
      new Promise(resolve => setTimeout(() => {
        setSubmissions(prev => prev.map(submission => 
          submission.id === action.submissionId
            ? {
                ...submission,
                documents: submission.documents.map(doc =>
                  doc.id === action.documentId
                    ? {
                        ...doc,
                        status: action.action === 'approve' ? 'approved' : action.action === 'reject' ? 'rejected' : 'under_review',
                        reviewedAt: new Date().toISOString(),
                        reviewer: 'Current Admin',
                        notes: action.notes
                      }
                    : doc
                ),
                lastActivity: new Date().toISOString()
              }
            : submission
        ))
        resolve(`${action.action} completed!`)
      }, 1500)),
      {
        loading: `Processing ${action.action}...`,
        success: `Document ${action.action}d successfully!`,
        error: `Failed to ${action.action} document.`,
      }
    )
    setShowApprovalModal(false)
    setApprovalAction({
      submissionId: '',
      documentId: '',
      action: 'approve',
      notes: ''
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="warning" className="bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case 'approved': return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>
      case 'rejected': return <Badge variant="destructive" className="bg-red-100 text-red-700"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>
      case 'under_review': return <Badge className="bg-blue-100 text-blue-700"><Eye className="h-3 w-3 mr-1" /> Under Review</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Badge variant="destructive" className="bg-red-100 text-red-700">Urgent</Badge>
      case 'high': return <Badge variant="warning" className="bg-orange-100 text-orange-700">High</Badge>
      case 'medium': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Medium</Badge>
      case 'low': return <Badge variant="outline" className="bg-gray-100 text-gray-700">Low</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPendingDocumentsCount = (submission: UserSubmission) => {
    return submission.documents.filter(doc => doc.status === 'pending').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
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
          <h2 className="text-3xl font-bold text-gray-900">User Approval Chamber</h2>
          <p className="text-gray-600 mt-1">Review and approve user document submissions from Digital Wallet</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Queue
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {submissions.reduce((acc, sub) => acc + getPendingDocumentsCount(sub), 0)}
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
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-blue-600">
                  {submissions.reduce((acc, sub) => acc + sub.documents.filter(doc => doc.status === 'under_review').length, 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {submissions.reduce((acc, sub) => acc + sub.documents.filter(doc => doc.status === 'approved' && doc.reviewedAt && new Date(doc.reviewedAt).toDateString() === new Date().toDateString()).length, 0)}
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
                <p className="text-sm text-gray-600">Urgent Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {submissions.filter(sub => sub.priority === 'urgent').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="completed">Completed</option>
            </select>
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map(submission => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold">{submission.userName}</h3>
                      {getPriorityBadge(submission.priority)}
                      <Badge variant="outline">{submission.id}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{submission.userEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{submission.userPhone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(submission.submissionDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 mb-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Credit Score</p>
                        <p className="text-lg font-bold">{submission.creditScore}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total VCs</p>
                        <p className="text-lg font-bold">{submission.totalVCs}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Pending Docs</p>
                        <p className="text-lg font-bold text-yellow-600">{getPendingDocumentsCount(submission)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Risk Factors</p>
                        <p className="text-lg font-bold text-red-600">{submission.riskFactors.length}</p>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Documents:</h4>
                      <div className="flex flex-wrap gap-2">
                        {submission.documents.map(doc => (
                          <div key={doc.id} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">{doc.type}</span>
                            {getStatusBadge(doc.status)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {getPendingDocumentsCount(submission) > 0 && (
                      <Button 
                        size="sm"
                        onClick={() => {
                          const pendingDoc = submission.documents.find(doc => doc.status === 'pending')
                          if (pendingDoc) {
                            setApprovalAction({
                              submissionId: submission.id,
                              documentId: pendingDoc.id,
                              action: 'approve',
                              notes: ''
                            })
                            setShowApprovalModal(true)
                          }
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Quick Approve
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Docs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Approval Modal */}
      <AnimatePresence>
        {showApprovalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Document Approval</CardTitle>
                  <CardDescription>Review and approve/reject user document</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Action</label>
                    <select
                      value={approvalAction.action}
                      onChange={(e) => setApprovalAction({ ...approvalAction, action: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                    >
                      <option value="approve">Approve</option>
                      <option value="reject">Reject</option>
                      <option value="request_more_info">Request More Info</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Notes (Optional)</label>
                    <textarea
                      value={approvalAction.notes}
                      onChange={(e) => setApprovalAction({ ...approvalAction, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                      rows={3}
                      placeholder="Add any notes or comments..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleApprovalAction(approvalAction)}>
                      {approvalAction.action === 'approve' ? 'Approve' : 
                       approvalAction.action === 'reject' ? 'Reject' : 'Request Info'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
