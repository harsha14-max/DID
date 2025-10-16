// =====================================================
// BSM Platform - Admin DID Management Component
// =====================================================
// Component for managing DIDs in the admin portal

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Plus, 
  Eye, 
  Shield, 
  ShieldOff, 
  Users, 
  Activity,
  Calendar,
  Key,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { DID, DIDManagementProps } from '@/types/credit'
import { didManager } from '@/components/shared/credit/DIDManager'

export default function DIDManagement({ userId, onDIDCreated }: DIDManagementProps) {
  const [dids, setDids] = useState<DID[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDID, setSelectedDID] = useState<DID | null>(null)
  const [statistics, setStatistics] = useState({
    total_dids: 0,
    active_dids: 0,
    inactive_dids: 0,
    created_today: 0,
    created_this_week: 0,
    created_this_month: 0
  })

  useEffect(() => {
    loadDIDs()
    loadStatistics()
  }, [])

  const loadDIDs = async () => {
    try {
      setLoading(true)
      const data = await didManager.listAllDIDs()
      setDids(data)
    } catch (error) {
      console.error('Error loading DIDs:', error)
      toast.error('Failed to load DIDs')
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const stats = await didManager.getDIDStatistics()
      setStatistics(stats)
    } catch (error) {
      console.error('Error loading statistics:', error)
    }
  }

  const handleCreateDID = async () => {
    try {
      if (!userId) {
        toast.error('User ID is required')
        return
      }

      const response = await didManager.createDID({
        user_id: userId,
        did_method: 'did:bsm'
      })

      toast.success('DID created successfully')
      setDids(prev => [response.did, ...prev])
      
      if (onDIDCreated) {
        onDIDCreated(response.did)
      }

      // Update statistics
      loadStatistics()
    } catch (error) {
      console.error('Error creating DID:', error)
      toast.error('Failed to create DID')
    }
  }

  const handleDeactivateDID = async (didId: string) => {
    try {
      await didManager.deactivateDID(didId)
      toast.success('DID deactivated successfully')
      
      // Update local state
      setDids(prev => prev.map(did => 
        did.id === didId ? { ...did, is_active: false } : did
      ))
      
      // Update statistics
      loadStatistics()
    } catch (error) {
      console.error('Error deactivating DID:', error)
      toast.error('Failed to deactivate DID')
    }
  }

  const filteredDIDs = dids.filter(did => 
    did.did_identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    did.user_id.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">DID Management</h2>
          <p className="text-gray-600">Manage Decentralized Identifiers for users</p>
        </div>
        <Button onClick={handleCreateDID} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create DID
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total DIDs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total_dids}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.active_dids} active, {statistics.inactive_dids} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.created_today}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.created_this_week} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.created_this_month}</div>
            <p className="text-xs text-muted-foreground">
              New DIDs created
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">DID List</TabsTrigger>
          <TabsTrigger value="details">DID Details</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search DIDs by identifier or user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* DIDs Table */}
          <Card>
            <CardHeader>
              <CardTitle>DID Registry</CardTitle>
              <CardDescription>
                All Decentralized Identifiers in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDIDs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No DIDs found
                    </div>
                  ) : (
                    filteredDIDs.map((did) => (
                      <div
                        key={did.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <Key className="h-8 w-8 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {did.did_identifier}
                              </p>
                              <Badge 
                                variant={did.is_active ? "default" : "secondary"}
                                className={did.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                              >
                                {did.is_active ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Inactive
                                  </>
                                )}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              User: {did.user_id}
                            </p>
                            <p className="text-xs text-gray-400">
                              Created: {formatDate(did.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDID(did)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {did.is_active && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeactivateDID(did.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <ShieldOff className="h-4 w-4" />
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
          {selectedDID ? (
            <Card>
              <CardHeader>
                <CardTitle>DID Details</CardTitle>
                <CardDescription>
                  Detailed information about the selected DID
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">DID Identifier</label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                      {selectedDID.did_identifier}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">User ID</label>
                    <p className="text-sm text-gray-900">{selectedDID.user_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">DID Method</label>
                    <p className="text-sm text-gray-900">{selectedDID.did_method}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Badge 
                      variant={selectedDID.is_active ? "default" : "secondary"}
                      className={selectedDID.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    >
                      {selectedDID.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Created At</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedDID.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Updated At</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedDID.updated_at)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Public Key</label>
                  <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded break-all">
                    {selectedDID.public_key}
                  </p>
                </div>

                {selectedDID.metadata && Object.keys(selectedDID.metadata).length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Metadata</label>
                    <pre className="text-sm text-gray-900 bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(selectedDID.metadata, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDID(null)}
                  >
                    Close
                  </Button>
                  {selectedDID.is_active && (
                    <Button
                      variant="destructive"
                      onClick={() => handleDeactivateDID(selectedDID.id)}
                    >
                      <ShieldOff className="h-4 w-4 mr-2" />
                      Deactivate DID
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No DID Selected</h3>
                  <p className="text-gray-500">
                    Select a DID from the list to view its details
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

