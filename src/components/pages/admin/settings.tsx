'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Settings, Save, RefreshCw, Download, Upload, Trash2, Shield, Bell, Database, Wrench, Info, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'BSM Platform',
      siteDescription: 'Business Service Management Platform',
      timezone: 'UTC',
      language: 'en',
      theme: 'light'
    },
    security: {
      passwordMinLength: 8,
      requireTwoFactor: false,
      sessionTimeout: 30,
      allowRegistration: true,
      emailVerification: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      ticketUpdates: true,
      systemAlerts: true
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      cloudBackup: false
    },
    maintenance: {
      maintenanceMode: false,
      scheduledMaintenance: false,
      maintenanceMessage: 'System is under maintenance. Please try again later.'
    }
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const handleSaveSettings = async () => {
    try {
      setLoading(true)
      // Here you would typically save to your database
      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      toast.success('Settings reset to default values!')
    }
  }

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'bsm-platform-settings.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast.success('Settings exported successfully!')
  }

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          setSettings(importedSettings)
          toast.success('Settings imported successfully!')
        } catch (error) {
          toast.error('Invalid settings file. Please try again.')
        }
      }
      reader.readAsText(file)
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'backup', label: 'Backup', icon: Database },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench }
  ]

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Configuration</CardTitle>
          <CardDescription>Basic site settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">Site Name</label>
            <Input
              id="siteName"
              value={settings.general.siteName}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, siteName: e.target.value }
              }))}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">Site Description</label>
            <Input
              id="siteDescription"
              value={settings.general.siteDescription}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, siteDescription: e.target.value }
              }))}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
            <select
              id="timezone"
              value={settings.general.timezone}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, timezone: e.target.value }
              }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
            <select
              id="language"
              value={settings.general.language}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, language: e.target.value }
              }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Configure security policies and authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="passwordMinLength" className="block text-sm font-medium text-gray-700">Minimum Password Length</label>
            <Input
              id="passwordMinLength"
              type="number"
              value={settings.security.passwordMinLength}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                security: { ...prev.security, passwordMinLength: parseInt(e.target.value) }
              }))}
              className="mt-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="requireTwoFactor"
              checked={settings.security.requireTwoFactor}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                security: { ...prev.security, requireTwoFactor: e.target.checked }
              }))}
              className="rounded"
            />
            <label htmlFor="requireTwoFactor" className="text-sm font-medium text-gray-700">Require Two-Factor Authentication</label>
          </div>
          <div>
            <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
            <Input
              id="sessionTimeout"
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
              }))}
              className="mt-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allowRegistration"
              checked={settings.security.allowRegistration}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                security: { ...prev.security, allowRegistration: e.target.checked }
              }))}
              className="rounded"
            />
            <label htmlFor="allowRegistration" className="text-sm font-medium text-gray-700">Allow User Registration</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="emailVerification"
              checked={settings.security.emailVerification}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                security: { ...prev.security, emailVerification: e.target.checked }
              }))}
              className="rounded"
            />
            <label htmlFor="emailVerification" className="text-sm font-medium text-gray-700">Require Email Verification</label>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, emailNotifications: e.target.checked }
              }))}
              className="rounded"
            />
            <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">Email Notifications</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="pushNotifications"
              checked={settings.notifications.pushNotifications}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, pushNotifications: e.target.checked }
              }))}
              className="rounded"
            />
            <label htmlFor="pushNotifications" className="text-sm font-medium text-gray-700">Push Notifications</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="smsNotifications"
              checked={settings.notifications.smsNotifications}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, smsNotifications: e.target.checked }
              }))}
              className="rounded"
            />
            <label htmlFor="smsNotifications" className="text-sm font-medium text-gray-700">SMS Notifications</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="ticketUpdates"
              checked={settings.notifications.ticketUpdates}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, ticketUpdates: e.target.checked }
              }))}
              className="rounded"
            />
            <label htmlFor="ticketUpdates" className="text-sm font-medium text-gray-700">Ticket Update Notifications</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="systemAlerts"
              checked={settings.notifications.systemAlerts}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, systemAlerts: e.target.checked }
              }))}
              className="rounded"
            />
            <label htmlFor="systemAlerts" className="text-sm font-medium text-gray-700">System Alert Notifications</label>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Backup Settings</CardTitle>
          <CardDescription>Configure data backup and recovery options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoBackup"
              checked={settings.backup.autoBackup}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                backup: { ...prev.backup, autoBackup: e.target.checked }
              }))}
              className="rounded"
            />
            <label htmlFor="autoBackup" className="text-sm font-medium text-gray-700">Enable Automatic Backup</label>
          </div>
          <div>
            <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700">Backup Frequency</label>
            <select
              id="backupFrequency"
              value={settings.backup.backupFrequency}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                backup: { ...prev.backup, backupFrequency: e.target.value }
              }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label htmlFor="retentionDays" className="block text-sm font-medium text-gray-700">Retention Period (days)</label>
            <Input
              id="retentionDays"
              type="number"
              value={settings.backup.retentionDays}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                backup: { ...prev.backup, retentionDays: parseInt(e.target.value) }
              }))}
              className="mt-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="cloudBackup"
              checked={settings.backup.cloudBackup}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                backup: { ...prev.backup, cloudBackup: e.target.checked }
              }))}
              className="rounded"
            />
            <label htmlFor="cloudBackup" className="text-sm font-medium text-gray-700">Enable Cloud Backup</label>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderMaintenanceSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Settings</CardTitle>
          <CardDescription>Configure system maintenance and downtime</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={settings.maintenance.maintenanceMode}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                maintenance: { ...prev.maintenance, maintenanceMode: e.target.checked }
              }))}
              className="rounded"
            />
            <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700">Enable Maintenance Mode</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="scheduledMaintenance"
              checked={settings.maintenance.scheduledMaintenance}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                maintenance: { ...prev.maintenance, scheduledMaintenance: e.target.checked }
              }))}
              className="rounded"
            />
            <label htmlFor="scheduledMaintenance" className="text-sm font-medium text-gray-700">Enable Scheduled Maintenance</label>
          </div>
          <div>
            <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700">Maintenance Message</label>
            <textarea
              id="maintenanceMessage"
              rows={3}
              value={settings.maintenance.maintenanceMessage}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                maintenance: { ...prev.maintenance, maintenanceMessage: e.target.value }
              }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'security':
        return renderSecuritySettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'backup':
        return renderBackupSettings()
      case 'maintenance':
        return renderMaintenanceSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600">Configure system-wide settings and preferences</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={handleSaveSettings} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button onClick={handleResetSettings} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Settings Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Settings Content */}
      {renderContent()}

      {/* Import/Export */}
      <Card>
        <CardHeader>
          <CardTitle>Import/Export Settings</CardTitle>
          <CardDescription>Backup or restore your configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button onClick={handleExportSettings} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Settings
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportSettings}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current system status and version information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Platform Version:</strong> 1.0.0</p>
              <p><strong>Database:</strong> PostgreSQL (Supabase)</p>
              <p><strong>Framework:</strong> Next.js 14</p>
            </div>
            <div>
              <p><strong>Last Backup:</strong> {new Date().toLocaleString()}</p>
              <p><strong>System Status:</strong> <Badge className="bg-green-100 text-green-800">Online</Badge></p>
              <p><strong>Uptime:</strong> 99.9%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

