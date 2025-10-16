'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Upload, 
  Send, 
  X, 
  FileText, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Star,
  HelpCircle,
  Paperclip,
  Image,
  File
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TicketFormData {
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  attachments: File[]
}

interface TicketCreationFormProps {
  className?: string
  onSubmit?: (data: TicketFormData) => void
  onCancel?: () => void
}

export function TicketCreationForm({ className, onSubmit, onCancel }: TicketCreationFormProps) {
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    attachments: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const categories = [
    'Technical Support',
    'Account Issues',
    'Billing',
    'Feature Request',
    'Bug Report',
    'General Inquiry',
    'Training',
    'Other'
  ]

  const priorityLevels = [
    { value: 'low', label: 'Low', description: 'Non-urgent request', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', description: 'Standard priority', color: 'text-yellow-600' },
    { value: 'high', label: 'High', description: 'Important issue', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', description: 'Critical issue', color: 'text-red-600' }
  ]

  const handleInputChange = (field: keyof TicketFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    
    const newFiles = Array.from(files)
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles]
    }))
  }

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const getFileIcon = (file: File) => {
    const type = file.type
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (onSubmit) {
        onSubmit(formData)
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        attachments: []
      })
    } catch (error) {
      console.error('Error submitting ticket:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.title.trim() && formData.description.trim() && formData.category

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Create New Ticket</h2>
          <p className="text-muted-foreground">Describe your issue and we'll help you resolve it quickly</p>
        </div>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>

      {/* Help Section */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Tips for Better Support
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Be specific about the issue you're experiencing</li>
                <li>• Include steps to reproduce the problem</li>
                <li>• Attach relevant screenshots or files</li>
                <li>• Choose the appropriate priority level</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Ticket Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of your issue"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {priorityLevels.map((priority) => (
                  <div
                    key={priority.value}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer transition-colors",
                      formData.priority === priority.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    )}
                    onClick={() => handleInputChange('priority', priority.value as any)}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="priority"
                        value={priority.value}
                        checked={formData.priority === priority.value}
                        onChange={() => handleInputChange('priority', priority.value as any)}
                        className="text-primary"
                      />
                      <div>
                        <div className={cn("font-medium", priority.color)}>
                          {priority.label}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {priority.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                placeholder="Please provide detailed information about your issue..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm min-h-[120px] resize-y"
                required
              />
              <p className="text-xs text-muted-foreground">
                Include steps to reproduce the issue, error messages, and any relevant context.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* File Attachments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Paperclip className="h-5 w-5 mr-2" />
              Attachments
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Upload screenshots, documents, or other files that might help us understand your issue
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Area */}
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Supported formats: Images, PDFs, Documents (Max 10MB each)
              </p>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </div>

            {/* Attached Files */}
            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                <Label>Attached Files ({formData.attachments.length})</Label>
                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file)}
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SLA Information */}
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  Service Level Agreement
                </h3>
                <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <p>• <strong>Urgent:</strong> Response within 2 hours</p>
                  <p>• <strong>High:</strong> Response within 4 hours</p>
                  <p>• <strong>Medium:</strong> Response within 8 hours</p>
                  <p>• <strong>Low:</strong> Response within 24 hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            By submitting this ticket, you agree to our terms of service and privacy policy.
          </div>
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Ticket
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}











