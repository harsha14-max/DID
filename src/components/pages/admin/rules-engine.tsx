'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Shield, Plus, Download, Search, Filter, Eye, Edit, MoreHorizontal, X, Zap, AlertTriangle, CheckCircle, Clock, Settings, Play } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function RulesEnginePage() {
  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRule, setSelectedRule] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      setLoading(true)

      // Fetch rules from Supabase
      const { data: rulesData, error } = await supabase
        .from('rules')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching rules:', error)
        toast.error('Failed to load rules. Please try again.')
        
        // Fallback to mock data if database is not available
      const mockRules = [
        {
          id: '1',
          name: 'Auto-assign High Priority Tickets',
          type: 'automation',
          status: 'active',
          description: 'Automatically assign high priority tickets to senior agents',
          conditions: 'priority = "high" AND category = "technical"',
          actions: 'assign_to = "senior_agent" AND notify = true',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Escalate Overdue Tickets',
          type: 'escalation',
          status: 'active',
          description: 'Escalate tickets that are overdue by more than 24 hours',
          conditions: 'status = "open" AND created_at < NOW() - INTERVAL 24 HOUR',
          actions: 'priority = "urgent" AND notify_manager = true',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
            name: 'Auto-approve Low Risk Tickets',
            type: 'approval',
          status: 'active',
            description: 'Automatically approve low priority tickets from trusted customers',
            conditions: 'priority = "low" AND customer_trust_score > 80',
            actions: 'status = "approved" AND notify_customer = true',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      setRules(mockRules)
        return
      }

      setRules(rulesData || [])
      console.log('Rules loaded from Supabase:', rulesData?.length || 0)
    } catch (error) {
      console.error('Error fetching rules:', error)
    } finally {
      setLoading(false)
    }
  }

  const createRule = async (ruleData: any) => {
    try {
      const { data, error } = await supabase
        .from('rules')
        .insert({
          name: ruleData.name,
          type: ruleData.type,
          description: ruleData.description,
          conditions: ruleData.conditions,
          actions: ruleData.actions,
          is_active: ruleData.status === 'active',
          created_by: 'admin', // In real implementation, get from auth context
          metadata: {
            trigger_type: ruleData.trigger_type || 'ticket_created',
            execution_order: ruleData.execution_order || 1
          }
        })
        .select()

      if (error) {
        console.error('Error creating rule:', error)
        toast.error('Failed to create rule. Please try again.')
        return
      }

      toast.success('Rule created successfully!')
      fetchRules() // Refresh the rules list
      console.log('Rule created:', data)
    } catch (error) {
      console.error('Error creating rule:', error)
      toast.error('Failed to create rule. Please try again.')
    }
  }

  const executeRuleOnTickets = async (ruleId: string) => {
    try {
      const rule = rules.find(r => r.id === ruleId)
      if (!rule) {
        toast.error('Rule not found')
        return
      }

      // Get all tickets that match the rule conditions
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('status', 'open')

      if (error || !tickets) {
        console.error('Error fetching tickets:', error)
        toast.error('Failed to fetch tickets')
        return
      }

      let processedCount = 0
      for (const ticket of tickets) {
        if (evaluateRuleCondition(rule, ticket)) {
          await executeRuleAction(rule, ticket)
          processedCount++
        }
      }

      toast.success(`Rule executed on ${processedCount} tickets`)
    } catch (error) {
      console.error('Error executing rule:', error)
      toast.error('Failed to execute rule')
    }
  }

  const evaluateRuleCondition = (rule: any, ticket: any) => {
    try {
      const conditions = rule.conditions || ''
      
      // Simple condition evaluation
      if (conditions.includes('priority = "high"') && ticket.priority === 'high') {
        return true
      }
      
      if (conditions.includes('priority = "urgent"') && ticket.priority === 'urgent') {
        return true
      }
      
      if (conditions.includes('category = "technical"') && ticket.category === 'technical') {
        return true
      }
      
      if (conditions.includes('status = "open"') && ticket.status === 'open') {
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error evaluating rule condition:', error)
      return false
    }
  }

  const executeRuleAction = async (rule: any, ticket: any) => {
    try {
      const actions = rule.actions || ''
      
      // Execute actions based on rule
      if (actions.includes('assign_to = "senior_agent"')) {
        const { data: seniorAgents } = await supabase
          .from('users')
          .select('id')
          .eq('role', 'admin')
          .limit(1)

        if (seniorAgents && seniorAgents.length > 0) {
          await supabase
            .from('tickets')
            .update({ 
              assigned_to: seniorAgents[0].id,
              status: 'in_progress',
              metadata: {
                ...ticket.metadata,
                auto_assigned: true,
                rule_applied: rule.name,
                rule_id: rule.id
              }
            })
            .eq('id', ticket.id)
        }
      }
      
      if (actions.includes('status = "approved"')) {
        await supabase
          .from('tickets')
          .update({ 
            status: 'approved',
            metadata: {
              ...ticket.metadata,
              auto_approved: true,
              rule_applied: rule.name,
              rule_id: rule.id,
              approved_at: new Date().toISOString()
            }
          })
          .eq('id', ticket.id)
      }
      
      if (actions.includes('priority = "urgent"')) {
        await supabase
          .from('tickets')
          .update({ 
            priority: 'urgent',
            metadata: {
              ...ticket.metadata,
              escalated: true,
              rule_applied: rule.name,
              rule_id: rule.id,
              escalated_at: new Date().toISOString()
            }
          })
          .eq('id', ticket.id)
      }
      
    } catch (error) {
      console.error('Error executing rule action:', error)
    }
  }

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rule.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rule.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'automation': return Zap
      case 'escalation': return AlertTriangle
      case 'notification': return CheckCircle
      case 'approval': return Settings
      default: return Shield
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'automation': return 'bg-blue-100 text-blue-800'
      case 'escalation': return 'bg-orange-100 text-orange-800'
      case 'notification': return 'bg-green-100 text-green-800'
      case 'approval': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
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
          <h2 className="text-2xl font-bold text-gray-900">Rules Engine</h2>
          <p className="text-gray-600">Manage automation rules and business logic</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Rule
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
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{rules.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automation</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {rules.filter(r => r.type === 'automation').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalation</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {rules.filter(r => r.type === 'escalation').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notification</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {rules.filter(r => r.type === 'notification').length}
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
                  placeholder="Search rules..."
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

      {/* Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rules</CardTitle>
          <CardDescription>
            Showing {filteredRules.length} rules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRules.map((rule: any) => {
              const TypeIcon = getTypeIcon(rule.type)
              return (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedRule(rule)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <TypeIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{rule.name}</h3>
                        <Badge className={getTypeColor(rule.type)}>
                          {rule.type?.replace(/-/g, ' ') || 'Unknown'}
                        </Badge>
                        <Badge className={getStatusColor(rule.status)}>
                          {rule.status || 'Unknown'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>ID: {rule.id}</span>
                        <span>Created: {new Date(rule.created_at).toLocaleDateString()}</span>
                        <span>Updated: {new Date(rule.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        executeRuleOnTickets(rule.id)
                      }}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Execute
                    </Button>
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
            {filteredRules.length === 0 && (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No rules found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rule Detail Modal */}
      {selectedRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedRule.name}</h2>
              <Button variant="ghost" onClick={() => setSelectedRule(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className={getTypeColor(selectedRule.type)}>
                  {selectedRule.type?.replace(/-/g, ' ') || 'Unknown'}
                </Badge>
                <Badge className={getStatusColor(selectedRule.status)}>
                  {selectedRule.status || 'Unknown'}
                </Badge>
              </div>
              <div>
                <p><strong>Description:</strong></p>
                <p className="text-gray-700">{selectedRule.description}</p>
              </div>
              <div>
                <p><strong>Conditions:</strong></p>
                <p className="text-gray-700 font-mono text-sm bg-gray-100 p-2 rounded">
                  {selectedRule.conditions}
                </p>
              </div>
              <div>
                <p><strong>Actions:</strong></p>
                <p className="text-gray-700 font-mono text-sm bg-gray-100 p-2 rounded">
                  {selectedRule.actions}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><strong>Created:</strong> {new Date(selectedRule.created_at).toLocaleString()}</p>
                  <p><strong>Updated:</strong> {new Date(selectedRule.updated_at).toLocaleString()}</p>
                </div>
                <div>
                  <p><strong>ID:</strong> {selectedRule.id}</p>
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

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create New Rule</h2>
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Rule Name</label>
                <Input id="name" type="text" placeholder="Rule name" className="mt-1" />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Rule Type</label>
                <select id="type" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="automation">Automation</option>
                  <option value="escalation">Escalation</option>
                  <option value="notification">Notification</option>
                  <option value="approval">Approval</option>
                </select>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" rows={3} placeholder="Rule description" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
              </div>
              <div>
                <label htmlFor="conditions" className="block text-sm font-medium text-gray-700">Conditions</label>
                <textarea id="conditions" rows={3} placeholder="Rule conditions" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-mono text-sm"></textarea>
              </div>
              <div>
                <label htmlFor="actions" className="block text-sm font-medium text-gray-700">Actions</label>
                <textarea id="actions" rows={3} placeholder="Rule actions" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-mono text-sm"></textarea>
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

