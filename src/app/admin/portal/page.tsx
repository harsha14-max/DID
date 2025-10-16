'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CredXLogo } from '@/components/ui/credX-logo'
import { 
  BarChart3, 
  Users, 
  FileText, 
  MessageSquare, 
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  Settings,
  LogOut,
  Bell,
  Search,
  Database,
  Server,
  Monitor,
  Zap,
  Home,
  Building2,
  RotateCcw,
  BookOpen,
  Plug
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function AdminPortal() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    avgResponseTime: 0,
    satisfactionRating: 0,
    totalUsers: 0,
    knowledgeBaseArticles: 0,
    activeWorkflows: 0
  })
  const [recentTickets, setRecentTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For demo purposes, bypass authentication check
    // if (!user || user.role !== 'admin') {
    //   router.push('/auth/login?role=admin')
    //   return
    // }
    fetchDashboardData()
  }, [user, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch tickets data from Supabase
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select('id, title, description, status, priority, created_at')
        .order('created_at', { ascending: false })
        .limit(10)

      // Fetch analytics data from Supabase
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('analytics')
        .select('metric_name, metric_value')
        .in('metric_name', ['total_tickets', 'resolved_tickets', 'average_resolution_time', 'customer_satisfaction'])

      // Fetch users count
      const { count: usersCount, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      // Fetch knowledge base count
      const { count: knowledgeCount, error: knowledgeError } = await supabase
        .from('knowledge_base')
        .select('*', { count: 'exact', head: true })

      // Fetch workflows count
      const { count: workflowsCount, error: workflowsError } = await supabase
        .from('workflows')
        .select('*', { count: 'exact', head: true })

      if (ticketsError || analyticsError || usersError || knowledgeError || workflowsError) {
        console.error('Error fetching dashboard data:', { ticketsError, analyticsError, usersError, knowledgeError, workflowsError })
        toast.error('Failed to load dashboard data. Please try again.')
        return
      }
        // Calculate stats from real data
        const totalTickets = ticketsData?.length || 0
        const openTickets = ticketsData?.filter(t => t.status === 'open').length || 0
        const resolvedTickets = ticketsData?.filter(t => t.status === 'resolved').length || 0
        
        // Get analytics values
        const avgResponseTime = analyticsData?.find(a => a.metric_name === 'average_resolution_time')?.metric_value || 2.5
        const satisfactionRating = analyticsData?.find(a => a.metric_name === 'customer_satisfaction')?.metric_value || 4.2

        setStats({
          totalTickets,
          openTickets,
          resolvedTickets,
          avgResponseTime,
          satisfactionRating,
          totalUsers: usersCount || 0,
          knowledgeBaseArticles: knowledgeCount || 0,
          activeWorkflows: workflowsCount || 0
        })

        setRecentTickets(ticketsData || [])
        
        console.log('Admin portal data loaded from Supabase:', {
          totalTickets,
          openTickets,
          resolvedTickets,
          totalUsers: usersCount,
          knowledgeBaseArticles: knowledgeCount,
          activeWorkflows: workflowsCount
        })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Temporarily disabled for development
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading Admin Portal...</p>
  //       </div>
  //     </div>
  //   )
  // }

  const statCards = [
    {
      title: 'Total Tickets',
      value: stats.totalTickets,
      icon: MessageSquare,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      change: '+12%'
    },
    {
      title: 'Open Tickets',
      value: stats.openTickets,
      icon: AlertTriangle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      change: '+5%'
    },
    {
      title: 'Resolved Tickets',
      value: stats.resolvedTickets,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      change: '+8%'
    },
    {
      title: 'Avg Response Time',
      value: `${stats.avgResponseTime}h`,
      icon: Clock,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      change: '-15%'
    },
    {
      title: 'Satisfaction Rating',
      value: `${stats.satisfactionRating}/5`,
      icon: TrendingUp,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      change: '+3%'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      change: '+7%'
    }
  ]

  const quickActions = [
    {
      title: 'Create Knowledge Article',
      description: 'Add new help documentation',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '#'
    },
    {
      title: 'Manage Workflows',
      description: 'Configure automation rules',
      icon: Settings,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '#'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '#'
    },
    {
      title: 'View Analytics',
      description: 'Performance metrics and reports',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '#'
    },
    {
      title: 'Search Tickets',
      description: 'Find and manage support tickets',
      icon: Search,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      href: '#'
    },
    {
      title: 'System Health',
      description: 'Monitor system performance',
      icon: Activity,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      href: '#'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CredXLogo size={40} className="shadow-lg" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">credX Admin Portal</h1>
                  <p className="text-sm text-gray-500">Credit Management</p>
                </div>
              </div>
              <Badge variant="outline" className="ml-4">
                Admin Access
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: Home },
              { id: 'tickets', name: 'Tickets', icon: MessageSquare },
              { id: 'accounts', name: 'Accounts', icon: Building2 },
              { id: 'workflow', name: 'Workflow', icon: RotateCcw },
              { id: 'analytics', name: 'Analytics', icon: BarChart3 },
              { id: 'knowledge', name: 'Knowledge Base', icon: BookOpen },
              { id: 'integrations', name: 'Integrations', icon: Plug },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.full_name || 'Admin'}!
              </h2>
              <p className="text-gray-600">
                Here's what's happening with your BSM Platform today.
              </p>
            </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tickets */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Recent Tickets
              </CardTitle>
              <CardDescription>
                Latest support tickets requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTickets.length > 0 ? (
                  recentTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{ticket.title}</h4>
                        <p className="text-sm text-gray-600">
                          {ticket.description.substring(0, 100)}...
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge 
                            variant={ticket.status === 'open' ? 'destructive' : 'secondary'}
                          >
                            {ticket.status}
                          </Badge>
                          <Badge variant="outline">
                            {ticket.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No tickets found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="w-full justify-start h-auto p-4 hover:bg-gray-50"
                >
                  <div className={`p-2 rounded-lg ${action.bgColor} mr-3`}>
                    <action.icon className={`h-4 w-4 ${action.color}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{action.title}</div>
                    <div className="text-sm text-gray-500">{action.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                System Health
              </CardTitle>
              <CardDescription>
                Real-time system status and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <Database className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-medium">Database</p>
                  <p className="text-sm text-gray-500">Healthy</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <Server className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-medium">API</p>
                  <p className="text-sm text-gray-500">Healthy</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                  <Activity className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                  <p className="font-medium">AI Services</p>
                  <p className="text-sm text-gray-500">Degraded</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <Database className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-medium">Storage</p>
                  <p className="text-sm text-gray-500">Healthy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
          </>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Tickets Management</h2>
                <p className="text-gray-600">Manage and track all support tickets</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                      <p className="text-2xl font-bold text-gray-900">156</p>
                      <p className="text-xs text-green-600 font-medium">+12%</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                      <p className="text-2xl font-bold text-gray-900">23</p>
                      <p className="text-xs text-orange-600 font-medium">+5%</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Resolved</p>
                      <p className="text-2xl font-bold text-gray-900">133</p>
                      <p className="text-xs text-green-600 font-medium">+8%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
                      <p className="text-2xl font-bold text-gray-900">2.4h</p>
                      <p className="text-xs text-green-600 font-medium">-0.2h</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Tickets</CardTitle>
                <CardDescription>Latest support tickets requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{ticket.title}</h4>
                        <p className="text-sm text-gray-600">{ticket.description.substring(0, 100)}...</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant={ticket.status === 'open' ? 'destructive' : 'secondary'}>
                            {ticket.status}
                          </Badge>
                          <Badge variant="outline">{ticket.priority}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Account Management</h2>
                <p className="text-gray-600">Manage client accounts and relationships</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Building2 className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Accounts</p>
                      <p className="text-2xl font-bold text-gray-900">45</p>
                      <p className="text-xs text-green-600 font-medium">+7%</p>
                    </div>
                    <Building2 className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                      <p className="text-2xl font-bold text-gray-900">42</p>
                      <p className="text-xs text-green-600 font-medium">+3%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">SLA Compliance</p>
                      <p className="text-2xl font-bold text-gray-900">94%</p>
                      <p className="text-xs text-green-600 font-medium">+2%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
                <CardDescription>Client accounts and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Acme Corporation</h4>
                        <p className="text-sm text-gray-600">Enterprise Plan</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                      <p className="text-sm text-gray-500 mt-1">SLA: 98%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">TechStart Inc</h4>
                        <p className="text-sm text-gray-600">Professional Plan</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                      <p className="text-sm text-gray-500 mt-1">SLA: 92%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Workflow Tab */}
        {activeTab === 'workflow' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Workflow Automation</h2>
                <p className="text-gray-600">Design and manage automated workflows</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <RotateCcw className="h-4 w-4 mr-2" />
                Create Workflow
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                      <p className="text-xs text-green-600 font-medium">+2</p>
                    </div>
                    <RotateCcw className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Executions Today</p>
                      <p className="text-2xl font-bold text-gray-900">1,247</p>
                      <p className="text-xs text-green-600 font-medium">+15%</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">98.5%</p>
                      <p className="text-xs text-green-600 font-medium">+0.3%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Workflow Executions</CardTitle>
                <CardDescription>Latest automated workflow runs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Ticket Auto-Assignment</h4>
                        <p className="text-sm text-gray-600">Executed 2 minutes ago</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Success</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">SLA Reminder</h4>
                        <p className="text-sm text-gray-600">Executed 5 minutes ago</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Running</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
                <p className="text-gray-600">Performance metrics and business intelligence</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Customer Satisfaction</p>
                      <p className="text-2xl font-bold text-gray-900">4.2/5</p>
                      <p className="text-xs text-green-600 font-medium">+0.3</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Response Time</p>
                      <p className="text-2xl font-bold text-gray-900">2.5h</p>
                      <p className="text-xs text-green-600 font-medium">-15%</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                      <p className="text-2xl font-bold text-gray-900">85%</p>
                      <p className="text-xs text-green-600 font-medium">+3%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Agent Productivity</p>
                      <p className="text-2xl font-bold text-gray-900">92%</p>
                      <p className="text-xs text-green-600 font-medium">+2%</p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Key metrics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Chart visualization would go here</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Issues</CardTitle>
                  <CardDescription>Most common support requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Login Issues</span>
                      <span className="text-sm font-medium">23%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Password Reset</span>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Feature Requests</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Bug Reports</span>
                      <span className="text-sm font-medium">12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Knowledge Base Tab */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Knowledge Base</h2>
                <p className="text-gray-600">Manage help articles and documentation</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <BookOpen className="h-4 w-4 mr-2" />
                Create Article
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Articles</p>
                      <p className="text-2xl font-bold text-gray-900">28</p>
                      <p className="text-xs text-green-600 font-medium">+3</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Views This Month</p>
                      <p className="text-2xl font-bold text-gray-900">1,247</p>
                      <p className="text-xs text-green-600 font-medium">+25%</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Helpful Rate</p>
                      <p className="text-2xl font-bold text-gray-900">87%</p>
                      <p className="text-xs text-green-600 font-medium">+2%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Popular Articles</CardTitle>
                <CardDescription>Most viewed help articles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">How to Reset Your Password</h4>
                        <p className="text-sm text-gray-600">Updated 2 days ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">247 views</p>
                      <Badge className="bg-green-100 text-green-800">Helpful</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Setting Up Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Updated 1 week ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">189 views</p>
                      <Badge className="bg-green-100 text-green-800">Helpful</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Integrations</h2>
                <p className="text-gray-600">Manage third-party integrations and APIs</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plug className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Integrations</p>
                      <p className="text-2xl font-bold text-gray-900">8</p>
                      <p className="text-xs text-green-600 font-medium">+1</p>
                    </div>
                    <Plug className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">API Calls Today</p>
                      <p className="text-2xl font-bold text-gray-900">2,847</p>
                      <p className="text-xs text-green-600 font-medium">+12%</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">99.2%</p>
                      <p className="text-xs text-green-600 font-medium">+0.1%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Integration Status</CardTitle>
                <CardDescription>Current status of all integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Slack Integration</h4>
                        <p className="text-sm text-gray-600">Last sync: 2 minutes ago</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Email Service</h4>
                        <p className="text-sm text-gray-600">Last sync: 1 minute ago</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">CRM Integration</h4>
                        <p className="text-sm text-gray-600">Last sync: 15 minutes ago</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                <p className="text-gray-600">Manage team members and permissions</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Users className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">45</p>
                      <p className="text-xs text-green-600 font-medium">+7%</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900">42</p>
                      <p className="text-xs text-green-600 font-medium">+3%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Admin Users</p>
                      <p className="text-2xl font-bold text-gray-900">5</p>
                      <p className="text-xs text-gray-600 font-medium">No change</p>
                    </div>
                    <Settings className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Current team members and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">JD</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">John Doe</h4>
                        <p className="text-sm text-gray-600">john.doe@company.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-blue-100 text-blue-800">Admin</Badge>
                      <p className="text-sm text-gray-500 mt-1">Last active: 2 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">AS</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Alice Smith</h4>
                        <p className="text-sm text-gray-600">alice.smith@company.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">Agent</Badge>
                      <p className="text-sm text-gray-500 mt-1">Last active: 5 min ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
                <p className="text-gray-600">Configure system preferences and options</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Settings className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Basic system configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">System Name</h4>
                      <p className="text-sm text-gray-600">BSM Platform</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Default Language</h4>
                      <p className="text-sm text-gray-600">English</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Timezone</h4>
                      <p className="text-sm text-gray-600">UTC-5 (EST)</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Security and authentication options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Required for all users</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Session Timeout</h4>
                      <p className="text-sm text-gray-600">8 hours</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Password Policy</h4>
                      <p className="text-sm text-gray-600">Strong passwords required</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
