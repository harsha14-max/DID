'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Plus, 
  Clock,
  CheckCircle,
  Star,
  HelpCircle,
  Phone,
  Mail,
  FileText,
  Search,
  TrendingUp,
  AlertTriangle,
  User,
  Settings,
  LogOut,
  Bell,
  Download,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'

interface CustomerTicket {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  created_at: string
  updated_at: string
  resolved_at?: string
  satisfaction_rating?: number
  sla_deadline?: string
  tags: string[]
}

interface CustomerDashboardProps {
  className?: string
}

export function CustomerDashboard({ className }: CustomerDashboardProps) {
  const { signOut } = useAuth()
  
  // Mock data - in real implementation, this would come from API
  const customerStats = {
    myTickets: 8,
    openTickets: 2,
    resolvedTickets: 6,
    avgResolutionTime: 1.8,
    satisfactionRating: 4.7,
    knowledgeBaseViews: 12,
    lastLogin: new Date().toISOString()
  }

  const recentTickets: CustomerTicket[] = [
    {
      id: '1',
      title: 'Account Access Issue',
      description: 'Unable to access my account after password change',
      status: 'open',
      priority: 'high',
      category: 'Account Issues',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sla_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      tags: ['authentication', 'urgent']
    },
    {
      id: '2',
      title: 'Feature Request: Dark Mode',
      description: 'Would like to see more customization options for better UX',
      status: 'in_progress',
      priority: 'medium',
      category: 'Feature Request',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      sla_deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['ui', 'enhancement']
    },
    {
      id: '3',
      title: 'Billing Question',
      description: 'Need clarification on monthly charges',
      status: 'resolved',
      priority: 'medium',
      category: 'Billing',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      resolved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      satisfaction_rating: 5,
      tags: ['billing', 'clarification']
    }
  ]

  const knowledgeBase = [
    {
      id: '1',
      title: 'Getting Started Guide',
      content: 'Learn how to use the BSM Platform effectively',
      category: 'Getting Started',
      helpful_count: 15,
      view_count: 1247,
      last_updated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      title: 'Troubleshooting Common Issues',
      content: 'Solutions to frequently encountered problems',
      category: 'Support',
      helpful_count: 23,
      view_count: 892,
      last_updated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      title: 'Best Practices for Ticket Submission',
      content: 'Tips for submitting effective support tickets',
      category: 'Tips',
      helpful_count: 8,
      view_count: 456,
      last_updated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  const getStatusIcon = (status: CustomerTicket['status']) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: CustomerTicket['status']) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive">Open</Badge>
      case 'in_progress':
        return <Badge variant="default">In Progress</Badge>
      case 'resolved':
        return <Badge variant="secondary">Resolved</Badge>
      case 'closed':
        return <Badge variant="outline">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: CustomerTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getSLAStatus = (slaDeadline?: string) => {
    if (!slaDeadline) return null
    
    const deadline = new Date(slaDeadline)
    const now = new Date()
    const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    if (diffHours < 0) {
      return <Badge variant="destructive">Overdue</Badge>
    } else if (diffHours < 24) {
      return <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>
    } else {
      return <Badge variant="outline">On Track</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const statCards = [
    {
      title: 'My Tickets',
      value: customerStats.myTickets,
      icon: MessageSquare,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      trend: { value: 2, period: 'this month' }
    },
    {
      title: 'Open Tickets',
      value: customerStats.openTickets,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      trend: { value: -1, period: 'this week' }
    },
    {
      title: 'Resolved Tickets',
      value: customerStats.resolvedTickets,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      trend: { value: 3, period: 'this month' }
    },
    {
      title: 'Avg Resolution Time',
      value: `${customerStats.avgResolutionTime}h`,
      icon: Clock,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      trend: { value: -15, period: 'vs last month' }
    }
  ]

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Portal</h2>
          <p className="text-muted-foreground">Manage your support tickets and access help resources</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Welcome back! 👋</h3>
            <p className="text-muted-foreground mb-4">
              We're here to help! Submit a ticket, browse our knowledge base, or chat with our support team.
            </p>
            <div className="flex items-center space-x-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Submit New Ticket
              </Button>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search Knowledge Base
              </Button>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Support Online</span>
            </div>
            <p className="text-sm text-muted-foreground">Avg Response: {customerStats.avgResolutionTime}h</p>
            <p className="text-sm text-muted-foreground">Satisfaction: {customerStats.satisfactionRating}/5</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">
                      {stat.trend.value > 0 ? '+' : ''}{stat.trend.value} {stat.trend.period}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  My Recent Tickets
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Track the status of your support requests
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-lg">{ticket.title}</h4>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(ticket.status)}
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {ticket.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(ticket.priority)}
                      <Badge variant="outline">{ticket.category}</Badge>
                      {ticket.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{formatDate(ticket.created_at)}</span>
                      {getSLAStatus(ticket.sla_deadline)}
                    </div>
                  </div>
                  
                  {ticket.satisfaction_rating && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm text-muted-foreground">Your Rating:</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < ticket.satisfaction_rating! ? "text-yellow-500 fill-current" : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Knowledge Base */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Get help quickly
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Submit New Ticket
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search Knowledge Base
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Live Chat Support
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Button>
            </CardContent>
          </Card>

          {/* Knowledge Base */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Popular Articles
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Most helpful resources
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {knowledgeBase.map((article) => (
                  <div key={article.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <h4 className="font-medium text-sm mb-1">{article.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {article.content.substring(0, 80)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          {article.helpful_count}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {article.view_count}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Support Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            Need Help?
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Multiple ways to get the support you need
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-6 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <MessageSquare className="h-8 w-8 mx-auto mb-4 text-blue-500" />
              <h3 className="font-medium mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with our support team in real-time
              </p>
              <Button size="sm">Start Chat</Button>
            </div>
            <div className="text-center p-6 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Phone className="h-8 w-8 mx-auto mb-4 text-green-500" />
              <h3 className="font-medium mb-2">Phone Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Call us for immediate assistance
              </p>
              <Button size="sm" variant="outline">Call Now</Button>
            </div>
            <div className="text-center p-6 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Mail className="h-8 w-8 mx-auto mb-4 text-purple-500" />
              <h3 className="font-medium mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Send us an email and we'll respond quickly
              </p>
              <Button size="sm" variant="outline">Send Email</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}











