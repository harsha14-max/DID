// =====================================================
// credX Platform - Enhanced VC Templates & Issuance
// =====================================================
// Comprehensive template management and manual VC issuance system

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
  Upload, 
  FileText, 
  CheckCircle,
  BarChart3,
  Send,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface VCTemplate {
  id: string
  name: string
  description: string
  credentialType: string
  category: string
  version: number
  createdAt: string
  updatedAt: string
  fields: { name: string; type: string; required: boolean; description?: string }[]
  status: 'active' | 'draft' | 'deprecated'
  usageCount: number
  automationRules: {
    trigger: string
    condition: string
    action: string
  }[]
  issuerPermissions: string[]
  expirationRules: {
    type: 'fixed' | 'relative'
    value: number
    unit: 'days' | 'months' | 'years'
  }
}

interface User {
  id: string
  name: string
  email: string
  creditScore: number
  totalVCs: number
  lastActivity: string
}

interface BulkIssuanceData {
  userId: string
  templateId: string
  data: Record<string, any>
  expiresAt?: string
}

export default function VCTemplatesManagement() {
  const [templates, setTemplates] = useState<VCTemplate[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('templates')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showBulkIssuanceModal, setShowBulkIssuanceModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<VCTemplate | null>(null)
  const [bulkIssuanceData, setBulkIssuanceData] = useState<BulkIssuanceData[]>([])
  const [newTemplate, setNewTemplate] = useState<Partial<VCTemplate>>({
    name: '',
    description: '',
    credentialType: 'payment_history',
    category: 'Payment History Templates',
    fields: [{ name: 'amount', type: 'number', required: true, description: 'Payment amount' }],
    status: 'draft',
    usageCount: 0,
    automationRules: [],
    issuerPermissions: ['admin'],
    expirationRules: { type: 'relative', value: 365, unit: 'days' }
  })

  useEffect(() => {
    // Simulate fetching templates and users
    const timer = setTimeout(() => {
      setTemplates([
        {
          id: 'tpl-001', 
          name: 'Utility Payment Verification', 
          description: 'Verifies regular utility payments for credit building.', 
          credentialType: 'utility_payment', 
          category: 'Payment History Templates', 
          version: 2, 
          createdAt: '2023-01-01', 
          updatedAt: '2023-03-15', 
          status: 'active',
          usageCount: 45,
          fields: [
            { name: 'provider', type: 'string', required: true, description: 'Utility provider name' },
            { name: 'amount', type: 'number', required: true, description: 'Payment amount' },
            { name: 'period', type: 'string', required: true, description: 'Billing period' },
            { name: 'paymentDate', type: 'date', required: true, description: 'Date of payment' }
          ],
          automationRules: [
            { trigger: 'ticket_resolved', condition: 'service_type=utility', action: 'auto_issue' }
          ],
          issuerPermissions: ['admin', 'verifier'],
          expirationRules: { type: 'relative', value: 365, unit: 'days' }
        },
        {
          id: 'tpl-002', 
          name: 'Income Verification', 
          description: 'Verifies employment income for loan applications.', 
          credentialType: 'income_verification', 
          category: 'Income Verification Templates', 
          version: 1, 
          createdAt: '2023-02-10', 
          updatedAt: '2023-04-20', 
          status: 'active',
          usageCount: 32,
          fields: [
            { name: 'employer', type: 'string', required: true, description: 'Employer name' },
            { name: 'annualIncome', type: 'number', required: true, description: 'Annual income amount' },
            { name: 'currency', type: 'string', required: true, description: 'Currency code' },
            { name: 'employmentStatus', type: 'string', required: true, description: 'Employment status' },
            { name: 'startDate', type: 'date', required: true, description: 'Employment start date' }
          ],
          automationRules: [],
          issuerPermissions: ['admin'],
          expirationRules: { type: 'relative', value: 180, unit: 'days' }
        },
        {
          id: 'tpl-003', 
          name: 'Service Completion Certificate', 
          description: 'Certifies completion of professional services.', 
          credentialType: 'service_completion', 
          category: 'Service Performance Templates', 
          version: 1, 
          createdAt: '2023-04-10', 
          updatedAt: '2023-06-01', 
          status: 'draft',
          usageCount: 8,
          fields: [
            { name: 'serviceName', type: 'string', required: true, description: 'Service provided' },
            { name: 'completionDate', type: 'date', required: true, description: 'Service completion date' },
            { name: 'rating', type: 'number', required: false, description: 'Service rating (1-5)' },
            { name: 'clientFeedback', type: 'string', required: false, description: 'Client feedback' }
          ],
          automationRules: [
            { trigger: 'ticket_resolved', condition: 'status=completed', action: 'auto_issue' }
          ],
          issuerPermissions: ['admin', 'service_manager'],
          expirationRules: { type: 'relative', value: 730, unit: 'days' }
        }
      ])
      
      setUsers([
        { id: 'user-1', name: 'John Doe', email: 'john.doe@example.com', creditScore: 720, totalVCs: 8, lastActivity: '2024-01-15' },
        { id: 'user-2', name: 'Jane Smith', email: 'jane.smith@example.com', creditScore: 650, totalVCs: 5, lastActivity: '2024-01-14' },
        { id: 'user-3', name: 'Alice Johnson', email: 'alice.j@example.com', creditScore: 780, totalVCs: 12, lastActivity: '2024-01-16' },
        { id: 'user-4', name: 'Bob Williams', email: 'bob.w@example.com', creditScore: 580, totalVCs: 3, lastActivity: '2024-01-13' }
      ])
      
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredTemplates = templates.filter(template =>
    (filterCategory === 'all' || template.category === filterCategory) &&
    (template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.credentialType.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCreateOrUpdateTemplate = () => {
    if (!newTemplate.name || !newTemplate.description || !newTemplate.credentialType || !newTemplate.category) {
      toast.error('Please fill all required fields.')
      return
    }

    if (editingTemplate) {
      setTemplates(templates.map(tpl => 
        tpl.id === editingTemplate.id 
          ? { ...newTemplate as VCTemplate, id: editingTemplate.id, updatedAt: new Date().toISOString() } 
          : tpl
      ))
      toast.success('Template updated successfully!')
    } else {
      const id = `tpl-${String(templates.length + 1).padStart(3, '0')}`
      setTemplates([...templates, { 
        ...newTemplate as VCTemplate, 
        id, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(), 
        version: 1 
      }])
      toast.success('Template created successfully!')
    }
    setShowCreateModal(false)
    setEditingTemplate(null)
    setNewTemplate({
      name: '',
      description: '',
      credentialType: 'payment_history',
      category: 'Payment History Templates',
      fields: [{ name: 'amount', type: 'number', required: true, description: 'Payment amount' }],
      status: 'draft',
      usageCount: 0,
      automationRules: [],
      issuerPermissions: ['admin'],
      expirationRules: { type: 'relative', value: 365, unit: 'days' }
    })
  }

  const handleEditTemplate = (template: VCTemplate) => {
    setEditingTemplate(template)
    setNewTemplate(template)
    setShowCreateModal(true)
  }

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(tpl => tpl.id !== id))
      toast.success('Template deleted successfully!')
    }
  }

  const handleBulkIssuance = () => {
    if (bulkIssuanceData.length === 0) {
      toast.error('Please add at least one issuance record.')
      return
    }
    
    toast.promise(
      new Promise(resolve => setTimeout(() => {
        resolve('Bulk issuance completed!')
      }, 2000)),
      {
        loading: 'Processing bulk VC issuance...',
        success: `Successfully issued ${bulkIssuanceData.length} VCs!`,
        error: 'Failed to process bulk issuance.',
      }
    )
    setShowBulkIssuanceModal(false)
    setBulkIssuanceData([])
  }

  const addBulkIssuanceRecord = () => {
    setBulkIssuanceData([...bulkIssuanceData, {
      userId: '',
      templateId: '',
      data: {},
      expiresAt: ''
    }])
  }

  const removeBulkIssuanceRecord = (index: number) => {
    setBulkIssuanceData(bulkIssuanceData.filter((_, i) => i !== index))
  }

  const updateBulkIssuanceRecord = (index: number, field: string, value: any) => {
    const updated = [...bulkIssuanceData]
    updated[index] = { ...updated[index], [field]: value }
    setBulkIssuanceData(updated)
  }

  const templateCategories = [
    'Payment History Templates',
    'Service Performance Templates',
    'Income Verification Templates',
    'Business Operations Templates',
    'Compliance & Security Templates',
    'Custom Templates'
  ]

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
          <h2 className="text-3xl font-bold text-gray-900">VC Templates & Issuance</h2>
          <p className="text-gray-600 mt-1">Comprehensive template management and manual VC issuance system</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setShowBulkIssuanceModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Issuance
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Template Management</TabsTrigger>
          <TabsTrigger value="issuance">Manual Issuance</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
        </TabsList>

        {/* Template Management Tab */}
        <TabsContent value="templates" className="space-y-6">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {templateCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Template Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      {template.name}
                      <Badge variant={template.status === 'active' ? 'success' : template.status === 'draft' ? 'secondary' : 'destructive'}>
                        {template.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Version:</span>
                      <span className="font-medium">{template.version}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Usage Count:</span>
                      <span className="font-medium">{template.usageCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Fields:</span>
                      <span className="font-medium">{template.fields.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Automation Rules:</span>
                      <span className="font-medium">{template.automationRules.length}</span>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Manual Issuance Tab */}
        <TabsContent value="issuance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manual VC Issuance</CardTitle>
              <CardDescription>Issue verifiable credentials directly to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="userSelect">Select User</Label>
                  <select
                    id="userSelect"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  >
                    <option value="">Choose a user...</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email}) - Score: {user.creditScore}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="templateSelect">Select Template</Label>
                  <select
                    id="templateSelect"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  >
                    <option value="">Choose a template...</option>
                    {templates.filter(t => t.status === 'active').map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name} (v{template.version})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Template Fields</h3>
                <p className="text-gray-600">Select a template to see the required fields for VC issuance.</p>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Issue VC
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Templates</p>
                    <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Templates</p>
                    <p className="text-2xl font-bold text-gray-900">{templates.filter(t => t.status === 'active').length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Usage</p>
                    <p className="text-2xl font-bold text-gray-900">{templates.reduce((sum, t) => sum + t.usageCount, 0)}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Template Usage Trends</CardTitle>
              <CardDescription>Usage statistics and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Usage analytics charts will be implemented here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Template Modal */}
      <AnimatePresence>
        {showCreateModal && (
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
                  <CardTitle>{editingTemplate ? 'Edit VC Template' : 'Create New VC Template'}</CardTitle>
                  <CardDescription>Define the structure and rules for your verifiable credentials.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="templateName">Template Name</Label>
                      <Input
                        id="templateName"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                        placeholder="e.g., Income Verification"
                      />
                    </div>
                    <div>
                      <Label htmlFor="templateType">Credential Type</Label>
                      <Input
                        id="templateType"
                        value={newTemplate.credentialType}
                        onChange={(e) => setNewTemplate({ ...newTemplate, credentialType: e.target.value })}
                        placeholder="e.g., income_verification"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="templateDescription">Description</Label>
                    <Textarea
                      id="templateDescription"
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                      placeholder="A brief description of what this credential verifies."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="templateCategory">Category</Label>
                    <select
                      id="templateCategory"
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {templateCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateOrUpdateTemplate}>
                      {editingTemplate ? 'Update Template' : 'Create Template'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Issuance Modal */}
      <AnimatePresence>
        {showBulkIssuanceModal && (
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
              className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Bulk VC Issuance</CardTitle>
                  <CardDescription>Issue multiple verifiable credentials at once using CSV data or manual entry.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Issuance Records</h3>
                    <Button onClick={addBulkIssuanceRecord}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Record
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {bulkIssuanceData.map((record, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Record {index + 1}</h4>
                          <Button variant="destructive" size="sm" onClick={() => removeBulkIssuanceRecord(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>User</Label>
                            <select
                              value={record.userId}
                              onChange={(e) => updateBulkIssuanceRecord(index, 'userId', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select user...</option>
                              {users.map(user => (
                                <option key={user.id} value={user.id}>
                                  {user.name} ({user.email})
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <Label>Template</Label>
                            <select
                              value={record.templateId}
                              onChange={(e) => updateBulkIssuanceRecord(index, 'templateId', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select template...</option>
                              {templates.filter(t => t.status === 'active').map(template => (
                                <option key={template.id} value={template.id}>
                                  {template.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <Label>Expires At (Optional)</Label>
                            <Input
                              type="date"
                              value={record.expiresAt}
                              onChange={(e) => updateBulkIssuanceRecord(index, 'expiresAt', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowBulkIssuanceModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleBulkIssuance}>
                      <Send className="h-4 w-4 mr-2" />
                      Process Bulk Issuance
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
