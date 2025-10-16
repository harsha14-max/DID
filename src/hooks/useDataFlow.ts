// =====================================================
// BSM Platform - Data Flow React Hooks
// =====================================================
// This file contains React hooks for managing the complete data flow system

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import * as dataflowAPI from '@/lib/api/dataflow'

// =====================================================
// 1. SERVICES AND ASSETS HOOKS
// =====================================================

export const useServices = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await dataflowAPI.getVisibleServices()
      setServices(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  return { services, loading, error, refetch: fetchServices }
}

export const useServiceCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const data = await dataflowAPI.getServiceCategories()
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { categories, loading, refetch: fetchCategories }
}

// =====================================================
// 2. TICKET MANAGEMENT HOOKS
// =====================================================

export const useTickets = (userRole: 'admin' | 'customer') => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = userRole === 'admin' 
        ? await dataflowAPI.getAdminTickets()
        : await dataflowAPI.getCustomerTickets()
      setTickets(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userRole])

  const createTicket = useCallback(async (ticketData) => {
    try {
      const newTicket = await dataflowAPI.createTicket(ticketData)
      setTickets(prev => [newTicket, ...prev])
      return newTicket
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const approveTicket = useCallback(async (ticketId, approved) => {
    try {
      const updatedTicket = await dataflowAPI.approveTicket(ticketId, approved)
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, ...updatedTicket } : ticket
      ))
      return updatedTicket
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  return { 
    tickets, 
    loading, 
    error, 
    createTicket, 
    approveTicket, 
    refetch: fetchTickets 
  }
}

// =====================================================
// 3. WORKFLOW MANAGEMENT HOOKS
// =====================================================

export const useWorkflows = () => {
  const [templates, setTemplates] = useState([])
  const [instances, setInstances] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTemplates = useCallback(async () => {
    try {
      const data = await dataflowAPI.getWorkflowTemplates()
      setTemplates(data)
    } catch (err) {
      console.error('Error fetching workflow templates:', err)
    }
  }, [])

  const fetchInstances = useCallback(async (ticketId?: string) => {
    try {
      setLoading(true)
      const data = await dataflowAPI.getWorkflowInstances(ticketId)
      setInstances(data)
    } catch (err) {
      console.error('Error fetching workflow instances:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const executeWorkflowStep = useCallback(async (instanceId, stepData) => {
    try {
      const updatedInstance = await dataflowAPI.executeWorkflowStep(instanceId, stepData)
      setInstances(prev => prev.map(instance => 
        instance.id === instanceId ? { ...instance, ...updatedInstance } : instance
      ))
      return updatedInstance
    } catch (err) {
      console.error('Error executing workflow step:', err)
      throw err
    }
  }, [])

  useEffect(() => {
    fetchTemplates()
    fetchInstances()
  }, [fetchTemplates, fetchInstances])

  return { 
    templates, 
    instances, 
    loading, 
    executeWorkflowStep, 
    refetchInstances: fetchInstances 
  }
}

// =====================================================
// 4. RULE ENGINE HOOKS
// =====================================================

export const useRuleEngine = () => {
  const [rules, setRules] = useState([])
  const [executionLog, setExecutionLog] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRules = useCallback(async () => {
    try {
      const data = await dataflowAPI.getRuleEngineRules()
      setRules(data)
    } catch (err) {
      console.error('Error fetching rules:', err)
    }
  }, [])

  const fetchExecutionLog = useCallback(async (ticketId?: string) => {
    try {
      setLoading(true)
      const data = await dataflowAPI.getRuleExecutionLog(ticketId)
      setExecutionLog(data)
    } catch (err) {
      console.error('Error fetching execution log:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createRule = useCallback(async (ruleData) => {
    try {
      const newRule = await dataflowAPI.createRuleEngineRule(ruleData)
      setRules(prev => [newRule, ...prev])
      return newRule
    } catch (err) {
      console.error('Error creating rule:', err)
      throw err
    }
  }, [])

  useEffect(() => {
    fetchRules()
    fetchExecutionLog()
  }, [fetchRules, fetchExecutionLog])

  return { 
    rules, 
    executionLog, 
    loading, 
    createRule, 
    refetchRules: fetchRules,
    refetchExecutionLog: fetchExecutionLog
  }
}

// =====================================================
// 5. KNOWLEDGE BASE HOOKS
// =====================================================

export const useKnowledgeBase = () => {
  const [articles, setArticles] = useState([])
  const [featuredArticles, setFeaturedArticles] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchArticles = useCallback(async (categoryId?: string) => {
    try {
      setLoading(true)
      const data = await dataflowAPI.getKnowledgeBaseArticles(categoryId)
      setArticles(data)
    } catch (err) {
      console.error('Error fetching articles:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchFeaturedArticles = useCallback(async () => {
    try {
      const data = await dataflowAPI.getFeaturedKnowledgeBaseArticles()
      setFeaturedArticles(data)
    } catch (err) {
      console.error('Error fetching featured articles:', err)
    }
  }, [])

  const trackView = useCallback(async (articleId) => {
    try {
      await dataflowAPI.trackKnowledgeBaseView(articleId)
    } catch (err) {
      console.error('Error tracking view:', err)
    }
  }, [])

  useEffect(() => {
    fetchArticles()
    fetchFeaturedArticles()
  }, [fetchArticles, fetchFeaturedArticles])

  return { 
    articles, 
    featuredArticles, 
    loading, 
    trackView, 
    refetch: fetchArticles 
  }
}

// =====================================================
// 6. RATING AND REVIEW HOOKS
// =====================================================

export const useRatings = () => {
  const [ratings, setRatings] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRatings = useCallback(async () => {
    try {
      setLoading(true)
      // This would fetch user's own ratings
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('customer_ratings')
          .select('*')
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false })
        setRatings(data || [])
      }
    } catch (err) {
      console.error('Error fetching ratings:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchReviews = useCallback(async (serviceId?: string) => {
    try {
      const data = await dataflowAPI.getServiceReviews(serviceId)
      setReviews(data)
    } catch (err) {
      console.error('Error fetching reviews:', err)
    }
  }, [])

  const createRating = useCallback(async (ratingData) => {
    try {
      const newRating = await dataflowAPI.createRating(ratingData)
      setRatings(prev => [newRating, ...prev])
      return newRating
    } catch (err) {
      console.error('Error creating rating:', err)
      throw err
    }
  }, [])

  useEffect(() => {
    fetchRatings()
    fetchReviews()
  }, [fetchRatings, fetchReviews])

  return { 
    ratings, 
    reviews, 
    loading, 
    createRating, 
    refetchRatings: fetchRatings,
    refetchReviews: fetchReviews
  }
}

// =====================================================
// 7. ANALYTICS HOOKS
// =====================================================

export const useAnalytics = (type: string, filters: any = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const analyticsData = await dataflowAPI.getAnalyticsData(type, filters)
      setData(analyticsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [type, filters])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return { data, loading, error, refetch: fetchAnalytics }
}

// =====================================================
// 8. NOTIFICATION HOOKS
// =====================================================

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      const data = await dataflowAPI.getNotifications()
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.is_read).length)
    } catch (err) {
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await dataflowAPI.markNotificationAsRead(notificationId)
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, is_read: true, read_at: new Date().toISOString() }
          : notification
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    
    // Set up real-time subscription for notifications
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const subscription = supabase
          .channel('notifications')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          }, (payload) => {
            setNotifications(prev => [payload.new, ...prev])
            setUnreadCount(prev => prev + 1)
          })
          .subscribe()

        return () => {
          subscription.unsubscribe()
        }
      }
    }

    const cleanup = setupSubscription()
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.())
    }
  }, [fetchNotifications])

  return { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    refetch: fetchNotifications 
  }
}

// =====================================================
// 9. DASHBOARD DATA HOOKS
// =====================================================

export const useDashboardData = (userRole: 'admin' | 'customer') => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = userRole === 'admin' 
        ? await dataflowAPI.getAdminDashboardData()
        : await dataflowAPI.getCustomerDashboardData()
      setDashboardData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userRole])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return { 
    dashboardData, 
    loading, 
    error, 
    refetch: fetchDashboardData 
  }
}

// =====================================================
// 10. COMPREHENSIVE DATA FLOW HOOK
// =====================================================

export const useDataFlow = () => {
  const { user } = useAuth()
  const userRole = user?.role || 'customer'

  // All the individual hooks
  const services = useServices()
  const categories = useServiceCategories()
  const tickets = useTickets(userRole)
  const workflows = useWorkflows()
  const ruleEngine = useRuleEngine()
  const knowledgeBase = useKnowledgeBase()
  const ratings = useRatings()
  const notifications = useNotifications()
  const dashboardData = useDashboardData(userRole)

  // Analytics hooks for different types
  const ticketAnalytics = useAnalytics('tickets')
  const serviceAnalytics = useAnalytics('services')
  const ratingAnalytics = useAnalytics('ratings')
  const workflowAnalytics = useAnalytics('workflows')
  const knowledgeBaseAnalytics = useAnalytics('knowledge_base')

  return {
    // User context
    userRole,
    
    // Core data hooks
    services,
    categories,
    tickets,
    workflows,
    ruleEngine,
    knowledgeBase,
    ratings,
    notifications,
    dashboardData,
    
    // Analytics
    analytics: {
      tickets: ticketAnalytics,
      services: serviceAnalytics,
      ratings: ratingAnalytics,
      workflows: workflowAnalytics,
      knowledgeBase: knowledgeBaseAnalytics
    },
    
    // Combined loading state
    loading: services.loading || tickets.loading || workflows.loading || 
             ruleEngine.loading || knowledgeBase.loading || ratings.loading || 
             notifications.loading || dashboardData.loading,
    
    // Combined error state
    error: services.error || tickets.error || dashboardData.error
  }
}
