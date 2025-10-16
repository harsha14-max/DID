// =====================================================
// BSM Platform - Customer Digital Wallet Component
// =====================================================
// Component for managing DIDs and VCs in the customer portal

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Plus, 
  Eye, 
  Key, 
  Award, 
  Users, 
  Activity,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Shield,
  Download,
  Share2,
  Trash2
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { 
  DID, 
  VerifiableCredential, 
  CredentialType,
  DigitalWalletProps 
} from '@/types/credit'
import { didManager } from '@/components/shared/credit/DIDManager'
import { vcIssuer } from '@/components/shared/credit/VCIssuer'

export default function DigitalWallet({ userId, onCredentialAdded }: DigitalWalletProps) {
  const [userDID, setUserDID] = useState<DID | null>(null)
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCredential, setSelectedCredential] = useState<VerifiableCredential | null>(null)
  const [creatingDID, setCreatingDID] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [userId])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Load user's DID
      const did = await didManager.getUserDID(userId)
      setUserDID(did)
      
      // Load user's credentials
      if (did) {
        const userCredentials = await vcIssuer.getUserCredentials(userId)
        setCredentials(userCredentials)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      toast.error('Failed to load wallet data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDID = async () => {
    try {
      setCreatingDID(true)
      
      const response = await didManager.createDID({
        user_id: userId,
        did_method: 'did:bsm'
      })

      setUserDID(response.did)
      toast.success('DID created successfully! Your private key has been generated.')
      
      // Show private key to user (only shown once)
      toast.success(`Private Key: ${response.private_key}`, {
        duration: 10000,
        style: {
          backgroundColor: '#f0f9ff',
          border: '1px solid #0ea5e9',
          color: '#0c4a6e'
        }
      })
    } catch (error) {
      console.error('Error creating DID:', error)
      toast.error('Failed to create DID')
    } finally {
      setCreatingDID(false)
    }
  }

  const handleVerifyCredential = async (credentialId: string) => {
    try {
      const isValid = await vcIssuer.verifyCredential(credentialId)
      
      if (isValid) {
        toast.success('Credential is valid')
      } else {
        toast.error('Credential is invalid or expired')
      }
    } catch (error) {
      console.error('Error verifying credential:', error)
      toast.error('Failed to verify credential')
    }
  }

  const handleShareCredential = async (credential: VerifiableCredential) => {
    try {
      // In a real implementation, this would generate a shareable link or QR code
      const shareData = {
        credential_id: credential.id,
        credential_type: credential.credential_type,
        issuer: credential.issuer_did,
        issued_at: credential.issued_at
      }
      
      await navigator.clipboard.writeText(JSON.stringify(shareData, null, 2))
      toast.success('Credential data copied to clipboard')
    } catch (error) {
      console.error('Error sharing credential:', error)
      toast.error('Failed to share credential')
    }
  }

  const filteredCredentials = credentials.filter(credential => 
    credential.credential_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    credential.issuer_did.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCredentialTypeIcon = (type: CredentialType) => {
    switch (type) {
      case 'service_completion':
        return <Award className="h-4 w-4 text-blue-500" />
      case 'payment_history':
        return <FileText className="h-4 w-4 text-green-500" />
      case 'utility_payment':
        return <Shield className="h-4 w-4 text-purple-500" />
      case 'identity_verification':
        return <Users className="h-4 w-4 text-orange-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getCredentialTypeLabel = (type: CredentialType) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Digital Wallet</h2>
          <p className="text-gray-600">Manage your decentralized identity and verifiable credentials</p>
        </div>
        {!userDID && (
          <Button 
            onClick={handleCreateDID} 
            disabled={creatingDID}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {creatingDID ? 'Creating DID...' : 'Create DID'}
          </Button>
        )}
      </div>

      {/* DID Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-500" />
            Decentralized Identity (DID)
          </CardTitle>
          <CardDescription>
            Your unique digital identifier in the credit system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userDID ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {userDID.did_identifier}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {formatDate(userDID.created_at)}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export DID
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No DID Found</h3>
              <p className="text-gray-500 mb-4">
                Create a Decentralized Identity to start using the credit system
              </p>
              <Button onClick={handleCreateDID} disabled={creatingDID}>
                <Plus className="h-4 w-4 mr-2" />
                {creatingDID ? 'Creating DID...' : 'Create DID'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credentials Section */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">My Credentials</TabsTrigger>
          <TabsTrigger value="details">Credential Details</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search credentials by type or issuer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Credentials List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Verifiable Credentials ({credentials.length})</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {credentials.filter(c => !c.is_revoked).length} Active
                  </Badge>
                  <Badge variant="outline">
                    {credentials.filter(c => c.is_revoked).length} Revoked
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>
                Your verifiable credentials issued by trusted organizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCredentials.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No credentials found</p>
                      <p className="text-sm">Complete services to earn verifiable credentials</p>
                    </div>
                  ) : (
                    filteredCredentials.map((credential) => (
                      <div
                        key={credential.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getCredentialTypeIcon(credential.credential_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900">
                                {getCredentialTypeLabel(credential.credential_type)}
                              </p>
                              <Badge 
                                variant={credential.is_revoked ? "destructive" : "default"}
                                className={credential.is_revoked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                              >
                                {credential.is_revoked ? (
                                  <>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Revoked
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Active
                                  </>
                                )}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              Issuer: {credential.issuer_did}
                            </p>
                            <p className="text-xs text-gray-400">
                              Issued: {formatDate(credential.issued_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCredential(credential)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerifyCredential(credential.id)}
                          >
                            <Shield className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShareCredential(credential)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedCredential ? (
            <Card>
              <CardHeader>
                <CardTitle>Credential Details</CardTitle>
                <CardDescription>
                  Detailed information about the selected credential
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Credential Type</label>
                    <p className="text-sm text-gray-900 capitalize">
                      {getCredentialTypeLabel(selectedCredential.credential_type)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Badge 
                      variant={selectedCredential.is_revoked ? "destructive" : "default"}
                      className={selectedCredential.is_revoked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                    >
                      {selectedCredential.is_revoked ? 'Revoked' : 'Active'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Issuer DID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedCredential.issuer_did}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Issued At</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedCredential.issued_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Expires At</label>
                    <p className="text-sm text-gray-900">
                      {selectedCredential.expires_at ? formatDate(selectedCredential.expires_at) : 'Never'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Credential Data</label>
                  <pre className="text-sm text-gray-900 bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(selectedCredential.credential_data, null, 2)}
                  </pre>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Proof Signature</label>
                  <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded break-all">
                    {selectedCredential.proof_signature}
                  </p>
                </div>

                {selectedCredential.is_revoked && selectedCredential.revocation_reason && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Revocation Reason</label>
                    <p className="text-sm text-gray-900">{selectedCredential.revocation_reason}</p>
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCredential(null)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleVerifyCredential(selectedCredential.id)}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Verify Credential
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShareCredential(selectedCredential)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Credential
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Credential Selected</h3>
                  <p className="text-gray-500">
                    Select a credential from the list to view its details
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

