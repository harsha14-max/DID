'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Clock, 
  User, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle,
  MoreHorizontal,
  Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityItem {
  id: string
  type: 'ticket_created' | 'ticket_resolved' | 'user_login' | 'system_alert' | 'workflow_triggered'
  title: string
  description: string
  timestamp: string
  user?: string
  metadata?: Record<string, any>
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  className?: string
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'ticket_created':
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case 'ticket_resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'user_login':
        return <User className="h-4 w-4 text-purple-500" />
      case 'system_alert':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'workflow_triggered':
        return <Activity className="h-4 w-4 text-indigo-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityBadge = (type: ActivityItem['type']) => {
    switch (type) {
      case 'ticket_created':
        return <Badge variant="outline" className="text-blue-600">New Ticket</Badge>
      case 'ticket_resolved':
        return <Badge variant="outline" className="text-green-600">Resolved</Badge>
      case 'user_login':
        return <Badge variant="outline" className="text-purple-600">Login</Badge>
      case 'system_alert':
        return <Badge variant="outline" className="text-yellow-600">Alert</Badge>
      case 'workflow_triggered':
        return <Badge variant="outline" className="text-indigo-600">Workflow</Badge>
      default:
        return <Badge variant="outline">Activity</Badge>
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Real-time Activity</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium truncate">{activity.title}</h4>
                    <div className="flex items-center space-x-2">
                      {getActivityBadge(activity.type)}
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                  {activity.user && (
                    <p className="text-xs text-muted-foreground">
                      by {activity.user}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}











