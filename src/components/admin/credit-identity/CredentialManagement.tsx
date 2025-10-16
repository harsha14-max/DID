// =====================================================
// credX Platform - Credential Management Component
// =====================================================
// Component for managing existing Verifiable Credentials

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  User, 
  Calendar, 
  Shield, 
  MoreHorizontal,
  RefreshCw,
  Archive
} from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface VerifiableCredential {
  id: string
  userId: string
  userName: string
  userEmail: string
  credentialType: string
  issuer: string
  issuedAt: string
  expiresAt: string
  status: 'active' | 'expired' | 'revoked'
  verificationCount: number
  data: any
  metadata: any
}

export default function CredentialManagement() {
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterIssuer, setFilterIssuer] = useState('all')
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    loadCredentials()
  }, [])

  const loadCredentials = async () => {
    try {
      setLoading(true)
      // Simulate loading credentials
      const mockCredentials: VerifiableCredential[] = [
        {
          id: '1',
          userId: 'user-1',
          userName: 'John Doe',
          userEmail: 'john.doe@example.com',
          credentialType: 'Payment History Credential',
          issuer: 'credX Platform',
          issuedAt: '2024-01-15T10:00:00Z',
          expiresAt: '2025-01-15T10:00:00Z',
          status: 'active',
          verificationCount: 3,
          data: { paymentAmount: 1500, paymentDate: '2024-01-10' },
          metadata: { version: '1.0', schema: 'payment-history-v1' }
        },
        {
          id: '2',
          userId: 'user-2',
          userName: 'Jane Smith',
          userEmail: 'jane.smith@example.com',
          credentialType: 'Service Completion Credential',
          issuer: 'Service Provider Inc.',
          issuedAt: '2024-01-10T14:30:00Z',
          expiresAt: '2024-07-10T14:30:00Z',
          status: 'active',
          verificationCount: 1,
          data: { serviceType: 'Consultation', completionDate: '2024-01-08' },
          metadata: { version: '1.2', schema: 'service-completion-v1' }
        },
        {
          id: '3',
          userId: 'user-3',
          userName: 'Bob Johnson',
          userEmail: 'bob.johnson@example.com',
          credentialType: 'Income Verification Credential',
          issuer: 'Employer Corp',
          issuedAt: '2024-01-05T09:15:00Z',
          expiresAt: '2026-01-05T09:15:00Z',
          status: 'expired',
          verificationCount: 0,
          data: { annualIncome: 75000, incomeSource: 'Employment' },
          metadata: { version: '2.0', schema: 'income-verification-v1' }
        },
        {
          id: '4',
          userId: 'user-4',
          userName: 'Alice Brown',
          userEmail: 'alice.brown@example.com',
          credentialType: 'Payment History Credential',
          issuer: 'credX Platform',
          issuedAt: '2023-12-20T16:45:00Z',
          expiresAt: '2024-12-20T16:45:00Z',
          status: 'revoked',
          verificationCount: 2,
          data: { paymentAmount: 2000, paymentDate: '2023-12-15' },
          metadata: { version: '1.0', schema: 'payment-history-v1' }
        }
      ]
      setCredentials(mockCredentials)
    } catch (error) {
      console.error('Error loading credentials:', error)
      toast.error('Failed to load credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeCredential = async (credentialId: string) => {
    if (!confirm('Are you sure you want to revoke this credential?')) return
    
    try {
      setCredentials(prev => prev.map(c => 
        c.id === credentialId ? { ...c, status: 'revoked' as const } : c
      ))
      toast.success('Credential revoked successfully!')
    } catch (error) {
      console.error('Error revoking credential:', error)
      toast.error('Failed to revoke credential')
    }
  }

  const handleBulkRevoke = async () => {
    if (selectedCredentials.length === 0) {
      toast.error('Please select credentials to revoke')
      return
    }
    
    if (!confirm(`Are you sure you want to revoke ${selectedCredentials.length} credentials?`)) return
    
    try {
      setCredentials(prev => prev.map(c => 
        selectedCredentials.includes(c.id) ? { ...c, status: 'revoked' as const } : c
      ))
      setSelectedCredentials([])
      toast.success(`${selectedCredentials.length} credentials revoked successfully!`)
    } catch (error) {
      console.error('Error revoking credentials:', error)
      toast.error('Failed to revoke credentials')
    }
  }

  const handleExportCredentials = async () => {
    try {
      const csvContent = [
        ['ID', 'User Name', 'User Email', 'Credential Type', 'Issuer', 'Issued At', 'Expires At', 'Status', 'Verification Count'],
        ...credentials.map(c => [
          c.id,
          c.userName,
          c.userEmail,
          c.credentialType,
          c.issuer,
          c.issuedAt,
          c.expiresAt,
          c.status,
          c.verificationCount.toString()
        ])
      ].map(row => row.join(',')).join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'credentials-export.csv'
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast.success('Credentials exported successfully!')
    } catch (error) {
      console.error('Error exporting credentials:', error)
      toast.error('Failed to export credentials')
    }
  }

  const handleSelectCredential = (credentialId: string) => {
    setSelectedCredentials(prev => 
      prev.includes(credentialId) 
        ? prev.filter(id => id !== credentialId)
        : [...prev, credentialId]
    )
  }

  const handleSelectAll = () => {
    if (selectedCredentials.length === filteredCredentials.length) {
      setSelectedCredentials([])
    } else {
      setSelectedCredentials(filteredCredentials.map(c => c.id))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success" className="bg-green-100 text-green-700">Active</Badge>
      case 'expired': return <Badge variant="warning" className="bg-yellow-100 text-yellow-700">Expired</Badge>
      case 'revoked': return <Badge variant="destructive" className="bg-red-100 text-red-700">Revoked</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'expired': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'revoked': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredCredentials = credentials.filter(credential => {
    const matchesSearch = credential.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credential.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credential.credentialType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || credential.status === filterStatus
    const matchesIssuer = filterIssuer === 'all' || credential.issuer === filterIssuer
    return matchesSearch && matchesStatus && matchesIssuer
  })

  const issuers = Array.from(new Set(credentials.map(c => c.issuer)))

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
          <h2 className="text-3xl font-bold text-gray-900">Credential Management</h2>
          <p className="text-gray-600 mt-1">View, manage, and revoke Verifiable Credentials</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={loadCredentials} disabled={loading}>
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportCredentials}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          {selectedCredentials.length > 0 && (
            <Button variant="destructive" onClick={handleBulkRevoke}>
              <Trash2 className="h-4 w-4 mr-2" />
              Revoke Selected ({selectedCredentials.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by user name, email, or credential type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="revoked">Revoked</option>
              </select>
            </div>
            <div className="sm:w-48">
              <select
                value={filterIssuer}
                onChange={(e) => setFilterIssuer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Issuers</option>
                {issuers.map(issuer => (
                  <option key={issuer} value={issuer}>{issuer}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credentials Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Verifiable Credentials ({filteredCredentials.length})</span>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCredentials.length === filteredCredentials.length && filteredCredentials.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    <input
                      type="checkbox"
                      checked={selectedCredentials.length === filteredCredentials.length && filteredCredentials.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left p-3 font-medium">User</th>
                  <th className="text-left p-3 font-medium">Credential Type</th>
                  <th className="text-left p-3 font-medium">Issuer</th>
                  <th className="text-left p-3 font-medium">Issued At</th>
                  <th className="text-left p-3 font-medium">Expires At</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Verifications</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCredentials.map((credential) => (
                  <motion.tr
                    key={credential.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedCredentials.includes(credential.id)}
                        onChange={() => handleSelectCredential(credential.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{credential.userName}</div>
                        <div className="text-sm text-gray-600">{credential.userEmail}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm">{credential.credentialType}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm">{credential.issuer}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm">{new Date(credential.issuedAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm">{new Date(credential.expiresAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        {getStatusIcon(credential.status)}
                        <span className="ml-2">{getStatusBadge(credential.status)}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm font-medium">{credential.verificationCount}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {credential.status === 'active' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRevokeCredential(credential.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
