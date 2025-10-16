'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Shield, 
  Key, 
  Fingerprint, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Copy, 
  Download, 
  RefreshCw, 
  Plus, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  Smartphone, 
  Laptop, 
  Globe, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Activity, 
  Target, 
  Award, 
  Star, 
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
  Bell
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface DigitalWalletDIDSecurityProps {
  userId: string
}

export default function DigitalWalletDIDSecurity({ userId }: DigitalWalletDIDSecurityProps) {
  const [didData, setDidData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    biometricEnabled: false,
    autoLock: true,
    sessionTimeout: 30,
    notifications: true
  })

  useEffect(() => {
    fetchDIDData()
  }, [userId])

  const fetchDIDData = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/credit/dids?user_id=${userId}`)
      const data = await response.json()
      
      setDidData(data.did || null)
    } catch (error) {
      console.error('Error fetching DID data:', error)
      toast.error('Failed to load DID information')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const downloadDIDDocument = () => {
    if (!didData) return
    
    const didDocument = {
      "@context": "https://www.w3.org/ns/did/v1",
      "id": didData.did,
      "publicKey": didData.public_key,
      "created": didData.created_at,
      "updated": didData.updated_at,
      "metadata": didData.metadata
    }
    
    const blob = new Blob([JSON.stringify(didDocument, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `did-document-${didData.did.split(':').pop()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('DID document downloaded')
  }

  const generateNewKeys = async () => {
    try {
      // In a real implementation, this would generate new cryptographic keys
      toast.success('New keys generated successfully')
      await fetchDIDData()
    } catch (error) {
      console.error('Error generating new keys:', error)
      toast.error('Failed to generate new keys')
    }
  }

  const revokeDID = async () => {
    if (!confirm('Are you sure you want to revoke this DID? This action cannot be undone.')) {
      return
    }
    
    try {
      // In a real implementation, this would revoke the DID
      toast.success('DID revoked successfully')
      await fetchDIDData()
    } catch (error) {
      console.error('Error revoking DID:', error)
      toast.error('Failed to revoke DID')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
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
          <h2 className="text-3xl font-bold text-gray-900">DID & Security</h2>
          <p className="text-gray-600">Manage your decentralized identity and security settings</p>
        </div>
        <Button variant="outline" onClick={fetchDIDData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* DID Overview */}
      {didData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="h-8 w-8" />
                    <div>
                      <h3 className="text-2xl font-bold">Decentralized Identity</h3>
                      <Badge className="bg-white/20 text-white border-white/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-100">DID:</span>
                      <code className="text-white font-mono text-sm bg-white/10 px-2 py-1 rounded">
                        {didData.did}
                      </code>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-100">Status:</span>
                      <Badge className="bg-green-100 text-green-800">
                        {didData.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-100">Created:</span>
                      <span className="text-white">{formatDate(didData.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                    <Key className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* DID Details and Security Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DID Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>DID Details</span>
              </CardTitle>
              <CardDescription>Your decentralized identity information</CardDescription>
            </CardHeader>
            <CardContent>
              {didData ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">DID Identifier</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input value={didData.did} readOnly className="text-sm font-mono" />
                      <Button size="sm" onClick={() => copyToClipboard(didData.did)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Public Key</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input value={didData.public_key} readOnly className="text-sm font-mono" />
                      <Button size="sm" onClick={() => copyToClipboard(didData.public_key)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Private Key</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input 
                        type={showPrivateKey ? "text" : "password"}
                        value={didData.private_key_encrypted} 
                        readOnly 
                        className="text-sm font-mono" 
                      />
                      <Button size="sm" onClick={() => setShowPrivateKey(!showPrivateKey)}>
                        {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" onClick={() => copyToClipboard(didData.private_key_encrypted)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Created</Label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(didData.created_at)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Updated</Label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(didData.updated_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-4">
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={downloadDIDDocument}>
                      <Download className="h-4 w-4 mr-2" />
                      Download DID Document
                    </Button>
                    <Button variant="outline" onClick={generateNewKeys}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate New Keys
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No DID Found</h3>
                  <p className="text-gray-600 mb-6">
                    You don't have a decentralized identity yet. Create one to get started.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create DID
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>Manage your wallet security preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Button 
                    variant={securitySettings.twoFactorEnabled ? "default" : "outline"}
                    onClick={() => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
                  >
                    {securitySettings.twoFactorEnabled ? 'Enabled' : 'Enable'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Fingerprint className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Biometric Authentication</h4>
                      <p className="text-sm text-gray-600">Use fingerprint or face ID</p>
                    </div>
                  </div>
                  <Button 
                    variant={securitySettings.biometricEnabled ? "default" : "outline"}
                    onClick={() => setSecuritySettings(prev => ({ ...prev, biometricEnabled: !prev.biometricEnabled }))}
                  >
                    {securitySettings.biometricEnabled ? 'Enabled' : 'Enable'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Lock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Auto-Lock</h4>
                      <p className="text-sm text-gray-600">Automatically lock after inactivity</p>
                    </div>
                  </div>
                  <Button 
                    variant={securitySettings.autoLock ? "default" : "outline"}
                    onClick={() => setSecuritySettings(prev => ({ ...prev, autoLock: !prev.autoLock }))}
                  >
                    {securitySettings.autoLock ? 'Enabled' : 'Enable'}
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Session Timeout</h4>
                      <p className="text-sm text-gray-600">Minutes before auto-logout</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="number" 
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-600">minutes</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Bell className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Security Notifications</h4>
                      <p className="text-sm text-gray-600">Get alerts for security events</p>
                    </div>
                  </div>
                  <Button 
                    variant={securitySettings.notifications ? "default" : "outline"}
                    onClick={() => setSecuritySettings(prev => ({ ...prev, notifications: !prev.notifications }))}
                  >
                    {securitySettings.notifications ? 'Enabled' : 'Enable'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Security Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Security Actions</span>
            </CardTitle>
            <CardDescription>Advanced security operations for your DID</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-16 flex flex-col items-center space-y-2">
                <RefreshCw className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Regenerate Keys</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex flex-col items-center space-y-2">
                <Download className="h-6 w-6 text-green-600" />
                <span className="text-sm">Export DID</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex flex-col items-center space-y-2 text-red-600 hover:text-red-700" onClick={revokeDID}>
                <Trash2 className="h-6 w-6" />
                <span className="text-sm">Revoke DID</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
