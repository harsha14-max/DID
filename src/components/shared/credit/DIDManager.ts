// =====================================================
// BSM Platform - DID Manager
// =====================================================
// Decentralized Identity management utilities

import { DID, CreateDIDRequest, CreateDIDResponse } from '@/types/credit'
import { supabase } from '@/lib/supabase/client'
// Simple crypto utilities for demo purposes
const simpleCrypto = {
  encrypt: (text: string, key: string): string => {
    // Simple base64 encoding for demo (not secure for production)
    return btoa(text + ':' + key)
  },
  decrypt: (encrypted: string, key: string): string => {
    try {
      const decoded = atob(encrypted)
      const parts = decoded.split(':')
      return parts[0]
    } catch {
      return ''
    }
  }
}

export class DIDManager {
  private readonly DID_METHOD = 'did:bsm'
  private readonly ENCRYPTION_KEY = 'bsm-platform-did-key' // In production, use proper key management

  /**
   * Create a new DID for a user
   */
  async createDID(request: CreateDIDRequest): Promise<CreateDIDResponse> {
    try {
      // Generate DID identifier
      const didIdentifier = `${this.DID_METHOD}:${request.user_id}`
      
      // Generate keypair (simplified for demo - in production use proper crypto)
      const keypair = this.generateKeyPair()
      
      // Encrypt private key
      const encryptedPrivateKey = this.encryptPrivateKey(keypair.privateKey)
      
      // Create DID record
      const { data: did, error } = await supabase
        .from('dids')
        .insert({
          user_id: request.user_id,
          did_method: request.did_method || this.DID_METHOD,
          did_identifier: didIdentifier,
          public_key: keypair.publicKey,
          private_key_encrypted: encryptedPrivateKey,
          is_active: true
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create DID: ${error.message}`)
      }

      return {
        did: did as DID,
        private_key: keypair.privateKey // Only returned once during creation
      }
    } catch (error) {
      console.error('Error creating DID:', error)
      throw error
    }
  }

  /**
   * Get user's DID
   */
  async getUserDID(userId: string): Promise<DID | null> {
    try {
      const { data, error } = await supabase
        .from('dids')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // No DID found
        }
        throw new Error(`Failed to get DID: ${error.message}`)
      }

      return data as DID
    } catch (error) {
      console.error('Error getting DID:', error)
      throw error
    }
  }

  /**
   * Get DID by identifier
   */
  async getDIDByIdentifier(didIdentifier: string): Promise<DID | null> {
    try {
      const { data, error } = await supabase
        .from('dids')
        .select('*')
        .eq('did_identifier', didIdentifier)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw new Error(`Failed to get DID: ${error.message}`)
      }

      return data as DID
    } catch (error) {
      console.error('Error getting DID by identifier:', error)
      throw error
    }
  }

  /**
   * Deactivate a DID
   */
  async deactivateDID(didId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('dids')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', didId)

      if (error) {
        throw new Error(`Failed to deactivate DID: ${error.message}`)
      }
    } catch (error) {
      console.error('Error deactivating DID:', error)
      throw error
    }
  }

  /**
   * List all DIDs (admin only)
   */
  async listAllDIDs(): Promise<DID[]> {
    try {
      const { data, error } = await supabase
        .from('dids')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to list DIDs: ${error.message}`)
      }

      return data as DID[]
    } catch (error) {
      console.error('Error listing DIDs:', error)
      throw error
    }
  }

  /**
   * Generate a keypair (simplified for demo)
   */
  private generateKeyPair(): { publicKey: string; privateKey: string } {
    // In production, use proper cryptographic libraries like @stablelib/ed25519
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2)
    
    return {
      publicKey: `pub_${timestamp}_${random}`,
      privateKey: `priv_${timestamp}_${random}`
    }
  }

  /**
   * Encrypt private key
   */
  private encryptPrivateKey(privateKey: string): string {
    return simpleCrypto.encrypt(privateKey, this.ENCRYPTION_KEY)
  }

  /**
   * Decrypt private key
   */
  private decryptPrivateKey(encryptedPrivateKey: string): string {
    return simpleCrypto.decrypt(encryptedPrivateKey, this.ENCRYPTION_KEY)
  }

  /**
   * Validate DID format
   */
  validateDIDFormat(didIdentifier: string): boolean {
    const didPattern = /^did:bsm:[a-f0-9-]{36}$/
    return didPattern.test(didIdentifier)
  }

  /**
   * Resolve DID to get public key
   */
  async resolveDID(didIdentifier: string): Promise<{ publicKey: string; isActive: boolean } | null> {
    try {
      const did = await this.getDIDByIdentifier(didIdentifier)
      if (!did) {
        return null
      }

      return {
        publicKey: did.public_key,
        isActive: did.is_active
      }
    } catch (error) {
      console.error('Error resolving DID:', error)
      return null
    }
  }

  /**
   * Create DID document (simplified)
   */
  createDIDDocument(did: DID): any {
    return {
      '@context': ['https://www.w3.org/ns/did/v1'],
      id: did.did_identifier,
      verificationMethod: [
        {
          id: `${did.did_identifier}#key-1`,
          type: 'Ed25519VerificationKey2018',
          controller: did.did_identifier,
          publicKeyBase58: did.public_key
        }
      ],
      authentication: [`${did.did_identifier}#key-1`],
      assertionMethod: [`${did.did_identifier}#key-1`],
      created: did.created_at,
      updated: did.updated_at
    }
  }

  /**
   * Check if user has DID
   */
  async hasDID(userId: string): Promise<boolean> {
    try {
      const did = await this.getUserDID(userId)
      return did !== null
    } catch (error) {
      console.error('Error checking if user has DID:', error)
      return false
    }
  }

  /**
   * Get DID statistics (admin only)
   */
  async getDIDStatistics(): Promise<{
    total_dids: number
    active_dids: number
    inactive_dids: number
    created_today: number
    created_this_week: number
    created_this_month: number
  }> {
    try {
      const { data, error } = await supabase
        .from('dids')
        .select('is_active, created_at')

      if (error) {
        throw new Error(`Failed to get DID statistics: ${error.message}`)
      }

      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      const stats = {
        total_dids: data.length,
        active_dids: data.filter(d => d.is_active).length,
        inactive_dids: data.filter(d => !d.is_active).length,
        created_today: data.filter(d => new Date(d.created_at) >= today).length,
        created_this_week: data.filter(d => new Date(d.created_at) >= weekAgo).length,
        created_this_month: data.filter(d => new Date(d.created_at) >= monthAgo).length
      }

      return stats
    } catch (error) {
      console.error('Error getting DID statistics:', error)
      throw error
    }
  }
}

// Export singleton instance
export const didManager = new DIDManager()
