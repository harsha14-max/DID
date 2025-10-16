'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Building2, Plus, Download, Search, Filter, Eye, Edit, MoreHorizontal, X, User, DollarSign, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      setLoading(true)

      const { data: accountsData, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching accounts:', error)
        setAccounts([])
        toast.error('Failed to load accounts. Please try again.')
        return
      }

      setAccounts(accountsData || [])
      console.log('Accounts loaded from Supabase:', accountsData?.length || 0)
    } catch (error) {
      console.error('Error fetching accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          account.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          account.type?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      case 'small-business': return 'bg-blue-100 text-blue-800'
      case 'individual': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
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
          <h2 className="text-2xl font-bold text-gray-900">Account Management</h2>
          <p className="text-gray-600">Manage client accounts and organizations</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Account
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
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{accounts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enterprise</CardTitle>
            <Building2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {accounts.filter(a => a.type === 'enterprise').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Small Business</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {accounts.filter(a => a.type === 'small-business').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Individual</CardTitle>
            <User className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {accounts.filter(a => a.type === 'individual').length}
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
                  placeholder="Search accounts..."
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

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
          <CardDescription>
            Showing {filteredAccounts.length} accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAccounts.map((account: any) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedAccount(account)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900">{account.name || 'Unnamed Account'}</h3>
                      <Badge className={getTypeColor(account.type)}>
                        {account.type?.replace(/-/g, ' ') || 'Unknown'}
                      </Badge>
                      <Badge className={getStatusColor(account.status)}>
                        {account.status || 'Unknown'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{account.email || 'No email provided'}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>ID: {account.id}</span>
                      <span>Created: {new Date(account.created_at).toLocaleDateString()}</span>
                      <span>Updated: {new Date(account.updated_at).toLocaleDateString()}</span>
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
            ))}
            {filteredAccounts.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Detail Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedAccount.name || 'Unnamed Account'}</h2>
              <Button variant="ghost" onClick={() => setSelectedAccount(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className={getTypeColor(selectedAccount.type)}>
                  {selectedAccount.type?.replace(/-/g, ' ') || 'Unknown'}
                </Badge>
                <Badge className={getStatusColor(selectedAccount.status)}>
                  {selectedAccount.status || 'Unknown'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><strong>Email:</strong> {selectedAccount.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedAccount.phone || 'N/A'}</p>
                  <p><strong>Address:</strong> {selectedAccount.address || 'N/A'}</p>
                </div>
                <div>
                  <p><strong>Created:</strong> {new Date(selectedAccount.created_at).toLocaleString()}</p>
                  <p><strong>Updated:</strong> {new Date(selectedAccount.updated_at).toLocaleString()}</p>
                  <p><strong>ID:</strong> {selectedAccount.id}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Edit</Button>
                <Button className="bg-red-600 hover:bg-red-700">Delete</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create New Account</h2>
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Account Name</label>
                <Input id="name" type="text" placeholder="Account name" className="mt-1" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Input id="email" type="email" placeholder="account@example.com" className="mt-1" />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Account Type</label>
                <select id="type" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="individual">Individual</option>
                  <option value="small-business">Small Business</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" className="mt-1" />
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

