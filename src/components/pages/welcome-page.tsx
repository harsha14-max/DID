'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings, 
  Shield,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Zap
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

export function WelcomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Debug logging
  console.log('WelcomePage - User:', user)
  console.log('WelcomePage - Loading:', loading)

  const handleRoleSelection = (role: 'admin' | 'customer') => {
    if (isDemoMode) {
      // Demo mode - show preview
      router.push(`/demo/${role}`)
    } else {
      // Normal mode - go to login
      router.push(`/auth/login?role=${role}`)
    }
  }

  const stats = [
    { label: 'Total Articles', value: '1,247', icon: FileText, color: 'text-blue-500' },
    { label: 'Published Content', value: '892', icon: CheckCircle, color: 'text-green-500' },
    { label: 'Active Tickets', value: '156', icon: MessageSquare, color: 'text-orange-500' },
    { label: 'Resolved Rate', value: '94.2%', icon: Star, color: 'text-purple-500' },
  ]

  const features = [
    {
      title: 'Multi-Channel Support',
      description: 'Email, chat, phone, and Slack integration',
      icon: MessageSquare,
    },
    {
      title: 'AI-Powered Automation',
      description: 'Smart routing and predictive analytics',
      icon: Zap,
    },
    {
      title: 'Workflow Builder',
      description: 'Drag-and-drop no-code automation',
      icon: Settings,
    },
    {
      title: 'Real-time Analytics',
      description: 'Live dashboards and SLA monitoring',
      icon: BarChart3,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">credX Platform</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="hidden sm:inline-flex">
              v1.0.0
            </Badge>
            {user ? (
              <Button onClick={() => {
                console.log('Go to Dashboard clicked - User:', user)
                console.log('User role:', user.role)
                if (user.role === 'admin') {
                  console.log('Redirecting to admin dashboard')
                  router.push('/admin/dashboard')
                } else if (user.role === 'customer') {
                  console.log('Redirecting to customer dashboard')
                  router.push('/customer/dashboard')
                } else {
                  console.log('Unknown role:', user.role, 'redirecting to login')
                  router.push('/auth/login')
                }
              }}>
                Go to Dashboard ({user.role || 'unknown'})
              </Button>
            ) : (
              <Button variant="outline" onClick={() => router.push('/auth/login')}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            🚀 Production Ready
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Credit Management Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comprehensive solution with Admin & Customer portals, AI-powered automation, 
            multi-channel support, and real-time analytics for enterprise-grade credit management.
          </p>
          
          {/* Demo Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className="text-sm text-muted-foreground">Demo Mode:</span>
            <Button
              variant={isDemoMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsDemoMode(!isDemoMode)}
            >
              {isDemoMode ? "ON" : "OFF"}
            </Button>
          </div>

          {/* Role Selection */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group" 
                  onClick={() => handleRoleSelection('admin')}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit">
                  <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl">Admin Portal</CardTitle>
                <CardDescription>
                  Manage tickets, workflows, analytics, and system administration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Dashboard & Analytics
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Workflow Management
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    AI Integration
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    User Management
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-blue-600">
                  Access Admin Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group"
                  onClick={() => handleRoleSelection('customer')}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit">
                  <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl">Customer Portal</CardTitle>
                <CardDescription>
                  Submit tickets, track progress, access knowledge base, and get support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Ticket Management
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Live Chat Support
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Knowledge Base
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Service Catalog
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-green-600">
                  Access Customer Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Platform Statistics</h2>
          <p className="text-muted-foreground">Real-time metrics and performance indicators</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-muted-foreground">Comprehensive tools for modern service management</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold">credX Platform</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© 2024 credX Platform</span>
              <span>•</span>
              <span>Enterprise Ready</span>
              <span>•</span>
              <span>Scalable Architecture</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

