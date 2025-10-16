'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Clock,
  User,
  Tag,
  Paperclip,
  Send,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  assigned_to?: string
  created_by: string
  created_at: string
  updated_at: string
  resolved_at?: string
  tags: string[]
  attachments: string[]
  sla_deadline?: string
  satisfaction_rating?: number
}

interface TicketManagementProps {
  className?: string
}

export function TicketManagement({ className }: TicketManagementProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Mock data - in real implementation, this would come from API
  useEffect(() => {
    const mockTickets: Ticket[] = [
      {
        id: '1',
        title: 'Unable to access account after password reset',
        description: 'I reset my password but still cannot log into my account. Getting authentication error.',
        status: 'open',
        priority: 'high',
        category: 'Account Issues',
        created_by: 'user1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['authentication', 'password'],
        attachments: [],
        sla_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: 'Feature request: Dark mode toggle',
        description: 'Would love to see a dark mode option in the customer portal for better user experience.',
        status: 'in_progress',
        priority: 'medium',
        category: 'Feature Request',
        assigned_to: 'admin1',
        created_by: 'user2',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['ui', 'feature'],
        attachments: [],
        sla_deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        title: 'Billing discrepancy in monthly invoice',
        description: 'My monthly invoice shows charges that I did not authorize. Need clarification.',
        status: 'resolved',
        priority: 'urgent',
        category: 'Billing',
        assigned_to: 'admin2',
        created_by: 'user3',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        resolved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['billing', 'invoice'],
        attachments: ['invoice.pdf'],
        satisfaction_rating: 5
      }
    ]
    setTickets(mockTickets)
    setFilteredTickets(mockTickets)
  }, [])

  // Filter tickets based on search and filters
  useEffect(() => {
    let filtered = tickets

    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter)
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter)
    }

    setFilteredTickets(filtered)
  }, [tickets, searchTerm, statusFilter, priorityFilter])

  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: Ticket['status']) => {
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

  const getPriorityBadge = (priority: Ticket['priority']) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
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

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ticket Management</h2>
          <p className="text-muted-foreground">Manage and track all support tickets</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Tickets ({filteredTickets.length})</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{tickets.filter(t => t.status === 'open').length} Open</Badge>
                  <Badge variant="outline">{tickets.filter(t => t.status === 'in_progress').length} In Progress</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-lg">{ticket.title}</h3>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(ticket.status)}
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {ticket.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(ticket.priority)}
                        <Badge variant="outline">{ticket.category}</Badge>
                        {ticket.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{formatDate(ticket.created_at)}</span>
                        {getSLAStatus(ticket.sla_deadline)}
                      </div>
                    </div>
                    
                    {ticket.assigned_to && (
                      <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Assigned to: {ticket.assigned_to}</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {filteredTickets.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tickets found matching your criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Details */}
        <div className="lg:col-span-1">
          {selectedTicket ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Ticket Details</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">{selectedTicket.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTicket.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Priority:</span>
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <Badge variant="outline">{selectedTicket.category}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Created:</span>
                    <span className="text-sm">{formatDate(selectedTicket.created_at)}</span>
                  </div>
                  {selectedTicket.sla_deadline && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">SLA Deadline:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{formatDate(selectedTicket.sla_deadline)}</span>
                        {getSLAStatus(selectedTicket.sla_deadline)}
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedTicket.tags.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground mb-2 block">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedTicket.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedTicket.satisfaction_rating && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Satisfaction:</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < selectedTicket.satisfaction_rating! ? "text-yellow-500 fill-current" : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <Button className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a ticket to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}



