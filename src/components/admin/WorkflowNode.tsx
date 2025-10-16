'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  Pause, 
  Square, 
  ArrowRight, 
  Mail, 
  Bell, 
  User, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Trash2,
  Edit,
  Copy
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'notification' | 'approval' | 'escalation'
  title: string
  description: string
  config: Record<string, any>
  position: { x: number; y: number }
  status: 'active' | 'inactive' | 'error'
  connections: string[]
}

interface WorkflowNodeProps {
  node: WorkflowNode
  isSelected?: boolean
  onSelect?: (nodeId: string) => void
  onEdit?: (nodeId: string) => void
  onDelete?: (nodeId: string) => void
  onDuplicate?: (nodeId: string) => void
  className?: string
}

export function WorkflowNodeComponent({
  node,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  className
}: WorkflowNodeProps) {
  const getNodeIcon = (type: WorkflowNode['type']) => {
    switch (type) {
      case 'trigger':
        return <Play className="h-4 w-4" />
      case 'action':
        return <ArrowRight className="h-4 w-4" />
      case 'condition':
        return <CheckCircle className="h-4 w-4" />
      case 'notification':
        return <Bell className="h-4 w-4" />
      case 'approval':
        return <User className="h-4 w-4" />
      case 'escalation':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const getNodeColor = (type: WorkflowNode['type']) => {
    switch (type) {
      case 'trigger':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20'
      case 'action':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
      case 'condition':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
      case 'notification':
        return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
      case 'approval':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
      case 'escalation':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20'
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const getStatusColor = (status: WorkflowNode['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-500'
      case 'inactive':
        return 'text-gray-500'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: WorkflowNode['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-3 w-3" />
      case 'inactive':
        return <Pause className="h-3 w-3" />
      case 'error':
        return <AlertTriangle className="h-3 w-3" />
      default:
        return <Square className="h-3 w-3" />
    }
  }

  return (
    <Card
      className={cn(
        "w-64 cursor-pointer transition-all duration-200 hover:shadow-lg",
        getNodeColor(node.type),
        isSelected && "ring-2 ring-primary shadow-lg",
        className
      )}
      onClick={() => onSelect?.(node.id)}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "p-1 rounded",
              getNodeColor(node.type).replace('border-', 'bg-').replace(' bg-', ' bg-')
            )}>
              {getNodeIcon(node.type)}
            </div>
            <div>
              <h3 className="font-medium text-sm">{node.title}</h3>
              <div className="flex items-center space-x-1">
                {getStatusIcon(node.status)}
                <span className={cn("text-xs", getStatusColor(node.status))}>
                  {node.status}
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(node.id)
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                onDuplicate?.(node.id)
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(node.id)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {node.description}
        </p>

        {/* Configuration Preview */}
        <div className="space-y-2">
          {node.type === 'trigger' && (
            <div className="flex items-center justify-between text-xs">
              <span>Trigger:</span>
              <Badge variant="outline" className="text-xs">
                {node.config.triggerType || 'Manual'}
              </Badge>
            </div>
          )}
          
          {node.type === 'notification' && (
            <div className="flex items-center justify-between text-xs">
              <span>Channel:</span>
              <Badge variant="outline" className="text-xs">
                {node.config.channel || 'Email'}
              </Badge>
            </div>
          )}
          
          {node.type === 'approval' && (
            <div className="flex items-center justify-between text-xs">
              <span>Approver:</span>
              <Badge variant="outline" className="text-xs">
                {node.config.approver || 'Auto'}
              </Badge>
            </div>
          )}
          
          {node.type === 'escalation' && (
            <div className="flex items-center justify-between text-xs">
              <span>Level:</span>
              <Badge variant="outline" className="text-xs">
                {node.config.level || 'Level 1'}
              </Badge>
            </div>
          )}
        </div>

        {/* Connections */}
        {node.connections.length > 0 && (
          <div className="mt-3 pt-2 border-t">
            <div className="flex items-center justify-between text-xs">
              <span>Connections:</span>
              <Badge variant="secondary" className="text-xs">
                {node.connections.length}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Node Palette Component
interface NodePaletteProps {
  onAddNode: (type: WorkflowNode['type']) => void
  className?: string
}

export function NodePalette({ onAddNode, className }: NodePaletteProps) {
  const nodeTypes = [
    {
      type: 'trigger' as const,
      title: 'Trigger',
      description: 'Start workflow execution',
      icon: <Play className="h-4 w-4" />,
      color: 'border-green-500 bg-green-50 dark:bg-green-900/20'
    },
    {
      type: 'action' as const,
      title: 'Action',
      description: 'Perform an action',
      icon: <ArrowRight className="h-4 w-4" />,
      color: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
    },
    {
      type: 'condition' as const,
      title: 'Condition',
      description: 'Check conditions',
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      type: 'notification' as const,
      title: 'Notification',
      description: 'Send notifications',
      icon: <Bell className="h-4 w-4" />,
      color: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
    },
    {
      type: 'approval' as const,
      title: 'Approval',
      description: 'Require approval',
      icon: <User className="h-4 w-4" />,
      color: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
    },
    {
      type: 'escalation' as const,
      title: 'Escalation',
      description: 'Escalate to higher level',
      icon: <AlertTriangle className="h-4 w-4" />,
      color: 'border-red-500 bg-red-50 dark:bg-red-900/20'
    }
  ]

  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Node Types</h3>
      {nodeTypes.map((nodeType) => (
        <Card
          key={nodeType.type}
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-md",
            nodeType.color
          )}
          onClick={() => onAddNode(nodeType.type)}
        >
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className={cn(
                "p-1 rounded",
                nodeType.color.replace('border-', 'bg-').replace(' bg-', ' bg-')
              )}>
                {nodeType.icon}
              </div>
              <div>
                <h4 className="text-sm font-medium">{nodeType.title}</h4>
                <p className="text-xs text-muted-foreground">{nodeType.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}











