'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  GitBranch, 
  Clock, 
  CheckCircle, 
  Zap,
  Save,
  Undo,
  Redo,
  Trash2,
  Plus,
  Minus,
  Eye,
  Copy,
  RefreshCw
} from 'lucide-react'

interface WorkflowComponent {
  id: string
  type: 'action' | 'condition' | 'delay' | 'approval' | 'trigger'
  label: string
  icon: any
  color: string
  description: string
}

interface CanvasComponent {
  id: string
  type: string
  label: string
  x: number
  y: number
}

interface Connection {
  id: string
  from: string
  to: string
  fromX: number
  fromY: number
  toX: number
  toY: number
}

const paletteComponents: WorkflowComponent[] = [
  {
    id: 'action',
    type: 'action',
    label: 'Action',
    icon: Play,
    color: 'bg-blue-500',
    description: 'Execute an action or task'
  },
  {
    id: 'condition',
    type: 'condition',
    label: 'Condition',
    icon: GitBranch,
    color: 'bg-green-500',
    description: 'Check a condition or rule'
  },
  {
    id: 'delay',
    type: 'delay',
    label: 'Delay',
    icon: Clock,
    color: 'bg-yellow-500',
    description: 'Wait for a specified time'
  },
  {
    id: 'approval',
    type: 'approval',
    label: 'Approval',
    icon: CheckCircle,
    color: 'bg-purple-500',
    description: 'Require human approval'
  },
  {
    id: 'trigger',
    type: 'trigger',
    label: 'Trigger',
    icon: Zap,
    color: 'bg-red-500',
    description: 'Start or trigger the workflow'
  }
]

export default function WorkflowBuilder() {
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [draggedComponent, setDraggedComponent] = useState<WorkflowComponent | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStart, setConnectionStart] = useState<{ id: string; x: number; y: number } | null>(null)
  const [connectionEnd, setConnectionEnd] = useState<{ x: number; y: number } | null>(null)
  
  // Canvas interaction states
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; componentId?: string } | null>(null)
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, component: WorkflowComponent) => {
    setDraggedComponent(component)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    
    if (!draggedComponent) return

    const canvas = e.currentTarget as HTMLElement
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newComponent: CanvasComponent = {
      id: `${draggedComponent.type}-${Date.now()}`,
      type: draggedComponent.type,
      label: draggedComponent.label,
      x: Math.max(0, x - 60), // Center the component
      y: Math.max(0, y - 30)
    }

    setCanvasComponents(prev => [...prev, newComponent])
    setDraggedComponent(null)
  }

  const removeComponent = (id: string) => {
    setCanvasComponents(prev => prev.filter(comp => comp.id !== id))
    // Also remove any connections involving this component
    setConnections(prev => prev.filter(conn => conn.from !== id && conn.to !== id))
  }

  const startConnection = (e: React.MouseEvent, componentId: string) => {
    e.stopPropagation()
    const component = canvasComponents.find(comp => comp.id === componentId)
    if (!component) return

    setIsConnecting(true)
    setConnectionStart({
      id: componentId,
      x: component.x + 64, // Right side of component
      y: component.y + 32 // Middle of component
    })
    console.log('Starting connection from:', componentId)
  }


  const removeConnection = (connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId))
  }

  // Zoom functions
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3))
  }

  const handleZoomReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // Pan functions
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse or Ctrl+Left click
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      e.preventDefault()
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      })
      return
    }

    if (!isConnecting || !connectionStart) return

    const canvas = e.currentTarget as HTMLElement
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - pan.x) / zoom
    const y = (e.clientY - rect.top - pan.y) / zoom

    setConnectionEnd({ x, y })
  }

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    if (isPanning) {
      setIsPanning(false)
      return
    }

    if (!isConnecting || !connectionStart) return

    const canvas = e.currentTarget as HTMLElement
    const rect = canvas.getBoundingClientRect()
    
    // Calculate mouse position relative to the transformed canvas
    const mouseX = (e.clientX - rect.left - pan.x) / zoom
    const mouseY = (e.clientY - rect.top - pan.y) / zoom

    // Find component under mouse with better detection
    const targetComponent = canvasComponents.find(comp => {
      const componentLeft = comp.x
      const componentRight = comp.x + 128
      const componentTop = comp.y
      const componentBottom = comp.y + 64
      
      return mouseX >= componentLeft && mouseX <= componentRight && 
             mouseY >= componentTop && mouseY <= componentBottom
    })

    if (targetComponent && targetComponent.id !== connectionStart.id) {
      // Create connection with proper coordinates
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        from: connectionStart.id,
        to: targetComponent.id,
        fromX: connectionStart.x + 64, // Right side of source component
        fromY: connectionStart.y + 32, // Middle of source component
        toX: targetComponent.x,        // Left side of target component
        toY: targetComponent.y + 32    // Middle of target component
      }

      setConnections(prev => [...prev, newConnection])
      console.log('Connection created:', newConnection)
    } else {
      console.log('No valid target component found at:', mouseX, mouseY)
    }

    // Reset connection state
    setIsConnecting(false)
    setConnectionStart(null)
    setConnectionEnd(null)
  }

  // Context menu functions
  const handleContextMenu = (e: React.MouseEvent, componentId?: string) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      componentId
    })
  }

  const closeContextMenu = () => {
    setContextMenu(null)
  }

  const duplicateComponent = (componentId: string) => {
    const component = canvasComponents.find(comp => comp.id === componentId)
    if (!component) return

    const newComponent: CanvasComponent = {
      id: `${component.type}-${Date.now()}`,
      type: component.type,
      label: component.label,
      x: component.x + 20,
      y: component.y + 20
    }

    setCanvasComponents(prev => [...prev, newComponent])
    closeContextMenu()
  }

  const selectComponent = (componentId: string) => {
    setSelectedComponent(componentId)
    closeContextMenu()
  }

  return (
    <div className="flex h-[calc(100vh-200px)] bg-gray-50">
      {/* Component Palette */}
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Workflow Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {paletteComponents.map((component) => {
              const Icon = component.icon
              return (
                <div
                  key={component.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, component)}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-grab hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 ${component.color} rounded flex items-center justify-center`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">{component.label}</div>
                    <div className="text-xs text-gray-500">{component.description}</div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">Workflow Canvas</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomReset}>
                  Reset
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Undo className="h-4 w-4 mr-1" />
                Undo
              </Button>
              <Button variant="outline" size="sm">
                <Redo className="h-4 w-4 mr-1" />
                Redo
              </Button>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                <Play className="h-4 w-4 mr-1" />
                Run Workflow
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div
          className="flex-1 relative bg-white overflow-hidden"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseDown={handleCanvasMouseDown}
          onContextMenu={(e) => handleContextMenu(e)}
          style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        >
          {/* Canvas Transform Container */}
          <div
            className="absolute inset-0"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          >
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Connections */}
          <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#374151"
                />
              </marker>
            </defs>
            {connections.map((connection) => (
              <g key={connection.id}>
                <line
                  x1={connection.fromX}
                  y1={connection.fromY}
                  x2={connection.toX}
                  y2={connection.toY}
                  stroke="#374151"
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                />
                {/* Connection delete button */}
                <circle
                  cx={(connection.fromX + connection.toX) / 2}
                  cy={(connection.fromY + connection.toY) / 2}
                  r="8"
                  fill="#ef4444"
                  className="pointer-events-auto cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                  onClick={() => removeConnection(connection.id)}
                />
                <text
                  x={(connection.fromX + connection.toX) / 2}
                  y={(connection.fromY + connection.toY) / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="10"
                  className="pointer-events-none"
                >
                  ×
                </text>
              </g>
            ))}
            
            {/* Temporary connection line while dragging */}
            {isConnecting && connectionStart && connectionEnd && (
              <line
                x1={connectionStart.x}
                y1={connectionStart.y}
                x2={connectionEnd.x}
                y2={connectionEnd.y}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
                markerEnd="url(#arrowhead)"
              />
            )}
            
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#6b7280"
                />
              </marker>
            </defs>
          </svg>

          {/* Canvas Components */}
          {canvasComponents.map((component) => {
            const paletteComponent = paletteComponents.find(pc => pc.type === component.type)
            const Icon = paletteComponent?.icon || Play
            
            return (
              <div
                key={component.id}
                className="absolute"
                style={{
                  left: component.x,
                  top: component.y,
                  zIndex: 2
                }}
              >
                <div 
                  className="relative group"
                  onContextMenu={(e) => handleContextMenu(e, component.id)}
                  onClick={() => setSelectedComponent(component.id)}
                >
                  <div className={`w-32 h-16 ${paletteComponent?.color || 'bg-gray-500'} rounded-lg border-2 ${selectedComponent === component.id ? 'border-blue-400' : 'border-white'} shadow-lg flex items-center justify-center cursor-move`}>
                    <div className="flex items-center space-x-2 text-white">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{component.label}</span>
                    </div>
                  </div>
                  
                  {/* Connection Point */}
                  <div
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100 border-2 border-white shadow-lg hover:scale-110"
                    onMouseDown={(e) => startConnection(e, component.id)}
                    title="Click and drag to connect components"
                  />
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => removeComponent(component.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )
          })}

          {/* Empty State */}
          {canvasComponents.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Workflow</h3>
                <p className="text-gray-600">Drag components from the palette to the canvas to begin</p>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <div
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
            onClick={closeContextMenu}
          >
            {contextMenu.componentId ? (
              <>
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                  onClick={() => selectComponent(contextMenu.componentId!)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Select
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                  onClick={() => duplicateComponent(contextMenu.componentId!)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </button>
                <hr className="my-1" />
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center"
                  onClick={() => {
                    removeComponent(contextMenu.componentId!)
                    closeContextMenu()
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                  onClick={() => setSelectedComponent(null)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Clear Selection
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                  onClick={handleZoomReset}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset View
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}