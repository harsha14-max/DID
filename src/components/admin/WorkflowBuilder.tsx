'use client'

import { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Save, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  Eye,
  Edit,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { WorkflowNodeComponent, NodePalette, type WorkflowNode } from './WorkflowNode'

interface WorkflowBuilderProps {
  className?: string
}

export function WorkflowBuilder({ className }: WorkflowBuilderProps) {
  const [workflow, setWorkflow] = useState({
    id: '1',
    name: 'New Workflow',
    description: 'A new workflow',
    status: 'draft' as 'draft' | 'active' | 'paused',
    nodes: [] as WorkflowNode[],
    connections: [] as Array<{ from: string; to: string }>
  })
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Generate unique ID for nodes
  const generateNodeId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Add new node to workflow
  const addNode = useCallback((type: WorkflowNode['type']) => {
    const newNode: WorkflowNode = {
      id: generateNodeId(),
      type,
      title: getDefaultNodeTitle(type),
      description: getDefaultNodeDescription(type),
      config: getDefaultNodeConfig(type),
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      status: 'inactive',
      connections: []
    }

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }))
  }, [])

  // Get default values for different node types
  const getDefaultNodeTitle = (type: WorkflowNode['type']): string => {
    switch (type) {
      case 'trigger': return 'Workflow Trigger'
      case 'action': return 'Custom Action'
      case 'condition': return 'Condition Check'
      case 'notification': return 'Send Notification'
      case 'approval': return 'Require Approval'
      case 'escalation': return 'Escalate Ticket'
      default: return 'New Node'
    }
  }

  const getDefaultNodeDescription = (type: WorkflowNode['type']): string => {
    switch (type) {
      case 'trigger': return 'Starts when a ticket is created'
      case 'action': return 'Performs a custom action'
      case 'condition': return 'Checks if conditions are met'
      case 'notification': return 'Sends notification to user'
      case 'approval': return 'Requires approval before proceeding'
      case 'escalation': return 'Escalates ticket to higher level'
      default: return 'Node description'
    }
  }

  const getDefaultNodeConfig = (type: WorkflowNode['type']): Record<string, any> => {
    switch (type) {
      case 'trigger':
        return { triggerType: 'ticket_created', conditions: [] }
      case 'action':
        return { actionType: 'update_status', parameters: {} }
      case 'condition':
        return { conditionType: 'priority_check', value: 'high' }
      case 'notification':
        return { channel: 'email', template: 'default' }
      case 'approval':
        return { approver: 'manager', timeout: 24 }
      case 'escalation':
        return { level: 'level_2', department: 'technical' }
      default:
        return {}
    }
  }

  // Update node
  const updateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }))
  }, [])

  // Delete node
  const deleteNode = useCallback((nodeId: string) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      connections: prev.connections.filter(conn => 
        conn.from !== nodeId && conn.to !== nodeId
      )
    }))
    setSelectedNode(null)
  }, [])

  // Duplicate node
  const duplicateNode = useCallback((nodeId: string) => {
    const node = workflow.nodes.find(n => n.id === nodeId)
    if (!node) return

    const newNode: WorkflowNode = {
      ...node,
      id: generateNodeId(),
      title: `${node.title} (Copy)`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50
      }
    }

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }))
  }, [workflow.nodes])

  // Execute workflow
  const executeWorkflow = async () => {
    setIsExecuting(true)
    try {
      // Simulate workflow execution
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update node statuses
      setWorkflow(prev => ({
        ...prev,
        nodes: prev.nodes.map(node => ({
          ...node,
          status: 'active' as const
        }))
      }))
      
      // Simulate completion
      setTimeout(() => {
        setWorkflow(prev => ({
          ...prev,
          nodes: prev.nodes.map(node => ({
            ...node,
            status: 'inactive' as const
          }))
        }))
      }, 3000)
      
    } catch (error) {
      console.error('Workflow execution failed:', error)
    } finally {
      setIsExecuting(false)
    }
  }

  // Save workflow
  const saveWorkflow = () => {
    console.log('Saving workflow:', workflow)
    // Here you would typically save to your backend
  }

  // Load workflow template
  const loadTemplate = (templateName: string) => {
    const templates = {
      'ticket_escalation': {
        name: 'Ticket Escalation',
        description: 'Automatically escalates high-priority tickets',
        nodes: [
          {
            id: 'trigger_1',
            type: 'trigger' as const,
            title: 'High Priority Ticket',
            description: 'Triggers on high priority tickets',
            config: { triggerType: 'priority_high' },
            position: { x: 100, y: 100 },
            status: 'inactive' as const,
            connections: ['action_1']
          },
          {
            id: 'action_1',
            type: 'escalation' as const,
            title: 'Escalate to Manager',
            description: 'Escalates ticket to manager',
            config: { level: 'manager' },
            position: { x: 300, y: 100 },
            status: 'inactive' as const,
            connections: ['notification_1']
          },
          {
            id: 'notification_1',
            type: 'notification' as const,
            title: 'Notify Customer',
            description: 'Notifies customer of escalation',
            config: { channel: 'email' },
            position: { x: 500, y: 100 },
            status: 'inactive' as const,
            connections: []
          }
        ],
        connections: [
          { from: 'trigger_1', to: 'action_1' },
          { from: 'action_1', to: 'notification_1' }
        ]
      }
    }

    const template = templates[templateName as keyof typeof templates]
    if (template) {
      setWorkflow(prev => ({
        ...prev,
        name: template.name,
        description: template.description,
        nodes: template.nodes,
        connections: template.connections
      }))
    }
  }

  return (
    <div className={cn("h-full flex", className)}>
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/20 p-4 space-y-4">
        {/* Workflow Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Workflow</span>
              <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                {workflow.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Input
                value={workflow.name}
                onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
                className="font-medium"
              />
            </div>
            <div>
              <Input
                value={workflow.description}
                onChange={(e) => setWorkflow(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
              />
            </div>
          </CardContent>
        </Card>

        {/* Node Palette */}
        <NodePalette onAddNode={addNode} />

        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => loadTemplate('ticket_escalation')}
            >
              <Zap className="h-4 w-4 mr-2" />
              Ticket Escalation
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => loadTemplate('approval_workflow')}
            >
              <Users className="h-4 w-4 mr-2" />
              Approval Workflow
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={executeWorkflow}
              disabled={isExecuting || workflow.nodes.length === 0}
              className="w-full"
            >
              {isExecuting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Execute
                </>
              )}
            </Button>
            <Button
              onClick={saveWorkflow}
              variant="outline"
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">Workflow Builder</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{workflow.nodes.length} nodes</Badge>
                <Badge variant="outline">{workflow.connections.length} connections</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden bg-gray-50 dark:bg-gray-900"
          style={{
            backgroundImage: `
              radial-gradient(circle, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        >
          {workflow.nodes.map((node) => (
            <div
              key={node.id}
              className="absolute"
              style={{
                left: node.position.x,
                top: node.position.y,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <WorkflowNodeComponent
                node={node}
                isSelected={selectedNode === node.id}
                onSelect={setSelectedNode}
                onEdit={(nodeId) => {
                  // Open edit modal
                  console.log('Edit node:', nodeId)
                }}
                onDelete={deleteNode}
                onDuplicate={duplicateNode}
              />
            </div>
          ))}

          {/* Empty State */}
          {workflow.nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Zap className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start Building Your Workflow</h3>
                <p className="text-muted-foreground mb-4">
                  Drag nodes from the sidebar to create your workflow
                </p>
                <Button onClick={() => addNode('trigger')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Node
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}











