// =====================================================
// BSM Platform - Data Flow API Functions
// =====================================================
// This file contains all API functions for the complete data flow system

import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

// =====================================================
// 1. SERVICE-ASSET MANAGEMENT FUNCTIONS
// =====================================================

export const getVisibleServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        service_categories(name, description)
      `)
      .eq('is_visible_to_customers', true)
      .eq('status', 'active')
      .order('name')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching visible services:', error)
    toast.error('Failed to load services')
    return []
  }
}

export const getServiceCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching service categories:', error)
    return []
  }
}

// =====================================================
// 2. TICKET MANAGEMENT FUNCTIONS
// =====================================================

export const createTicket = async (ticketData: {
  title: string
  description: string
  service_id?: string
  priority: string
  category: string
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        title: ticketData.title,
        description: ticketData.description,
        service_id: ticketData.service_id,
        priority: ticketData.priority,
        category: ticketData.category,
        created_by: user.id,
        status: 'open',
        approval_status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    // Create notification for admin
    await createNotification({
      type: 'ticket_update',
      title: 'New Ticket Created',
      message: `New ticket "${ticketData.title}" has been created`,
      data: { ticket_id: data.id }
    })

    toast.success('Ticket created successfully!')
    return data
  } catch (error) {
    console.error('Error creating ticket:', error)
    toast.error('Failed to create ticket')
    throw error
  }
}

export const getCustomerTickets = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        services(name, description),
        workflow_instances(status, current_step)
      `)
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching customer tickets:', error)
    toast.error('Failed to load tickets')
    return []
  }
}

export const getAdminTickets = async () => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        services(name, description),
        users!tickets_created_by_fkey(full_name, email),
        workflow_instances(status, current_step)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching admin tickets:', error)
    toast.error('Failed to load tickets')
    return []
  }
}

export const approveTicket = async (ticketId: string, approved: boolean) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tickets')
      .update({
        approval_status: approved ? 'approved' : 'rejected',
        approval_method: 'manual',
        approved_by: user.id,
        approved_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single()

    if (error) throw error

    // Create notification for customer
    const ticket = await supabase
      .from('tickets')
      .select('created_by, title')
      .eq('id', ticketId)
      .single()

    if (ticket.data) {
      await createNotification({
        user_id: ticket.data.created_by,
        type: 'approval_request',
        title: `Ticket ${approved ? 'Approved' : 'Rejected'}`,
        message: `Your ticket "${ticket.data.title}" has been ${approved ? 'approved' : 'rejected'}`,
        data: { ticket_id: ticketId, approved }
      })
    }

    toast.success(`Ticket ${approved ? 'approved' : 'rejected'} successfully!`)
    return data
  } catch (error) {
    console.error('Error approving ticket:', error)
    toast.error('Failed to update ticket')
    throw error
  }
}

// =====================================================
// 3. WORKFLOW MANAGEMENT FUNCTIONS
// =====================================================

export const getWorkflowTemplates = async () => {
  try {
    const { data, error } = await supabase
      .from('workflow_templates')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching workflow templates:', error)
    return []
  }
}

export const getWorkflowInstances = async (ticketId?: string) => {
  try {
    let query = supabase
      .from('workflow_instances')
      .select(`
        *,
        workflow_templates(name, description),
        tickets(title, status)
      `)

    if (ticketId) {
      query = query.eq('ticket_id', ticketId)
    }

    const { data, error } = await query.order('started_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching workflow instances:', error)
    return []
  }
}

export const executeWorkflowStep = async (instanceId: string, stepData: any) => {
  try {
    const { data, error } = await supabase
      .from('workflow_instances')
      .update({
        current_step: stepData.step,
        context_data: stepData.context,
        updated_at: new Date().toISOString()
      })
      .eq('id', instanceId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error executing workflow step:', error)
    throw error
  }
}

// =====================================================
// 4. RULE ENGINE FUNCTIONS
// =====================================================

export const getRuleEngineRules = async () => {
  try {
    const { data, error } = await supabase
      .from('rule_engine_rules')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching rule engine rules:', error)
    return []
  }
}

export const createRuleEngineRule = async (ruleData: {
  name: string
  description: string
  conditions: any
  actions: any[]
  priority: number
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('rule_engine_rules')
      .insert({
        ...ruleData,
        created_by: user.id
      })
      .select()
      .single()

    if (error) throw error
    toast.success('Rule created successfully!')
    return data
  } catch (error) {
    console.error('Error creating rule:', error)
    toast.error('Failed to create rule')
    throw error
  }
}

export const getRuleExecutionLog = async (ticketId?: string) => {
  try {
    let query = supabase
      .from('rule_execution_log')
      .select(`
        *,
        rule_engine_rules(name, description),
        tickets(title, status)
      `)

    if (ticketId) {
      query = query.eq('ticket_id', ticketId)
    }

    const { data, error } = await query.order('executed_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching rule execution log:', error)
    return []
  }
}

// =====================================================
// 5. KNOWLEDGE BASE FUNCTIONS
// =====================================================

export const getKnowledgeBaseArticles = async (categoryId?: string) => {
  try {
    let query = supabase
      .from('knowledge_base')
      .select(`
        *,
        service_categories(name)
      `)
      .eq('status', 'published')

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching knowledge base articles:', error)
    return []
  }
}

export const getFeaturedKnowledgeBaseArticles = async () => {
  try {
    const { data, error } = await supabase
      .from('knowledge_base')
      .select(`
        *,
        service_categories(name)
      `)
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('helpful_count', { ascending: false })
      .limit(5)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching featured articles:', error)
    return []
  }
}

export const trackKnowledgeBaseView = async (articleId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Record view
    await supabase
      .from('knowledge_base_views')
      .insert({
        article_id: articleId,
        user_id: user.id,
        session_id: Math.random().toString(36).substring(7)
      })

    // Update view count
    await supabase
      .from('knowledge_base')
      .update({
        view_count: supabase.raw('view_count + 1')
      })
      .eq('id', articleId)
  } catch (error) {
    console.error('Error tracking knowledge base view:', error)
  }
}

// =====================================================
// 6. RATING AND REVIEW FUNCTIONS
// =====================================================

export const createRating = async (ratingData: {
  ticket_id?: string
  service_id?: string
  rating: number
  comment?: string
  rating_type: string
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('customer_ratings')
      .insert({
        ...ratingData,
        customer_id: user.id
      })
      .select()
      .single()

    if (error) throw error

    // Create notification for admin
    await createNotification({
      type: 'rating_request',
      title: 'New Rating Received',
      message: `A new ${ratingData.rating}-star rating has been received`,
      data: { rating_id: data.id, rating: ratingData.rating }
    })

    toast.success('Rating submitted successfully!')
    return data
  } catch (error) {
    console.error('Error creating rating:', error)
    toast.error('Failed to submit rating')
    throw error
  }
}

export const getServiceReviews = async (serviceId?: string) => {
  try {
    let query = supabase
      .from('service_reviews')
      .select(`
        *,
        users!service_reviews_customer_id_fkey(full_name, avatar_url),
        services(name)
      `)
      .eq('is_public', true)

    if (serviceId) {
      query = query.eq('service_id', serviceId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching service reviews:', error)
    return []
  }
}

// =====================================================
// 7. ANALYTICS FUNCTIONS
// =====================================================

export const getAnalyticsData = async (type: string, filters: any = {}) => {
  try {
    switch (type) {
      case 'tickets':
        return await getTicketAnalytics(filters)
      case 'services':
        return await getServiceAnalytics(filters)
      case 'ratings':
        return await getRatingAnalytics(filters)
      case 'workflows':
        return await getWorkflowAnalytics(filters)
      case 'knowledge_base':
        return await getKnowledgeBaseAnalytics(filters)
      default:
        return {}
    }
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return {}
  }
}

const getTicketAnalytics = async (filters: any) => {
  const { data, error } = await supabase
    .from('tickets')
    .select('status, priority, approval_status, created_at')
    .gte('created_at', filters.startDate || '2024-01-01')
    .lte('created_at', filters.endDate || '2024-12-31')

  if (error) throw error

  return {
    total: data.length,
    byStatus: data.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1
      return acc
    }, {}),
    byPriority: data.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1
      return acc
    }, {}),
    byApprovalStatus: data.reduce((acc, ticket) => {
      acc[ticket.approval_status] = (acc[ticket.approval_status] || 0) + 1
      return acc
    }, {})
  }
}

const getServiceAnalytics = async (filters: any) => {
  const { data, error } = await supabase
    .from('services')
    .select('status, created_at')
    .gte('created_at', filters.startDate || '2024-01-01')
    .lte('created_at', filters.endDate || '2024-12-31')

  if (error) throw error

  return {
    total: data.length,
    byStatus: data.reduce((acc, service) => {
      acc[service.status] = (acc[service.status] || 0) + 1
      return acc
    }, {})
  }
}

const getRatingAnalytics = async (filters: any) => {
  const { data, error } = await supabase
    .from('customer_ratings')
    .select('rating, created_at')
    .gte('created_at', filters.startDate || '2024-01-01')
    .lte('created_at', filters.endDate || '2024-12-31')

  if (error) throw error

  const averageRating = data.reduce((sum, rating) => sum + rating.rating, 0) / data.length

  return {
    total: data.length,
    average: averageRating,
    byRating: data.reduce((acc, rating) => {
      acc[rating.rating] = (acc[rating.rating] || 0) + 1
      return acc
    }, {})
  }
}

const getWorkflowAnalytics = async (filters: any) => {
  const { data, error } = await supabase
    .from('workflow_instances')
    .select('status, started_at, completed_at')
    .gte('started_at', filters.startDate || '2024-01-01')
    .lte('started_at', filters.endDate || '2024-12-31')

  if (error) throw error

  return {
    total: data.length,
    byStatus: data.reduce((acc, workflow) => {
      acc[workflow.status] = (acc[workflow.status] || 0) + 1
      return acc
    }, {}),
    completed: data.filter(w => w.status === 'completed').length,
    averageCompletionTime: data
      .filter(w => w.completed_at)
      .reduce((sum, w) => {
        const duration = new Date(w.completed_at).getTime() - new Date(w.started_at).getTime()
        return sum + duration
      }, 0) / data.filter(w => w.completed_at).length
  }
}

const getKnowledgeBaseAnalytics = async (filters: any) => {
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('view_count, helpful_count, status, created_at')
    .gte('created_at', filters.startDate || '2024-01-01')
    .lte('created_at', filters.endDate || '2024-12-31')

  if (error) throw error

  return {
    total: data.length,
    published: data.filter(article => article.status === 'published').length,
    totalViews: data.reduce((sum, article) => sum + article.view_count, 0),
    totalHelpful: data.reduce((sum, article) => sum + article.helpful_count, 0),
    mostViewed: data.sort((a, b) => b.view_count - a.view_count).slice(0, 5)
  }
}

// =====================================================
// 8. NOTIFICATION FUNCTIONS
// =====================================================

export const createNotification = async (notificationData: {
  user_id?: string
  type: string
  title: string
  message: string
  data?: any
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notificationData,
        user_id: notificationData.user_id || user?.id
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

export const getNotifications = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return []
  }
}

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

// =====================================================
// 9. DASHBOARD DATA FUNCTIONS
// =====================================================

export const getCustomerDashboardData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const [tickets, ratings, notifications] = await Promise.all([
      getCustomerTickets(),
      supabase.from('customer_ratings').select('*').eq('customer_id', user.id),
      getNotifications()
    ])

    return {
      tickets: {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        approved: tickets.filter(t => t.approval_status === 'approved').length,
        pending: tickets.filter(t => t.approval_status === 'pending').length
      },
      ratings: {
        total: ratings.data?.length || 0,
        average: ratings.data?.reduce((sum, r) => sum + r.rating, 0) / (ratings.data?.length || 1) || 0
      },
      notifications: {
        unread: notifications.filter(n => !n.is_read).length,
        recent: notifications.slice(0, 5)
      }
    }
  } catch (error) {
    console.error('Error fetching customer dashboard data:', error)
    return null
  }
}

export const getAdminDashboardData = async () => {
  try {
    const [tickets, workflows, rules, analytics] = await Promise.all([
      getAdminTickets(),
      getWorkflowInstances(),
      getRuleEngineRules(),
      getAnalyticsData('tickets')
    ])

    return {
      tickets: {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        pendingApproval: tickets.filter(t => t.approval_status === 'pending').length,
        approved: tickets.filter(t => t.approval_status === 'approved').length
      },
      workflows: {
        total: workflows.length,
        active: workflows.filter(w => w.status === 'in_progress').length,
        completed: workflows.filter(w => w.status === 'completed').length,
        failed: workflows.filter(w => w.status === 'failed').length
      },
      rules: {
        total: rules.length,
        active: rules.filter(r => r.is_active).length
      },
      analytics
    }
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error)
    return null
  }
}
