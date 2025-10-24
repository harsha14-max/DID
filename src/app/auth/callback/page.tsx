'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { motion } from 'framer-motion'
import { CredXLogo } from '@/components/ui/credX-logo'
import { DatabaseTest } from './test-db'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { fetchUserProfile } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Handling OAuth callback...')
        
        // Get the role from URL params - Google OAuth is only for customers
        const role = 'customer' // Force customer role for Google OAuth
        console.log('OAuth callback role (forced to customer):', role)

        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('OAuth callback error:', error)
          console.error('Error details:', {
            message: error.message,
            status: error.status
          })
          setError(`OAuth Error: ${error.message}`)
          setStatus('error')
          return
        }

        console.log('Session data:', data)
        console.log('User data:', data.session?.user)

        if (data.session?.user) {
          console.log('OAuth user authenticated:', data.session.user.email)
          
          // Create or update user profile with role
          console.log('Creating user profile with data:', {
            id: data.session.user.id,
            email: data.session.user.email,
            full_name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || 'Google User',
            avatar_url: data.session.user.user_metadata?.avatar_url,
            role: role
          })

          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .upsert({
              id: data.session.user.id,
              email: data.session.user.email,
              full_name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || 'Google User',
              avatar_url: data.session.user.user_metadata?.avatar_url,
              role: role,
              is_verified: true,
              last_login: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single()

          if (profileError) {
            console.error('Profile creation error:', profileError)
            console.error('Profile error details:', {
              message: profileError.message,
              details: profileError.details,
              hint: profileError.hint,
              code: profileError.code
            })
            setError(`Failed to create user profile: ${profileError.message}`)
            setStatus('error')
            return
          }

          console.log('User profile created/updated successfully:', profileData)
          
          // Fetch the complete user profile
          console.log('Fetching user profile...')
          await fetchUserProfile(data.session.user)
          console.log('User profile fetch completed')
          
          setStatus('success')
          
          // Redirect to customer dashboard (Google OAuth is customer-only)
          console.log('Redirecting to customer dashboard...')
          setTimeout(() => {
            console.log('Executing redirect to /customer/dashboard')
            router.push('/customer/dashboard')
          }, 1000)
          
        } else {
          console.error('No user in session')
          setError('Authentication failed')
          setStatus('error')
        }
        
      } catch (error: any) {
        console.error('OAuth callback error:', error)
        setError(error.message || 'Authentication failed')
        setStatus('error')
      }
    }

    handleAuthCallback()
  }, [router, searchParams, fetchUserProfile])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CredXLogo size={64} className="mx-auto" />
        </motion.div>

        {status === 'loading' && (
          <>
            <motion.div
              className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
            <h2 className="text-2xl font-bold text-white mb-4">Authenticating...</h2>
            <p className="text-white/80">Please wait while we verify your Google account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Successful!</h2>
            <p className="text-white/80">Redirecting you to your dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Failed</h2>
            <p className="text-white/80 mb-6">{error}</p>
            <motion.button
              onClick={() => router.push('/auth/login')}
              className="bg-white text-blue-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </>
        )}
      </motion.div>
      
      {/* Database Test - Remove after debugging */}
      <div className="mt-8">
        <DatabaseTest />
      </div>
    </div>
  )
}
