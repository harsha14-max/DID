'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, Plus, Download, Search, Filter, Eye, Edit, MoreHorizontal, X, 
  Server, Monitor, Wifi, Mouse, Keyboard, Printer, Star, TrendingUp, 
  Users, DollarSign, Shield, CheckCircle, AlertTriangle, Clock, Globe,
  Phone, Mail, MapPin, Calendar, FileText, Settings, BarChart3
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface Lender {
  id: string
  name: string
  type: 'bank' | 'utility' | 'government' | 'fintech'
  capacity: string
  location: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  rating: number
  contact_email: string
  contact_phone: string
  website: string
  description: string
  did: string
  created_at: string
  updated_at: string
  total_loans: number
  success_rate: number
  avg_processing_time: number
}

export default function LendersPage() {
  const [lenders, setLenders] = useState<Lender[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedLender, setSelectedLender] = useState<Lender | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingLender, setEditingLender] = useState<Lender | null>(null)
  const [showDIDModal, setShowDIDModal] = useState(false)
  const [selectedLenderForDID, setSelectedLenderForDID] = useState<Lender | null>(null)
  const [generatedDID, setGeneratedDID] = useState('')
  const [newLender, setNewLender] = useState({
    name: '',
    type: 'bank' as const,
    capacity: '',
    location: '',
    status: 'active' as const,
    rating: 5,
    contact_email: '',
    contact_phone: '',
    website: '',
    description: ''
  })

  // Mock data for demonstration
  const mockLenders: Lender[] = [
    {
      id: '1',
      name: 'CredX National Bank',
      type: 'bank',
      capacity: '$50M',
      location: 'New York, NY',
      status: 'active',
      rating: 4.8,
      contact_email: 'contact@credxbank.com',
      contact_phone: '+1-555-0123',
      website: 'https://credxbank.com',
      description: 'Leading digital bank specializing in credit solutions',
      did: 'did:credX:lender:bank:001',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      total_loans: 1250,
      success_rate: 94.5,
      avg_processing_time: 2.3
    },
    {
      id: '2',
      name: 'Metro Utility Credit',
      type: 'utility',
      capacity: '$25M',
      location: 'Chicago, IL',
      status: 'active',
      rating: 4.6,
      contact_email: 'credit@metroutility.com',
      contact_phone: '+1-555-0456',
      website: 'https://metroutility.com',
      description: 'Utility company offering credit services to customers',
      did: 'did:credX:lender:utility:002',
      created_at: '2024-01-14T09:15:00Z',
      updated_at: '2024-01-14T09:15:00Z',
      total_loans: 890,
      success_rate: 91.2,
      avg_processing_time: 3.1
    },
    {
      id: '3',
      name: 'Federal Credit Agency',
      type: 'government',
      capacity: '$100M',
      location: 'Washington, DC',
      status: 'active',
      rating: 4.9,
      contact_email: 'info@fedcredit.gov',
      contact_phone: '+1-555-0789',
      website: 'https://fedcredit.gov',
      description: 'Government agency providing credit services',
      did: 'did:credX:lender:government:003',
      created_at: '2024-01-13T14:20:00Z',
      updated_at: '2024-01-13T14:20:00Z',
      total_loans: 2100,
      success_rate: 96.8,
      avg_processing_time: 1.8
    },
    {
      id: '4',
      name: 'FinTech Solutions Inc',
      type: 'fintech',
      capacity: '$15M',
      location: 'San Francisco, CA',
      status: 'pending',
      rating: 4.3,
      contact_email: 'hello@fintechsolutions.com',
      contact_phone: '+1-555-0321',
      website: 'https://fintechsolutions.com',
      description: 'Innovative fintech company with AI-powered lending',
      did: 'did:credX:lender:fintech:004',
      created_at: '2024-01-12T11:45:00Z',
      updated_at: '2024-01-12T11:45:00Z',
      total_loans: 450,
      success_rate: 88.7,
      avg_processing_time: 4.2
    }
  ]

  useEffect(() => {
    fetchLenders()
  }, [])

  const fetchLenders = async () => {
    try {
      setLoading(true)
      
      const { data: lendersData, error } = await supabase
        .from('lenders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching lenders:', error)
        toast.error('Failed to load lenders. Please try again.')
        return
      }

      // Transform Supabase data to match our interface
      const transformedLenders: Lender[] = (lendersData || []).map((lender: any) => ({
        id: lender.id,
        name: lender.name,
        type: lender.metadata?.type || 'bank',
        capacity: `$${(lender.lending_capacity / 1000000).toFixed(0)}M`,
        location: lender.metadata?.location || 'N/A',
        status: lender.is_active ? 'active' : 'inactive',
        rating: lender.metadata?.rating || 4.0,
        contact_email: lender.email,
        contact_phone: lender.phone,
        website: lender.metadata?.website || '',
        description: lender.metadata?.description || '',
        did: lender.special_did_id || '',
        created_at: lender.created_at,
        updated_at: lender.updated_at,
        total_loans: lender.metadata?.total_loans || 0,
        success_rate: lender.metadata?.success_rate || 0,
        avg_processing_time: lender.metadata?.avg_processing_time || 0
      }))

      setLenders(transformedLenders)
      console.log('Lenders loaded from Supabase:', transformedLenders.length)
    } catch (error) {
      console.error('Error fetching lenders:', error)
      toast.error('Failed to load lenders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateDID = (type: string) => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `did:credX:lender:${type}:${timestamp}:${random}`
  }

  const handleGenerateDID = (lender: Lender) => {
    const newDID = generateDID(lender.type)
    setGeneratedDID(newDID)
    setSelectedLenderForDID(lender)
    setShowDIDModal(true)
  }

  const handleSaveDID = async () => {
    if (!selectedLenderForDID || !generatedDID) return

    try {
      // In a real app, this would update the lender's DID in Supabase
      setLenders(prev => prev.map(lender => 
        lender.id === selectedLenderForDID.id 
          ? { ...lender, did: generatedDID }
          : lender
      ))
      
      toast.success('DID generated and saved successfully!')
      setShowDIDModal(false)
      setSelectedLenderForDID(null)
      setGeneratedDID('')
    } catch (error) {
      console.error('Error saving DID:', error)
      toast.error('Failed to save DID. Please try again.')
    }
  }

  const handleCreateLender = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newLender.name.trim()) {
      toast.error('Please enter a lender name')
      return
    }

    try {
      setLoading(true)

      const lenderData: Lender = {
        id: Date.now().toString(),
        name: newLender.name.trim(),
        type: newLender.type,
        capacity: newLender.capacity.trim(),
        location: newLender.location.trim(),
        status: newLender.status,
        rating: newLender.rating,
        contact_email: newLender.contact_email.trim(),
        contact_phone: newLender.contact_phone.trim(),
        website: newLender.website.trim(),
        description: newLender.description.trim(),
        did: generateDID(newLender.type),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        total_loans: 0,
        success_rate: 0,
        avg_processing_time: 0
      }

      // In a real app, this would be saved to Supabase
      setLenders(prev => [lenderData, ...prev])
      toast.success('Lender created successfully!')
      setShowCreateModal(false)
      setNewLender({
        name: '',
        type: 'bank',
        capacity: '',
        location: '',
        status: 'active',
        rating: 5,
        contact_email: '',
        contact_phone: '',
        website: '',
        description: ''
      })
    } catch (error) {
      console.error('Error creating lender:', error)
      toast.error('Failed to create lender. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setNewLender(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const filteredLenders = lenders.filter(lender => {
    const matchesSearch = lender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lender.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lender.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || lender.type === typeFilter
    const matchesStatus = statusFilter === 'all' || lender.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bank': return Building2
      case 'utility': return Server
      case 'government': return Shield
      case 'fintech': return TrendingUp
      default: return Building2
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bank': return 'bg-blue-100 text-blue-800'
      case 'utility': return 'bg-green-100 text-green-800'
      case 'government': return 'bg-purple-100 text-purple-800'
      case 'fintech': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'inactive': return X
      case 'pending': return Clock
      case 'suspended': return AlertTriangle
      default: return Clock
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lenders Management</h2>
          <p className="text-gray-600">Manage financial institutions and lending partners</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Lender
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lenders</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{lenders.length}</div>
            <p className="text-xs text-green-600">+2 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banks</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {lenders.filter(l => l.type === 'bank').length}
            </div>
            <p className="text-xs text-gray-500">Financial institutions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilities</CardTitle>
            <Server className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {lenders.filter(l => l.type === 'utility').length}
            </div>
            <p className="text-xs text-gray-500">Utility companies</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Government</CardTitle>
            <Shield className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {lenders.filter(l => l.type === 'government').length}
            </div>
            <p className="text-xs text-gray-500">Government agencies</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search lenders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="bank">Banks</option>
                <option value="utility">Utilities</option>
                <option value="government">Government</option>
                <option value="fintech">Fintech</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
                Advanced
            </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lenders Directory */}
      <Card>
        <CardHeader>
          <CardTitle>Lenders Directory</CardTitle>
          <CardDescription>
            Showing {filteredLenders.length} lenders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLenders.map((lender) => {
              const TypeIcon = getTypeIcon(lender.type)
              const StatusIcon = getStatusIcon(lender.status)
              return (
                <div
                  key={lender.id}
                  className="flex items-center justify-between p-6 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedLender(lender)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <TypeIcon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{lender.name}</h3>
                        <Badge className={getTypeColor(lender.type)}>
                          {lender.type.charAt(0).toUpperCase() + lender.type.slice(1)}
                        </Badge>
                        <Badge className={getStatusColor(lender.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {lender.status.charAt(0).toUpperCase() + lender.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{lender.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{lender.capacity}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="flex">{renderStars(lender.rating)}</div>
                          <span>({lender.rating})</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-xs text-gray-500">
                        <span>DID: {lender.did}</span>
                        <span>Loans: {lender.total_loans}</span>
                        <span>Success Rate: {lender.success_rate}%</span>
                        <span>Avg Time: {lender.avg_processing_time}d</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation()
                      setEditingLender(lender)
                      setShowEditModal(true)
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleGenerateDID(lender)
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
            {filteredLenders.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No lenders found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Lender
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lender Detail Modal */}
      {selectedLender && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  {React.createElement(getTypeIcon(selectedLender.type), { className: "h-6 w-6 text-gray-600" })}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedLender.name}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getTypeColor(selectedLender.type)}>
                      {selectedLender.type.charAt(0).toUpperCase() + selectedLender.type.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(selectedLender.status)}>
                      {selectedLender.status.charAt(0).toUpperCase() + selectedLender.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setSelectedLender(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm"><strong>Location:</strong> {selectedLender.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm"><strong>Capacity:</strong> {selectedLender.capacity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">{renderStars(selectedLender.rating)}</div>
                    <span className="text-sm"><strong>Rating:</strong> {selectedLender.rating}/5</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm"><strong>DID:</strong> {selectedLender.did}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedLender.contact_email}</span>
                  </div>
              <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedLender.contact_phone}</span>
              </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a href={selectedLender.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      {selectedLender.website}
                    </a>
                </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Loans</span>
                    <span className="font-semibold">{selectedLender.total_loans}</span>
                </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-semibold text-green-600">{selectedLender.success_rate}%</span>
              </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Processing Time</span>
                    <span className="font-semibold">{selectedLender.avg_processing_time} days</span>
                </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{selectedLender.description}</p>
                </CardContent>
              </Card>
              </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => {
                setEditingLender(selectedLender)
                setShowEditModal(true)
                setSelectedLender(null)
              }}>
                Edit Lender
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">
                Suspend Lender
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Lender Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Create New Lender</h2>
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4" onSubmit={handleCreateLender}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Lender Name</label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Enter lender name" 
                    value={newLender.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
              <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Lender Type</label>
                  <select 
                    id="type" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newLender.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <option value="bank">Bank</option>
                    <option value="utility">Utility</option>
                    <option value="government">Government</option>
                    <option value="fintech">Fintech</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">Lending Capacity</label>
                  <Input 
                    id="capacity" 
                    type="text" 
                    placeholder="e.g., $50M" 
                    value={newLender.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                  />
              </div>
              <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <Input 
                    id="location" 
                    type="text" 
                    placeholder="City, State" 
                    value={newLender.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <Input 
                    id="contact_email" 
                    type="email" 
                    placeholder="contact@lender.com" 
                    value={newLender.contact_email}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  />
              </div>
              <div>
                  <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <Input 
                    id="contact_phone" 
                    type="tel" 
                    placeholder="+1-555-0123" 
                    value={newLender.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <Input 
                  id="website" 
                  type="url" 
                  placeholder="https://lender.com" 
                  value={newLender.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  id="description" 
                  placeholder="Brief description of the lender" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  value={newLender.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Lender'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DID Generation Modal */}
      {showDIDModal && selectedLenderForDID && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Generate DID for {selectedLenderForDID.name}</h2>
              <Button variant="ghost" onClick={() => setShowDIDModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Generated DID</label>
                <div className="p-3 bg-gray-100 rounded-md border">
                  <code className="text-sm text-gray-800 break-all">{generatedDID}</code>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800 font-medium">DID Information</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  This DID will be associated with {selectedLenderForDID.name} and can be used for secure identity verification.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowDIDModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveDID}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save DID
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}