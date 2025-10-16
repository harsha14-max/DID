'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Package, Plus, Download, Search, Filter, Eye, Edit, MoreHorizontal, X, Server, Monitor, HardDrive, Wifi, Mouse, Keyboard, Printer } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      setLoading(true)

      const { data: assetsData, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching assets:', error)
        setAssets([])
        toast.error('Failed to load assets. Please try again.')
        return
      }

      setAssets(assetsData || [])
      console.log('Assets loaded from Supabase:', assetsData?.length || 0)
    } catch (error) {
      console.error('Error fetching assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.location?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hardware': return Server
      case 'software': return Monitor
      case 'network': return Wifi
      case 'peripheral': return Mouse
      default: return Package
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hardware': return 'bg-blue-100 text-blue-800'
      case 'software': return 'bg-green-100 text-green-800'
      case 'network': return 'bg-purple-100 text-purple-800'
      case 'peripheral': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'retired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
          <h2 className="text-2xl font-bold text-gray-900">Asset Management</h2>
          <p className="text-gray-600">Manage IT assets and inventory</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{assets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hardware</CardTitle>
            <Server className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {assets.filter(a => a.type === 'hardware').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Software</CardTitle>
            <Monitor className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assets.filter(a => a.type === 'software').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Wifi className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {assets.filter(a => a.type === 'network').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
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
                  placeholder="Search assets..."
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

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
          <CardDescription>
            Showing {filteredAssets.length} assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAssets.map((asset: any) => {
              const TypeIcon = getTypeIcon(asset.type)
              return (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedAsset(asset)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <TypeIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{asset.name || 'Unnamed Asset'}</h3>
                        <Badge className={getTypeColor(asset.type)}>
                          {asset.type?.replace(/-/g, ' ') || 'Unknown'}
                        </Badge>
                        <Badge className={getStatusColor(asset.status)}>
                          {asset.status || 'Unknown'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Serial: {asset.serial_number || 'N/A'} | Location: {asset.location || 'N/A'}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>ID: {asset.id}</span>
                        <span>Created: {new Date(asset.created_at).toLocaleDateString()}</span>
                        <span>Updated: {new Date(asset.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
            {filteredAssets.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedAsset.name || 'Unnamed Asset'}</h2>
              <Button variant="ghost" onClick={() => setSelectedAsset(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className={getTypeColor(selectedAsset.type)}>
                  {selectedAsset.type?.replace(/-/g, ' ') || 'Unknown'}
                </Badge>
                <Badge className={getStatusColor(selectedAsset.status)}>
                  {selectedAsset.status || 'Unknown'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><strong>Serial Number:</strong> {selectedAsset.serial_number || 'N/A'}</p>
                  <p><strong>Location:</strong> {selectedAsset.location || 'N/A'}</p>
                  <p><strong>Assigned To:</strong> {selectedAsset.assigned_to || 'N/A'}</p>
                </div>
                <div>
                  <p><strong>Created:</strong> {new Date(selectedAsset.created_at).toLocaleString()}</p>
                  <p><strong>Updated:</strong> {new Date(selectedAsset.updated_at).toLocaleString()}</p>
                  <p><strong>ID:</strong> {selectedAsset.id}</p>
                </div>
              </div>
              {selectedAsset.description && (
                <div>
                  <p><strong>Description:</strong></p>
                  <p className="text-gray-700">{selectedAsset.description}</p>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Edit</Button>
                <Button className="bg-red-600 hover:bg-red-700">Delete</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Asset Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create New Asset</h2>
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Asset Name</label>
                <Input id="name" type="text" placeholder="Asset name" className="mt-1" />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Asset Type</label>
                <select id="type" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="network">Network</option>
                  <option value="peripheral">Peripheral</option>
                </select>
              </div>
              <div>
                <label htmlFor="serial" className="block text-sm font-medium text-gray-700">Serial Number</label>
                <Input id="serial" type="text" placeholder="Serial number" className="mt-1" />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <Input id="location" type="text" placeholder="Asset location" className="mt-1" />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select id="status" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

