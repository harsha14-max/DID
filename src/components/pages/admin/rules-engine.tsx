'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  Edit,
  Copy,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Target,
  Zap,
  Settings,
  Save,
  X,
  Eye,
  RotateCcw
} from 'lucide-react'

interface Rule {
  id: string
  name: string
  conditions: any
  actions: any
  priority: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface RuleExecution {
  id: string
  rule_id: string
  status: string
  executed_at: string
  result: any
}

export default function RulesEnginePage() {
  const [rules, setRules] = useState<Rule[]>([])
  const [executions, setExecutions] = useState<RuleExecution[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [newRule, setNewRule] = useState({
    name: '',
    conditions: '',
    actions: '',
    priority: 3
  })

  // Mock data for demonstration
  const mockRules: Rule[] = [
    {
      id: '1',
      name: 'High Priority Ticket Routing',
      conditions: { priority: 'high', category: 'technical' },
      actions: { route_to: 'senior_support', notify: true },
      priority: 1,
      is_active: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Auto-Response for Common Issues',
      conditions: { category: 'billing', keywords: ['refund', 'payment'] },
      actions: { auto_response: true, template: 'billing_template' },
      priority: 2,
      is_active: true,
      created_at: '2024-01-14T09:15:00Z',
      updated_at: '2024-01-14T09:15:00Z'
    },
    {
      id: '3',
      name: 'Escalation After 24 Hours',
      conditions: { status: 'open', hours_open: 24 },
      actions: { escalate: true, notify_manager: true },
      priority: 3,
      is_active: false,
      created_at: '2024-01-13T14:20:00Z',
      updated_at: '2024-01-13T14:20:00Z'
    }
  ]

  const mockExecutions: RuleExecution[] = [
    {
      id: '1',
      rule_id: '1',
      status: 'success',
      executed_at: '2024-01-15T11:30:00Z',
      result: { tickets_routed: 5, success: true }
    },
    {
      id: '2',
      rule_id: '2',
      status: 'success',
      executed_at: '2024-01-15T10:45:00Z',
      result: { responses_sent: 3, success: true }
    },
    {
      id: '3',
      rule_id: '1',
      status: 'failed',
      executed_at: '2024-01-15T09:20:00Z',
      result: { error: 'Database connection failed', success: false }
    }
  ]

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setRules(mockRules)
      setExecutions(mockExecutions)
      setLoading(false)
    }, 1000)
  }, [])

  const handleRuleAction = (action: string, ruleId: string) => {
    console.log(`${action} action for rule ${ruleId}`)
    
    switch (action) {
      case 'play':
        executeRule(ruleId)
        break
      case 'edit':
        const rule = rules.find(r => r.id === ruleId)
        if (rule) {
          setEditingRule(rule)
          setNewRule({
            name: rule.name,
            conditions: JSON.stringify(rule.conditions, null, 2),
            actions: JSON.stringify(rule.actions, null, 2),
            priority: rule.priority
          })
          setShowCreateModal(true)
        }
        break
      case 'duplicate':
        duplicateRule(ruleId)
        break
      case 'delete':
        deleteRule(ruleId)
        break
      case 'toggle':
        toggleRuleStatus(ruleId)
        break
    }
  }

  const executeRule = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId)
    if (!rule) return

    // Simulate rule execution
    const execution: RuleExecution = {
      id: Date.now().toString(),
      rule_id: ruleId,
      status: Math.random() > 0.2 ? 'success' : 'failed',
      executed_at: new Date().toISOString(),
      result: {
        tickets_processed: Math.floor(Math.random() * 10) + 1,
        success: Math.random() > 0.2
      }
    }

    setExecutions(prev => [execution, ...prev])
    
    // Show success notification
    alert(`Rule "${rule.name}" executed successfully!`)
  }

  const duplicateRule = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId)
    if (!rule) return

    const duplicatedRule: Rule = {
      ...rule,
      id: Date.now().toString(),
      name: `${rule.name} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setRules(prev => [...prev, duplicatedRule])
    alert(`Rule "${rule.name}" duplicated successfully!`)
  }

  const deleteRule = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId)
    if (!rule) return

    if (confirm(`Are you sure you want to delete rule "${rule.name}"?`)) {
      setRules(prev => prev.filter(r => r.id !== ruleId))
      alert(`Rule "${rule.name}" deleted successfully!`)
    }
  }

  const toggleRuleStatus = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, is_active: !rule.is_active, updated_at: new Date().toISOString() }
        : rule
    ))
  }

  const handleCreateRule = () => {
    if (!newRule.name.trim()) {
      alert('Please enter a rule name')
      return
    }

    try {
      const conditions = JSON.parse(newRule.conditions)
      const actions = JSON.parse(newRule.actions)

      const rule: Rule = {
        id: Date.now().toString(),
        name: newRule.name,
        conditions,
        actions,
        priority: newRule.priority,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      if (editingRule) {
        setRules(prev => prev.map(r => r.id === editingRule.id ? { ...rule, id: editingRule.id } : r))
        alert(`Rule "${rule.name}" updated successfully!`)
      } else {
        setRules(prev => [...prev, rule])
        alert(`Rule "${rule.name}" created successfully!`)
      }

      setShowCreateModal(false)
      setEditingRule(null)
      setNewRule({ name: '', conditions: '', actions: '', priority: 3 })
    } catch (error) {
      alert('Invalid JSON format in conditions or actions')
    }
  }

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && rule.is_active) ||
      (statusFilter === 'inactive' && !rule.is_active)
    const matchesPriority = priorityFilter === 'all' || 
      (priorityFilter === 'high' && rule.priority <= 2) ||
      (priorityFilter === 'medium' && rule.priority === 3) ||
      (priorityFilter === 'low' && rule.priority >= 4)
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const totalExecutions = executions.length
  const successfulExecutions = executions.filter(e => e.status === 'success').length
  const successRate = totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 0

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rules Engine</h1>
          <p className="text-gray-600 mt-1">Automate workflows and processes with intelligent rules</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4" />
            Create Rule
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rules</p>
                <p className="text-2xl font-bold text-gray-900">{rules.length}</p>
                <p className="text-xs text-green-600">+2 this week</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Rules</p>
                <p className="text-2xl font-bold text-green-600">{rules.filter(r => r.is_active).length}</p>
                <p className="text-xs text-gray-500">Currently running</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Executions</p>
                <p className="text-2xl font-bold text-gray-900">{totalExecutions}</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">{successRate}%</p>
                <p className="text-xs text-gray-500">Average</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
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

            <div className="flex gap-3 items-center">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Advanced
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rules Directory</CardTitle>
          <CardDescription>Manage and monitor your automation rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Conditions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Priority</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Modified</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{rule.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600 max-w-xs">
                        <pre className="whitespace-pre-wrap text-xs">
                          {JSON.stringify(rule.conditions, null, 2)}
                        </pre>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600 max-w-xs">
                        <pre className="whitespace-pre-wrap text-xs">
                          {JSON.stringify(rule.actions, null, 2)}
                        </pre>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={rule.priority <= 2 ? 'destructive' : rule.priority === 3 ? 'secondary' : 'outline'}>
                        {rule.priority <= 2 ? 'High' : rule.priority === 3 ? 'Medium' : 'Low'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                          {rule.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRuleAction('toggle', rule.id)}
                          className="h-6 w-6 p-0"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {new Date(rule.updated_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRuleAction('play', rule.id)}
                          className="h-8 w-8 p-0"
                          title="Execute Rule"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRuleAction('edit', rule.id)}
                          className="h-8 w-8 p-0"
                          title="Edit Rule"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRuleAction('duplicate', rule.id)}
                          className="h-8 w-8 p-0"
                          title="Duplicate Rule"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRuleAction('delete', rule.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          title="Delete Rule"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingRule ? 'Edit Rule' : 'Create New Rule'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingRule(null)
                  setNewRule({ name: '', conditions: '', actions: '', priority: 3 })
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rule Name
                </label>
                <Input
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter rule name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newRule.priority}
                  onChange={(e) => setNewRule(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>High (1)</option>
                  <option value={2}>High (2)</option>
                  <option value={3}>Medium (3)</option>
                  <option value={4}>Low (4)</option>
                  <option value={5}>Low (5)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conditions (JSON)
                </label>
                <textarea
                  value={newRule.conditions}
                  onChange={(e) => setNewRule(prev => ({ ...prev, conditions: e.target.value }))}
                  placeholder='{"priority": "high", "category": "technical"}'
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actions (JSON)
                </label>
                <textarea
                  value={newRule.actions}
                  onChange={(e) => setNewRule(prev => ({ ...prev, actions: e.target.value }))}
                  placeholder='{"route_to": "senior_support", "notify": true}'
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 font-mono text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingRule(null)
                    setNewRule({ name: '', conditions: '', actions: '', priority: 3 })
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateRule} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingRule ? 'Update Rule' : 'Create Rule'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}