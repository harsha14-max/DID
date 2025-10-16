// =====================================================
// credX Platform - VC Generation Component
// =====================================================
// Component for requesting verifiable credentials from different issuers

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Zap, 
  Droplets, 
  Briefcase, 
  FileText, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Plus,
  X,
  Calendar,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  User,
  CreditCard,
  Shield,
  Key,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase/client'

interface Issuer {
  id: string
  name: string
  type: 'landlord' | 'electric' | 'utility' | 'gig-economy'
  description: string
  icon: React.ComponentType<any>
  color: string
  bgColor: string
  fields: {
    name: string
    type: 'text' | 'email' | 'phone' | 'number' | 'date' | 'textarea'
    label: string
    placeholder: string
    required: boolean
  }[]
}

interface VCRequest {
  id: string
  issuerId: string
  issuerName: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  approvedAt?: string
  formData: { [key: string]: string }
}

export default function VCGeneration() {
  const [issuers, setIssuers] = useState<Issuer[]>([
    {
      id: 'landlord-001',
      name: 'Property Management Co.',
      type: 'landlord',
      description: 'Request rental history verification from your landlord',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      fields: [
        { name: 'propertyAddress', type: 'text', label: 'Property Address', placeholder: 'Enter property address', required: true },
        { name: 'landlordName', type: 'text', label: 'Landlord Name', placeholder: 'Enter landlord name', required: true },
        { name: 'landlordEmail', type: 'email', label: 'Landlord Email', placeholder: 'landlord@example.com', required: true },
        { name: 'rentAmount', type: 'number', label: 'Monthly Rent', placeholder: 'Enter monthly rent amount', required: true },
        { name: 'leaseStart', type: 'date', label: 'Lease Start Date', placeholder: '', required: true },
        { name: 'leaseEnd', type: 'date', label: 'Lease End Date', placeholder: '', required: false },
        { name: 'additionalNotes', type: 'textarea', label: 'Additional Notes', placeholder: 'Any additional information...', required: false }
      ]
    },
    {
      id: 'electric-001',
      name: 'ElectroCorp Utilities',
      type: 'electric',
      description: 'Request electricity bill verification from your utility provider',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      fields: [
        { name: 'accountNumber', type: 'text', label: 'Account Number', placeholder: 'Enter your account number', required: true },
        { name: 'serviceAddress', type: 'text', label: 'Service Address', placeholder: 'Enter service address', required: true },
        { name: 'customerName', type: 'text', label: 'Customer Name', placeholder: 'Enter name on account', required: true },
        { name: 'phoneNumber', type: 'phone', label: 'Phone Number', placeholder: '+1 (555) 123-4567', required: true },
        { name: 'emailAddress', type: 'email', label: 'Email Address', placeholder: 'customer@example.com', required: true },
        { name: 'verificationPeriod', type: 'text', label: 'Verification Period', placeholder: 'e.g., Last 6 months', required: true }
      ]
    },
    {
      id: 'utility-001',
      name: 'AquaFlow Water Services',
      type: 'utility',
      description: 'Request water bill verification from your utility company',
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      fields: [
        { name: 'accountNumber', type: 'text', label: 'Account Number', placeholder: 'Enter your account number', required: true },
        { name: 'serviceAddress', type: 'text', label: 'Service Address', placeholder: 'Enter service address', required: true },
        { name: 'customerName', type: 'text', label: 'Customer Name', placeholder: 'Enter name on account', required: true },
        { name: 'phoneNumber', type: 'phone', label: 'Phone Number', placeholder: '+1 (555) 123-4567', required: true },
        { name: 'emailAddress', type: 'email', label: 'Email Address', placeholder: 'customer@example.com', required: true },
        { name: 'verificationPeriod', type: 'text', label: 'Verification Period', placeholder: 'e.g., Last 6 months', required: true }
      ]
    },
    {
      id: 'gig-001',
      name: 'FlexWork Platform',
      type: 'gig-economy',
      description: 'Request work history verification from gig economy platforms',
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      fields: [
        { name: 'platformName', type: 'text', label: 'Platform Name', placeholder: 'e.g., Uber, DoorDash, TaskRabbit', required: true },
        { name: 'username', type: 'text', label: 'Username/ID', placeholder: 'Enter your platform username', required: true },
        { name: 'emailAddress', type: 'email', label: 'Email Address', placeholder: 'platform@example.com', required: true },
        { name: 'workPeriod', type: 'text', label: 'Work Period', placeholder: 'e.g., Last 12 months', required: true },
        { name: 'totalEarnings', type: 'number', label: 'Total Earnings', placeholder: 'Enter total earnings', required: true },
        { name: 'workType', type: 'text', label: 'Type of Work', placeholder: 'e.g., Delivery, Ride-sharing, Freelance', required: true }
      ]
    }
  ])

  const [selectedIssuer, setSelectedIssuer] = useState<Issuer | null>(null)
  const [formData, setFormData] = useState<{ [key: string]: string }>({})
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requests, setRequests] = useState<VCRequest[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load existing requests from localStorage
    const savedRequests = localStorage.getItem('vc-requests')
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests))
    }
  }, [])

  const handleIssuerSelect = (issuer: Issuer) => {
    setSelectedIssuer(issuer)
    setFormData({})
    setShowRequestForm(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedIssuer) return

    setLoading(true)
    
    try {
      // Generate credential data
      const credentialId = `cred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const now = new Date()
      const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // 1 year
      
      // Create verifiable credential in Supabase
      const { data: credential, error } = await supabase
        .from('verifiable_credentials')
        .insert({
          credential_id: credentialId,
          issuer_did: `did:credX:${selectedIssuer.type}`,
          holder_did: `did:credX:user_${Date.now()}`,
          credential_type: `${selectedIssuer.type.charAt(0).toUpperCase() + selectedIssuer.type.slice(1)} Verification`,
          credential_data: formData,
          signature: `sig_${credentialId}`,
          issued_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          status: 'valid',
          user_id: '7728175c-891d-4d88-99d4-d1f7d96c6e17', // Default user ID for demo
          proof_signature: `proof_${credentialId}`,
          is_revoked: false,
          metadata: {
            issuer_name: selectedIssuer.name,
            issuer_type: selectedIssuer.type,
            approved_message: '✅ Approved and verified by issuer',
            form_data: formData
          }
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating credential:', error)
        toast.error('Failed to create credential')
        return
      }

      // Create request record
      const newRequest: VCRequest = {
        id: `req-${Date.now()}`,
        issuerId: selectedIssuer.id,
        issuerName: selectedIssuer.name,
        status: 'approved',
        submittedAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
        formData: { ...formData }
      }

      // Add to requests
      const updatedRequests = [...requests, newRequest]
      setRequests(updatedRequests)
      localStorage.setItem('vc-requests', JSON.stringify(updatedRequests))

      // Show success notification
      toast.success(`Your request to ${selectedIssuer.name} has been approved! Credential verified.`, {
        duration: 5000,
        icon: '✅'
      })

      // Reset form
      setFormData({})
      setShowRequestForm(false)
      setSelectedIssuer(null)

      // Create notification
      const notification = {
        id: `notif-${Date.now()}`,
        type: 'credential_approved',
        title: `Credential Approved: ${selectedIssuer.name}`,
        message: `Your ${selectedIssuer.name} verification has been approved and added to your credentials.`,
        timestamp: new Date().toISOString(),
        issuer: selectedIssuer.name,
        credentialType: selectedIssuer.type,
        read: false
      }
      
      // Save notification
      const existingNotifications = JSON.parse(localStorage.getItem('credential-notifications') || '[]')
      existingNotifications.push(notification)
      localStorage.setItem('credential-notifications', JSON.stringify(existingNotifications))

    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="warning" className="bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case 'approved': return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>
      case 'rejected': return <Badge variant="destructive" className="bg-red-100 text-red-700"><AlertCircle className="h-3 w-3 mr-1" /> Rejected</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getIssuerIcon = (type: string) => {
    switch (type) {
      case 'landlord': return <Building2 className="h-6 w-6 text-blue-600" />
      case 'electric': return <Zap className="h-6 w-6 text-yellow-600" />
      case 'utility': return <Droplets className="h-6 w-6 text-blue-600" />
      case 'gig-economy': return <Briefcase className="h-6 w-6 text-green-600" />
      default: return <FileText className="h-6 w-6 text-gray-600" />
    }
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
          <h2 className="text-3xl font-bold text-gray-900">VC Generation</h2>
          <p className="text-gray-600 mt-1">Request verifiable credentials from trusted issuers</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Issuers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {issuers.map(issuer => (
          <motion.div
            key={issuer.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleIssuerSelect(issuer)}>
              <CardHeader className="text-center">
                <div className={`mx-auto w-16 h-16 ${issuer.bgColor} rounded-full flex items-center justify-center mb-4`}>
                  <issuer.icon className={`h-8 w-8 ${issuer.color}`} />
                </div>
                <CardTitle className="text-lg">{issuer.name}</CardTitle>
                <CardDescription className="text-sm">{issuer.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Request Credential
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Requests */}
      {requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>Your recent verifiable credential requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.slice(-5).reverse().map(request => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getIssuerIcon(issuers.find(i => i.id === request.issuerId)?.type || '')}
                    <div>
                      <h4 className="font-medium">{request.issuerName}</h4>
                      <p className="text-sm text-gray-600">
                        Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(request.status)}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Request Form Modal */}
      <AnimatePresence>
        {showRequestForm && selectedIssuer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${selectedIssuer.bgColor} rounded-full flex items-center justify-center`}>
                        <selectedIssuer.icon className={`h-6 w-6 ${selectedIssuer.color}`} />
                      </div>
                      <div>
                        <CardTitle>Request Credential from {selectedIssuer.name}</CardTitle>
                        <CardDescription>{selectedIssuer.description}</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setShowRequestForm(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    {selectedIssuer.fields.map(field => (
                      <div key={field.name}>
                        <Label htmlFor={field.name} className="text-sm font-medium">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {field.type === 'textarea' ? (
                          <Textarea
                            id={field.name}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            required={field.required}
                            className="mt-1"
                            rows={3}
                          />
                        ) : (
                          <Input
                            id={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            required={field.required}
                            className="mt-1"
                          />
                        )}
                      </div>
                    ))}
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Request
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
