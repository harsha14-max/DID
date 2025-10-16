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
  Lock,
  Unlock,
  Fingerprint,
  Zap,
  Target,
  Award,
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Info,
  HelpCircle,
  X,
  QrCode,
  Scan,
  Bell,
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
  Plus,
  Minus,
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
  Globe,
  Printer,
  Camera,
  Headphones,
  Mic,
  Video,
  Truck,
  Package,
  Receipt,
  CreditCard,
  Banknote,
  Coins,
  Calculator,
  Percent,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Issuer {
  id: string
  name: string
  did: string
  type: 'government' | 'financial' | 'utility' | 'employment' | 'education'
  logo: string
  verified: boolean
  trustLevel: number
  publicKey: string
  description: string
  active: boolean
}

interface CredentialTemplate {
  id: string
  name: string
  type: 'utility' | 'rental' | 'income' | 'service' | 'identity' | 'employment'
  issuer: Issuer
  fields: any[]
  requiredFields: string[]
  description: string
  validityPeriod: number
  icon: string
  color: string
}

interface IssuedCredential {
  id: string
  templateId: string
  template: CredentialTemplate
  userId: string
  data: Record<string, any>
  signature: string
  issuedAt: string
  expiresAt?: string
  status: 'active' | 'expired' | 'revoked'
  verificationUrl: string
  metadata: {
    issuerSignature: string
    verificationMethod: string
    trustScore: number
  }
}

interface CredentialIssuanceProps {
  userId: string
  onCredentialIssued?: (credential: IssuedCredential) => void
}

export default function CredentialIssuance({ userId, onCredentialIssued }: CredentialIssuanceProps) {
  const [issuers, setIssuers] = useState<Issuer[]>([])
  const [templates, setTemplates] = useState<CredentialTemplate[]>([])
  const [issuedCredentials, setIssuedCredentials] = useState<IssuedCredential[]>([])
  const [loading, setLoading] = useState(false)
  const [showIssuanceModal, setShowIssuanceModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<CredentialTemplate | null>(null)

  useEffect(() => {
    loadIssuers()
    loadTemplates()
    loadIssuedCredentials()
  }, [userId])

  const loadIssuers = () => {
    const mockIssuers: Issuer[] = [
      {
        id: 'issuer_1',
        name: 'CredX Government Services',
        did: 'did:gov:credX',
        type: 'government',
        logo: '🏛️',
        verified: true,
        trustLevel: 95,
        publicKey: 'gov_pub_key_123',
        description: 'Official government credential issuer',
        active: true
      },
      {
        id: 'issuer_2',
        name: 'Utility Verification Corp',
        did: 'did:utility:verification',
        type: 'utility',
        logo: '⚡',
        verified: true,
        trustLevel: 88,
        publicKey: 'utility_pub_key_456',
        description: 'Verified utility payment issuer',
        active: true
      },
      {
        id: 'issuer_3',
        name: 'Employment Verification Inc',
        did: 'did:employment:verification',
        type: 'employment',
        logo: '💼',
        verified: true,
        trustLevel: 92,
        publicKey: 'employment_pub_key_789',
        description: 'Employment and income verification',
        active: true
      },
      {
        id: 'issuer_4',
        name: 'Financial Services Trust',
        did: 'did:financial:trust',
        type: 'financial',
        logo: '🏦',
        verified: true,
        trustLevel: 90,
        publicKey: 'financial_pub_key_012',
        description: 'Financial institution credential issuer',
        active: true
      }
    ]
    
    setIssuers(mockIssuers)
  }

  const loadTemplates = () => {
    const mockTemplates: CredentialTemplate[] = [
      {
        id: 'template_1',
        name: 'Utility Payment Verification',
        type: 'utility',
        issuer: issuers.find(i => i.id === 'issuer_2') || issuers[0],
        fields: [],
        requiredFields: ['utilityCompany', 'accountNumber', 'paymentAmount'],
        description: 'Verify your utility payment history',
        validityPeriod: 365,
        icon: '⚡',
        color: 'text-blue-600'
      },
      {
        id: 'template_2',
        name: 'Employment Verification',
        type: 'employment',
        issuer: issuers.find(i => i.id === 'issuer_3') || issuers[0],
        fields: [],
        requiredFields: ['employerName', 'jobTitle', 'monthlyIncome'],
        description: 'Verify your employment and income',
        validityPeriod: 180,
        icon: '💼',
        color: 'text-green-600'
      },
      {
        id: 'template_3',
        name: 'Identity Verification',
        type: 'identity',
        issuer: issuers.find(i => i.id === 'issuer_1') || issuers[0],
        fields: [],
        requiredFields: ['fullName', 'dateOfBirth', 'address'],
        description: 'Verify your identity information',
        validityPeriod: 730,
        icon: '🆔',
        color: 'text-purple-600'
      },
      {
        id: 'template_4',
        name: 'Rental Payment History',
        type: 'rental',
        issuer: issuers.find(i => i.id === 'issuer_2') || issuers[0],
        fields: [],
        requiredFields: ['landlordName', 'propertyAddress', 'monthlyRent'],
        description: 'Verify your rental payment history',
        validityPeriod: 365,
        icon: '🏠',
        color: 'text-orange-600'
      }
    ]
    
    setTemplates(mockTemplates)
  }

  const loadIssuedCredentials = () => {
    try {
      const storedCredentials = localStorage.getItem(`issued_credentials_${userId}`)
      if (storedCredentials) {
        const parsedCredentials = JSON.parse(storedCredentials)
        setIssuedCredentials(parsedCredentials)
      }
    } catch (error) {
      console.error('Error loading issued credentials:', error)
    }
  }

  const issueCredential = async () => {
    if (!selectedTemplate) return

    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const credentialId = `cred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const now = new Date()
      const expiresAt = selectedTemplate.validityPeriod > 0 ? 
        new Date(now.getTime() + selectedTemplate.validityPeriod * 24 * 60 * 60 * 1000) : 
        undefined

      const signature = `sig_${credentialId}_${btoa(JSON.stringify({
        issuer: selectedTemplate.issuer.did,
        template: selectedTemplate.id,
        timestamp: now.toISOString()
      }))}`

      const issuedCredential: IssuedCredential = {
        id: credentialId,
        templateId: selectedTemplate.id,
        template: selectedTemplate,
        userId,
        data: {},
        signature,
        issuedAt: now.toISOString(),
        expiresAt: expiresAt?.toISOString(),
        status: 'active',
        verificationUrl: `https://verify.credX.com/credential/${credentialId}`,
        metadata: {
          issuerSignature: signature,
          verificationMethod: 'digital_signature',
          trustScore: selectedTemplate.issuer.trustLevel
        }
      }

      const updatedCredentials = [...issuedCredentials, issuedCredential]
      localStorage.setItem(`issued_credentials_${userId}`, JSON.stringify(updatedCredentials))
      setIssuedCredentials(updatedCredentials)
      
      toast.success('Credential issued successfully!')
      setShowIssuanceModal(false)
      setSelectedTemplate(null)
      
      if (onCredentialIssued) {
        onCredentialIssued(issuedCredential)
      }
      
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
          <h2 className="text-3xl font-bold text-gray-900">Credential Issuance</h2>
          <p className="text-gray-600">Issue and manage verifiable credentials</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowIssuanceModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Issue Credential
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Issued</p>
                <p className="text-3xl font-bold text-gray-900">{issuedCredentials.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                <p className="text-3xl font-bold text-green-600">
                  {issuedCredentials.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Expired</p>
                <p className="text-3xl font-bold text-red-600">
                  {issuedCredentials.filter(c => c.status === 'expired').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Trust Score</p>
                <p className="text-3xl font-bold text-purple-600">
                  {issuedCredentials.length > 0 ? 
                    Math.round(issuedCredentials.reduce((sum, c) => sum + c.metadata.trustScore, 0) / issuedCredentials.length) : 
                    0
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
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
            {templates.map((template, index) => (
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
                          <span className="text-2xl">{template.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.issuer.name}</p>
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
                        <span className="font-medium">{template.issuer.trustLevel}%</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setSelectedTemplate(template)
                        setShowIssuanceModal(true)
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
      {issuedCredentials.length > 0 && (
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
              {issuedCredentials.map((credential, index) => {
                const Icon = getCredentialTypeIcon(credential.template.type)
                
                return (
                  <motion.div
                    key={credential.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${getCredentialTypeBgColor(credential.template.type)} rounded-lg flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${getCredentialTypeColor(credential.template.type)}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{credential.template.name}</h4>
                        <p className="text-sm text-gray-600">
                          Issued by {credential.template.issuer.name}
                        </p>
                        <p className="text-xs text-gray-500">
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

      {/* Issuance Modal */}
      {showIssuanceModal && selectedTemplate && (
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
                <div className="text-2xl">{selectedTemplate.icon}</div>
                <div>
                  <h3 className="font-semibold">{selectedTemplate.name}</h3>
                  <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Credential Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Issuer:</span>
                    <span className="font-semibold text-blue-900 ml-2">{selectedTemplate.issuer.name}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Validity:</span>
                    <span className="font-semibold text-blue-900 ml-2">{selectedTemplate.validityPeriod} days</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Trust Level:</span>
                    <span className="font-semibold text-blue-900 ml-2">{selectedTemplate.issuer.trustLevel}%</span>
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