'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  Eye, 
  Download, 
  Copy, 
  RefreshCw,
  Key,
  Target,
  Award,
  Activity,
  Plus,
  X,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Info,
  HelpCircle,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  User,
  Building,
  Home,
  Briefcase,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  Zap,
  Building2,
  Droplets
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase/client'

interface DigitalWalletCredentialsProps {
  userId: string
}

export default function DigitalWalletCredentials({ userId }: DigitalWalletCredentialsProps) {
  const [credentials, setCredentials] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showIssuanceModal, setShowIssuanceModal] = useState(false)

  useEffect(() => {
    loadCredentials()
  }, [userId])

  const loadCredentials = async () => {
    try {
      setLoading(true)
      
      // Load credentials from Supabase
      const { data: supabaseCredentials, error } = await supabase
        .from('verifiable_credentials')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'valid')
        .order('issued_at', { ascending: false })

      if (error) {
        console.error('Error loading credentials:', error)
        toast.error('Failed to load credentials')
        return
      }

      // Transform Supabase data to match our interface
      const transformedCredentials = supabaseCredentials?.map(cred => ({
        id: cred.id,
        name: cred.credential_type,
        type: getCredentialType(cred.credential_type),
        issuer: getIssuerName(cred.issuer_did),
        logo: getIssuerLogo(cred.credential_type),
        issuedAt: cred.issued_at,
        expiresAt: cred.expires_at,
        status: cred.status === 'valid' ? 'active' : cred.status,
        trustLevel: 95,
        description: `Verifiable credential issued by ${getIssuerName(cred.issuer_did)}`,
        approvedMessage: '✅ Approved and verified by issuer',
        credentialId: cred.credential_id,
        holderDid: cred.holder_did,
        metadata: cred.credential_data || {}
      })) || []

      setCredentials(transformedCredentials)
    } catch (error) {
      console.error('Error loading credentials:', error)
      toast.error('Failed to load credentials')
    } finally {
      setLoading(false)
    }
  }

  const getCredentialType = (credentialType: string) => {
    if (credentialType.toLowerCase().includes('utility')) return 'utility'
    if (credentialType.toLowerCase().includes('income')) return 'income'
    if (credentialType.toLowerCase().includes('address')) return 'address'
    if (credentialType.toLowerCase().includes('employment')) return 'employment'
    return 'general'
  }

  const getIssuerName = (issuerDid: string) => {
    if (issuerDid.includes('landlord')) return 'Property Management Co.'
    if (issuerDid.includes('electric')) return 'ElectroCorp Utilities'
    if (issuerDid.includes('utility')) return 'AquaFlow Water Services'
    if (issuerDid.includes('gig')) return 'FlexWork Platform'
    return 'Trusted Issuer'
  }

  const getIssuerLogo = (credentialType: string) => {
    if (credentialType.toLowerCase().includes('utility')) return '⚡'
    if (credentialType.toLowerCase().includes('income')) return '💼'
    if (credentialType.toLowerCase().includes('address')) return '🏠'
    if (credentialType.toLowerCase().includes('employment')) return '💼'
    return '🏛️'
  }

  const issueCredential = async () => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const credentialId = `cred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const now = new Date()
      const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // 1 year

      const newCredential = {
        id: credentialId,
        name: 'Utility Payment Verification',
        type: 'utility',
        issuer: 'CredX Government Services',
        logo: '⚡',
        issuedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        status: 'active',
        trustLevel: 95,
        description: 'Verified utility payment history'
      }

      const updatedCredentials = [...credentials, newCredential]
      localStorage.setItem(`issued_credentials_${userId}`, JSON.stringify(updatedCredentials))
      setCredentials(updatedCredentials)
      
      toast.success('Credential issued successfully!')
      setShowIssuanceModal(false)
      
    } catch (error) {
      console.error('Error issuing credential:', error)
      toast.error('Failed to issue credential')
    } finally {
      setLoading(false)
    }
  }

  const getCredentialTypeIcon = (type: string) => {
    switch (type) {
      case 'utility': return Zap
      case 'rental': return Home
      case 'income': return DollarSign
      case 'service': return Settings
      case 'identity': return User
      case 'employment': return Briefcase
      default: return Shield
    }
  }

  const getCredentialTypeColor = (type: string) => {
    switch (type) {
      case 'utility': return 'text-blue-600'
      case 'rental': return 'text-orange-600'
      case 'income': return 'text-green-600'
      case 'service': return 'text-purple-600'
      case 'identity': return 'text-indigo-600'
      case 'employment': return 'text-cyan-600'
      default: return 'text-gray-600'
    }
  }

  const getCredentialTypeBgColor = (type: string) => {
    switch (type) {
      case 'utility': return 'bg-blue-100'
      case 'rental': return 'bg-orange-100'
      case 'income': return 'bg-green-100'
      case 'service': return 'bg-purple-100'
      case 'identity': return 'bg-indigo-100'
      case 'employment': return 'bg-cyan-100'
      default: return 'bg-gray-100'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Credentials</h2>
          <p className="text-sm text-gray-600">Manage your verifiable credentials</p>
        </div>
        <div className="flex space-x-1">
          <Button variant="outline" onClick={loadCredentials} disabled={loading} size="sm">
            <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowIssuanceModal(true)} size="sm">
            <Plus className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Issue Credential</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Total</p>
                <p className="text-xl font-bold text-gray-900">{credentials.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Active</p>
                <p className="text-xl font-bold text-green-600">
                  {credentials.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Expired</p>
                <p className="text-xl font-bold text-red-600">
                  {credentials.filter(c => c.status === 'expired').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Trust Score</p>
                <p className="text-xl font-bold text-purple-600">
                  {credentials.length > 0 ? 
                    Math.round(credentials.reduce((sum, c) => sum + (c.trustLevel || 0), 0) / credentials.length) : 
                    0
                  }
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Available Credential Templates</span>
          </CardTitle>
          <CardDescription>Choose a credential template to issue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: 'template_1',
                name: 'Utility Payment Verification',
                type: 'utility',
                issuer: 'Utility Verification Corp',
                logo: '⚡',
                description: 'Verify your utility payment history',
                validityPeriod: 365,
                trustLevel: 88
              },
              {
                id: 'template_2',
                name: 'Employment Verification',
                type: 'employment',
                issuer: 'Employment Verification Inc',
                logo: '💼',
                description: 'Verify your employment and income',
                validityPeriod: 180,
                trustLevel: 92
              },
              {
                id: 'template_3',
                name: 'Identity Verification',
                type: 'identity',
                issuer: 'CredX Government Services',
                logo: '🆔',
                description: 'Verify your identity information',
                validityPeriod: 730,
                trustLevel: 95
              },
              {
                id: 'template_4',
                name: 'Rental Payment History',
                type: 'rental',
                issuer: 'Property Management Co',
                logo: '🏠',
                description: 'Verify your rental payment history',
                validityPeriod: 365,
                trustLevel: 85
              }
            ].map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${getCredentialTypeBgColor(template.type)} rounded-lg flex items-center justify-center`}>
                          <span className="text-2xl">{template.logo}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.issuer}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Validity:</span>
                        <span className="font-medium">{template.validityPeriod} days</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Trust Level:</span>
                        <span className="font-medium">{template.trustLevel}%</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        // Issue credential directly
                        issueCredential()
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Issue Credential
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Issued Credentials */}
      {credentials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Issued Credentials</span>
            </CardTitle>
            <CardDescription>Your issued verifiable credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {credentials.map((credential, index) => {
                const Icon = getCredentialTypeIcon(credential.type)
                
                return (
                  <motion.div
                    key={credential.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${getCredentialTypeBgColor(credential.type)} rounded-lg flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${getCredentialTypeColor(credential.type)}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{credential.name}</h4>
                        <p className="text-sm text-gray-600">
                          Issued by {credential.issuer}
                        </p>
                        {credential.approvedMessage && (
                          <div className="mt-1">
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              {credential.approvedMessage}
                            </Badge>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Issued: {formatDate(credential.issuedAt)}
                          {credential.expiresAt && ` • Expires: ${formatDate(credential.expiresAt)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        credential.status === 'active' ? 'bg-green-100 text-green-800' :
                        credential.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {credential.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {credentials.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Credentials Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't issued any verifiable credentials yet. Issue your first credential to get started.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowIssuanceModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Issue Your First Credential
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Issuance Modal */}
      {showIssuanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Issue Credential</h2>
              <Button variant="ghost" onClick={() => setShowIssuanceModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">⚡</div>
                <div>
                  <h3 className="font-semibold">Utility Payment Verification</h3>
                  <p className="text-sm text-gray-600">Verify your utility payment history</p>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Credential Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Issuer:</span>
                    <span className="font-semibold text-blue-900 ml-2">Utility Verification Corp</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Validity:</span>
                    <span className="font-semibold text-blue-900 ml-2">365 days</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Trust Level:</span>
                    <span className="font-semibold text-blue-900 ml-2">88%</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Signature:</span>
                    <span className="font-semibold text-blue-900 ml-2">Digital</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 pt-6">
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                onClick={issueCredential}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Issuing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Issue Credential
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowIssuanceModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}