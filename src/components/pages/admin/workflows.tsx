'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { RotateCcw, Plus, Download, Search, Filter, Eye, Edit, MoreHorizontal, X, Play, Pause, Square, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function WorkflowPage() {
  const [workflows, setWorkflows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      setLoading(true)

      const { data: workflowsData, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching workflows:', error)
        setWorkflows([])
        toast.error('Failed to load workflows. Please try again.')
        return
      }

      setWorkflows(workflowsData || [])
      console.log('Workflows loaded from Supabase:', workflowsData?.length || 0)
    } catch (error) {
      console.error('Error fetching workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          workflow.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          workflow.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ticket-workflow': return 'bg-blue-100 text-blue-800'
      case 'approval-workflow': return 'bg-green-100 text-green-800'
      case 'onboarding': return 'bg-purple-100 text-purple-800'
      case 'offboarding': return 'bg-orange-100 text-orange-800'
      case 'custom': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'paused': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Play
      case 'inactive': return Square
      case 'draft': return Edit
      case 'paused': return Pause
      default: return Square
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
          <h2 className="text-2xl font-bold text-gray-900">Workflow Management</h2>
          <p className="text-gray-600">Design and manage business process workflows</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
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
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <RotateCcw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{workflows.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Play className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {workflows.filter(w => w.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Edit className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {workflows.filter(w => w.status === 'draft').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paused</CardTitle>
            <Pause className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {workflows.filter(w => w.status === 'paused').length}
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
                  placeholder="Search workflows..."
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

      {/* Workflows Table */}
      <Card>
        <CardHeader>
          <CardTitle>Workflows</CardTitle>
          <CardDescription>
            Showing {filteredWorkflows.length} workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredWorkflows.map((workflow: any) => {
              const StatusIcon = getStatusIcon(workflow.status)
              return (
                <div
                  key={workflow.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedWorkflow(workflow)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <RotateCcw className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{workflow.name || 'Unnamed Workflow'}</h3>
                        <Badge className={getTypeColor(workflow.type)}>
                          {workflow.type?.replace(/-/g, ' ') || 'Unknown'}
                        </Badge>
                        <Badge className={getStatusColor(workflow.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {workflow.status || 'Unknown'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{workflow.description || 'No description'}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>ID: {workflow.id}</span>
                        <span>Created: {new Date(workflow.created_at).toLocaleDateString()}</span>
                        <span>Updated: {new Date(workflow.updated_at).toLocaleDateString()}</span>
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
            {filteredWorkflows.length === 0 && (
              <div className="text-center py-8">
                <RotateCcw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Detail Modal */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedWorkflow.name || 'Unnamed Workflow'}</h2>
              <Button variant="ghost" onClick={() => setSelectedWorkflow(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className={getTypeColor(selectedWorkflow.type)}>
                  {selectedWorkflow.type?.replace(/-/g, ' ') || 'Unknown'}
                </Badge>
                <Badge className={getStatusColor(selectedWorkflow.status)}>
                  {selectedWorkflow.status || 'Unknown'}
                </Badge>
              </div>
              <div>
                <p><strong>Description:</strong></p>
                <p className="text-gray-700">{selectedWorkflow.description || 'No description available'}</p>
              </div>
              {selectedWorkflow.steps && (
                <div>
                  <p><strong>Workflow Steps:</strong></p>
                  <div className="space-y-2 mt-2">
                    {JSON.parse(selectedWorkflow.steps || '[]').map((step: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
                        <span className="text-sm font-medium">{index + 1}.</span>
                        <span className="text-sm">{step.name || `Step ${index + 1}`}</span>
                        <Badge variant="secondary" className="text-xs">{step.type || 'action'}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><strong>Created:</strong> {new Date(selectedWorkflow.created_at).toLocaleString()}</p>
                  <p><strong>Updated:</strong> {new Date(selectedWorkflow.updated_at).toLocaleString()}</p>
                </div>
                <div>
                  <p><strong>ID:</strong> {selectedWorkflow.id}</p>
                  <p><strong>Version:</strong> {selectedWorkflow.version || '1.0'}</p>
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

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create New Workflow</h2>
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Workflow Name</label>
                <Input id="name" type="text" placeholder="Workflow name" className="mt-1" />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Workflow Type</label>
                <select id="type" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="ticket-workflow">Ticket Workflow</option>
                  <option value="approval-workflow">Approval Workflow</option>
                  <option value="onboarding">Onboarding</option>
                  <option value="offboarding">Offboarding</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" rows={3} placeholder="Workflow description" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select id="status" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

