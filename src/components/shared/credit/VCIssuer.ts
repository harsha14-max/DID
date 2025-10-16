// =====================================================
// BSM Platform - Verifiable Credential Issuer
// =====================================================
// Utility for issuing and managing Verifiable Credentials

import { 
  VerifiableCredential, 
  CredentialType, 
  CredentialData,
  IssueCredentialRequest,
  IssueCredentialResponse,
  ServiceCompletionData,
  PaymentHistoryData,
  UtilityPaymentData,
  IdentityVerificationData,
  EmploymentVerificationData,
  IncomeVerificationData
} from '@/types/credit'
import { supabase } from '@/lib/supabase/client'
import { didManager } from './DIDManager'
// Simple crypto utilities for demo purposes
const simpleCrypto = {
  hash: (text: string): string => {
    // Simple hash function for demo (not cryptographically secure)
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16)
  },
  sign: (data: string, key: string): string => {
    // Simple signature for demo (not cryptographically secure)
    return simpleCrypto.hash(data + key)
  }
}

export class VCIssuer {
  private readonly ISSUER_DID = 'did:bsm:issuer:bsm-platform'
  private readonly SIGNING_KEY = 'bsm-platform-vc-signing-key' // In production, use proper key management

  /**
   * Issue a verifiable credential
   */
  async issueCredential(request: IssueCredentialRequest): Promise<IssueCredentialResponse> {
    try {
      // Validate credential data
      if (!this.validateCredentialData(request.credential_type, request.credential_data)) {
        throw new Error(`Invalid credential data for type: ${request.credential_type}`)
      }

      // Generate credential ID
      const credentialId = `vc:bsm:${Date.now()}:${Math.random().toString(36).substring(2)}`

      // Create credential
      const credential: Omit<VerifiableCredential, 'id' | 'proof_signature' | 'issued_at'> = {
        user_id: request.user_id,
        issuer_did: this.ISSUER_DID,
        credential_type: request.credential_type,
        credential_data: request.credential_data,
        expires_at: request.expires_at,
        is_revoked: false,
        metadata: {
          credential_id: credentialId,
          version: '1.0.0'
        }
      }

      // Generate proof signature
      const proofSignature = this.generateProofSignature(credential)

      // Insert into database
      const { data, error } = await supabase
        .from('verifiable_credentials')
        .insert({
          ...credential,
          proof_signature: proofSignature,
          issued_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to issue credential: ${error.message}`)
      }

      return {
        credential: data as VerifiableCredential
      }
    } catch (error) {
      console.error('Error issuing credential:', error)
      throw error
    }
  }

  /**
   * Issue service completion credential from resolved ticket
   */
  async issueServiceCompletionCredential(
    userId: string, 
    ticketData: {
      service: string
      rating: number
      completed_at: string
      ticket_id?: string
      resolution_time?: number
    }
  ): Promise<VerifiableCredential> {
    const credentialData: ServiceCompletionData = {
      service: ticketData.service,
      rating: ticketData.rating,
      completed_at: ticketData.completed_at,
      ticket_id: ticketData.ticket_id,
      resolution_time: ticketData.resolution_time
    }

    const response = await this.issueCredential({
      user_id: userId,
      credential_type: 'service_completion',
      credential_data: credentialData,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
    })

    return response.credential
  }

  /**
   * Issue payment history credential
   */
  async issuePaymentHistoryCredential(
    userId: string,
    paymentData: {
      months_paid: number
      total_amount: number
      average_amount: number
      last_payment_date: string
      payment_frequency: 'monthly' | 'quarterly' | 'annually'
    }
  ): Promise<VerifiableCredential> {
    const credentialData: PaymentHistoryData = {
      months_paid: paymentData.months_paid,
      total_amount: paymentData.total_amount,
      average_amount: paymentData.average_amount,
      last_payment_date: paymentData.last_payment_date,
      payment_frequency: paymentData.payment_frequency
    }

    const response = await this.issueCredential({
      user_id: userId,
      credential_type: 'payment_history',
      credential_data: credentialData,
      expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() // 6 months
    })

    return response.credential
  }

  /**
   * Issue utility payment credential
   */
  async issueUtilityPaymentCredential(
    userId: string,
    utilityData: {
      utility_type: 'electricity' | 'water' | 'gas' | 'internet' | 'phone'
      months_paid: number
      average_amount: number
      last_payment_date: string
      provider_name: string
    }
  ): Promise<VerifiableCredential> {
    const credentialData: UtilityPaymentData = {
      utility_type: utilityData.utility_type,
      months_paid: utilityData.months_paid,
      average_amount: utilityData.average_amount,
      last_payment_date: utilityData.last_payment_date,
      provider_name: utilityData.provider_name
    }

    const response = await this.issueCredential({
      user_id: userId,
      credential_type: 'utility_payment',
      credential_data: credentialData,
      expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() // 6 months
    })

    return response.credential
  }

  /**
   * Issue identity verification credential
   */
  async issueIdentityVerificationCredential(
    userId: string,
    identityData: {
      verification_method: 'government_id' | 'biometric' | 'social_security'
      verified_at: string
      verification_level: 'basic' | 'enhanced' | 'premium'
      issuing_authority: string
    }
  ): Promise<VerifiableCredential> {
    const credentialData: IdentityVerificationData = {
      verification_method: identityData.verification_method,
      verified_at: identityData.verified_at,
      verification_level: identityData.verification_level,
      issuing_authority: identityData.issuing_authority
    }

    const response = await this.issueCredential({
      user_id: userId,
      credential_type: 'identity_verification',
      credential_data: credentialData,
      expires_at: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString() // 2 years
    })

    return response.credential
  }

  /**
   * Get user's credentials
   */
  async getUserCredentials(userId: string): Promise<VerifiableCredential[]> {
    try {
      const { data, error } = await supabase
        .from('verifiable_credentials')
        .select('*')
        .eq('user_id', userId)
        .eq('is_revoked', false)
        .order('issued_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to get user credentials: ${error.message}`)
      }

      return data as VerifiableCredential[]
    } catch (error) {
      console.error('Error getting user credentials:', error)
      throw error
    }
  }

  /**
   * Get credentials by type
   */
  async getCredentialsByType(userId: string, credentialType: CredentialType): Promise<VerifiableCredential[]> {
    try {
      const { data, error } = await supabase
        .from('verifiable_credentials')
        .select('*')
        .eq('user_id', userId)
        .eq('credential_type', credentialType)
        .eq('is_revoked', false)
        .order('issued_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to get credentials by type: ${error.message}`)
      }

      return data as VerifiableCredential[]
    } catch (error) {
      console.error('Error getting credentials by type:', error)
      throw error
    }
  }

  /**
   * Revoke a credential
   */
  async revokeCredential(credentialId: string, reason: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('verifiable_credentials')
        .update({
          is_revoked: true,
          revocation_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', credentialId)

      if (error) {
        throw new Error(`Failed to revoke credential: ${error.message}`)
      }
    } catch (error) {
      console.error('Error revoking credential:', error)
      throw error
    }
  }

  /**
   * Verify a credential
   */
  async verifyCredential(credentialId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('verifiable_credentials')
        .select('*')
        .eq('id', credentialId)
        .single()

      if (error) {
        return false
      }

      const credential = data as VerifiableCredential

      // Check if credential is revoked
      if (credential.is_revoked) {
        return false
      }

      // Check if credential is expired
      if (credential.expires_at && new Date(credential.expires_at) < new Date()) {
        return false
      }

      // Verify proof signature
      return this.verifyProofSignature(credential)
    } catch (error) {
      console.error('Error verifying credential:', error)
      return false
    }
  }

  /**
   * Get credential statistics
   */
  async getCredentialStatistics(): Promise<{
    total_credentials: number
    active_credentials: number
    revoked_credentials: number
    expired_credentials: number
    by_type: Record<CredentialType, number>
    issued_today: number
    issued_this_week: number
    issued_this_month: number
  }> {
    try {
      const { data, error } = await supabase
        .from('verifiable_credentials')
        .select('*')

      if (error) {
        throw new Error(`Failed to get credential statistics: ${error.message}`)
      }

      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      const byType: Record<string, number> = {}
      data.forEach(credential => {
        byType[credential.credential_type] = (byType[credential.credential_type] || 0) + 1
      })

      const stats = {
        total_credentials: data.length,
        active_credentials: data.filter(c => !c.is_revoked && (!c.expires_at || new Date(c.expires_at) > now)).length,
        revoked_credentials: data.filter(c => c.is_revoked).length,
        expired_credentials: data.filter(c => c.expires_at && new Date(c.expires_at) <= now).length,
        by_type: byType as Record<CredentialType, number>,
        issued_today: data.filter(c => new Date(c.issued_at) >= today).length,
        issued_this_week: data.filter(c => new Date(c.issued_at) >= weekAgo).length,
        issued_this_month: data.filter(c => new Date(c.issued_at) >= monthAgo).length
      }

      return stats
    } catch (error) {
      console.error('Error getting credential statistics:', error)
      throw error
    }
  }

  /**
   * Validate credential data based on type
   */
  private validateCredentialData(type: CredentialType, data: any): boolean {
    switch (type) {
      case 'service_completion':
        return data && 
               typeof data.rating === 'number' && 
               data.rating >= 1 && 
               data.rating <= 5 &&
               typeof data.service === 'string' &&
               typeof data.completed_at === 'string'

      case 'payment_history':
        return data && 
               typeof data.months_paid === 'number' && 
               data.months_paid > 0 &&
               typeof data.total_amount === 'number' &&
               typeof data.average_amount === 'number' &&
               typeof data.last_payment_date === 'string' &&
               ['monthly', 'quarterly', 'annually'].includes(data.payment_frequency)

      case 'utility_payment':
        return data && 
               typeof data.months_paid === 'number' && 
               data.months_paid > 0 &&
               typeof data.average_amount === 'number' &&
               typeof data.last_payment_date === 'string' &&
               typeof data.provider_name === 'string' &&
               ['electricity', 'water', 'gas', 'internet', 'phone'].includes(data.utility_type)

      case 'identity_verification':
        return data && 
               typeof data.verification_method === 'string' &&
               typeof data.verified_at === 'string' &&
               typeof data.verification_level === 'string' &&
               typeof data.issuing_authority === 'string' &&
               ['government_id', 'biometric', 'social_security'].includes(data.verification_method) &&
               ['basic', 'enhanced', 'premium'].includes(data.verification_level)

      case 'employment_verification':
        return data && 
               typeof data.employer_name === 'string' &&
               typeof data.position === 'string' &&
               typeof data.employment_start_date === 'string'

      case 'income_verification':
        return data && 
               typeof data.monthly_income === 'number' &&
               data.monthly_income > 0 &&
               typeof data.annual_income === 'number' &&
               typeof data.verification_date === 'string' &&
               typeof data.verification_method === 'string'

      default:
        return false
    }
  }

  /**
   * Generate proof signature for credential
   */
  private generateProofSignature(credential: Omit<VerifiableCredential, 'id' | 'proof_signature' | 'issued_at'>): string {
    // Create credential hash
    const credentialHash = simpleCrypto.hash(JSON.stringify({
      user_id: credential.user_id,
      issuer_did: credential.issuer_did,
      credential_type: credential.credential_type,
      credential_data: credential.credential_data,
      expires_at: credential.expires_at
    }))

    // Sign the hash (simplified for demo)
    const signature = simpleCrypto.sign(credentialHash, this.SIGNING_KEY)
    
    return signature
  }

  /**
   * Verify proof signature
   */
  private verifyProofSignature(credential: VerifiableCredential): boolean {
    try {
      // Recreate credential hash
      const credentialHash = simpleCrypto.hash(JSON.stringify({
        user_id: credential.user_id,
        issuer_did: credential.issuer_did,
        credential_type: credential.credential_type,
        credential_data: credential.credential_data,
        expires_at: credential.expires_at
      }))

      // Verify signature
      const expectedSignature = simpleCrypto.sign(credentialHash, this.SIGNING_KEY)
      
      return credential.proof_signature === expectedSignature
    } catch (error) {
      console.error('Error verifying proof signature:', error)
      return false
    }
  }

  /**
   * Bulk issue credentials
   */
  async bulkIssueCredentials(requests: IssueCredentialRequest[]): Promise<IssueCredentialResponse[]> {
    const responses: IssueCredentialResponse[] = []
    
    for (const request of requests) {
      try {
        const response = await this.issueCredential(request)
        responses.push(response)
      } catch (error) {
        console.error(`Failed to issue credential for user ${request.user_id}:`, error)
        // Continue with other credentials
      }
    }

    return responses
  }

  /**
   * Get credentials by issuer
   */
  async getCredentialsByIssuer(issuerDid: string): Promise<VerifiableCredential[]> {
    try {
      const { data, error } = await supabase
        .from('verifiable_credentials')
        .select('*')
        .eq('issuer_did', issuerDid)
        .order('issued_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to get credentials by issuer: ${error.message}`)
      }

      return data as VerifiableCredential[]
    } catch (error) {
      console.error('Error getting credentials by issuer:', error)
      throw error
    }
  }
}

// Export singleton instance
export const vcIssuer = new VCIssuer()
