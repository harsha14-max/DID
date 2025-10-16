// =====================================================
// credX Platform - Verified Credentials Component
// =====================================================
// Component for displaying verified credentials and notifications

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Bell, 
  Building2, 
  Zap, 
  Droplets, 
  Briefcase, 
  Calendar, 
  Eye, 
  Download, 
  Share2, 
  RefreshCw,
  AlertCircle,
  Clock,
  Award,
  Shield,
  Key,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  TrendingUp,
  Star,
  Heart,
  Smile
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface VerifiedCredential {
  id: string
  issuer: string
  issuerType: 'landlord' | 'electric' | 'utility' | 'gig-economy'
  credentialType: string
  issuedAt: string
  expiresAt?: string
  status: 'active' | 'expired' | 'revoked'
  data: { [key: string]: any }
  verifiedBy: string
}

interface Notification {
  id: string
  type: 'credential_approved' | 'credential_expired' | 'credential_revoked'
  title: string
  message: string
  timestamp: string
  issuer: string
  credentialType: string
  read: boolean
}

export default function VerifiedCredentials() {
  const [credentials, setCredentials] = useState<VerifiedCredential[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'credentials' | 'notifications'>('notifications')

  useEffect(() => {
    // Load verified credentials and notifications from localStorage
    const loadData = () => {
      // Load credentials
      const savedCredentials = localStorage.getItem('verified-credentials')
      if (savedCredentials) {
        setCredentials(JSON.parse(savedCredentials))
      }

      // Load notifications
      const savedNotifications = localStorage.getItem('credential-notifications')
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications))
      }

      setLoading(false)
    }

    loadData()

    // Listen for new notifications
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'credential-notifications' && e.newValue) {
        setNotifications(JSON.parse(e.newValue))
      }
      if (e.key === 'verified-credentials' && e.newValue) {
        setCredentials(JSON.parse(e.newValue))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const getIssuerIcon = (type: string) => {
    switch (type) {
      case 'landlord': return <Building2 className="h-5 w-5 text-blue-600" />
      case 'electric': return <Zap className="h-5 w-5 text-yellow-600" />
      case 'utility': return <Droplets className="h-5 w-5 text-blue-600" />
      case 'gig-economy': return <Briefcase className="h-5 w-5 text-green-600" />
      default: return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>
      case 'expired': return <Badge variant="warning" className="bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3 mr-1" /> Expired</Badge>
      case 'revoked': return <Badge variant="destructive" className="bg-red-100 text-red-700"><AlertCircle className="h-3 w-3 mr-1" /> Revoked</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ))
    
    // Update localStorage
    const updatedNotifications = notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    )
    localStorage.setItem('credential-notifications', JSON.stringify(updatedNotifications))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
    localStorage.setItem('credential-notifications', JSON.stringify(
      notifications.map(notif => ({ ...notif, read: true }))
    ))
    toast.success('All notifications marked as read!')
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Verified Credentials</h2>
          <p className="text-gray-600 mt-1">Your verified credentials and approval notifications</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'notifications' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('notifications')}
          className="relative"
        >
          <Bell className="h-4 w-4 mr-2" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
        <Button
          variant={activeTab === 'credentials' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('credentials')}
        >
          <Award className="h-4 w-4 mr-2" />
          My Credentials ({credentials.length})
        </Button>
      </div>

      {/* Notifications Tab */}
      <AnimatePresence>
        {activeTab === 'notifications' && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map(notification => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className={`hover:shadow-md transition-shadow ${!notification.read ? 'border-l-4 border-l-green-500 bg-green-50' : ''}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                notification.type === 'credential_approved' ? 'bg-green-100' : 
                                notification.type === 'credential_expired' ? 'bg-yellow-100' : 'bg-red-100'
                              }`}>
                                {notification.type === 'credential_approved' ? (
                                  <CheckCircle className="h-6 w-6 text-green-600" />
                                ) : notification.type === 'credential_expired' ? (
                                  <Clock className="h-6 w-6 text-yellow-600" />
                                ) : (
                                  <AlertCircle className="h-6 w-6 text-red-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold text-lg">{notification.title}</h3>
                                  {!notification.read && (
                                    <Badge variant="destructive" className="bg-green-100 text-green-700">
                                      New
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-2">{notification.message}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    {getIssuerIcon(notification.credentialType)}
                                    <span>{notification.issuer}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(notification.timestamp).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {!notification.read && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => markNotificationAsRead(notification.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Read
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications</h3>
                  <p className="text-gray-600">You'll receive notifications here when your credential requests are approved.</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Credentials Tab */}
      <AnimatePresence>
        {activeTab === 'credentials' && (
          <motion.div
            key="credentials"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {credentials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {credentials.map(credential => (
                  <motion.div
                    key={credential.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getIssuerIcon(credential.issuerType)}
                            <div>
                              <CardTitle className="text-lg">{credential.issuer}</CardTitle>
                              <CardDescription>{credential.credentialType}</CardDescription>
                            </div>
                          </div>
                          {getStatusBadge(credential.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>Issued:</span>
                            <span>{new Date(credential.issuedAt).toLocaleDateString()}</span>
                          </div>
                          {credential.expiresAt && (
                            <div className="flex items-center justify-between">
                              <span>Expires:</span>
                              <span>{new Date(credential.expiresAt).toLocaleDateString()}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span>Verified by:</span>
                            <span>{credential.verifiedBy}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Verified Credentials</h3>
                  <p className="text-gray-600 mb-4">Your verified credentials will appear here once approved by issuers.</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Request Credentials
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
