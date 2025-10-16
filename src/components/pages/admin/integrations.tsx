'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plug, Plus, Download, Search, Filter, Eye, Edit, MoreHorizontal, X, Mail, MessageSquare, Webhook, Settings, CheckCircle, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchIntegrations()
  }, [])

  const fetchIntegrations = async () => {
    try {
      setLoading(true)

      // Mock integrations data since we don't have an integrations table
      const mockIntegrations = [
        {
          id: '1',
          name: 'Email Integration',
          type: 'email',
          status: 'active',
          description: 'Connect with email providers for ticket notifications',
          provider: 'SMTP',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Slack Integration',
          type: 'slack',
          status: 'active',
          description: 'Send notifications and updates to Slack channels',
          provider: 'Slack API',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Microsoft Teams',
          type: 'teams',
          status: 'inactive',
          description: 'Integrate with Microsoft Teams for collaboration',
          provider: 'Microsoft Graph API',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Webhook Integration',
          type: 'webhook',
          status: 'active',
          description: 'Send data to external systems via webhooks',
          provider: 'Custom',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]

      setIntegrations(mockIntegrations)
      console.log('Integrations loaded:', mockIntegrations.length)
    } catch (error) {
      console.error('Error fetching integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          integration.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          integration.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          integration.provider?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail
      case 'slack': return MessageSquare
      case 'teams': return MessageSquare
      case 'webhook': return Webhook
      case 'api': return Settings
      default: return Plug
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800'
      case 'slack': return 'bg-purple-100 text-purple-800'
      case 'teams': return 'bg-blue-100 text-blue-800'
      case 'webhook': return 'bg-green-100 text-green-800'
      case 'api': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'inactive': return X
      case 'error': return AlertTriangle
      case 'pending': return Settings
      default: return Settings
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Integrations</h2>
          <p className="text-gray-600">Manage third-party integrations and API connections</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
            <Plug className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{integrations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {integrations.filter(i => i.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <X className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {integrations.filter(i => i.status === 'inactive').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {integrations.filter(i => i.status === 'error').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search integrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Integrations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Showing {filteredIntegrations.length} integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIntegrations.map((integration: any) => {
              const TypeIcon = getTypeIcon(integration.type)
              const StatusIcon = getStatusIcon(integration.status)
              return (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedIntegration(integration)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <TypeIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{integration.name}</h3>
                        <Badge className={getTypeColor(integration.type)}>
                          {integration.type?.replace(/-/g, ' ') || 'Unknown'}
                        </Badge>
                        <Badge className={getStatusColor(integration.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {integration.status || 'Unknown'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>Provider: {integration.provider || 'Unknown'}</span>
                        <span>Created: {new Date(integration.created_at).toLocaleDateString()}</span>
                        <span>Updated: {new Date(integration.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
            {filteredIntegrations.length === 0 && (
              <div className="text-center py-8">
                <Plug className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Integration Detail Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedIntegration.name}</h2>
              <Button variant="ghost" onClick={() => setSelectedIntegration(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className={getTypeColor(selectedIntegration.type)}>
                  {selectedIntegration.type?.replace(/-/g, ' ') || 'Unknown'}
                </Badge>
                <Badge className={getStatusColor(selectedIntegration.status)}>
                  {selectedIntegration.status || 'Unknown'}
                </Badge>
              </div>
              <div>
                <p><strong>Description:</strong></p>
                <p className="text-gray-700">{selectedIntegration.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><strong>Provider:</strong> {selectedIntegration.provider || 'Unknown'}</p>
                  <p><strong>Type:</strong> {selectedIntegration.type || 'Unknown'}</p>
                  <p><strong>Status:</strong> {selectedIntegration.status || 'Unknown'}</p>
                </div>
                <div>
                  <p><strong>Created:</strong> {new Date(selectedIntegration.created_at).toLocaleString()}</p>
                  <p><strong>Updated:</strong> {new Date(selectedIntegration.updated_at).toLocaleString()}</p>
                  <p><strong>ID:</strong> {selectedIntegration.id}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Edit</Button>
                <Button className="bg-red-600 hover:bg-red-700">Delete</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Integration Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Add New Integration</h2>
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Integration Name</label>
                <Input id="name" type="text" placeholder="Integration name" className="mt-1" />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Integration Type</label>
                <select id="type" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="email">Email</option>
                  <option value="slack">Slack</option>
                  <option value="teams">Microsoft Teams</option>
                  <option value="webhook">Webhook</option>
                  <option value="api">API</option>
                </select>
              </div>
              <div>
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Provider</label>
                <Input id="provider" type="text" placeholder="Integration provider" className="mt-1" />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" rows={3} placeholder="Integration description" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select id="status" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

