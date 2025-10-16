// =====================================================
// BSM Platform - Customer Privacy Controls Component
// =====================================================
// Component for managing privacy settings and data sharing controls

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Settings, 
  Users, 
  Building2,
  FileText,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Save,
  Key,
  Database,
  Globe,
  Smartphone,
  Laptop,
  Server,
  Activity,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Info,
  HelpCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { 
  PrivacyControlsProps,
  PrivacySettings,
  DataSharingConsent,
  AuditLog
} from '@/types/credit'

export default function PrivacyControls({ userId, onSettingsUpdated }: PrivacyControlsProps) {
  
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataSharingEnabled: false,
    analyticsEnabled: false,
    marketingEnabled: false,
    thirdPartySharing: false,
    dataRetentionPeriod: 365,
    autoDeleteExpiredData: true,
    requireExplicitConsent: true,
    anonymizeData: true,
    encryptPersonalData: true,
    allowDataPortability: true,
    allowDataDeletion: true,
    auditLogging: true
  })

  const [consents, setConsents] = useState<DataSharingConsent[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPrivacyData()
  }, [userId])

  const loadPrivacyData = async () => {
    try {
      setLoading(true)
      
      // Load privacy settings
      const settingsData = await fetch(`/api/credit/privacy/settings?user_id=${userId}`)
        .then(res => res.json())
      setPrivacySettings(settingsData || privacySettings)

      // Load data sharing consents
      const consentsData = await fetch(`/api/credit/privacy/consents?user_id=${userId}`)
        .then(res => res.json())
      setConsents(consentsData || [])

      // Load audit logs
      const auditData = await fetch(`/api/credit/privacy/audit-logs?user_id=${userId}`)
        .then(res => res.json())
      setAuditLogs(auditData || [])

    } catch (error) {
      console.error('Error loading privacy data:', error)
      toast.error('Failed to load privacy settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (key: keyof PrivacySettings, value: boolean | number) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      
      const response = await fetch(`/api/credit/privacy/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          ...privacySettings
        })
      })

      if (response.ok) {
        toast.success('Privacy settings saved successfully!')
        onSettingsUpdated?.()
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving privacy settings:', error)
      toast.error('Failed to save privacy settings')
    } finally {
      setSaving(false)
    }
  }

  const handleRevokeConsent = async (consentId: string) => {
    if (!confirm('Are you sure you want to revoke this consent?')) return

    try {
      const response = await fetch(`/api/credit/privacy/consents/${consentId}/revoke`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      })

      if (response.ok) {
        toast.success('Consent revoked successfully!')
        loadPrivacyData()
      } else {
        throw new Error('Failed to revoke consent')
      }
    } catch (error) {
      console.error('Error revoking consent:', error)
      toast.error('Failed to revoke consent')
    }
  }

  const handleRequestDataDeletion = async () => {
    if (!confirm('Are you sure you want to request data deletion? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/credit/privacy/request-deletion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      })

      if (response.ok) {
        toast.success('Data deletion request submitted successfully!')
      } else {
        throw new Error('Failed to submit deletion request')
      }
    } catch (error) {
      console.error('Error requesting data deletion:', error)
      toast.error('Failed to submit deletion request')
    }
  }

  const handleExportData = async () => {
    try {
      const response = await fetch(`/api/credit/privacy/export-data?user_id=${userId}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `my-data-export-${new Date().toISOString().split('T')[0]}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Data exported successfully!')
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Failed to export data')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Controls</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your data privacy and sharing preferences</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleSaveSettings} disabled={saving} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </Button>
          <Button variant="outline" onClick={loadPrivacyData} className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Privacy Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Data Sharing</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {privacySettings.dataSharingEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              {privacySettings.dataSharingEnabled ? (
                <Eye className="h-8 w-8 text-green-600" />
              ) : (
                <EyeOff className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Consents</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {consents.filter(c => c.is_active).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Data Retention</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {privacySettings.dataRetentionPeriod} days
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Audit Events</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {auditLogs.length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Privacy Settings</TabsTrigger>
          <TabsTrigger value="consents">Data Consents</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        {/* Privacy Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Sharing Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Data Sharing Controls</span>
                </CardTitle>
                <CardDescription>Control how your data is shared with third parties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-sharing">Enable Data Sharing</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Allow sharing of anonymized data for research and analytics
                    </p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={privacySettings.dataSharingEnabled}
                    onCheckedChange={(checked) => handleSettingChange('dataSharingEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">Analytics Tracking</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Allow analytics tracking for service improvement
                    </p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={privacySettings.analyticsEnabled}
                    onCheckedChange={(checked) => handleSettingChange('analyticsEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing">Marketing Communications</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive marketing emails and promotional content
                    </p>
                  </div>
                  <Switch
                    id="marketing"
                    checked={privacySettings.marketingEnabled}
                    onCheckedChange={(checked) => handleSettingChange('marketingEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="third-party">Third-Party Sharing</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Allow sharing with trusted third-party partners
                    </p>
                  </div>
                  <Switch
                    id="third-party"
                    checked={privacySettings.thirdPartySharing}
                    onCheckedChange={(checked) => handleSettingChange('thirdPartySharing', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Protection Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Data Protection</span>
                </CardTitle>
                <CardDescription>Advanced data protection and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="explicit-consent">Require Explicit Consent</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Require explicit consent for each data sharing action
                    </p>
                  </div>
                  <Switch
                    id="explicit-consent"
                    checked={privacySettings.requireExplicitConsent}
                    onCheckedChange={(checked) => handleSettingChange('requireExplicitConsent', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="anonymize">Anonymize Data</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically anonymize personal data when possible
                    </p>
                  </div>
                  <Switch
                    id="anonymize"
                    checked={privacySettings.anonymizeData}
                    onCheckedChange={(checked) => handleSettingChange('anonymizeData', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="encrypt">Encrypt Personal Data</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Encrypt all personal data at rest and in transit
                    </p>
                  </div>
                  <Switch
                    id="encrypt"
                    checked={privacySettings.encryptPersonalData}
                    onCheckedChange={(checked) => handleSettingChange('encryptPersonalData', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="audit-logging">Audit Logging</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Log all data access and modification events
                    </p>
                  </div>
                  <Switch
                    id="audit-logging"
                    checked={privacySettings.auditLogging}
                    onCheckedChange={(checked) => handleSettingChange('auditLogging', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Retention Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Data Retention</span>
                </CardTitle>
                <CardDescription>Control how long your data is retained</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="retention-period">Data Retention Period (days)</Label>
                  <input
                    id="retention-period"
                    type="number"
                    min="30"
                    max="2555"
                    value={privacySettings.dataRetentionPeriod}
                    onChange={(e) => handleSettingChange('dataRetentionPeriod', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Data will be automatically deleted after this period
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-delete">Auto-Delete Expired Data</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically delete data that has exceeded retention period
                    </p>
                  </div>
                  <Switch
                    id="auto-delete"
                    checked={privacySettings.autoDeleteExpiredData}
                    onCheckedChange={(checked) => handleSettingChange('autoDeleteExpiredData', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Rights Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>Data Rights</span>
                </CardTitle>
                <CardDescription>Control your data rights and access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-portability">Allow Data Portability</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Allow exporting your data in a portable format
                    </p>
                  </div>
                  <Switch
                    id="data-portability"
                    checked={privacySettings.allowDataPortability}
                    onCheckedChange={(checked) => handleSettingChange('allowDataPortability', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-deletion">Allow Data Deletion</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Allow requesting complete deletion of your data
                    </p>
                  </div>
                  <Switch
                    id="data-deletion"
                    checked={privacySettings.allowDataDeletion}
                    onCheckedChange={(checked) => handleSettingChange('allowDataDeletion', checked)}
                  />
                </div>
                <div className="pt-4 space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={handleExportData}
                    className="w-full flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export My Data</span>
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleRequestDataDeletion}
                    className="w-full flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Request Data Deletion</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Consents Tab */}
        <TabsContent value="consents" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {consents.map((consent) => (
              <Card key={consent.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {consent.consent_type}
                        </h3>
                        <Badge variant={consent.is_active ? "default" : "secondary"}>
                          {consent.is_active ? 'Active' : 'Revoked'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p><strong>Purpose:</strong> {consent.purpose}</p>
                        <p><strong>Data Types:</strong> {consent.data_types.join(', ')}</p>
                        <p><strong>Third Parties:</strong> {consent.third_parties.join(', ')}</p>
                        <p><strong>Granted:</strong> {new Date(consent.granted_at).toLocaleDateString()}</p>
                        {consent.revoked_at && (
                          <p><strong>Revoked:</strong> {new Date(consent.revoked_at).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {consent.is_active && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRevokeConsent(consent.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {auditLogs.map((log) => (
              <Card key={log.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {log.action}
                        </h3>
                        <Badge variant={
                          log.action_type === 'access' ? 'default' :
                          log.action_type === 'modification' ? 'secondary' :
                          'outline'
                        }>
                          {log.action_type}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p><strong>Resource:</strong> {log.resource_type}</p>
                        <p><strong>IP Address:</strong> {log.ip_address}</p>
                        <p><strong>User Agent:</strong> {log.user_agent}</p>
                        <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                        {log.details && (
                          <p><strong>Details:</strong> {log.details}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Data Management Tab */}
        <TabsContent value="data" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Usage Summary</CardTitle>
                <CardDescription>Overview of your data usage and storage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Data Stored</span>
                    <span className="font-semibold">2.3 MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Credentials</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Applications</span>
                    <span className="font-semibold">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                    <span className="font-semibold">2 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Sharing Summary</CardTitle>
                <CardDescription>Current data sharing status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Consents</span>
                    <span className="font-semibold">{consents.filter(c => c.is_active).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Third Parties</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Data Types Shared</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Shared</span>
                    <span className="font-semibold">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

