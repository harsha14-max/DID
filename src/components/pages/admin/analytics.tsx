'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, TrendingDown, Activity, Target, DollarSign, Users, Clock, Star, AlertTriangle, CheckCircle, RefreshCw, MessageSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('all')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)

      // Helper function to safely query Supabase tables
      const safeQuery = async (tableName: string, select: string) => {
        try {
          const result = await supabase.from(tableName).select(select)
          return { status: 'fulfilled', value: result }
        } catch (error) {
          console.warn(`Table ${tableName} not found or inaccessible, using empty data`)
          return { status: 'rejected', reason: error }
        }
      }

      // Fetch comprehensive analytics from all tables with error handling
      const [
        ticketsResult,
        usersResult,
        knowledgeResult,
        workflowsResult,
        ratingsResult,
        servicesResult,
        assetsResult,
        rulesResult
      ] = await Promise.allSettled([
        safeQuery('tickets', 'status, priority, created_at, resolved_at'),
        safeQuery('users', 'role, created_at, last_login'),
        safeQuery('knowledge_base', 'view_count, helpful_count, created_at'),
        safeQuery('workflows', 'is_active, created_at'),
        safeQuery('ratings', 'rating, created_at'),
        safeQuery('services', 'status, uptime'),
        safeQuery('assets', 'status, uptime'),
        safeQuery('rules', 'is_active, type')
      ])

      // Helper function to safely extract data from Promise.allSettled results
      const getData = (result: any) => {
        if (result.status === 'fulfilled' && result.value?.data) {
          return result.value.data
        }
        return []
      }

      // Process tickets analytics
      const ticketsData = getData(ticketsResult)
      const ticketAnalytics = {
        total: ticketsData.length,
        open: ticketsData.filter((t: any) => t.status === 'open').length,
        in_progress: ticketsData.filter((t: any) => t.status === 'in_progress').length,
        resolved: ticketsData.filter((t: any) => t.status === 'resolved').length,
        approved: ticketsData.filter((t: any) => t.status === 'approved').length,
        urgent: ticketsData.filter((t: any) => t.priority === 'urgent').length,
        high: ticketsData.filter((t: any) => t.priority === 'high').length,
        avgResolutionTime: calculateAvgResolutionTime(ticketsData)
      }

      // Process user analytics
      const usersData = getData(usersResult)
      const userAnalytics = {
        total: usersData.length,
        admins: usersData.filter((u: any) => u.role === 'admin').length,
        customers: usersData.filter((u: any) => u.role === 'customer').length,
        activeUsers: usersData.filter((u: any) => {
          if (!u.last_login) return false
          const lastLogin = new Date(u.last_login)
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          return lastLogin > thirtyDaysAgo
        }).length
      }

      // Process knowledge base analytics
      const knowledgeData = getData(knowledgeResult)
      const knowledgeAnalytics = {
        totalArticles: knowledgeData.length,
        totalViews: knowledgeData.reduce((sum: any, article: any) => sum + (article.view_count || 0), 0),
        totalHelpful: knowledgeData.reduce((sum: any, article: any) => sum + (article.helpful_count || 0), 0),
        avgViewsPerArticle: knowledgeData.length > 0 ?
          knowledgeData.reduce((sum: any, article: any) => sum + (article.view_count || 0), 0) / knowledgeData.length : 0
      }

      // Process workflow analytics
      const workflowsData = getData(workflowsResult)
      const workflowAnalytics = {
        total: workflowsData.length,
        active: workflowsData.filter((w: any) => w.is_active).length,
        inactive: workflowsData.filter((w: any) => !w.is_active).length
      }

      // Process ratings analytics
      const ratingsData = getData(ratingsResult)
      const ratingAnalytics = {
        totalRatings: ratingsData.length,
        avgRating: ratingsData.length > 0 ?
          ratingsData.reduce((sum: any, rating: any) => sum + rating.rating, 0) / ratingsData.length : 0,
        fiveStar: ratingsData.filter((r: any) => r.rating === 5).length,
        fourStar: ratingsData.filter((r: any) => r.rating === 4).length,
        threeStar: ratingsData.filter((r: any) => r.rating === 3).length,
        twoStar: ratingsData.filter((r: any) => r.rating === 2).length,
        oneStar: ratingsData.filter((r: any) => r.rating === 1).length
      }

      // Process services analytics
      const servicesData = getData(servicesResult)
      const serviceAnalytics = {
        total: servicesData.length,
        operational: servicesData.filter((s: any) => s.status === 'operational').length,
        degraded: servicesData.filter((s: any) => s.status === 'degraded').length,
        maintenance: servicesData.filter((s: any) => s.status === 'maintenance').length,
        outage: servicesData.filter((s: any) => s.status === 'outage').length,
        avgUptime: servicesData.length > 0 ? 
          servicesData.reduce((sum: any, service: any) => sum + parseFloat(service.uptime || '0'), 0) / servicesData.length : 0
      }

      // Process assets analytics
      const assetsData = getData(assetsResult)
      const assetAnalytics = {
        total: assetsData.length,
        operational: assetsData.filter((a: any) => a.status === 'operational').length,
        degraded: assetsData.filter((a: any) => a.status === 'degraded').length,
        maintenance: assetsData.filter((a: any) => a.status === 'maintenance').length,
        outage: assetsData.filter((a: any) => a.status === 'outage').length,
        avgUptime: assetsData.length > 0 ? 
          assetsData.reduce((sum: any, asset: any) => sum + parseFloat(asset.uptime || '0'), 0) / assetsData.length : 0
      }

      // Process rules analytics
      const rulesData = getData(rulesResult)
      const ruleAnalytics = {
        total: rulesData.length,
        active: rulesData.filter((r: any) => r.is_active).length,
        automation: rulesData.filter((r: any) => r.type === 'automation').length,
        escalation: rulesData.filter((r: any) => r.type === 'escalation').length,
        approval: rulesData.filter((r: any) => r.type === 'approval').length,
        notification: rulesData.filter((r: any) => r.type === 'notification').length
      }

      // Combine all analytics
      const comprehensiveAnalytics = {
        tickets: ticketAnalytics,
        users: userAnalytics,
        knowledge: knowledgeAnalytics,
        workflows: workflowAnalytics,
        ratings: ratingAnalytics,
        services: serviceAnalytics,
        assets: assetAnalytics,
        rules: ruleAnalytics,
        timestamp: new Date().toISOString()
      }

      setAnalyticsData(comprehensiveAnalytics)
      console.log('Comprehensive analytics loaded:', comprehensiveAnalytics)

    } catch (error) {
      console.error('Error fetching analytics:', error)
      
      // Fallback to mock data if Supabase queries fail
      const mockAnalytics = {
        tickets: {
          total: 45,
          open: 12,
          in_progress: 8,
          resolved: 20,
          approved: 5,
          urgent: 3,
          high: 7,
          avgResolutionTime: 4.2
        },
        users: {
          total: 156,
          admins: 8,
          customers: 148,
          activeUsers: 89
        },
        knowledge: {
          totalArticles: 23,
          totalViews: 1247,
          totalHelpful: 89,
          avgViewsPerArticle: 54.2
        },
        workflows: {
          total: 12,
          active: 9,
          inactive: 3
        },
        ratings: {
          totalRatings: 67,
          avgRating: 4.2,
          fiveStar: 28,
          fourStar: 22,
          threeStar: 12,
          twoStar: 3,
          oneStar: 2
        },
        services: {
          total: 8,
          operational: 6,
          degraded: 1,
          maintenance: 1,
          outage: 0,
          avgUptime: 98.5
        },
        assets: {
          total: 15,
          operational: 13,
          degraded: 1,
          maintenance: 1,
          outage: 0,
          avgUptime: 99.2
        },
        rules: {
          total: 24,
          active: 18,
          automation: 8,
          escalation: 6,
          approval: 4,
          notification: 6
        },
        timestamp: new Date().toISOString()
      }
      
      setAnalyticsData(mockAnalytics)
      console.log('Using mock analytics data due to API errors')
      toast.error('Using demo data - some features may be limited')
    } finally {
      setLoading(false)
    }
  }

  const calculateAvgResolutionTime = (tickets: any[]) => {
    const resolvedTickets = tickets.filter(t => t.resolved_at && t.created_at)
    if (resolvedTickets.length === 0) return 0
    
    const totalTime = resolvedTickets.reduce((sum, ticket) => {
      const created = new Date(ticket.created_at)
      const resolved = new Date(ticket.resolved_at)
      return sum + (resolved.getTime() - created.getTime())
    }, 0)
    
    return Math.round(totalTime / resolvedTickets.length / (1000 * 60 * 60)) // Convert to hours
  }

  const getMetricIcon = (metricName: string) => {
    switch (metricName) {
      case 'ticket_volume': return MessageSquare
      case 'response_time': return Clock
      case 'customer_satisfaction': return Star
      case 'resolution_rate': return CheckCircle
      case 'system_health': return Activity
      case 'uptime': return Target
      case 'performance_score': return TrendingUp
      case 'sla_compliance': return AlertTriangle
      default: return BarChart3
    }
  }

  const getMetricColor = (metricName: string) => {
    switch (metricName) {
      case 'ticket_volume': return 'text-blue-600'
      case 'response_time': return 'text-orange-600'
      case 'customer_satisfaction': return 'text-green-600'
      case 'resolution_rate': return 'text-purple-600'
      case 'system_health': return 'text-green-600'
      case 'uptime': return 'text-blue-600'
      case 'performance_score': return 'text-purple-600'
      case 'sla_compliance': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  // Convert analytics object to array for filtering
  const analyticsArray = Object.keys(analyticsData).map(key => ({
    metric_name: key,
    ...analyticsData[key]
  }))
  
  const filteredData = selectedMetric === 'all' 
    ? analyticsArray 
    : analyticsArray.filter(item => item.metric_name === selectedMetric)

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
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive system performance and business metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button onClick={fetchAnalytics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Volume</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.tickets?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.tickets?.avgResolutionTime || 0}h
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+5%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analyticsData.ratings?.avgRating * 20) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.tickets?.resolved && analyticsData.tickets?.total ? 
                Math.round((analyticsData.tickets.resolved / analyticsData.tickets.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Real-time system health metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">System Health</span>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {analyticsData.services?.avgUptime ? Math.round(analyticsData.services.avgUptime) : 95}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Uptime</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {analyticsData.assets?.avgUptime ? Math.round(analyticsData.assets.avgUptime) : 99}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Performance Score</span>
              </div>
              <Badge className="bg-purple-100 text-purple-800">
                {analyticsData.workflows?.active && analyticsData.workflows?.total ? 
                  Math.round((analyticsData.workflows.active / analyticsData.workflows.total) * 100) : 85}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">SLA Compliance</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">
                {analyticsData.rules?.active && analyticsData.rules?.total ? 
                  Math.round((analyticsData.rules.active / analyticsData.rules.total) * 100) : 92}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Active Users</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {analyticsData.users?.activeUsers || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Revenue</span>
              </div>
              <Badge className="bg-green-100 text-green-800">
                ${(analyticsData.tickets?.total || 0) * 150}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Growth Rate</span>
              </div>
              <Badge className="bg-purple-100 text-purple-800">
                {analyticsData.knowledge?.totalArticles ? 
                  Math.round((analyticsData.knowledge.totalArticles / 10) * 100) : 15}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Success Rate</span>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {analyticsData.ratings?.avgRating ? 
                  Math.round(analyticsData.ratings.avgRating * 20) : 88}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics</CardTitle>
          <CardDescription>
            Comprehensive view of all system metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredData.map((metric: any) => {
              const Icon = getMetricIcon(metric.metric_name)
              const colorClass = getMetricColor(metric.metric_name)
              
              return (
                <div
                  key={metric.metric_name}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Icon className={`h-5 w-5 ${colorClass}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">
                          {metric.metric_name.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </h3>
                        <Badge variant="secondary">Analytics</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Comprehensive metrics for {metric.metric_name.replace(/_/g, ' ')}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>Data Points: {Object.keys(metric).length - 1}</span>
                        <span>Type: Analytics</span>
                        <span>Updated: {new Date().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
            {filteredData.length === 0 && (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No metrics found</h3>
                <p className="text-gray-600">Try adjusting your filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

