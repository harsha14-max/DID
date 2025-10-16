'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  RefreshCw,
  Eye,
  Lightbulb
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { aiService, type AIInsights, type SentimentAnalysisResult } from '@/lib/ai/ai-service'

interface AIInsightsPanelProps {
  className?: string
}

export function AIInsightsPanel({ className }: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<AIInsights | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Mock recent ticket for AI analysis
  const mockTicket = {
    title: 'Unable to access account after password reset',
    description: 'I reset my password but I\'m still getting authentication errors. This is very frustrating and I need immediate help.',
    customerHistory: []
  }

  const analyzeTicket = async () => {
    setLoading(true)
    try {
      const result = await aiService.generateInsights(mockTicket)
      setInsights(result)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to generate AI insights:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    analyzeTicket()
  }, [])

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500'
      case 'negative': return 'text-red-500'
      case 'neutral': return 'text-gray-500'
      default: return 'text-gray-500'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'negative': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'neutral': return <Clock className="h-4 w-4 text-gray-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Insights</h2>
            <p className="text-sm text-muted-foreground">
              Intelligent analysis powered by Gemini AI
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={analyzeTicket}
          disabled={loading}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="h-5 w-5 animate-spin text-purple-500" />
              <span className="text-muted-foreground">Analyzing ticket with AI...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {insights && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sentiment Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Sentiment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getSentimentIcon(insights.sentiment.sentiment)}
                  <span className="font-medium capitalize">
                    {insights.sentiment.sentiment}
                  </span>
                </div>
                <Badge variant="outline">
                  {Math.round(insights.sentiment.confidence * 100)}% confidence
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Emotion Breakdown:</h4>
                <div className="space-y-1">
                  {Object.entries(insights.sentiment.emotions).map(([emotion, value]) => (
                    <div key={emotion} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{emotion}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8">
                          {value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auto-Categorization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Auto-Categorization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {insights.categorization.category}
                </Badge>
                <Badge variant="outline">
                  {Math.round(insights.categorization.confidence * 100)}% confidence
                </Badge>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Suggested Priority:</h4>
                <Badge 
                  variant="outline" 
                  className={cn("text-sm", getPriorityColor(insights.categorization.priority))}
                >
                  {insights.categorization.priority.toUpperCase()}
                </Badge>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Suggested Tags:</h4>
                <div className="flex flex-wrap gap-1">
                  {insights.categorization.suggestedTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Reasoning:</h4>
                <p className="text-sm text-muted-foreground">
                  {insights.categorization.reasoning}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intelligent Routing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Intelligent Routing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{insights.routing.department}</h4>
                  <p className="text-sm text-muted-foreground">
                    Suggested: {insights.routing.suggestedAssignee || 'Auto-assign'}
                  </p>
                </div>
                <Badge variant="outline">
                  {Math.round(insights.routing.confidence * 100)}% confidence
                </Badge>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Reasoning:</h4>
                <p className="text-sm text-muted-foreground">
                  {insights.routing.reasoning}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Summary & Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                AI Summary & Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Summary:</h4>
                <p className="text-sm text-muted-foreground">
                  {insights.summary}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Suggested Actions:</h4>
                <ul className="space-y-1">
                  {insights.suggestedActions.map((action, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Status */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-medium">AI Services Status</h3>
                <p className="text-sm text-muted-foreground">
                  Gemini AI is active and processing requests
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Last updated: {lastUpdated?.toLocaleTimeString() || 'Never'}
              </p>
              <p className="text-xs text-muted-foreground">
                Processing time: ~2.3s
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}











