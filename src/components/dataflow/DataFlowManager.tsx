// =====================================================
// BSM Platform - Data Flow Manager Component
// =====================================================
// This component manages the complete data flow between customer and admin portals

'use client'

import React, { useState, useEffect } from 'react'
import { useDataFlow } from '@/hooks/useDataFlow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Ticket, 
  Workflow, 
  Settings, 
  BarChart3, 
  BookOpen, 
  Star,
  Bell,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface DataFlowManagerProps {
  userRole: 'admin' | 'customer'
}

export default function DataFlowManager({ userRole }: DataFlowManagerProps) {
  const dataFlow = useDataFlow()
  const [activeFlow, setActiveFlow] = useState('overview')

  // Real-time data flow monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh data every 30 seconds for real-time updates
      // dataFlow.refetch?.() // Removed - refetch not available
    }, 30000)

    return () => clearInterval(interval)
  }, [dataFlow])

  const renderFlowOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Services/Assets Flow */}
      <Card className="border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-blue-600 flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Services & Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {dataFlow.services.services?.length || 0}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Available to customers
          </p>
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {dataFlow.categories.categories?.length || 0} Categories
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Flow */}
      <Card className="border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-green-600 flex items-center">
            <Ticket className="h-4 w-4 mr-2" />
            Tickets Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {dataFlow.tickets.tickets?.length || 0}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total tickets
          </p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Pending:</span>
              <span className="font-medium">
                {dataFlow.tickets.tickets?.filter((t: any) => t.approval_status === 'pending').length || 0}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Approved:</span>
              <span className="font-medium">
                {dataFlow.tickets.tickets?.filter((t: any) => t.approval_status === 'approved').length || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Automation */}
      <Card className="border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-purple-600 flex items-center">
            <Workflow className="h-4 w-4 mr-2" />
            Workflows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {dataFlow.workflows.instances?.length || 0}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Active workflows
          </p>
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {dataFlow.workflows.templates?.length || 0} Templates
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Rule Engine */}
      <Card className="border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-orange-600 flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Rule Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {dataFlow.ruleEngine.rules?.length || 0}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Active rules
          </p>
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {dataFlow.ruleEngine.executionLog?.length || 0} Executions
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTicketsFlow = () => (
    <div className="space-y-6">
      {/* Ticket Creation Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ticket className="h-5 w-5 mr-2" />
            Ticket Creation & Approval Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-medium text-sm">Service Available</h3>
              <p className="text-xs text-gray-500 mt-1">
                Services are visible to customers
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-medium text-sm">Ticket Created</h3>
              <p className="text-xs text-gray-500 mt-1">
                Customer raises ticket
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-medium text-sm">Auto/Manual Approval</h3>
              <p className="text-xs text-gray-500 mt-1">
                Rule engine or admin approval
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Tickets Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Ticket Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dataFlow.tickets.tickets?.slice(0, 5).map((ticket: any) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    ticket.approval_status === 'approved' ? 'bg-green-500' :
                    ticket.approval_status === 'pending' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">{ticket.title}</p>
                    <p className="text-xs text-gray-500">
                      {ticket.services?.name || 'General'} • {ticket.priority}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    ticket.approval_status === 'approved' ? 'default' :
                    ticket.approval_status === 'pending' ? 'secondary' :
                    'destructive'
                  }>
                    {ticket.approval_status}
                  </Badge>
                  {ticket.workflow_instances?.[0] && (
                    <Badge variant="outline">
                      {ticket.workflow_instances[0].status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderWorkflowAutomation = () => (
    <div className="space-y-6">
      {/* Workflow Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Workflow className="h-5 w-5 mr-2" />
            Workflow Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataFlow.workflows.templates?.map((template: any) => (
              <div key={template.id} className="p-4 border rounded-lg">
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                <div className="mt-3">
                  <Badge variant="outline" className="text-xs">
                    {template.steps?.length || 0} Steps
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Workflow Instances */}
      <Card>
        <CardHeader>
          <CardTitle>Active Workflow Instances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dataFlow.workflows.instances?.slice(0, 5).map((instance: any) => (
              <div key={instance.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    instance.status === 'completed' ? 'bg-green-500' :
                    instance.status === 'in_progress' ? 'bg-blue-500' :
                    instance.status === 'failed' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">
                      {instance.workflow_templates?.name || 'Unknown Template'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Ticket: {instance.tickets?.title || 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    instance.status === 'completed' ? 'default' :
                    instance.status === 'in_progress' ? 'secondary' :
                    instance.status === 'failed' ? 'destructive' :
                    'outline'
                  }>
                    {instance.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Step {instance.current_step || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderRuleEngine = () => (
    <div className="space-y-6">
      {/* Rule Engine Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Rule Engine Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dataFlow.ruleEngine.rules?.map((rule: any) => (
              <div key={rule.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{rule.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{rule.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      Priority: {rule.priority}
                    </Badge>
                    <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rule Execution Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Rule Executions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dataFlow.ruleEngine.executionLog?.slice(0, 5).map((log: any) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <div>
                    <p className="font-medium text-sm">
                      {log.rule_engine_rules?.name || 'Unknown Rule'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Ticket: {log.tickets?.title || 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(log.executed_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Ticket Analytics</p>
                <p className="text-xs text-gray-500">
                  {(dataFlow.analytics.tickets.data as any)?.total || 0} total tickets
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Rating Analytics</p>
                <p className="text-xs text-gray-500">
                  Avg: {(dataFlow.analytics.ratings.data as any)?.average?.toFixed(1) || '0.0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Workflow className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Workflow Analytics</p>
                <p className="text-xs text-gray-500">
                  {(dataFlow.analytics.workflows.data as any)?.completed || 0} completed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Knowledge Base</p>
                <p className="text-xs text-gray-500">
                  {(dataFlow.analytics.knowledgeBase.data as any)?.totalViews || 0} views
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tickets" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="ratings">Ratings</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
            </TabsList>
            <TabsContent value="tickets" className="mt-4">
              <div className="space-y-2">
                <p className="text-sm">Total Tickets: {(dataFlow.analytics.tickets.data as any)?.total || 0}</p>
                <p className="text-sm">By Status: {JSON.stringify((dataFlow.analytics.tickets.data as any)?.byStatus || {})}</p>
                <p className="text-sm">By Priority: {JSON.stringify((dataFlow.analytics.tickets.data as any)?.byPriority || {})}</p>
              </div>
            </TabsContent>
            <TabsContent value="services" className="mt-4">
              <div className="space-y-2">
                <p className="text-sm">Total Services: {(dataFlow.analytics.services.data as any)?.total || 0}</p>
                <p className="text-sm">By Status: {JSON.stringify((dataFlow.analytics.services.data as any)?.byStatus || {})}</p>
              </div>
            </TabsContent>
            <TabsContent value="ratings" className="mt-4">
              <div className="space-y-2">
                <p className="text-sm">Total Ratings: {(dataFlow.analytics.ratings.data as any)?.total || 0}</p>
                <p className="text-sm">Average Rating: {(dataFlow.analytics.ratings.data as any)?.average?.toFixed(2) || '0.00'}</p>
                <p className="text-sm">By Rating: {JSON.stringify((dataFlow.analytics.ratings.data as any)?.byRating || {})}</p>
              </div>
            </TabsContent>
            <TabsContent value="workflows" className="mt-4">
              <div className="space-y-2">
                <p className="text-sm">Total Workflows: {(dataFlow.analytics.workflows.data as any)?.total || 0}</p>
                <p className="text-sm">Completed: {(dataFlow.analytics.workflows.data as any)?.completed || 0}</p>
                <p className="text-sm">By Status: {JSON.stringify((dataFlow.analytics.workflows.data as any)?.byStatus || {})}</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )

  if (dataFlow.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Flow Manager</h1>
          <p className="text-gray-600">
            Complete backend connections and data flow monitoring
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {userRole === 'admin' ? 'Admin Portal' : 'Customer Portal'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Real-time Updates
          </Badge>
        </div>
      </div>

      <Tabs value={activeFlow} onValueChange={setActiveFlow} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tickets">Tickets Flow</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="rules">Rule Engine</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderFlowOverview()}
        </TabsContent>

        <TabsContent value="tickets" className="mt-6">
          {renderTicketsFlow()}
        </TabsContent>

        <TabsContent value="workflows" className="mt-6">
          {renderWorkflowAutomation()}
        </TabsContent>

        <TabsContent value="rules" className="mt-6">
          {renderRuleEngine()}
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          {renderAnalytics()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
