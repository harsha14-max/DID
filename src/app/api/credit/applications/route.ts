// =====================================================
// BSM Platform - Credit Applications API Routes
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const lender_did = searchParams.get('lender_did')
    const status = searchParams.get('status')
    
    let query = supabase.from('credit_applications').select('*')
    
    if (user_id) {
      query = query.eq('user_id', user_id)
    }
    if (lender_did) {
      query = query.eq('lender_did', lender_did)
    }
    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ applications: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      user_id, 
      lender_did, 
      zkp_proof, 
      score_threshold, 
      loan_amount, 
      loan_purpose, 
      metadata 
    } = body

    if (!user_id || !lender_did || !zkp_proof || !score_threshold) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('credit_applications')
      .insert({
        user_id,
        lender_did,
        zkp_proof,
        score_threshold,
        loan_amount,
        loan_purpose,
        status: 'pending',
        metadata: metadata || {}
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ application: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 })
    }

    // Add timestamp based on status change
    if (updateData.status === 'verified') {
      updateData.verified_at = new Date().toISOString()
    } else if (updateData.status === 'approved') {
      updateData.approved_at = new Date().toISOString()
    } else if (updateData.status === 'rejected') {
      updateData.rejected_at = new Date().toISOString()
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('credit_applications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ application: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('credit_applications')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Application deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
