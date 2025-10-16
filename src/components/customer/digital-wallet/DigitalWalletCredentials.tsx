'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Eye, 
  Download, 
  Share2, 
  Plus,
  Search,
  Filter,
  Zap,
  Home,
  Briefcase,
  Settings,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Smartphone,
  Laptop,
  Globe,
  Award,
  Star,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  MoreHorizontal,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface DigitalWalletCredentialsProps {
  userId: string
}

export default function DigitalWalletCredentials({ userId }: DigitalWalletCredentialsProps) {
  const [credentials, setCredentials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedCredential, setSelectedCredential] = useState<any>(null)

  useEffect(() => {
    fetchCredentials()
  }, [userId])

  const fetchCredentials = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/credit/credentials?user_id=${userId}`)
      const data = await response.json()
      
      setCredentials(data.credentials || [])
    } catch (error) {
      console.error('Error fetching credentials:', error)
      toast.error('Failed to load credentials')
    } finally {
      setLoading(false)
    }
  }

  const credentialTypes = {
    utility: { icon: Zap, label: 'Utility', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    rental: { icon: Home, label: 'Rental', color: 'text-green-600', bgColor: 'bg-green-100' },
    income: { icon: Briefcase, label: 'Income', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    service: { icon: Settings, label: 'Service', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    identity: { icon: User, label: 'Identity', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    employment: { icon: Building, label: 'Employment', color: 'text-cyan-600', bgColor: 'bg-cyan-100' }
  }

  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch = cred.credential_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cred.issuer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || cred.credential_type === filterType
    return matchesSearch && matchesFilter
  })

  const getCredentialType = (type: string) => {
    return credentialTypes[type as keyof typeof credentialTypes] || credentialTypes.service
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Credentials</h2>
          <p className="text-gray-600">Manage your verifiable credentials</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Credential
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search credentials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="utility">Utility</option>
                <option value="rental">Rental</option>
                <option value="income">Income</option>
                <option value="service">Service</option>
                <option value="identity">Identity</option>
                <option value="employment">Employment</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCredentials.map((credential, index) => {
            const credType = getCredentialType(credential.credential_type)
            const Icon = credType.icon
            
            return (
              <motion.div
                key={credential.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${credType.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${credType.color}`} />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedCredential(credential)}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">{credType.label} Credential</h4>
                    <p className="text-sm text-gray-600 mb-3">{credential.issuer_name || 'Unknown Issuer'}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Issued:</span>
                        <span className="font-medium">{formatDate(credential.issued_at)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Expires:</span>
                        <span className="font-medium">
                          {credential.expires_at ? formatDate(credential.expires_at) : 'Never'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Status:</span>
                        <Badge className={credential.is_revoked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                          {credential.is_revoked ? 'Revoked' : 'Active'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredCredentials.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Credentials Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'No credentials match your search criteria'
                : 'You haven\'t added any credentials yet'
              }
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Credential
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Credential Detail Modal */}
      {selectedCredential && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Credential Details</h2>
              <Button variant="ghost" onClick={() => setSelectedCredential(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 ${getCredentialType(selectedCredential.credential_type).bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-8 w-8 ${getCredentialType(selectedCredential.credential_type).color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{getCredentialType(selectedCredential.credential_type).label} Credential</h3>
                  <p className="text-gray-600">{selectedCredential.issuer_name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Credential ID</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input value={selectedCredential.id} readOnly className="text-sm" />
                    <Button size="sm" onClick={() => copyToClipboard(selectedCredential.id)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Issuer DID</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input value={selectedCredential.issuer_did || 'N/A'} readOnly className="text-sm" />
                    <Button size="sm" onClick={() => copyToClipboard(selectedCredential.issuer_did || '')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Issued Date</label>
                  <p className="text-sm mt-1">{formatDate(selectedCredential.issued_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Expiry Date</label>
                  <p className="text-sm mt-1">
                    {selectedCredential.expires_at ? formatDate(selectedCredential.expires_at) : 'Never expires'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Credential Data</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(selectedCredential.credential_data, null, 2)}
                  </pre>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Verify
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
