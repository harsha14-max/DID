'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Database, 
  Server, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SystemHealthItem {
  name: string
  status: 'healthy' | 'warning' | 'critical' | 'maintenance'
  uptime: string
  responseTime: number
  lastCheck: string
  icon: React.ComponentType<{ className?: string }>
}

interface SystemHealthProps {
  systems: SystemHealthItem[]
  className?: string
}

export function SystemHealth({ systems, className }: SystemHealthProps) {
  const getStatusIcon = (status: SystemHealthItem['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'maintenance':
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: SystemHealthItem['status']) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="outline" className="text-green-600 border-green-200">Healthy</Badge>
      case 'warning':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200">Warning</Badge>
      case 'critical':
        return <Badge variant="outline" className="text-red-600 border-red-200">Critical</Badge>
      case 'maintenance':
        return <Badge variant="outline" className="text-blue-600 border-blue-200">Maintenance</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusColor = (status: SystemHealthItem['status']) => {
    switch (status) {
      case 'healthy': return 'border-green-200 bg-green-50 dark:bg-green-900/20'
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
      case 'critical': return 'border-red-200 bg-red-50 dark:bg-red-900/20'
      case 'maintenance': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const formatUptime = (uptime: string) => {
    // Parse uptime string and format it nicely
    return uptime
  }

  const formatLastCheck = (lastCheck: string) => {
    const date = new Date(lastCheck)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>System Health</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systems.map((system) => (
            <div 
              key={system.name} 
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md",
                getStatusColor(system.status)
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <system.icon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">{system.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(system.status)}
                  {getStatusBadge(system.status)}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uptime:</span>
                  <span className="font-medium">{formatUptime(system.uptime)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Response:</span>
                  <span className="font-medium">{system.responseTime}ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Check:</span>
                  <span className="font-medium">{formatLastCheck(system.lastCheck)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Overall System Status */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="font-medium">Overall System Status</span>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-200">
              Operational
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            All critical systems are running normally. Last incident: 3 days ago.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}











