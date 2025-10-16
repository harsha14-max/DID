// =====================================================
// credX Platform - VC Verification Queue Component
// =====================================================
// Document submission management and verification workflow

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Download,
  MessageSquare,
  RefreshCw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface DocumentSubmission {
  id: string
  userId: string
  userName: string
  userEmail: string
  documentType: string
  documentName: string
  submittedAt: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'needs_more_info'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  reviewerId?: string
  reviewerName?: string
  reviewNotes?: string
  rejectionReason?: string
  documentUrl: string
  metadata: {
    fileSize: string
    fileType: string
    pages?: number
    amount?: number
    currency?: string
    period?: string
    provider?: string
  }
}

export default function VCVerificationQueue() {
  const [submissions, setSubmissions] = useState<DocumentSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [selectedSubmission, setSelectedSubmission] = useState<DocumentSubmission | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')

  useEffect(() => {
    // Simulate fetching document submissions
    const timer = setTimeout(() => {
      setSubmissions([
        {
          id: 'sub-001',
          userId: 'user-1',
          userName: 'Sarah Johnson',
          userEmail: 'sarah.j@example.com',
          documentType: 'Utility Bill',
          documentName: 'Electric Bill - March 2024.pdf',
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          priority: 'high',
          documentUrl: '/documents/electric-bill-march-2024.pdf',
          metadata: {
            fileSize: '2.3 MB',
            fileType: 'PDF',
            pages: 3,
            amount: 89.99,
            currency: 'USD',
            period: 'March 2024',
            provider: 'Electric Co.'
          }
        },
        {
          id: 'sub-002',
          userId: 'user-2',
          userName: 'John Doe',
          userEmail: 'john.doe@example.com',
          documentType: 'Income Verification',
          documentName: 'Pay Stub - April 2024.pdf',
          submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'under_review',
          priority: 'medium',
          reviewerId: 'admin-1',
          reviewerName: 'Admin User',
          documentUrl: '/documents/pay-stub-april-2024.pdf',
          metadata: {
            fileSize: '1.8 MB',
            fileType: 'PDF',
            pages: 2,
            amount: 4500,
            currency: 'USD',
            period: 'April 2024',
            provider: 'Employer Inc.'
          }
        },
        {
          id: 'sub-003',
          userId: 'user-3',
          userName: 'Jane Smith',
          userEmail: 'jane.smith@example.com',
          documentType: 'Rental History',
          documentName: 'Lease Agreement - 2023.pdf',
          submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'approved',
          priority: 'low',
          reviewerId: 'admin-2',
          reviewerName: 'Admin User 2',
          reviewNotes: 'Document verified successfully. All information matches records.',
          documentUrl: '/documents/lease-agreement-2023.pdf',
          metadata: {
            fileSize: '4.1 MB',
            fileType: 'PDF',
            pages: 8,
            amount: 1500,
            currency: 'USD',
            period: '2023',
            provider: 'Property Management Co.'
          }
        },
        {
          id: 'sub-004',
          userId: 'user-4',
          userName: 'Bob Williams',
          userEmail: 'bob.w@example.com',
          documentType: 'Income Verification',
          documentName: 'Bank Statement - March 2024.pdf',
          submittedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          status: 'rejected',
          priority: 'medium',
          reviewerId: 'admin-1',
          reviewerName: 'Admin User',
          rejectionReason: 'Insufficient documentation. Please provide employer letter and recent pay stubs.',
          documentUrl: '/documents/bank-statement-march-2024.pdf',
          metadata: {
            fileSize: '3.2 MB',
            fileType: 'PDF',
            pages: 5,
            amount: 3200,
            currency: 'USD',
            period: 'March 2024',
            provider: 'Bank of America'
          }
        },
        {
          id: 'sub-005',
          userId: 'user-5',
          userName: 'Alice Johnson',
          userEmail: 'alice.j@example.com',
          documentType: 'Service Completion',
          documentName: 'Project Completion Certificate.pdf',
          submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          status: 'needs_more_info',
          priority: 'high',
          reviewerId: 'admin-2',
          reviewerName: 'Admin User 2',
          reviewNotes: 'Please provide additional details about the project scope and client feedback.',
          documentUrl: '/documents/project-completion-certificate.pdf',
          metadata: {
            fileSize: '1.5 MB',
            fileType: 'PDF',
            pages: 2,
            amount: 5000,
            currency: 'USD',
            period: 'Q1 2024',
            provider: 'Client Corp.'
          }
        }
      ])
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.documentName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus
    const matchesType = filterType === 'all' || submission.documentType === filterType
    const matchesPriority = filterPriority === 'all' || submission.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const handleViewSubmission = (submission: DocumentSubmission) => {
    setSelectedSubmission(submission)
    setShowDetailModal(true)
  }

  const handleApproveSubmission = (id: string) => {
    if (window.confirm('Are you sure you want to approve this document submission?')) {
      setSubmissions(submissions.map(sub => 
        sub.id === id 
          ? { ...sub, status: 'approved', reviewerId: 'current-admin', reviewerName: 'Current Admin', reviewNotes: 'Document approved and VC will be issued.' }
          : sub
      ))
      toast.success('Document submission approved! VC will be issued to user.')
    }
  }

  const handleRejectSubmission = (id: string) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (reason) {
      setSubmissions(submissions.map(sub => 
        sub.id === id 
          ? { ...sub, status: 'rejected', reviewerId: 'current-admin', reviewerName: 'Current Admin', rejectionReason: reason }
          : sub
      ))
      toast.success('Document submission rejected. User will be notified.')
    }
  }

  const handleRequestMoreInfo = (id: string) => {
    const note = prompt('Please provide details about what additional information is needed:')
    if (note) {
      setSubmissions(submissions.map(sub => 
        sub.id === id 
          ? { ...sub, status: 'needs_more_info', reviewerId: 'current-admin', reviewerName: 'Current Admin', reviewNotes: note }
          : sub
      ))
      toast.success('Request for more information sent to user.')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Pending</Badge>
      case 'under_review': return <Badge variant="warning" className="bg-blue-100 text-blue-700">Under Review</Badge>
      case 'approved': return <Badge variant="success" className="bg-green-100 text-green-700">Approved</Badge>
      case 'rejected': return <Badge variant="destructive" className="bg-red-100 text-red-700">Rejected</Badge>
      case 'needs_more_info': return <Badge variant="warning" className="bg-orange-100 text-orange-700">Needs More Info</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Badge variant="destructive" className="bg-red-100 text-red-700">Urgent</Badge>
      case 'high': return <Badge variant="destructive" className="bg-orange-100 text-orange-700">High</Badge>
      case 'medium': return <Badge variant="warning" className="bg-yellow-100 text-yellow-700">Medium</Badge>
      case 'low': return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Low</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const documentTypes = Array.from(new Set(submissions.map(sub => sub.documentType)))

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
          <h2 className="text-3xl font-bold text-gray-900">VC Verification Queue</h2>
          <p className="text-gray-600 mt-1">Document submission management and verification workflow</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setLoading(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Queue
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by user, document type, or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="needs_more_info">Needs More Info</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          {documentTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Submissions List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      No document submissions found.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map(submission => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{submission.userName}</div>
                          <div className="text-sm text-gray-500">{submission.userEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{submission.documentName}</div>
                        <div className="text-sm text-gray-500">{submission.metadata.fileSize}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.documentType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(submission.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getPriorityBadge(submission.priority)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewSubmission(submission)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {submission.status === 'pending' && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleApproveSubmission(submission.id)}>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleRejectSubmission(submission.id)}>
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleRequestMoreInfo(submission.id)}>
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Document Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedSubmission && (
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
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Document Review: {selectedSubmission.documentName}</CardTitle>
                  <CardDescription>Submitted by {selectedSubmission.userName} ({selectedSubmission.userEmail})</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Document Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Document Information</h3>
                      <div className="space-y-2">
                        <p><strong>Type:</strong> {selectedSubmission.documentType}</p>
                        <p><strong>File Size:</strong> {selectedSubmission.metadata.fileSize}</p>
                        <p><strong>File Type:</strong> {selectedSubmission.metadata.fileType}</p>
                        <p><strong>Pages:</strong> {selectedSubmission.metadata.pages}</p>
                        <p><strong>Submitted:</strong> {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Document Details</h3>
                      <div className="space-y-2">
                        {selectedSubmission.metadata.amount && (
                          <p><strong>Amount:</strong> ${selectedSubmission.metadata.amount} {selectedSubmission.metadata.currency}</p>
                        )}
                        {selectedSubmission.metadata.period && (
                          <p><strong>Period:</strong> {selectedSubmission.metadata.period}</p>
                        )}
                        {selectedSubmission.metadata.provider && (
                          <p><strong>Provider:</strong> {selectedSubmission.metadata.provider}</p>
                        )}
                        <p><strong>Status:</strong> {getStatusBadge(selectedSubmission.status)}</p>
                        <p><strong>Priority:</strong> {getPriorityBadge(selectedSubmission.priority)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Document Viewer Placeholder */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Document viewer will be implemented here</p>
                    <p className="text-sm text-gray-500 mt-2">PDF viewer with zoom, rotate, and validation tools</p>
                  </div>

                  {/* Review Actions */}
                  {selectedSubmission.status === 'pending' && (
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => handleRequestMoreInfo(selectedSubmission.id)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Request More Info
                      </Button>
                      <Button variant="destructive" onClick={() => handleRejectSubmission(selectedSubmission.id)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button onClick={() => handleApproveSubmission(selectedSubmission.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve & Issue VC
                      </Button>
                    </div>
                  )}

                  {/* Review History */}
                  {(selectedSubmission.reviewNotes || selectedSubmission.rejectionReason) && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Review History</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {selectedSubmission.reviewNotes && (
                          <p><strong>Review Notes:</strong> {selectedSubmission.reviewNotes}</p>
                        )}
                        {selectedSubmission.rejectionReason && (
                          <p><strong>Rejection Reason:</strong> {selectedSubmission.rejectionReason}</p>
                        )}
                        {selectedSubmission.reviewerName && (
                          <p><strong>Reviewed by:</strong> {selectedSubmission.reviewerName}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                      Close
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
