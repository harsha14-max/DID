export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface TicketFilters {
  status?: string[]
  priority?: string[]
  category?: string[]
  assigned_to?: string[]
  created_by?: string[]
  date_range?: {
    start: string
    end: string
  }
  search?: string
}

export interface AnalyticsFilters {
  date_range?: {
    start: string
    end: string
  }
  category?: string[]
  metric_type?: string[]
}

export interface WorkflowStep {
  id: string
  type: 'approval' | 'notification' | 'escalation' | 'ai_processing'
  config: Record<string, any>
  next_steps?: string[]
  conditions?: Record<string, any>
}

export interface ChatMessage {
  id: string
  content: string
  sender_id: string
  sender_type: 'user' | 'agent' | 'system'
  timestamp: string
  ticket_id?: string
  attachments?: string[]
  metadata?: Record<string, any>
}

export interface ServiceHealth {
  service_name: string
  status: 'healthy' | 'degraded' | 'down'
  uptime: number
  response_time: number
  last_check: string
  details?: Record<string, any>
}

