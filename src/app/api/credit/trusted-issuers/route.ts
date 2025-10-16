// =====================================================
// BSM Platform - Trusted Issuers API Routes
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const is_approved = searchParams.get('is_approved')
    const issuer_type = searchParams.get('issuer_type')
    
    const supabase = createServerSupabaseClient()
    let query = supabase.from('trusted_issuers').select('*')
    
    if (is_approved !== null) {
      query = query.eq('is_approved', is_approved === 'true')
    }
    if (issuer_type) {
      query = query.eq('issuer_type', issuer_type)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ issuers: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      issuer_did, 
      issuer_name, 
      issuer_type, 
      issuer_description, 
      contact_email, 
      is_approved, 
      approved_by, 
      metadata 
    } = body

    if (!issuer_did || !issuer_name || !issuer_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('trusted_issuers')
      .insert({
        issuer_did,
        issuer_name,
        issuer_type,
        issuer_description,
        contact_email,
        is_approved: is_approved || false,
        approved_by,
        approved_at: is_approved ? new Date().toISOString() : null,
        metadata: metadata || {}
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ issuer: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Issuer ID is required' }, { status: 400 })
    }

    // Add approval timestamp if being approved
    if (updateData.is_approved && !updateData.approved_at) {
      updateData.approved_at = new Date().toISOString()
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('trusted_issuers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ issuer: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Issuer ID is required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('trusted_issuers')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Issuer deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
