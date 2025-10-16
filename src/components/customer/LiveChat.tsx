'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Mail,
  User,
  Bot,
  Clock,
  CheckCircle,
  AlertCircle,
  Minimize2,
  Maximize2,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'agent' | 'system'
  timestamp: string
  attachments?: string[]
  isTyping?: boolean
}

interface LiveChatProps {
  className?: string
  isOpen?: boolean
  onClose?: () => void
  onMinimize?: () => void
}

export function LiveChat({ className, isOpen = true, onClose, onMinimize }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [agentStatus, setAgentStatus] = useState<'online' | 'away' | 'offline'>('online')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock initial messages
  useEffect(() => {
    const initialMessages: ChatMessage[] = [
      {
        id: '1',
        content: 'Hello! Welcome to credX Platform support. How can I help you today?',
        sender: 'agent',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        content: 'Hi! I\'m having trouble accessing my account after the recent update.',
        sender: 'user',
        timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        content: 'I\'m sorry to hear that. Let me help you troubleshoot this issue. Can you tell me what error message you\'re seeing?',
        sender: 'agent',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
      }
    ]
    setMessages(initialMessages)
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    // Simulate agent typing and response
    setTimeout(() => {
      setIsTyping(false)
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Thank you for that information. Let me check your account status and get back to you with a solution.',
        sender: 'agent',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, agentMessage])
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getSenderIcon = (sender: ChatMessage['sender']) => {
    switch (sender) {
      case 'user':
        return <User className="h-4 w-4" />
      case 'agent':
        return <Bot className="h-4 w-4" />
      case 'system':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getSenderName = (sender: ChatMessage['sender']) => {
    switch (sender) {
      case 'user':
        return 'You'
      case 'agent':
        return 'Support Agent'
      case 'system':
        return 'System'
      default:
        return 'Unknown'
    }
  }

  const getAgentStatusColor = () => {
    switch (agentStatus) {
      case 'online':
        return 'text-green-500'
      case 'away':
        return 'text-yellow-500'
      case 'offline':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getAgentStatusText = () => {
    switch (agentStatus) {
      case 'online':
        return 'Online'
      case 'away':
        return 'Away'
      case 'offline':
        return 'Offline'
      default:
        return 'Unknown'
    }
  }

  if (!isOpen) return null

  return (
    <div className={cn("fixed bottom-4 right-4 w-96 h-[600px] z-50", className)}>
      <Card className="h-full flex flex-col shadow-2xl border-2">
        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                  getAgentStatusColor().replace('text-', 'bg-')
                )} />
              </div>
              <div>
                <CardTitle className="text-lg">Live Support</CardTitle>
                <div className="flex items-center space-x-2">
                  <span className={cn("text-xs", getAgentStatusColor())}>
                    {getAgentStatusText()}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {messages.length} messages
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={onMinimize}>
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex space-x-2",
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender !== 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      {getSenderIcon(message.sender)}
                    </div>
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2",
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium opacity-70">
                      {getSenderName(message.sender)}
                    </span>
                    <span className="text-xs opacity-50">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.sender === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex space-x-2 justify-start">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">Support Agent</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={!isConnected}
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Paperclip className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Smile className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isConnected ? "bg-green-500" : "bg-red-500"
                )} />
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}











