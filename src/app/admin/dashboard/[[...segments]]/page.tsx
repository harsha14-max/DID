'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Home, MessageSquare, Users, Package, Shield, RotateCcw,
  BarChart3, BookOpen, Settings, RefreshCw, Download,
  ChevronDown, ChevronRight, User, Clock, AlertTriangle, CheckCircle, Plus, Search, Filter, Eye, Edit, MoreHorizontal, X, Server, Star, LogOut, CreditCard,
  DollarSign, TrendingUp, FileText, Activity, CheckCircle2, Timer, ClipboardList, Bell, Phone, Mail, Globe, XCircle, Zap, Monitor, HardDrive, Wifi, Mouse, Keyboard, Printer, Play, Info, Copy, Trash2, Save, Undo, Redo, Minus, Grid3X3, List, ArrowDown, ArrowRight, ChevronLeft, Building2, History
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

// Import page components directly for inline rendering
import AnalyticsPage from '@/components/pages/admin/analytics'
import LendersPage from '@/components/pages/admin/assets'
import RulesEnginePage from '@/components/pages/admin/rules-engine'
import WorkflowPage from '@/components/pages/admin/workflows'
import KnowledgePage from '@/components/pages/admin/knowledge'
import SettingsPage from '@/components/pages/admin/settings'

// Import Credit Identity components
import DIDManagement from '@/components/admin/credit-identity/DIDManagement'
import CredentialIssuance from '@/components/admin/credit-identity/CredentialIssuance'
import LenderManagement from '@/components/admin/credit-identity/LenderManagement'
import CreditAnalytics from '@/components/admin/credit-identity/CreditAnalytics'
import CreditIdentityDashboard from '@/components/admin/credit-identity/CreditIdentityDashboard'
import VCVerificationQueue from '@/components/admin/credit-identity/VCVerificationQueue'
import VCTemplatesManagement from '@/components/admin/credit-identity/VCTemplatesManagement'
import CredentialManagement from '@/components/admin/credit-identity/CredentialManagement'
import UserCreditProfiles from '@/components/admin/credit-identity/UserCreditProfiles'
import UserApproval from '@/components/admin/credit-identity/UserApproval'
import WorkflowBuilder from '@/components/admin/WorkflowBuilder'

export default function AdminDashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading: authLoading, signOut } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({})
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activeSubTab, setActiveSubTab] = useState('')
  const [dashboardData, setDashboardData] = useState({
    todayTickets: 0,
    resolvedToday: 0,
    avgResponse: 0,
    satisfaction: 0,
    activeTickets: 0,
    clientAccounts: 0,
    itAssets: 0,
    responseTime: 0,
    systemHealth: 0,
    uptime: 0,
    securityAlerts: 0,
    performanceScore: 0,
    slaCompliance: 0,
    knowledgeBaseArticles: 0,
    workflowsActive: 0,
    teamMembers: 0,
    projectsActive: 0,
    budgetUtilized: 0,
    complianceScore: 0,
    trainingCompleted: 0,
    incidentsResolved: 0,
    preventiveMaintenance: 0,
    vendorManagement: 0,
    disasterRecovery: 0,
    dataBackup: 0,
    networkSecurity: 0,
    endpointProtection: 0,
    // New loan application metrics
    pendingLoanApplications: 0,
    approvedLoans: 0,
    rejectedLoans: 0,
    totalLoanAmount: 0,
    avgApprovalTime: 0,
    // Credit identity metrics
    didsGenerated: 0,
    vcsIssued: 0,
    pendingVcVerifications: 0,
    zkpProofsGenerated: 0,
    // Lender activity metrics
    totalActiveLenders: 0,
    newLendersThisMonth: 0,
    totalLendingCapacity: 0,
    // User activity metrics
    newUsersThisMonth: 0,
    activeUsersToday: 0,
    userGrowthRate: 0,
    // Digital wallet metrics
    totalWalletBalance: 0,
    transactionsProcessed: 0,
    vcRequestsSubmitted: 0,
  })
  const [tickets, setTickets] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Determine active tab and sub-tab from pathname
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean)
    const tab = segments[2] || 'dashboard'
    const subTab = segments[3] || ''
    
    setActiveTab(tab)
    setActiveSubTab(subTab)
  }, [pathname])

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  // Add timeout for loading state
  useEffect(() => {
    if (authLoading) {
      const timeout = setTimeout(() => {
        console.log('Auth loading timeout - redirecting to login')
        router.push('/auth/login')
      }, 5000) // 5 second timeout

      return () => clearTimeout(timeout)
    }
  }, [authLoading, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch analytics data from Supabase
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('analytics')
        .select('metric_name, metric_value')

      // Fetch counts from other tables
      const { count: totalTicketsCount, error: ticketsCountError } = await supabase.from('tickets').select('*', { count: 'exact', head: true })
      const { count: resolvedTicketsCount, error: resolvedTicketsCountError } = await supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'resolved')
      const { count: usersCount, error: usersCountError } = await supabase.from('users').select('*', { count: 'exact', head: true })
      const { count: knowledgeCount, error: knowledgeCountError } = await supabase.from('knowledge_base').select('*', { count: 'exact', head: true })
      const { count: workflowsCount, error: workflowsCountError } = await supabase.from('workflows').select('*', { count: 'exact', head: true })
      const { count: assetsCount, error: assetsCountError } = await supabase.from('assets').select('*', { count: 'exact', head: true })
      const { count: accountsCount, error: accountsCountError } = await supabase.from('accounts').select('*', { count: 'exact', head: true })
      
      // Fetch loan application data
      const { count: pendingLoansCount, error: pendingLoansError } = await supabase.from('loan_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      const { count: approvedLoansCount, error: approvedLoansError } = await supabase.from('loan_applications').select('*', { count: 'exact', head: true }).eq('status', 'approved')
      const { count: rejectedLoansCount, error: rejectedLoansError } = await supabase.from('loan_applications').select('*', { count: 'exact', head: true }).eq('status', 'rejected')
      
      // Fetch lender data
      const { count: lendersCount, error: lendersError } = await supabase.from('lenders').select('*', { count: 'exact', head: true })
      
      // Fetch user wallet data
      const { data: walletData, error: walletError } = await supabase.from('user_wallets').select('balance')

      if (analyticsError || ticketsCountError || resolvedTicketsCountError || usersCountError || knowledgeCountError || workflowsCountError || assetsCountError || accountsCountError || pendingLoansError || approvedLoansError || rejectedLoansError || lendersError || walletError) {
        console.error('Error fetching dashboard data:', { analyticsError, ticketsCountError, resolvedTicketsCountError, usersCountError, knowledgeCountError, workflowsCountError, assetsCountError, accountsCountError, pendingLoansError, approvedLoansError, rejectedLoansError, lendersError, walletError })
        toast.error('Failed to load dashboard data. Please try again.')
        return
      }

      const getMetricValue = (name: string) => analyticsData?.find(a => a.metric_name === name)?.metric_value || 0

      // Calculate total wallet balance
      const totalWalletBalance = walletData?.reduce((sum, wallet) => sum + (wallet.balance || 0), 0) || 0

      setDashboardData({
        todayTickets: totalTicketsCount || 0,
        resolvedToday: resolvedTicketsCount || 0,
        avgResponse: getMetricValue('average_response_time'),
        satisfaction: getMetricValue('customer_satisfaction'),
        activeTickets: (totalTicketsCount || 0) - (resolvedTicketsCount || 0),
        clientAccounts: accountsCount || 0,
        itAssets: assetsCount || 0,
        responseTime: getMetricValue('response_time'),
        systemHealth: getMetricValue('system_health'),
        uptime: getMetricValue('uptime'),
        securityAlerts: getMetricValue('security_alerts'),
        performanceScore: getMetricValue('performance_score'),
        slaCompliance: getMetricValue('sla_compliance'),
        knowledgeBaseArticles: knowledgeCount || 0,
        workflowsActive: workflowsCount || 0,
        teamMembers: usersCount || 0,
        projectsActive: getMetricValue('projects_active'),
        budgetUtilized: getMetricValue('budget_utilized'),
        complianceScore: getMetricValue('compliance_score'),
        trainingCompleted: getMetricValue('training_completed'),
        incidentsResolved: getMetricValue('incidents_resolved'),
        preventiveMaintenance: getMetricValue('preventive_maintenance'),
        vendorManagement: getMetricValue('vendor_management'),
        disasterRecovery: getMetricValue('disaster_recovery'),
        dataBackup: getMetricValue('data_backup'),
        networkSecurity: getMetricValue('network_security'),
        endpointProtection: getMetricValue('endpoint_protection'),
        // New loan application metrics
        pendingLoanApplications: pendingLoansCount || 0,
        approvedLoans: approvedLoansCount || 0,
        rejectedLoans: rejectedLoansCount || 0,
        totalLoanAmount: getMetricValue('total_loan_amount'),
        avgApprovalTime: getMetricValue('avg_approval_time'),
        // Credit identity metrics
        didsGenerated: getMetricValue('dids_generated'),
        vcsIssued: getMetricValue('vcs_issued'),
        pendingVcVerifications: getMetricValue('pending_vc_verifications'),
        zkpProofsGenerated: getMetricValue('zkp_proofs_generated'),
        // Lender activity metrics
        totalActiveLenders: lendersCount || 0,
        newLendersThisMonth: getMetricValue('new_lenders_this_month'),
        totalLendingCapacity: getMetricValue('total_lending_capacity'),
        // User activity metrics
        newUsersThisMonth: getMetricValue('new_users_this_month'),
        activeUsersToday: getMetricValue('active_users_today'),
        userGrowthRate: getMetricValue('user_growth_rate'),
        // Digital wallet metrics
        totalWalletBalance: totalWalletBalance,
        transactionsProcessed: getMetricValue('transactions_processed'),
        vcRequestsSubmitted: getMetricValue('vc_requests_submitted'),
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true)

      let query = supabase
        .from('tickets')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          category,
          created_at,
          updated_at,
          resolved_at,
          created_by,
          assigned_to,
          approval_method,
          approved_at,
          approved_by,
          creator:created_by(full_name, email),
          assignee:assigned_to(full_name, email)
        `)
        .order('created_at', { ascending: false })

      if (activeSubTab !== '' && activeSubTab !== 'all') {
        query = query.eq('status', activeSubTab.replace(/-/g, '_'))
      }

      const { data: ticketsData, error } = await query

      if (error) {
        console.error('Error fetching tickets:', error)
        setTickets([])
        toast.error('Failed to load tickets. Please try again.')
        return
      }

      const transformedTickets = ticketsData?.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category,
        assignee: (ticket.assignee as any)?.full_name || 'Unassigned',
        requester: (ticket.creator as any)?.full_name || 'Unknown',
        created: ticket.created_at,
        updated: ticket.updated_at,
        resolved_at: ticket.resolved_at,
        approval_type: ticket.approval_method || 'automated',
        approved_at: ticket.approved_at,
        approved_by: ticket.approved_by
      })) || []

      setTickets(transformedTickets)
      console.log('Tickets loaded from Supabase:', transformedTickets.length)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }, [activeSubTab])

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)

      let query = supabase
        .from('users')
        .select('id, email, role, full_name, avatar_url, is_verified, last_login, created_at')
        .order('created_at', { ascending: false })

      if (activeSubTab !== '' && activeSubTab !== 'all') {
        query = query.eq('role', activeSubTab.replace(/-/g, '_'))
      }

      const { data: usersData, error } = await query

      if (error) {
        console.error('Error fetching users:', error)
        setUsers([])
        toast.error('Failed to load users. Please try again.')
        return
      }

      setUsers(usersData || [])
      console.log('Users loaded from Supabase:', usersData?.length || 0)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [activeSubTab])

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData()
    } else if (activeTab === 'tickets') {
      fetchTickets()
    } else if (activeTab === 'users') {
      fetchUsers()
    }
  }, [activeTab, activeSubTab, fetchTickets, fetchUsers])

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
          <p className="mt-2 text-sm text-gray-500">Checking authentication...</p>
          <p className="mt-1 text-xs text-gray-400">If this takes too long, you'll be redirected to login</p>
        </div>
      </div>
    )
  }

  // Don't render if user is not admin
  if (!user || user.role !== 'admin') {
    return null
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tickets', label: 'Tickets', icon: MessageSquare },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'assets', label: 'Lenders', icon: Package },
    { id: 'rules', label: 'Rules Engine', icon: Shield },
    { id: 'workflow', label: 'Workflow', icon: RotateCcw },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'credit-identity', label: 'Credit Identity', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const subTabs: { [key: string]: { id: string; label: string }[] } = {
    tickets: [
      { id: 'all', label: 'All Tickets' },
      { id: 'open', label: 'Open' },
      { id: 'in-progress', label: 'In Progress' },
      { id: 'resolved', label: 'Resolved' },
      { id: 'closed', label: 'Closed' }
    ],
    users: [
      { id: 'all', label: 'All Users' },
      { id: 'admins', label: 'Administrators' },
      { id: 'agents', label: 'Agents' },
      { id: 'customers', label: 'Customers' },
      { id: 'groups', label: 'Groups' }
    ],
    assets: [
      { id: 'all', label: 'All Assets' },
      { id: 'hardware', label: 'Hardware' },
      { id: 'software', label: 'Software' },
      { id: 'network', label: 'Network' },
      { id: 'peripheral', label: 'Peripheral' }
    ],
    rules: [
      { id: 'automation', label: 'Automation Rules' },
      { id: 'escalation', label: 'Escalation Rules' },
      { id: 'notification', label: 'Notification Rules' },
      { id: 'approval', label: 'Approval Rules' }
    ],
    workflow: [
      { id: 'ticket-workflow', label: 'Ticket Workflows' },
      { id: 'approval-workflow', label: 'Approval Workflows' },
      { id: 'onboarding', label: 'Onboarding' },
      { id: 'offboarding', label: 'Offboarding' },
      { id: 'custom', label: 'Custom Workflows' },
      { id: 'workflow-builder', label: 'Workflow Builder' }
    ],
    analytics: [
      { id: 'ticket-analytics', label: 'Ticket Analytics' },
      { id: 'performance', label: 'Performance Metrics' },
      { id: 'satisfaction', label: 'Customer Satisfaction' },
      { id: 'reports', label: 'System Reports' }
    ],
    knowledge: [
      { id: 'articles', label: 'Articles' },
      { id: 'faqs', label: 'FAQs' },
      { id: 'troubleshooting', label: 'Troubleshooting' },
      { id: 'guides', label: 'User Guides' },
      { id: 'videos', label: 'Video Tutorials' },
      { id: 'categories', label: 'Categories' }
    ],
      'credit-identity': [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'verification-queue', label: 'Verification Queue' },
        { id: 'user-approval', label: 'User Approval' },
        { id: 'vc-templates', label: 'VC Templates' },
        { id: 'issue-credentials', label: 'Issue Credentials' },
        { id: 'credential-management', label: 'Credential Management' },
        { id: 'user-credit-profiles', label: 'User Credit Profiles' },
        { id: 'lender-network', label: 'Lender Network' },
        { id: 'system-analytics', label: 'System Analytics' }
      ],
    settings: [
      { id: 'general', label: 'General' },
      { id: 'security', label: 'Security' },
      { id: 'notifications', label: 'Notifications' },
      { id: 'backup', label: 'Backup' },
      { id: 'maintenance', label: 'Maintenance' },
      { id: 'system-info', label: 'System Info' }
    ]
  }

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    setActiveSubTab('')
    
    // Update URL without page reload
    const newPath = `/admin/dashboard/${tabId}`
    router.push(newPath, { scroll: false })
    
    if (subTabs[tabId as keyof typeof subTabs]) {
      setExpandedMenus(prev => ({
        ...prev,
        [tabId]: !prev[tabId]
      }))
    }
  }

  const handleSubTabClick = (subTabId: string) => {
    setActiveSubTab(subTabId)
    
    // Update URL with sub-tab
    const newPath = `/admin/dashboard/${activeTab}/${subTabId}`
    router.push(newPath, { scroll: false })
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleTicketApproval = async (ticketId: string, action: 'approved' | 'rejected') => {
    try {
      // Update ticket status in Supabase
      const { error } = await supabase
        .from('tickets')
        .update({ 
          status: action === 'approved' ? 'approved' : 'rejected',
          approval_method: 'manual',
          approved_at: new Date().toISOString(),
          approved_by: user?.id || 'admin'
        })
        .eq('id', ticketId)

      if (error) {
        console.error('Error updating ticket:', error)
        toast.error('Failed to update ticket status')
        return
      }

      // Update local state
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === ticketId 
              ? { 
                ...ticket, 
                status: action === 'approved' ? 'approved' : 'rejected',
                approval_type: 'manual',
                approved_at: new Date().toISOString(),
                approved_by: user?.id || 'admin'
              }
            : ticket
        )
      )

      toast.success(`Ticket ${action} successfully!`)
    } catch (error) {
      console.error('Error handling ticket approval:', error)
      toast.error('Failed to process ticket approval')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-purple-100 text-purple-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  )
}

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{dashboardData.todayTickets}</div>
            <p className="text-xs text-muted-foreground">
                Total tickets in the system
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Tickets</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{dashboardData.resolvedToday}</div>
            <p className="text-xs text-muted-foreground">
                {dashboardData.todayTickets > 0 ? Math.floor((dashboardData.resolvedToday / dashboardData.todayTickets) * 100) : 0}% resolution rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{dashboardData.avgResponse}m</div>
            <p className="text-xs text-muted-foreground">
                Average time to first response
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{dashboardData.satisfaction}%</div>
            <p className="text-xs text-muted-foreground">
                Overall customer satisfaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current system performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">System Health</span>
              </div>
                <Badge className="bg-green-100 text-green-800">{dashboardData.systemHealth}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Uptime</span>
              </div>
                <Badge className="bg-blue-100 text-blue-800">{dashboardData.uptime}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Security Alerts</span>
              </div>
                <Badge className="bg-yellow-100 text-yellow-800">{dashboardData.securityAlerts}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Performance Score</span>
              </div>
                <Badge className="bg-purple-100 text-purple-800">{dashboardData.performanceScore}%</Badge>
            </div>
          </CardContent>
        </Card>

          {/* Quick Stats */}
        <Card>
          <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Overview of key operational numbers</CardDescription>
          </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Tickets</p>
                <p className="text-2xl font-bold">{dashboardData.activeTickets}</p>
                </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Client Accounts</p>
                <p className="text-2xl font-bold">{dashboardData.clientAccounts}</p>
                </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">IT Assets</p>
                <p className="text-2xl font-bold">{dashboardData.itAssets}</p>
                </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Knowledge Articles</p>
                <p className="text-2xl font-bold">{dashboardData.knowledgeBaseArticles}</p>
                </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Workflows</p>
                <p className="text-2xl font-bold">{dashboardData.workflowsActive}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold">{dashboardData.teamMembers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Platform-Specific Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Applications Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Loan Applications Overview
            </CardTitle>
            <CardDescription>Current loan application status and metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{dashboardData.pendingLoanApplications}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{dashboardData.approvedLoans}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{dashboardData.rejectedLoans}</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-sm text-gray-600">Total Amount Processed</div>
              <div className="font-semibold">${dashboardData.totalLoanAmount.toLocaleString()}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Avg Approval Time</div>
              <div className="font-semibold">{dashboardData.avgApprovalTime}h</div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Identity Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Credit Identity Metrics
            </CardTitle>
            <CardDescription>DID and VC management statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{dashboardData.didsGenerated}</div>
                <div className="text-sm text-gray-600">DIDs Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{dashboardData.vcsIssued}</div>
                <div className="text-sm text-gray-600">VCs Issued</div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-sm text-gray-600">Pending VC Verifications</div>
              <Badge variant="secondary">{dashboardData.pendingVcVerifications}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">ZKP Proofs Generated</div>
              <div className="font-semibold">{dashboardData.zkpProofsGenerated}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Lender Activity and User Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lender Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600" />
              Lender Activity Summary
            </CardTitle>
            <CardDescription>Lender network and capacity metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Total Active Lenders</div>
              <div className="text-2xl font-bold text-indigo-600">{dashboardData.totalActiveLenders}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">New Lenders This Month</div>
              <div className="font-semibold text-green-600">+{dashboardData.newLendersThisMonth}</div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-sm text-gray-600">Total Lending Capacity</div>
              <div className="font-semibold">${dashboardData.totalLendingCapacity.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>

        {/* User Registration & Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              User Registration & Activity
            </CardTitle>
            <CardDescription>User growth and engagement metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">New Users This Month</div>
              <div className="text-2xl font-bold text-green-600">{dashboardData.newUsersThisMonth}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Active Users Today</div>
              <div className="font-semibold">{dashboardData.activeUsersToday}</div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-sm text-gray-600">User Growth Rate</div>
              <div className="font-semibold text-green-600">+{dashboardData.userGrowthRate}%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fourth Row - Digital Wallet and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Digital Wallet Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Digital Wallet Statistics
            </CardTitle>
            <CardDescription>Wallet balance and transaction metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Total Wallet Balance</div>
              <div className="text-2xl font-bold text-emerald-600">${dashboardData.totalWalletBalance.toLocaleString()}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Transactions Processed</div>
              <div className="font-semibold">{dashboardData.transactionsProcessed}</div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-sm text-gray-600">VC Requests Submitted</div>
              <div className="font-semibold">{dashboardData.vcRequestsSubmitted}</div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              Recent Activity Feed
            </CardTitle>
            <CardDescription>Latest platform activities and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <div className="text-sm font-medium">Loan Application Approved</div>
                <div className="text-xs text-gray-600">$5,000 approved for John Doe</div>
              </div>
              <div className="text-xs text-gray-500">2m ago</div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
              <User className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <div className="text-sm font-medium">New User Registered</div>
                <div className="text-xs text-gray-600">Jane Smith joined the platform</div>
              </div>
              <div className="text-xs text-gray-500">5m ago</div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
              <Shield className="h-4 w-4 text-purple-600" />
              <div className="flex-1">
                <div className="text-sm font-medium">DID Generated</div>
                <div className="text-xs text-gray-600">New decentralized identity created</div>
              </div>
              <div className="text-xs text-gray-500">8m ago</div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
              <Bell className="h-4 w-4 text-yellow-600" />
              <div className="flex-1">
                <div className="text-sm font-medium">System Notification</div>
                <div className="text-xs text-gray-600">New lender added to network</div>
              </div>
              <div className="text-xs text-gray-500">12m ago</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

  const renderTicketsContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
            <div>
          <h2 className="text-2xl font-bold text-gray-900">Ticket Management</h2>
            <p className="text-gray-600">Manage all customer support tickets</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
            </div>
          </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{tickets.length}</div>
            </CardContent>
          </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold text-green-600">
              {tickets.filter(t => t.status === 'open').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {tickets.filter(t => t.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold text-purple-600">
              {tickets.filter(t => t.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
                </div>
        </CardContent>
      </Card>

      {/* Human Approval Chamber */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Human Approval Chamber</span>
          </CardTitle>
          <CardDescription>
            Tickets requiring manual review (failed rule engine validation)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.filter(ticket => ticket.status === 'pending_approval').map((ticket: any) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                    <p className="text-sm text-gray-600">{ticket.description.substring(0, 80)}...</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>Requester: {ticket.requester}</span>
                      <span>Category: {ticket.category}</span>
                      <span>Created: {new Date(ticket.created).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    onClick={() => handleTicketApproval(ticket.id, 'approved')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    onClick={() => handleTicketApproval(ticket.id, 'rejected')}
                    variant="destructive"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
            {tickets.filter(ticket => ticket.status === 'pending_approval').length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets pending approval</h3>
                <p className="text-gray-600">All tickets have been processed by the rule engine</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Approval History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5 text-purple-600" />
            <span>Approval History</span>
          </CardTitle>
          <CardDescription>
            Complete history of ticket approvals and rejections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ticket Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date Created</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Approval Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Approval Type</th>
                </tr>
              </thead>
              <tbody>
                {tickets.filter(ticket => ticket.status === 'approved' || ticket.status === 'rejected').map((ticket: any) => (
                  <tr key={ticket.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{ticket.title}</div>
                      <div className="text-sm text-gray-600">{ticket.description.substring(0, 50)}...</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(ticket.created).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={
                        ticket.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={
                        ticket.approval_type === 'automated' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }>
                        {ticket.approval_type === 'manual' ? 'Human' : 'Auto'}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {tickets.filter(ticket => ticket.status === 'approved' || ticket.status === 'rejected').length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      No approval history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
          <CardDescription>
            Showing {filteredTickets.length} tickets
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
              {filteredTickets.map((ticket: any) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-gray-600" />
                    </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                      <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace(/_/g, ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                      <p className="text-sm text-gray-600">{ticket.description.substring(0, 100)}...</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>Requester: {ticket.requester}</span>
                      <span>Assignee: {ticket.assignee}</span>
                        <span>Category: {ticket.category}</span>
                        <span>Created: {new Date(ticket.created).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
            </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
              </div>
            ))}
              {filteredTickets.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
              )}
            </div>
        </CardContent>
      </Card>
              </div>
    )
  }

  const renderUsersContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  )
  }

  const filteredUsers = users.filter(user => {
      const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.role.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })

  return (
    <div className="space-y-6">
      {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600">Manage system users and permissions</p>
                    </div>
        <div className="flex items-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
                  </div>
                  </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <User className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.role === 'admin').length}
                </div>
              </CardContent>
            </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agents</CardTitle>
            <User className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.role === 'agent').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <User className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === 'customer').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
                    <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                    </div>
                  </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
                </div>
              </CardContent>
            </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Showing {filteredUsers.length} users
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                  </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{user.full_name || 'Unknown'}</h3>
                        <Badge className={user.role === 'admin' ? 'bg-red-100 text-red-800' : user.role === 'agent' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}>
                          {user.role}
                        </Badge>
                        {user.is_verified && (
                          <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
                        )}
                  </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>ID: {user.id}</span>
                        <span>Created: {new Date(user.created_at).toLocaleDateString()}</span>
                        <span>Last Login: {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</span>
                </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
              </CardContent>
            </Card>
    </div>
  )
  }

  const renderCreditIdentityContent = () => {
    switch (activeSubTab) {
      case 'dashboard':
        return <CreditIdentityDashboard />
      case 'verification-queue':
        return <VCVerificationQueue />
      case 'user-approval':
        return <UserApproval />
      case 'vc-templates':
        return <VCTemplatesManagement />
      case 'issue-credentials':
        return <CredentialIssuance userId={user?.id || ''} />
      case 'credential-management':
        return <CredentialManagement />
      case 'user-credit-profiles':
        return <UserCreditProfiles />
      case 'lender-network':
        return <LenderManagement userId={user?.id || ''} />
      case 'system-analytics':
        return <CreditAnalytics userId={user?.id || ''} />
      default:
        return <CreditIdentityDashboard />
    }
  }

  const renderWorkflowContent = () => {
    switch (activeSubTab) {
      case 'workflow-builder':
        return <WorkflowBuilder />
      default:
        return <WorkflowPage />
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardContent()
      case 'tickets':
        return renderTicketsContent()
      case 'users':
        return renderUsersContent()
      case 'analytics':
        return <AnalyticsPage />
      case 'assets':
        return <LendersPage />
      case 'rules':
        return <RulesEnginePage />
      case 'workflow':
        return renderWorkflowContent()
      case 'knowledge':
        return <KnowledgePage />
      case 'credit-identity':
        return renderCreditIdentityContent()
      case 'settings':
        return <SettingsPage />
      default:
  return (
                <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
            <p className="text-gray-600">This section is under development</p>
    </div>
  )
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 admin-dashboard">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col admin-sidebar">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">BSM Platform</h1>
          <p className="text-sm text-gray-600">Admin Dashboard</p>
          </div>

        <nav className="mt-6 flex-1 overflow-y-auto scrollable" data-lenis-prevent>
          {tabs.map((tab: any) => {
            const Icon = tab.icon
            return (
              <div key={tab.id}>
                <button
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                    activeTab === tab.id ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.label}
                  {subTabs[tab.id as keyof typeof subTabs] && (
                    <div className="ml-auto">
                      {expandedMenus[tab.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                  )}
                </div>
          )}
                </button>

                {/* Sub-tabs */}
                {expandedMenus[tab.id] && subTabs[tab.id as keyof typeof subTabs] && (
                  <div className="bg-gray-50">
                    {subTabs[tab.id as keyof typeof subTabs].map((subTab: any) => (
                      <button
                        key={subTab.id}
                        onClick={() => handleSubTabClick(subTab.id)}
                        className={`w-full flex items-center px-12 py-2 text-left text-sm hover:bg-gray-100 ${
                          activeSubTab === subTab.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                        }`}
                      >
                        {subTab.label}
                      </button>
                    ))}
        </div>
      )}
    </div>
  )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
      {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {tabs.find(t => t.id === activeTab)?.label}
                {activeSubTab && subTabs[activeTab as keyof typeof subTabs] && (
                  <span className="text-gray-500 ml-2">
                    - {subTabs[activeTab as keyof typeof subTabs].find(s => s.id === activeSubTab)?.label}
                  </span>
                )}
              </h2>
            </div>
          <div className="flex items-center space-x-4">
              <Button onClick={() => window.location.reload()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleLogout} variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
                  </div>
                  </div>
      </div>

        {/* Sub-tab Navigation */}
        {subTabs[activeTab as keyof typeof subTabs] && (
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex space-x-1">
              {subTabs[activeTab as keyof typeof subTabs].map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => handleSubTabClick(subTab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSubTab === subTab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {subTab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto scrollable admin-content" data-lenis-prevent>
          {renderContent()}
                    </div>
                  </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" data-lenis-prevent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedTicket.title}</h2>
              <Button variant="ghost" onClick={() => setSelectedTicket(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(selectedTicket.status)}>
                  {selectedTicket.status.replace(/_/g, ' ')}
                      </Badge>
                <Badge className={getPriorityColor(selectedTicket.priority)}>
                  {selectedTicket.priority}
                  </Badge>
                <Badge variant="secondary">{selectedTicket.category}</Badge>
                </div>
              <p className="text-gray-700">{selectedTicket.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                  <p><strong>Requester:</strong> {selectedTicket.requester}</p>
                  <p><strong>Assignee:</strong> {selectedTicket.assignee}</p>
                  <p><strong>Created:</strong> {new Date(selectedTicket.created).toLocaleString()}</p>
                    </div>
                    <div>
                  <p><strong>Updated:</strong> {new Date(selectedTicket.updated).toLocaleString()}</p>
                  <p><strong>Resolved:</strong> {selectedTicket.resolved_at ? new Date(selectedTicket.resolved_at).toLocaleString() : 'N/A'}</p>
                  <p><strong>ID:</strong> {selectedTicket.id}</p>
                    </div>
                    </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Edit</Button>
                <Button className="bg-red-600 hover:bg-red-700">Delete</Button>
                    </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto" data-lenis-prevent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create New Ticket</h2>
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
                <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <Input id="title" type="text" placeholder="Ticket title" className="mt-1" />
                </div>
                <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" rows={4} placeholder="Detailed description" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                </div>
                <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <Input id="category" type="text" placeholder="e.g., Software, Hardware" className="mt-1" />
                </div>
                <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                <select id="priority" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                  </select>
                </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
