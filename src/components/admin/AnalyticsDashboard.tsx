'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Clock,
  Download,
  Filter,
  Calendar,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChartData {
  name: string
  value: number
  change: number
  color: string
}

interface AnalyticsDashboardProps {
  className?: string
}

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  // Mock data - in real implementation, this would come from API
  const ticketTrends: ChartData[] = [
    { name: 'Open', value: 45, change: 12, color: 'text-blue-500' },
    { name: 'In Progress', value: 23, change: -5, color: 'text-yellow-500' },
    { name: 'Resolved', value: 156, change: 8, color: 'text-green-500' },
    { name: 'Closed', value: 89, change: 3, color: 'text-gray-500' }
  ]

  const performanceMetrics = [
    { name: 'Avg Response Time', value: '2.3h', change: -15, trend: 'down' },
    { name: 'Resolution Rate', value: '94.2%', change: 2.1, trend: 'up' },
    { name: 'Customer Satisfaction', value: '4.6/5', change: 0.3, trend: 'up' },
    { name: 'SLA Compliance', value: '98.7%', change: 1.2, trend: 'up' }
  ]

  const topCategories = [
    { name: 'Technical Support', count: 45, percentage: 35 },
    { name: 'Account Issues', count: 28, percentage: 22 },
    { name: 'Feature Requests', count: 23, percentage: 18 },
    { name: 'Billing', count: 18, percentage: 14 },
    { name: 'Other', count: 14, percentage: 11 }
  ]

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="h-3 w-3 text-green-500" /> : 
      <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
  }

  const getTrendColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500'
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive insights into platform performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {metric.name}
                  </p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    {getTrendIcon(metric.trend)}
                    <span className={cn("text-xs font-medium", getTrendColor(metric.change))}>
                      {Math.abs(metric.change)}% vs last period
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-muted">
                  <BarChart3 className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Ticket Status Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ticketTrends.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn("w-3 h-3 rounded-full", item.color.replace('text-', 'bg-'))} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{item.value}</span>
                    <Badge variant="outline" className={cn("text-xs", getTrendColor(item.change))}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Top Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{category.count} tickets</span>
                      <Badge variant="outline" className="text-xs">
                        {category.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-green-500">+12% from last week</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Knowledge Base Views</p>
                <p className="text-2xl font-bold">8,924</p>
                <p className="text-xs text-green-500">+23% from last week</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Resolution Time</p>
                <p className="text-2xl font-bold">2.3h</p>
                <p className="text-xs text-red-500">+5% from last week</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



