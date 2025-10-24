'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CredXLogo } from '@/components/ui/credX-logo'

// Import My Credit components
import DigitalWallet from '@/components/customer/my-credit/DigitalWallet'
import VerifiedCredentials from '@/components/customer/my-credit/VerifiedCredentials'
import CreditScore from '@/components/customer/my-credit/CreditScore'
import LoanApplications from '@/components/customer/my-credit/LoanApplications'
import PrivacyControls from '@/components/customer/my-credit/PrivacyControls'

// Import Digital Wallet components
import DigitalWalletDashboard from '@/components/customer/digital-wallet/DigitalWalletDashboard'
import DigitalWalletCredentials from '@/components/customer/digital-wallet/DigitalWalletCredentials'
import VCGeneration from '@/components/customer/digital-wallet/VCGeneration'
import DigitalWalletCreditScore from '@/components/customer/digital-wallet/DigitalWalletCreditScore'
import DigitalWalletLoanApplications from '@/components/customer/digital-wallet/DigitalWalletLoanApplications'
import DigitalWalletDIDSecurity from '@/components/customer/digital-wallet/DigitalWalletDIDSecurity'
import { 
  MessageSquare, 
  Star, 
  Monitor, 
  HelpCircle,
  Search,
  RefreshCw,
  Download,
  Bell,
  Settings,
  User,
  ChevronDown,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Plus,
  X,
  Save,
  Filter,
  Calendar,
  TrendingUp,
  FileText,
  BookOpen,
  Phone,
  Mail,
  Globe,
  Shield,
  Zap,
  Target,
  Award,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Archive,
  Trash2,
  CreditCard,
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Cloud,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Router,
  Smartphone,
  Laptop,
  Printer,
  Camera,
  Headphones,
  Mic,
  Video,
  MapPin,
  DollarSign,
  Receipt,
  Package,
  Truck,
  Home,
  Building,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  LogOut
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function CustomerDashboard({ params }: { params: { segments?: string[] } }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut, loading: authLoading } = useAuth()
  
  // Parse URL segments to determine active tab and sub-tab
  const segments = params.segments || []
  const activeTab = segments[0] || 'dashboard'
  const activeSubTab = segments[1] || 'overview'
  
  // Profile dropdown state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showProfileDropdown) {
        setShowProfileDropdown(false)
      }
    }
    
    if (showProfileDropdown) {
      document.addEventListener('click', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showProfileDropdown])

  // Authentication check - must be before any conditional returns
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        console.log('No user found, redirecting to login')
        router.push('/auth/login?role=customer')
        return
      }
      if (user.role !== 'customer') {
        console.log('User is not a customer, redirecting to appropriate portal')
        if (user.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/auth/login?role=customer')
        }
        return
      }
    }
  }, [user, authLoading, router])

  const [customerData, setCustomerData] = useState({
    openTickets: 3,
    inProgressTickets: 2,
    resolvedTickets: 15,
    totalTickets: 20,
    recentTickets: [] as any[],
    serviceHealth: [] as any[],
    recentActivity: [] as any[],
    slaPerformance: {
      compliance: 95,
      averageResponseTime: '2.5h',
      resolutionRate: 92
    },
    accountInfo: {
      companyName: 'gmail.com',
      supportTier: 'Professional',
      accountManager: 'Sarah Johnson',
      supportHours: '24/7'
    }
  })

  const [loading, setLoading] = useState(false)

  const fetchCustomerData = async () => {
    try {
      setLoading(true)
      
      if (!user?.id) {
        console.error('No user ID available for fetching customer data')
        return
      }

      // Fetch customer-specific data
      const { data: customerData, error: customerError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (customerError) {
        console.error('Error fetching customer data:', customerError)
        return
      }

      console.log('Customer data loaded:', customerData)
    } catch (error) {
      console.error('Error in fetchCustomerData:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomerData()
  }, [])

  // Role validation
  useEffect(() => {
    if (authLoading) return
    
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    if (user.role !== 'customer') {
      router.push('/admin/dashboard')
      return
    }
  }, [user, authLoading, router])

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }


  // Don't render if user is not customer
  if (!user || user.role !== 'customer') {
    return null
  }

  const handleTabClick = (tab: string) => {
    router.push(`/customer/dashboard/${tab}`)
  }

  const handleSubTabClick = (subTab: string) => {
    router.push(`/customer/dashboard/${activeTab}/${subTab}`)
  }

  const handleSignOut = async () => {
    try {
      console.log('Customer logout initiated')
      setShowProfileDropdown(false) // Close dropdown if open
      
      // Show loading state
      const logoutButton = document.querySelector('[data-logout-button]')
      if (logoutButton && 'disabled' in logoutButton) {
        logoutButton.textContent = 'Logging out...'
        ;(logoutButton as HTMLButtonElement).disabled = true
      }
      
      await signOut()
      console.log('Customer logout successful, redirecting to login')
      
      // Redirect to login page
      window.location.href = '/auth/login?role=customer'
    } catch (error) {
      console.error('Error signing out:', error)
      // Still redirect to login page even if signOut fails
      window.location.href = '/auth/login?role=customer'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays}d ago`
  }

  const getStatusBadge = (status: string, priority: string) => {
    if (status === 'open') {
      return (
        <div className="flex items-center space-x-2 mb-2">
          <Badge variant="destructive">{status}</Badge>
          <Badge variant="destructive">{priority}</Badge>
        </div>
      )
    } else if (status === 'in_progress') {
      return (
        <div className="flex items-center space-x-2 mb-2">
          <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>
          <Badge className="bg-yellow-100 text-yellow-800">{priority}</Badge>
        </div>
      )
    } else {
      return (
        <div className="flex items-center space-x-2 mb-2">
          <Badge className="bg-green-100 text-green-800">{status}</Badge>
          <Badge className="bg-green-100 text-green-800">{priority}</Badge>
        </div>
      )
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'tickets', label: 'Tickets', icon: MessageSquare },
    { id: 'ratings', label: 'Ratings', icon: Star },
    { id: 'services', label: 'Services', icon: Monitor },
    { id: 'digital-wallet', label: 'Digital Wallet', icon: CreditCard },
    { id: 'my-credit', label: 'My Credit', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'help', label: 'Help', icon: HelpCircle }
  ]

  const subTabs = {
    tickets: [
      { id: 'overview', label: 'Overview' },
      { id: 'open', label: 'Open' },
      { id: 'in-progress', label: 'In Progress' },
      { id: 'resolved', label: 'Resolved' },
      { id: 'create', label: 'Create New' }
    ],
    ratings: [
      { id: 'overview', label: 'Overview' },
      { id: 'submit', label: 'Submit Rating' },
      { id: 'history', label: 'Rating History' },
      { id: 'feedback', label: 'Feedback' }
    ],
    services: [
      { id: 'overview', label: 'Overview' },
      { id: 'status', label: 'System Status' },
      { id: 'health', label: 'Health Check' },
      { id: 'incidents', label: 'Incidents' }
    ],
    'digital-wallet': [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'credentials', label: 'My Credentials' },
      { id: 'vc-generation', label: 'VC Generation' },
      { id: 'loan-applications', label: 'Loan Applications' },
      { id: 'did-security', label: 'DID & Security' }
    ],
    'my-credit': [
      { id: 'did-generation', label: 'DID Generation' },
      { id: 'verified-credentials', label: 'Verified Credentials' },
      { id: 'credit-score', label: 'Credit Score' },
      { id: 'loan-applications', label: 'Loan Applications' },
      { id: 'privacy-controls', label: 'Privacy Controls' }
    ],
    help: [
      { id: 'overview', label: 'Overview' },
      { id: 'knowledge-base', label: 'Knowledge Base' },
      { id: 'faq', label: 'FAQ' },
      { id: 'contact', label: 'Contact Support' }
    ]
  }

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if user is not authenticated or not a customer
  if (!user || user.role !== 'customer') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <CredXLogo size={24} className="shadow-lg" />
              <div>
                <h1 className="text-sm font-bold text-gray-900">credX</h1>
                <p className="text-xs text-gray-600 hidden sm:block">Platform</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-1 overflow-x-auto flex-1 mx-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    onClick={() => handleTabClick(tab.id)}
                    className="flex items-center space-x-1 whitespace-nowrap text-xs px-2 py-1"
                  >
                    <Icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </Button>
                )
              })}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Button variant="ghost" size="sm" className="relative p-1">
                <Bell className="h-3 w-3" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>
              
              {/* Visible Logout Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                data-logout-button
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
              >
                <LogOut className="h-3 w-3" />
                <span className="hidden sm:inline text-xs">Logout</span>
              </Button>
              
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium hidden lg:block">{user?.full_name || 'Test Customer'}</span>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowProfileDropdown(!showProfileDropdown)
                    }}
                    className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <User className="h-3 w-3 text-white" />
                  </button>
                  
                  {/* Profile Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl border border-gray-200 z-[99999]">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                          {user?.full_name || 'Test Customer'}
                        </div>
                        <div
                          onClick={() => {
                            console.log('Logout clicked from dropdown!')
                            setShowProfileDropdown(false)
                            handleSignOut()
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center cursor-pointer"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sub Navigation */}
      {activeTab !== 'dashboard' && subTabs[activeTab as keyof typeof subTabs] && (
        <div className="bg-white border-b">
          <div className="px-2 py-2">
            <nav className="flex items-center space-x-1 overflow-x-auto">
              {subTabs[activeTab as keyof typeof subTabs].map((subTab) => (
                <Button
                  key={subTab.id}
                  variant={activeSubTab === subTab.id ? 'default' : 'ghost'}
                  onClick={() => handleSubTabClick(subTab.id)}
                  size="sm"
                  className="text-xs px-2 py-1 whitespace-nowrap"
                >
                  {subTab.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="p-2 overflow-y-auto scrollable flex-1" data-lenis-prevent>
        {activeTab === 'dashboard' && <DashboardContent data={customerData} />}
        {activeTab === 'tickets' && <TicketsContent subTab={activeSubTab} />}
        {activeTab === 'ratings' && <RatingsContent subTab={activeSubTab} />}
        {activeTab === 'services' && <ServicesContent subTab={activeSubTab} user={user} />}
        {activeTab === 'digital-wallet' && <DigitalWalletContent subTab={activeSubTab} userId={user?.id || ''} />}
        {activeTab === 'my-credit' && <MyCreditContent subTab={activeSubTab} userId={user?.id || ''} />}
        {activeTab === 'notifications' && <NotificationsContent userId={user?.id || ''} />}
        {activeTab === 'help' && <HelpContent subTab={activeSubTab} />}
      </div>
    </div>
  )
}

// Dashboard Content Component
function DashboardContent({ data }: { data: any }) {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays}d ago`
  }

  const getStatusBadge = (status: string, priority: string) => {
    if (status === 'open') {
      return (
        <div className="flex items-center space-x-2 mb-2">
          <Badge variant="destructive">{status}</Badge>
          <Badge variant="destructive">{priority}</Badge>
        </div>
      )
    } else if (status === 'in_progress') {
      return (
        <div className="flex items-center space-x-2 mb-2">
          <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>
          <Badge className="bg-yellow-100 text-yellow-800">{priority}</Badge>
        </div>
      )
    } else {
      return (
        <div className="flex items-center space-x-2 mb-2">
          <Badge className="bg-green-100 text-green-800">{status}</Badge>
          <Badge className="bg-green-100 text-green-800">{priority}</Badge>
        </div>
      )
    }
  }

  const handleCardClick = (path: string) => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push(path)
      setIsAnimating(false)
    }, 200)
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Welcome Section with Live Clock */}
      <div className="mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 opacity-50"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, Test Customer! 👋
              </h2>
              <p className="text-gray-600 text-lg">
                Manage your support tickets and access our services
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-gray-800">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Action Cards with Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card 
          className={`bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 cursor-pointer hover:shadow-md ${isAnimating ? 'animate-pulse' : ''}`}
          onClick={() => handleCardClick('/customer/dashboard/tickets')}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">View Tickets</h3>
                <p className="text-gray-600">Check your support requests</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Open</div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:border-green-300 transition-all duration-300 cursor-pointer hover:shadow-md ${isAnimating ? 'animate-pulse' : ''}`}
          onClick={() => handleCardClick('/customer/dashboard/ratings')}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Rate Service</h3>
                <p className="text-gray-600">Rate your experience</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">4.8</div>
              <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">⭐</div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:border-purple-300 transition-all duration-300 cursor-pointer hover:shadow-md ${isAnimating ? 'animate-pulse' : ''}`}
          onClick={() => handleCardClick('/customer/dashboard/services')}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Monitor className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">System Status</h3>
                <p className="text-gray-600">Check service status</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">99.9%</div>
              <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">🟢</div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 hover:border-orange-300 transition-all duration-300 cursor-pointer hover:shadow-md ${isAnimating ? 'animate-pulse' : ''}`}
          onClick={() => handleCardClick('/customer/dashboard/help')}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <HelpCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Get Help</h3>
                <p className="text-gray-600">Find answers and support</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">💬</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Ticket Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-300 bg-red-50/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Open</p>
                <p className="text-3xl font-bold text-red-600">{data.openTickets}</p>
                <p className="text-xs text-gray-500 mt-1">Requires attention</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-300 bg-yellow-50/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600">{data.inProgressTickets}</p>
                <p className="text-xs text-gray-500 mt-1">Being worked on</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-300 bg-green-50/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{data.resolvedTickets}</p>
                <p className="text-xs text-gray-500 mt-1">Successfully closed</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-300 bg-blue-50/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-blue-600">{data.totalTickets}</p>
                <p className="text-xs text-gray-500 mt-1">All time tickets</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Recent Tickets and Service Health Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Enhanced Recent Tickets */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>Recent Tickets</span>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => router.push('/customer/dashboard/tickets')} className="hover:bg-blue-600 hover:text-white transition-colors">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentTickets.length > 0 ? (
                data.recentTickets.map((ticket: any) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer group">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{ticket.title}</h4>
                      {getStatusBadge(ticket.status, ticket.priority)}
                      <p className="text-sm text-gray-600">
                        Created {formatDate(ticket.created_at)} • Updated {formatDate(ticket.updated_at)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="hover:bg-blue-100">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-blue-100">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">No tickets found</p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105" onClick={() => router.push('/customer/dashboard/tickets/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Ticket
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Service Health Status */}
        <Card>
          <CardHeader>
            <CardTitle>Service Health Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.serviceHealth.map((service: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      service.status === 'operational' ? 'bg-green-500' :
                      service.status === 'degraded' ? 'bg-yellow-500' :
                      service.status === 'maintenance' ? 'bg-blue-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{service.service}</h4>
                      <p className="text-xs text-gray-500">Last incident: {service.lastIncident}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      service.status === 'operational' ? 'bg-green-100 text-green-800' :
                      service.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                      service.status === 'maintenance' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }>
                      {service.status}
                    </Badge>
                    <p className="text-xs text-gray-600 mt-1">{service.uptime} uptime</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced SLA Performance and Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Enhanced SLA Performance */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span>SLA Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Compliance Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{data.slaPerformance.compliance}%</p>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  data.slaPerformance.compliance >= 95 ? 'bg-green-100' :
                  data.slaPerformance.compliance >= 85 ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <CheckCircle className={`h-8 w-8 ${
                    data.slaPerformance.compliance >= 95 ? 'text-green-600' :
                    data.slaPerformance.compliance >= 85 ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
                  <p className="text-2xl font-bold text-gray-900">{data.slaPerformance.averageResponseTime}</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Resolution Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{data.slaPerformance.resolutionRate}%</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'ticket_created' ? 'bg-blue-100' :
                    activity.type === 'ticket_updated' ? 'bg-yellow-100' :
                    activity.type === 'ticket_resolved' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {activity.type === 'ticket_created' ? <Plus className="h-4 w-4 text-blue-600" /> :
                     activity.type === 'ticket_updated' ? <RefreshCw className="h-4 w-4 text-yellow-600" /> :
                     activity.type === 'ticket_resolved' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                     <Bell className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Response Time</p>
                <p className="text-3xl font-bold">2.3h</p>
                <p className="text-blue-200 text-xs">Average</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Satisfaction</p>
                <p className="text-3xl font-bold">4.8/5</p>
                <p className="text-green-200 text-xs">Rating</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Uptime</p>
                <p className="text-3xl font-bold">99.9%</p>
                <p className="text-purple-200 text-xs">This Month</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Company</p>
              <p className="font-medium text-gray-900">{data.accountInfo.companyName}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Support Tier</p>
              <Badge className="bg-blue-100 text-blue-800">{data.accountInfo.supportTier}</Badge>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Account Manager</p>
              <p className="font-medium text-gray-900">{data.accountInfo.accountManager}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Support Hours</p>
              <p className="font-medium text-gray-900">{data.accountInfo.supportHours}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Tickets Content Component
function TicketsContent({ subTab }: { subTab: string }) {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchCustomerTickets = async () => {
    if (!user?.id) return
    
    try {
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          created_at,
          updated_at,
          category,
          assigned_to,
          assignee:users!assigned_to(full_name)
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

      if (ticketsError) {
        console.error('Error fetching tickets:', ticketsError)
        toast.error('Failed to load tickets. Please try again.')
        return
      }

      setTickets(ticketsData || [])
      console.log('Customer tickets loaded from Supabase:', ticketsData?.length || 0)
    } catch (error) {
      console.error('Error fetching customer tickets:', error)
      toast.error('Failed to load tickets. Please try again.')
    }
  }

  const createTicket = async () => {
    if (!user?.id || !ticketForm.title.trim() || !ticketForm.description.trim()) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          title: ticketForm.title.trim(),
          description: ticketForm.description.trim(),
          created_by: user.id,
          status: 'open',
          priority: 'medium',
          category: 'general'
        })
        .select()

      if (error) {
        console.error('Error creating ticket:', error)
        alert('Failed to create ticket. Please try again.')
        return
      }

      // Reset form and close modal
      setTicketForm({ title: '', description: '' })
      setShowCreateModal(false)
      
      // Refresh tickets list
      await fetchCustomerTickets()
      
      alert('Ticket created successfully!')
    } catch (error) {
      console.error('Error creating ticket:', error)
      alert('Failed to create ticket. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchCustomerTickets()
  }, [subTab, user])

  const filteredTickets = tickets.filter(ticket => {
    const matchesSubTab = !subTab || subTab === 'overview' || ticket.status === subTab.replace('-', '_')
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSubTab && matchesSearch
  })

  const approvedTickets = tickets.filter(ticket => ticket.status === 'approved')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const rateTicket = async (ticketId: string, rating: number, feedback?: string) => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .insert({
          ticket_id: ticketId,
          rating: rating,
          feedback: feedback || '',
          rated_by: user?.id,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error submitting rating:', error)
        toast.error('Failed to submit rating. Please try again.')
        return
      }

      // Update ticket status to rated
      await supabase
        .from('tickets')
        .update({ 
          status: 'rated',
          metadata: {
            ...tickets.find(t => t.id === ticketId)?.metadata,
            rating: rating,
            feedback: feedback,
            rated_at: new Date().toISOString()
          }
        })
        .eq('id', ticketId)

      toast.success('Rating submitted successfully!')
      
      // Update analytics
      await updateAnalytics('customer_satisfaction', rating)
      
      // Refresh tickets
      fetchCustomerTickets()
    } catch (error) {
      console.error('Error rating ticket:', error)
      toast.error('Failed to submit rating. Please try again.')
    }
  }

  const updateAnalytics = async (metricName: string, value: number) => {
    try {
      // Get existing analytics or create new
      const { data: existingAnalytics } = await supabase
        .from('analytics')
        .select('*')
        .eq('metric_name', metricName)
        .single()

      if (existingAnalytics) {
        // Update existing analytics (simple average for now)
        const newValue = (existingAnalytics.metric_value + value) / 2
        await supabase
          .from('analytics')
          .update({ metric_value: newValue })
          .eq('id', existingAnalytics.id)
      } else {
        // Create new analytics entry
        await supabase
          .from('analytics')
          .insert({
            metric_name: metricName,
            metric_value: value,
            metric_type: 'gauge',
            tags: { source: 'customer_rating' },
            metadata: { count: 1 }
          })
      }
    } catch (error) {
      console.error('Error updating analytics:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Tickets</h2>
          <p className="text-gray-600">Manage your support requests</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {tickets.filter(t => t.status === 'open').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {tickets.filter(t => t.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tickets.filter(t => t.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Star className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {approvedTickets.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{tickets.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Approved Tickets Section */}
      {approvedTickets.length > 0 && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Approved Tickets - Rate Your Experience
            </CardTitle>
            <CardDescription className="text-purple-600">
              Your tickets have been approved! Please rate your experience to help us improve.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvedTickets.map((ticket) => (
                <div key={ticket.id} className="bg-white p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{ticket.title}</h4>
                      <p className="text-sm text-gray-600">Approved on {formatDate(ticket.updated_at)}</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Approved</Badge>
                  </div>
                  
                  {/* Rating Section */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Rate your experience (1-5 stars):</Label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant="ghost"
                          size="sm"
                          onClick={() => rateTicket(ticket.id, rating)}
                          className="p-1 hover:bg-yellow-100"
                        >
                          <Star 
                            className={`h-5 w-5 ${
                              rating <= (ticket.metadata?.rating || 0) 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        </Button>
                      ))}
                    </div>
                    
                    {/* Feedback Section */}
                    <div className="mt-3">
                      <Label htmlFor={`feedback-${ticket.id}`} className="text-sm font-medium">
                        Additional feedback (optional):
                      </Label>
                      <Textarea
                        id={`feedback-${ticket.id}`}
                        placeholder="Tell us about your experience..."
                        className="mt-1"
                        rows={2}
                        onChange={(e) => {
                          const feedback = e.target.value
                          if (feedback.trim()) {
                            rateTicket(ticket.id, ticket.metadata?.rating || 5, feedback)
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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

      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{ticket.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>Created: {formatDate(ticket.created_at)}</span>
                    <span>Assigned to: {ticket.assigned_to}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto scrollable" data-lenis-prevent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedTicket.title}</h2>
              <Button variant="ghost" onClick={() => setSelectedTicket(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <Badge className={getStatusColor(selectedTicket.status)}>
                  {selectedTicket.status.replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <Label>Description</Label>
                <p className="text-sm mt-1">{selectedTicket.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Ticket
              </Button>
              <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create New Ticket</h2>
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter ticket title" 
                  value={ticketForm.title}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your issue..." 
                  rows={4}
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 pt-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={createTicket}
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Creating...' : 'Create Ticket'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Ratings Content Component
function RatingsContent({ subTab }: { subTab: string }) {
  const [ratings, setRatings] = useState<any[]>([])
  const [showRatingModal, setShowRatingModal] = useState(false)

  useEffect(() => {
    // Note: Ratings functionality would require a ratings table in Supabase
    // For now, using mock data until ratings table is implemented
    const mockRatings = [
      {
        id: 1,
        ticketId: 'T-001',
        rating: 5,
        comment: 'Excellent support! Issue resolved quickly.',
        createdAt: '2024-01-12T10:30:00Z',
        category: 'Technical Support'
      },
      {
        id: 2,
        ticketId: 'T-002',
        rating: 4,
        comment: 'Good service, minor delay in response.',
        createdAt: '2024-01-10T14:20:00Z',
        category: 'Account Management'
      }
    ]
    setRatings(mockRatings)
  }, [subTab])

  const averageRating = ratings.length > 0 ? 
    (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : '0.0'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service Ratings</h2>
          <p className="text-gray-600">Rate your support experience</p>
        </div>
        <Button onClick={() => setShowRatingModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Star className="h-4 w-4 mr-2" />
          Submit Rating
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{averageRating}</div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{ratings.length}</div>
            <p className="text-xs text-muted-foreground">Submitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {ratings.length > 0 ? Math.round((ratings.filter(r => r.rating >= 4).length / ratings.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">4+ stars</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rating History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    <p className="font-medium">Ticket #{rating.ticketId}</p>
                    <p className="text-sm text-gray-600">{rating.comment}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-blue-100 text-blue-800">{rating.category}</Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Rate Your Experience</h2>
              <Button variant="ghost" onClick={() => setShowRatingModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="flex items-center space-x-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-gray-300 cursor-pointer hover:text-yellow-400" />
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="comment">Comment</Label>
                <Textarea id="comment" placeholder="Share your feedback..." rows={3} />
              </div>
            </div>
            <div className="flex items-center space-x-4 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Submit Rating
              </Button>
              <Button variant="outline" onClick={() => setShowRatingModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Services Content Component
function ServicesContent({ subTab, user }: { subTab: string; user: any }) {
  const [services, setServices] = useState<any[]>([])
  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServicesAndAssets()
  }, [subTab])

  const fetchServicesAndAssets = async () => {
    try {
      setLoading(true)
      
      // Fetch services from Supabase
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'active')
        .order('name')

      // Fetch assets from Supabase
      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .eq('status', 'operational')
        .order('name')

      if (servicesError || assetsError) {
        console.error('Error fetching services/assets:', { servicesError, assetsError })
        toast.error('Failed to load services and assets. Please try again.')
        
        // Fallback to mock data if database is not available
        const mockServices = [
          { id: '1', name: 'Email System', status: 'operational', uptime: '99.9%', lastIncident: '7d ago', description: 'Corporate email system' },
          { id: '2', name: 'Web Application', status: 'operational', uptime: '99.8%', lastIncident: '2d ago', description: 'Main web application' },
          { id: '3', name: 'API Services', status: 'degraded', uptime: '98.5%', lastIncident: 'Active', description: 'REST API services' },
          { id: '4', name: 'Database', status: 'operational', uptime: '100%', lastIncident: '30d ago', description: 'Primary database system' }
        ]
        setServices(mockServices)
        return
      }

      // Combine services and assets data
      const combinedServices = [
        ...(servicesData || []).map(service => ({
          id: service.id,
          name: service.name,
          status: service.status || 'operational',
          uptime: service.uptime || '99.9%',
          lastIncident: service.last_incident || 'No recent incidents',
          description: service.description || 'Service description not available',
          type: 'service'
        })),
        ...(assetsData || []).map(asset => ({
          id: asset.id,
          name: asset.name,
          status: asset.status || 'operational',
          uptime: asset.uptime || '99.9%',
          lastIncident: asset.last_incident || 'No recent incidents',
          description: asset.description || 'Asset description not available',
          type: 'asset'
        }))
      ]

      setServices(combinedServices)
      console.log('Services and assets loaded from Supabase:', combinedServices.length)

      // Fetch incidents from tickets table (using tickets as incidents for now)
      const { data: incidentsData, error: incidentsError } = await supabase
        .from('tickets')
        .select('id, title, description, status, priority, created_at')
        .eq('category', 'incident')
        .order('created_at', { ascending: false })
        .limit(5)

      if (incidentsError) {
        console.error('Error fetching incidents:', incidentsError)
        const mockIncidents = [
          {
            id: '1',
            title: 'API Response Time Degradation',
            status: 'investigating',
            severity: 'medium',
            description: 'Some API endpoints experiencing slower response times',
            createdAt: '2024-01-15T09:00:00Z'
          }
        ]
        setIncidents(mockIncidents)
      } else {
        const formattedIncidents = (incidentsData || []).map(incident => ({
          id: incident.id,
          title: incident.title,
          status: incident.status,
          severity: incident.priority,
          description: incident.description,
          createdAt: incident.created_at
        }))
        setIncidents(formattedIncidents)
      }

    } catch (error) {
      console.error('Error fetching services and assets:', error)
      toast.error('Failed to load services and assets. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800'
      case 'degraded': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-blue-100 text-blue-800'
      case 'outage': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const createTicketForService = async (service: any) => {
    try {
      if (!user?.id) {
        toast.error('Please log in to create a ticket')
        return
      }

      // Create a ticket for the service
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          title: `Issue with ${service.name}`,
          description: `Customer reported an issue with ${service.name} (${service.type}). Service status: ${service.status}`,
          category: service.type === 'asset' ? 'hardware' : 'service',
          priority: service.status === 'outage' ? 'urgent' : 'medium',
          created_by: user.id,
          metadata: {
            service_id: service.id,
            service_name: service.name,
            service_type: service.type,
            service_status: service.status
          }
        })
        .select()

      if (error) {
        console.error('Error creating ticket:', error)
        toast.error('Failed to create ticket. Please try again.')
        return
      }

      toast.success(`Ticket created for ${service.name}`)
      console.log('Ticket created:', data)
      
      // Trigger rule engine evaluation
      await evaluateRulesForTicket(data[0])
      
    } catch (error) {
      console.error('Error creating ticket for service:', error)
      toast.error('Failed to create ticket. Please try again.')
    }
  }

  const evaluateRulesForTicket = async (ticket: any) => {
    try {
      // Fetch active rules from the rule engine
      const { data: rules, error } = await supabase
        .from('rules')
        .select('*')
        .eq('is_active', true)

      if (error || !rules) {
        console.log('No rules found or error fetching rules')
        return
      }

      // Evaluate rules against the ticket
      for (const rule of rules) {
        if (evaluateRuleCondition(rule, ticket)) {
          await executeRuleAction(rule, ticket)
        }
      }
    } catch (error) {
      console.error('Error evaluating rules:', error)
    }
  }

  const evaluateRuleCondition = (rule: any, ticket: any) => {
    // Simple rule evaluation logic
    // In a real implementation, this would be more sophisticated
    try {
      const conditions = rule.conditions || ''
      
      // Example: priority = "urgent" AND category = "service"
      if (conditions.includes('priority = "urgent"') && ticket.priority === 'urgent') {
        return true
      }
      
      if (conditions.includes('category = "service"') && ticket.category === 'service') {
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error evaluating rule condition:', error)
      return false
    }
  }

  const executeRuleAction = async (rule: any, ticket: any) => {
    try {
      const actions = rule.actions || ''
      
      // Example: assign_to = "senior_agent" AND notify = true
      if (actions.includes('assign_to = "senior_agent"')) {
        // Find a senior agent
        const { data: seniorAgents } = await supabase
          .from('users')
          .select('id')
          .eq('role', 'admin')
          .limit(1)

        if (seniorAgents && seniorAgents.length > 0) {
          await supabase
            .from('tickets')
            .update({ 
              assigned_to: seniorAgents[0].id,
              status: 'in_progress',
              metadata: {
                ...ticket.metadata,
                auto_assigned: true,
                rule_applied: rule.name
              }
            })
            .eq('id', ticket.id)

          toast.success(`Ticket auto-assigned by rule: ${rule.name}`)
        }
      }
      
      if (actions.includes('notify = true')) {
        // Send notification (implement notification logic)
        console.log(`Notification sent for ticket ${ticket.id} by rule ${rule.name}`)
      }
      
    } catch (error) {
      console.error('Error executing rule action:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service Status</h2>
          <p className="text-gray-600">Monitor system health and incidents</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operational</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {services.filter(s => s.status === 'operational').length}
            </div>
            <p className="text-xs text-muted-foreground">Services running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Degraded</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {services.filter(s => s.status === 'degraded').length}
            </div>
            <p className="text-xs text-muted-foreground">Performance issues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Settings className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {services.filter(s => s.status === 'maintenance').length}
            </div>
            <p className="text-xs text-muted-foreground">Scheduled work</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {incidents.filter(i => i.status === 'investigating').length}
            </div>
            <p className="text-xs text-muted-foreground">Under investigation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading services...</p>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No services available</p>
                </div>
              ) : (
                services.map((service, index) => (
                  <div key={service.id || index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        service.status === 'operational' ? 'bg-green-500' :
                        service.status === 'degraded' ? 'bg-yellow-500' :
                        service.status === 'maintenance' ? 'bg-blue-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {service.type || 'service'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">{service.description}</p>
                        <p className="text-xs text-gray-400">Last incident: {service.lastIncident}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                      <p className="text-xs text-gray-600 mt-1">{service.uptime} uptime</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2 text-xs"
                        onClick={() => createTicketForService(service)}
                      >
                        Create Ticket
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incidents.map((incident) => (
                <div key={incident.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{incident.title}</h4>
                    <Badge className="bg-yellow-100 text-yellow-800">{incident.severity}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Status: {incident.status}</span>
                    <span>{new Date(incident.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Digital Wallet Content Component
function DigitalWalletContent({ subTab, userId }: { subTab: string; userId: string }) {
  switch (subTab) {
    case 'dashboard':
      return <DigitalWalletDashboard userId={userId} />
    case 'credentials':
      return <DigitalWalletCredentials userId={userId} />
    case 'vc-generation':
      return <VCGeneration />
    case 'loan-applications':
      return <DigitalWalletLoanApplications userId={userId} />
    case 'did-security':
      return <DigitalWalletDIDSecurity userId={userId} />
    default:
      return <DigitalWalletDashboard userId={userId} />
  }
}

// My Credit Content Component
function MyCreditContent({ subTab, userId }: { subTab: string; userId: string }) {
  // Add a key to force re-render when switching tabs
  const componentKey = `${subTab}-${userId}`
  
  switch (subTab) {
    case 'did-generation':
      return <DigitalWallet key={componentKey} userId={userId} onCredentialAdded={() => {}} />
    case 'verified-credentials':
      return <VerifiedCredentials key={componentKey} />
    case 'credit-score':
      return <CreditScore key={componentKey} userId={userId} showBreakdown={true} />
    case 'loan-applications':
      return <LoanApplications key={componentKey} userId={userId} onApplicationSubmitted={() => {}} />
    case 'privacy-controls':
      return <PrivacyControls key={componentKey} userId={userId} />
    default:
      return <DigitalWallet key={componentKey} userId={userId} onCredentialAdded={() => {}} />
  }
}

// Help Content Component
function HelpContent({ subTab }: { subTab: string }) {
  const [articles, setArticles] = useState<any[]>([])
  const [faqs, setFaqs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchKnowledgeBase()
  }, [subTab])

  const fetchKnowledgeBase = async () => {
    try {
      const { data: articlesData, error: articlesError } = await supabase
        .from('knowledge_base')
        .select('*')
        .order('created_at', { ascending: false })

      if (articlesError) {
        console.error('Error fetching knowledge base:', articlesError)
        toast.error('Failed to load knowledge base. Please try again.')
        return
      }

      setArticles(articlesData || [])
      console.log('Knowledge base articles loaded from Supabase:', articlesData?.length || 0)

      // Note: FAQs would require a separate faqs table in Supabase
      // For now, using mock data until faqs table is implemented
      const mockFaqs = [
        {
          id: 1,
          question: 'How do I create a new ticket?',
          answer: 'Click on the "Create Ticket" button in the Tickets section and fill out the form with your issue details.',
          category: 'Tickets'
        },
        {
          id: 2,
          question: 'What is the response time for support?',
          answer: 'We aim to respond to all tickets within 2 hours during business hours (9 AM - 6 PM EST).',
          category: 'Support'
        }
      ]
      setFaqs(mockFaqs)
    } catch (error) {
      console.error('Error fetching knowledge base:', error)
      toast.error('Failed to load knowledge base. Please try again.')
    }
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Help Center</h2>
          <p className="text-gray-600">Find answers and get support</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
          <Button variant="outline">
            <Phone className="h-4 w-4 mr-2" />
            Call Support
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles and FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <div key={article.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{article.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{article.content.substring(0, 100)}...</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{article.views} views</span>
                        <span>{article.helpful} helpful</span>
                        <Badge className="bg-blue-100 text-blue-800">{article.category}</Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-sm text-gray-600 mb-2">{faq.answer}</p>
                      <Badge className="bg-green-100 text-green-800">{faq.category}</Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Live Chat</h4>
              <p className="text-sm text-gray-600 mb-3">Chat with our support team</p>
              <Button className="w-full">Start Chat</Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Email Support</h4>
              <p className="text-sm text-gray-600 mb-3">Send us an email</p>
              <Button variant="outline" className="w-full">Send Email</Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Phone className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Phone Support</h4>
              <p className="text-sm text-gray-600 mb-3">Call us directly</p>
              <Button variant="outline" className="w-full">Call Now</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Notifications Content Component
function NotificationsContent({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [userId])

  // Add a refresh mechanism when component mounts
  useEffect(() => {
    const interval = setInterval(() => {
      loadNotifications()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [userId])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading notifications:', error)
        return
      }

      setNotifications(data || [])
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId)

      if (error) {
        console.error('Error marking notification as read:', error)
        return
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true, read_at: new Date().toISOString() }
            : notif
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'loan_approval':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'ticket_update':
        return <MessageSquare className="h-5 w-5 text-blue-600" />
      case 'approval_request':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'loan_approval':
        return 'bg-green-100 text-green-800'
      case 'ticket_update':
        return 'bg-blue-100 text-blue-800'
      case 'approval_request':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">Stay updated with your account activity</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadNotifications}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-600">You'll see important updates and alerts here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-colors hover:bg-gray-50 ${
                !notification.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getNotificationBadgeColor(notification.type)}>
                          {notification.type.replace('_', ' ')}
                        </Badge>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                      {!notification.is_read && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
