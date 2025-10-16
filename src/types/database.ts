export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'customer'
          avatar_url: string | null
          created_at: string
          updated_at: string
          last_login: string | null
          is_verified: boolean
          metadata: Record<string, any> | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role: 'admin' | 'customer'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_verified?: boolean
          metadata?: Record<string, any> | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'customer'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_verified?: boolean
          metadata?: Record<string, any> | null
        }
      }
      tickets: {
        Row: {
          id: string
          title: string
          description: string
          status: 'open' | 'in_progress' | 'resolved' | 'closed'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          category: string
          assigned_to: string | null
          created_by: string
          created_at: string
          updated_at: string
          resolved_at: string | null
          sla_deadline: string | null
          tags: string[]
          attachments: string[]
          metadata: Record<string, any> | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          category: string
          assigned_to?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          sla_deadline?: string | null
          tags?: string[]
          attachments?: string[]
          metadata?: Record<string, any> | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          category?: string
          assigned_to?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          sla_deadline?: string | null
          tags?: string[]
          attachments?: string[]
          metadata?: Record<string, any> | null
        }
      }
      knowledge_base: {
        Row: {
          id: string
          title: string
          content: string
          category: string
          tags: string[]
          author_id: string
          status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
          published_at: string | null
          view_count: number
          helpful_count: number
          version: number
          metadata: Record<string, any> | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          category: string
          tags?: string[]
          author_id: string
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
          published_at?: string | null
          view_count?: number
          helpful_count?: number
          version?: number
          metadata?: Record<string, any> | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string
          tags?: string[]
          author_id?: string
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
          published_at?: string | null
          view_count?: number
          helpful_count?: number
          version?: number
          metadata?: Record<string, any> | null
        }
      }
      workflows: {
        Row: {
          id: string
          name: string
          description: string
          trigger_type: string
          trigger_config: Record<string, any>
          steps: Record<string, any>[]
          is_active: boolean
          created_by: string
          created_at: string
          updated_at: string
          metadata: Record<string, any> | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          trigger_type: string
          trigger_config: Record<string, any>
          steps: Record<string, any>[]
          is_active?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
          metadata?: Record<string, any> | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          trigger_type?: string
          trigger_config?: Record<string, any>
          steps?: Record<string, any>[]
          is_active?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
          metadata?: Record<string, any> | null
        }
      }
      analytics: {
        Row: {
          id: string
          metric_name: string
          metric_value: number
          metric_type: 'counter' | 'gauge' | 'histogram'
          tags: Record<string, string>
          timestamp: string
          metadata: Record<string, any> | null
        }
        Insert: {
          id?: string
          metric_name: string
          metric_value: number
          metric_type: 'counter' | 'gauge' | 'histogram'
          tags: Record<string, string>
          timestamp?: string
          metadata?: Record<string, any> | null
        }
        Update: {
          id?: string
          metric_name?: string
          metric_value?: number
          metric_type?: 'counter' | 'gauge' | 'histogram'
          tags?: Record<string, string>
          timestamp?: string
          metadata?: Record<string, any> | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'customer'
      ticket_status: 'open' | 'in_progress' | 'resolved' | 'closed'
      ticket_priority: 'low' | 'medium' | 'high' | 'urgent'
      article_status: 'draft' | 'published' | 'archived'
    }
  }
}

