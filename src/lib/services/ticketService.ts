// =====================================================
// BSM Platform - Enhanced Ticket Service with VC Integration
// =====================================================
// Service for managing tickets with automatic VC issuance

import { supabase } from '@/lib/supabase/client'
import { vcIssuer } from '@/components/shared/credit/VCIssuer'
import { toast } from 'react-hot-toast'

export interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  assigned_to?: string
  created_by: string
  created_at: string
  updated_at: string
  resolved_at?: string
  tags: string[]
  attachments: string[]
  sla_deadline?: string
  satisfaction_rating?: number
  metadata?: Record<string, any>
}

export interface TicketResolutionData {
  ticketId: string
  resolution: string
  rating: number
  resolvedBy: string
  resolutionTime?: number // in hours
}

export class TicketService {
  /**
   * Resolve a ticket and automatically issue VC if rating is positive
   */
  async resolveTicket(resolutionData: TicketResolutionData): Promise<Ticket> {
    try {
      // Update ticket status
      const { data: ticket, error } = await supabase
        .from('tickets')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: {
            resolution: resolutionData.resolution,
            rating: resolutionData.rating,
            resolved_by: resolutionData.resolvedBy,
            resolution_time: resolutionData.resolutionTime
          }
        })
        .eq('id', resolutionData.ticketId)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to resolve ticket: ${error.message}`)
      }

      // Auto-issue VC for positive resolutions (rating >= 4)
      if (resolutionData.rating >= 4) {
        try {
          await this.issueServiceCompletionVC(ticket, resolutionData)
        } catch (vcError) {
          console.warn('Failed to issue VC for ticket resolution:', vcError)
          // Don't fail the ticket resolution if VC issuance fails
        }
      }

      toast.success('Ticket resolved successfully')
      return ticket as Ticket
    } catch (error) {
      console.error('Error resolving ticket:', error)
      toast.error('Failed to resolve ticket')
      throw error
    }
  }

  /**
   * Issue service completion VC for resolved ticket
   */
  private async issueServiceCompletionVC(ticket: Ticket, resolutionData: TicketResolutionData): Promise<void> {
    try {
      // Determine service type from ticket category
      const serviceType = this.mapCategoryToServiceType(ticket.category)
      
      // Calculate resolution time if not provided
      const resolutionTime = resolutionData.resolutionTime || this.calculateResolutionTime(ticket)

      await vcIssuer.issueServiceCompletionCredential(ticket.created_by, {
        service: serviceType,
        rating: resolutionData.rating,
        completed_at: ticket.resolved_at || new Date().toISOString(),
        ticket_id: ticket.id,
        resolution_time: resolutionTime
      })

      console.log(`Service completion VC issued for ticket ${ticket.id}`)
    } catch (error) {
      console.error('Error issuing service completion VC:', error)
      throw error
    }
  }

  /**
   * Map ticket category to service type for VC
   */
  private mapCategoryToServiceType(category: string): string {
    const categoryMap: Record<string, string> = {
      'Account Issues': 'account_management',
      'Technical Support': 'technical_support',
      'Billing': 'billing_support',
      'Feature Request': 'feature_request',
      'Bug Report': 'bug_report',
      'General Inquiry': 'general_support',
      'Security': 'security_support',
      'Integration': 'integration_support'
    }

    return categoryMap[category] || 'general_support'
  }

  /**
   * Calculate resolution time in hours
   */
  private calculateResolutionTime(ticket: Ticket): number {
    if (!ticket.resolved_at) return 0
    
    const created = new Date(ticket.created_at)
    const resolved = new Date(ticket.resolved_at)
    const diffMs = resolved.getTime() - created.getTime()
    
    return Math.round(diffMs / (1000 * 60 * 60)) // Convert to hours
  }

  /**
   * Get all tickets
   */
  async getTickets(): Promise<Ticket[]> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch tickets: ${error.message}`)
      }

      return data as Ticket[]
    } catch (error) {
      console.error('Error fetching tickets:', error)
      throw error
    }
  }

  /**
   * Get ticket by ID
   */
  async getTicketById(ticketId: string): Promise<Ticket | null> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw new Error(`Failed to fetch ticket: ${error.message}`)
      }

      return data as Ticket
    } catch (error) {
      console.error('Error fetching ticket:', error)
      throw error
    }
  }

  /**
   * Create a new ticket
   */
  async createTicket(ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>): Promise<Ticket> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          ...ticketData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create ticket: ${error.message}`)
      }

      toast.success('Ticket created successfully')
      return data as Ticket
    } catch (error) {
      console.error('Error creating ticket:', error)
      toast.error('Failed to create ticket')
      throw error
    }
  }

  /**
   * Update ticket status
   */
  async updateTicketStatus(ticketId: string, status: Ticket['status']): Promise<Ticket> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      }

      // Set resolved_at if status is resolved
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', ticketId)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update ticket status: ${error.message}`)
      }

      return data as Ticket
    } catch (error) {
      console.error('Error updating ticket status:', error)
      throw error
    }
  }

  /**
   * Assign ticket to user
   */
  async assignTicket(ticketId: string, assignedTo: string): Promise<Ticket> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update({
          assigned_to: assignedTo,
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to assign ticket: ${error.message}`)
      }

      toast.success('Ticket assigned successfully')
      return data as Ticket
    } catch (error) {
      console.error('Error assigning ticket:', error)
      toast.error('Failed to assign ticket')
      throw error
    }
  }

  /**
   * Add satisfaction rating to ticket
   */
  async addSatisfactionRating(ticketId: string, rating: number): Promise<Ticket> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update({
          satisfaction_rating: rating,
          updated_at: new Date().toISOString(),
          metadata: {
            rating_added_at: new Date().toISOString()
          }
        })
        .eq('id', ticketId)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to add rating: ${error.message}`)
      }

      // If rating is high (>= 4), consider issuing VC
      if (rating >= 4) {
        try {
          const ticket = await this.getTicketById(ticketId)
          if (ticket) {
            await this.issueServiceCompletionVC(ticket, {
              ticketId,
              resolution: 'Customer satisfaction rating',
              rating,
              resolvedBy: 'system',
              resolutionTime: ticket.resolved_at ? this.calculateResolutionTime(ticket) : 0
            })
          }
        } catch (vcError) {
          console.warn('Failed to issue VC for satisfaction rating:', vcError)
        }
      }

      toast.success('Rating added successfully')
      return data as Ticket
    } catch (error) {
      console.error('Error adding rating:', error)
      toast.error('Failed to add rating')
      throw error
    }
  }

  /**
   * Get tickets by user
   */
  async getTicketsByUser(userId: string): Promise<Ticket[]> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch user tickets: ${error.message}`)
      }

      return data as Ticket[]
    } catch (error) {
      console.error('Error fetching user tickets:', error)
      throw error
    }
  }

  /**
   * Get tickets by status
   */
  async getTicketsByStatus(status: Ticket['status']): Promise<Ticket[]> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch tickets by status: ${error.message}`)
      }

      return data as Ticket[]
    } catch (error) {
      console.error('Error fetching tickets by status:', error)
      throw error
    }
  }

  /**
   * Get ticket statistics
   */
  async getTicketStatistics(): Promise<{
    total: number
    open: number
    in_progress: number
    resolved: number
    closed: number
    avg_resolution_time: number
    satisfaction_avg: number
  }> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('status, resolved_at, created_at, satisfaction_rating')

      if (error) {
        throw new Error(`Failed to fetch ticket statistics: ${error.message}`)
      }

      const stats = {
        total: data.length,
        open: data.filter(t => t.status === 'open').length,
        in_progress: data.filter(t => t.status === 'in_progress').length,
        resolved: data.filter(t => t.status === 'resolved').length,
        closed: data.filter(t => t.status === 'closed').length,
        avg_resolution_time: 0,
        satisfaction_avg: 0
      }

      // Calculate average resolution time
      const resolvedTickets = data.filter(t => t.status === 'resolved' && t.resolved_at && t.created_at)
      if (resolvedTickets.length > 0) {
        const totalResolutionTime = resolvedTickets.reduce((sum, ticket) => {
          const created = new Date(ticket.created_at)
          const resolved = new Date(ticket.resolved_at!)
          const diffMs = resolved.getTime() - created.getTime()
          return sum + (diffMs / (1000 * 60 * 60)) // Convert to hours
        }, 0)
        stats.avg_resolution_time = Math.round(totalResolutionTime / resolvedTickets.length)
      }

      // Calculate average satisfaction rating
      const ratedTickets = data.filter(t => t.satisfaction_rating && t.satisfaction_rating > 0)
      if (ratedTickets.length > 0) {
        const totalRating = ratedTickets.reduce((sum, ticket) => sum + (ticket.satisfaction_rating || 0), 0)
        stats.satisfaction_avg = Math.round((totalRating / ratedTickets.length) * 10) / 10
      }

      return stats
    } catch (error) {
      console.error('Error fetching ticket statistics:', error)
      throw error
    }
  }

  /**
   * Bulk resolve tickets
   */
  async bulkResolveTickets(resolutions: TicketResolutionData[]): Promise<Ticket[]> {
    const resolvedTickets: Ticket[] = []
    
    for (const resolution of resolutions) {
      try {
        const ticket = await this.resolveTicket(resolution)
        resolvedTickets.push(ticket)
      } catch (error) {
        console.error(`Failed to resolve ticket ${resolution.ticketId}:`, error)
        // Continue with other tickets
      }
    }

    return resolvedTickets
  }
}

// Export singleton instance
export const ticketService = new TicketService()

