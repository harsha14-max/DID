// =====================================================
// BSM Platform - Credit Scoring API Routes
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { creditScoringAlgorithm } from '@/components/shared/credit/CreditScoringAlgorithm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    
    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user's credentials
    const { data: credentials, error: credentialsError } = await supabase
      .from('verifiable_credentials')
      .select('*')
      .eq('user_id', user_id)
      .eq('is_revoked', false)

    if (credentialsError) {
      return NextResponse.json({ error: credentialsError.message }, { status: 500 })
    }

    // Calculate credit score
    const scoreCalculation = creditScoringAlgorithm.calculateScore(credentials || [])
    const scoreBreakdown = creditScoringAlgorithm.getScoreBreakdown(credentials || [])

    // Get score history
    const { data: history, error: historyError } = await supabase
      .from('credit_score_history')
      .select('*')
      .eq('user_id', user_id)
      .order('calculated_at', { ascending: false })
      .limit(10)

    if (historyError) {
      return NextResponse.json({ error: historyError.message }, { status: 500 })
    }

    return NextResponse.json({
      scoreCalculation,
      scoreBreakdown,
      history: history || []
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, calculation_method, contributing_credentials, metadata } = body

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user's credentials
    const { data: credentials, error: credentialsError } = await supabase
      .from('verifiable_credentials')
      .select('*')
      .eq('user_id', user_id)
      .eq('is_revoked', false)

    if (credentialsError) {
      return NextResponse.json({ error: credentialsError.message }, { status: 500 })
    }

    // Calculate credit score
    const scoreCalculation = creditScoringAlgorithm.calculateScore(credentials || [])
    const scoreBreakdown = creditScoringAlgorithm.getScoreBreakdown(credentials || [])

    // Save score to history
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('credit_score_history')
      .insert({
        user_id,
        score: scoreCalculation.totalScore,
        calculation_method: calculation_method || 'standard',
        contributing_credentials: contributing_credentials || credentials?.map(c => c.id) || [],
        metadata: metadata || {}
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      scoreHistory: data,
      scoreCalculation,
      scoreBreakdown
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
