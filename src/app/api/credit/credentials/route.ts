// =====================================================
// BSM Platform - Verifiable Credentials API Routes
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const issuer_did = searchParams.get('issuer_did')
    const credential_type = searchParams.get('credential_type')
    
    let query = supabase.from('verifiable_credentials').select('*')
    
    if (user_id) {
      query = query.eq('user_id', user_id)
    }
    if (issuer_did) {
      query = query.eq('issuer_did', issuer_did)
    }
    if (credential_type) {
      query = query.eq('credential_type', credential_type)
    }
    
    query = query.eq('is_revoked', false)

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ credentials: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      user_id, 
      issuer_did, 
      credential_type, 
      credential_data, 
      proof_signature, 
      expires_at, 
      metadata 
    } = body

    if (!user_id || !issuer_did || !credential_type || !credential_data || !proof_signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('verifiable_credentials')
      .insert({
        user_id,
        issuer_did,
        credential_type,
        credential_data,
        proof_signature,
        expires_at,
        metadata: metadata || {}
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ credential: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Credential ID is required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('verifiable_credentials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ credential: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const revocation_reason = searchParams.get('reason') || 'User requested'

    if (!id) {
      return NextResponse.json({ error: 'Credential ID is required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('verifiable_credentials')
      .update({ 
        is_revoked: true, 
        revocation_reason 
      })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Credential revoked successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
