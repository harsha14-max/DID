'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Bot, 
  Send, 
  RefreshCw, 
  Copy, 
  CheckCircle,
  AlertCircle,
  Lightbulb,
  MessageSquare,
  User,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { aiService } from '@/lib/ai/ai-service'
import toast from 'react-hot-toast'

interface TicketResponseGeneratorProps {
  ticketData: {
    title: string
    description: string
    category: string
    priority: string
  }
  className?: string
  onResponseGenerated?: (response: string) => void
}

export function TicketResponseGenerator({ 
  ticketData, 
  className, 
  onResponseGenerated 
}: TicketResponseGeneratorProps) {
  const [generatedResponse, setGeneratedResponse] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')

  const generateResponse = async () => {
    setIsGenerating(true)
    try {
      const response = await aiService.generateResponse(ticketData)
      setGeneratedResponse(response)
      
      if (onResponseGenerated) {
        onResponseGenerated(response)
      }
      
      toast.success('AI response generated successfully!')
    } catch (error) {
      console.error('Failed to generate response:', error)
      toast.error('Failed to generate AI response')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateCustomResponse = async () => {
    if (!customPrompt.trim()) {
      toast.error('Please enter a custom prompt')
      return
    }

    setIsGenerating(true)
    try {
      // Use custom prompt with ticket context
      const fullPrompt = `
      Generate a professional support response based on this ticket and custom instructions:
      
      Ticket: "${ticketData.title}" - "${ticketData.description}"
      Category: ${ticketData.category}
      Priority: ${ticketData.priority}
      
      Custom Instructions: ${customPrompt}
      
      Provide a professional, helpful response that addresses the customer's needs.
      `
      
      const response = await aiService.generateResponse({
        title: ticketData.title,
        description: ticketData.description,
        category: ticketData.category,
        priority: ticketData.priority
      })
      
      setGeneratedResponse(response)
      
      if (onResponseGenerated) {
        onResponseGenerated(response)
      }
      
      toast.success('Custom AI response generated!')
    } catch (error) {
      console.error('Failed to generate custom response:', error)
      toast.error('Failed to generate custom response')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedResponse)
      setIsCopied(true)
      toast.success('Response copied to clipboard!')
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy response')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <Bot className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold">AI Response Generator</h2>
          <p className="text-sm text-muted-foreground">
            Generate professional responses using AI
          </p>
        </div>
      </div>

      {/* Ticket Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Ticket Context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-medium">{ticketData.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {ticketData.description}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline">{ticketData.category}</Badge>
            <Badge 
              variant="outline" 
              className={cn(getPriorityColor(ticketData.priority))}
            >
              {ticketData.priority.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Custom Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            Custom Instructions (Optional)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Add specific instructions for the AI response
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., 'Include troubleshooting steps for login issues' or 'Emphasize our commitment to resolving this quickly'"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex items-center space-x-2">
            <Button
              onClick={generateCustomResponse}
              disabled={isGenerating || !customPrompt.trim()}
              variant="outline"
              size="sm"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Custom Response
            </Button>
            <Button
              onClick={generateResponse}
              disabled={isGenerating}
              size="sm"
            >
              <Bot className="h-4 w-4 mr-2" />
              Generate Standard Response
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Response */}
      {generatedResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Generated Response
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                disabled={isCopied}
              >
                {isCopied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium">Support Agent</span>
                    <Badge variant="outline" className="text-xs">
                      AI Generated
                    </Badge>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {generatedResponse}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
              <div>
                <p className="font-medium">Generating AI Response...</p>
                <p className="text-sm text-muted-foreground">
                  This may take a few seconds
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Tips */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                AI Response Tips
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Always review AI-generated responses before sending</li>
                <li>• Custom instructions help tailor responses to specific needs</li>
                <li>• AI responses are suggestions - personalize as needed</li>
                <li>• Use custom prompts for complex or sensitive issues</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



