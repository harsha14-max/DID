// =====================================================
// credX Platform - User Credit Profiles
// =====================================================
// Enhanced user credit profile management with approval system

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
  RefreshCw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  creditScore: number
  totalVCs: number
  lastActivity: string
  status: 'active' | 'pending' | 'suspended' | 'verified'
  documents: {
    id: string
    type: string
    status: 'pending' | 'approved' | 'rejected' | 'under_review'
    submittedAt: string
    reviewedAt?: string
    reviewer?: string
    notes?: string
  }[]
  creditHistory: {
    date: string
    action: string
    amount?: number
    description: string
  }[]
  riskFactors: string[]
  approvalRecommendations: {
    type: 'credit_limit' | 'loan_approval' | 'vc_issuance'
    recommendation: 'approve' | 'reject' | 'review'
    confidence: number
    reasoning: string
  }[]
}

interface ApprovalAction {
  userId: string
  documentId: string
  action: 'approve' | 'reject' | 'request_more_info'
  notes?: string
}

export default function UserCreditProfiles() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [approvalAction, setApprovalAction] = useState<ApprovalAction>({
    userId: '',
    documentId: '',
    action: 'approve',
    notes: ''
  })

  useEffect(() => {
    // Simulate fetching user profiles
    const timer = setTimeout(() => {
      setUsers([
        {
          id: 'user-1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          creditScore: 720,
          totalVCs: 8,
          lastActivity: '2024-01-15',
          status: 'pending',
          documents: [
            {
              id: 'doc-1',
              type: 'Income Verification',
              status: 'pending',
              submittedAt: '2024-01-14',
              notes: 'Salary slip and bank statement provided'
            },
            {
              id: 'doc-2',
              type: 'Utility Bill',
              status: 'approved',
              submittedAt: '2024-01-10',
              reviewedAt: '2024-01-12',
              reviewer: 'Admin Alice',
              notes: 'Electricity bill for last 3 months verified'
            }
          ],
          creditHistory: [
            {
              date: '2024-01-15',
              action: 'VC Issued',
              amount: 500,
              description: 'Service Completion Certificate'
            },
            {
              date: '2024-01-10',
              action: 'Document Approved',
              description: 'Utility Bill verification completed'
            }
          ],
          riskFactors: ['New user', 'Limited credit history'],
          approvalRecommendations: [
            {
              type: 'credit_limit',
              recommendation: 'approve',
              confidence: 85,
              reasoning: 'Good payment history and stable income'
            },
            {
              type: 'loan_approval',
              recommendation: 'review',
              confidence: 70,
              reasoning: 'Limited credit history but strong income verification'
            }
          ]
        },
        {
          id: 'user-2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1 (555) 987-6543',
          creditScore: 650,
          totalVCs: 5,
          lastActivity: '2024-01-14',
          status: 'verified',
          documents: [
            {
              id: 'doc-3',
              type: 'Employment Letter',
              status: 'approved',
              submittedAt: '2024-01-08',
              reviewedAt: '2024-01-09',
              reviewer: 'Admin Bob',
              notes: 'Employment verification completed'
            }
          ],
          creditHistory: [
            {
              date: '2024-01-14',
              action: 'Credit Score Update',
              amount: 650,
              description: 'Score increased by 25 points'
            }
          ],
          riskFactors: [],
          approvalRecommendations: [
            {
              type: 'credit_limit',
              recommendation: 'approve',
              confidence: 90,
              reasoning: 'Established user with good track record'
            }
          ]
        },
        {
          id: 'user-3',
          name: 'Alice Johnson',
          email: 'alice.j@example.com',
          phone: '+1 (555) 456-7890',
          creditScore: 780,
          totalVCs: 12,
          lastActivity: '2024-01-16',
          status: 'active',
          documents: [
            {
              id: 'doc-4',
              type: 'Bank Statement',
              status: 'under_review',
              submittedAt: '2024-01-15',
              notes: 'Bank statement for last 6 months'
            }
          ],
          creditHistory: [
            {
              date: '2024-01-16',
              action: 'Document Submitted',
              description: 'Bank statement uploaded for review'
            }
          ],
          riskFactors: [],
          approvalRecommendations: [
            {
              type: 'credit_limit',
              recommendation: 'approve',
              confidence: 95,
              reasoning: 'Excellent credit history and high score'
            }
          ]
        }
      ])
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredUsers = users.filter(user =>
    (filterStatus === 'all' || user.status === filterStatus) &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleApprovalAction = (action: ApprovalAction) => {
    toast.promise(
      new Promise(resolve => setTimeout(() => {
        setUsers(prev => prev.map(user => 
          user.id === action.userId
            ? {
                ...user,
                documents: user.documents.map(doc =>
                  doc.id === action.documentId
                    ? {
                        ...doc,
                        status: action.action === 'approve' ? 'approved' : action.action === 'reject' ? 'rejected' : 'under_review',
                        reviewedAt: new Date().toISOString(),
                        reviewer: 'Current Admin',
                        notes: action.notes
                      }
                    : doc
                )
              }
            : user
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
      userId: '',
      documentId: '',
      action: 'approve',
      notes: ''
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>
      case 'pending': return <Badge variant="warning" className="bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case 'suspended': return <Badge variant="destructive" className="bg-red-100 text-red-700"><XCircle className="h-3 w-3 mr-1" /> Suspended</Badge>
      case 'verified': return <Badge className="bg-blue-100 text-blue-700"><Shield className="h-3 w-3 mr-1" /> Verified</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
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
          <h2 className="text-3xl font-bold text-gray-900">User Credit Profiles</h2>
          <p className="text-gray-600 mt-1">Comprehensive user portfolio management and approval system</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* User Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  {user.name}
                  {getStatusBadge(user.status)}
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Credit Score:</span>
                  <span className="font-bold text-lg">{user.creditScore}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total VCs:</span>
                  <span className="font-medium">{user.totalVCs}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pending Docs:</span>
                  <span className="font-medium">{user.documents.filter(d => d.status === 'pending').length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Risk Factors:</span>
                  <span className="font-medium">{user.riskFactors.length}</span>
                </div>
                
                {/* Quick Actions */}
                <div className="flex space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedUser(user)}
                  >
                    <Eye className="h-4 w-4 mr-2" /> View Details
                  </Button>
                  {user.documents.some(d => d.status === 'pending') && (
                    <Button 
                      size="sm"
                      onClick={() => {
                        const pendingDoc = user.documents.find(d => d.status === 'pending')
                        if (pendingDoc) {
                          setApprovalAction({
                            userId: user.id,
                            documentId: pendingDoc.id,
                            action: 'approve',
                            notes: ''
                          })
                          setShowApprovalModal(true)
                        }
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Approve
                    </Button>
                  )}
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
