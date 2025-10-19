'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { AuthContextType, AuthUser } from '@/types/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener')
    
    // Initialize Supabase auth state listener with enhanced session management
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        console.log('Session expires at:', session?.expires_at ? new Date(session.expires_at * 1000) : 'No expiration')
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing user state')
          setUser(null)
          setLoading(false)
          return
        }
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully')
          if (session?.user) {
            await fetchUserProfile(session.user)
          }
          return
        }
        
        if (event === 'SIGNED_IN') {
          console.log('User signed in, setting up session')
          if (session?.user) {
            await fetchUserProfile(session.user)
          }
          return
        }
        
        if (session?.user) {
          console.log('User found in session, fetching profile...')
          await fetchUserProfile(session.user)
        } else {
          console.log('No user in session, clearing user state')
          setUser(null)
          setLoading(false)
        }
      }
    )

    // Check for existing session on mount with improved timeout handling
    const checkSession = async () => {
      try {
        console.log('Checking for existing session...')
        const { data: { session: existingSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setUser(null)
          setLoading(false)
          return
        }
        
        console.log('Existing session check:', existingSession?.user?.email)
        console.log('Session expires at:', existingSession?.expires_at ? new Date(existingSession.expires_at * 1000) : 'No expiration')
        
        if (existingSession?.user) {
          console.log('Found existing session, fetching profile...')
          await fetchUserProfile(existingSession.user)
        } else {
          console.log('No existing session found')
          setUser(null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error checking session:', error)
        setUser(null)
        setLoading(false)
      }
    }
    
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Auth timeout reached, setting loading to false')
      setLoading(false)
    }, 5000)
    
    checkSession().finally(() => {
      clearTimeout(timeoutId)
    })

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [])

  const fetchUserProfile = async (authUser: User) => {
    try {
      console.log('Fetching user profile for:', authUser.id, authUser.email)
      
      console.log('About to query users table...')
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 3000)
      );
      
      const queryPromise = supabase
        .from('users')
        .select('id, email, role, full_name, avatar_url, is_verified, last_login')
        .eq('id', authUser.id)
        .single();
      
      const result = await Promise.race([queryPromise, timeoutPromise]) as any
      const { data, error } = result

      console.log('User profile query completed!')
      console.log('User profile query result:', { data, error })

      if (error) {
        console.error('Error fetching user profile:', error)
        throw error
      }

      // Update last login
      console.log('Attempting to update last_login for user:', authUser.id)
      const { error: updateError } = await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', authUser.id)
      
      console.log('Last login update completed!')
      if (updateError) {
        console.error('Error updating last_login:', updateError)
      } else {
        console.log('Successfully updated last_login for user:', authUser.id)
      }

      console.log('User profile found and set:', data)
      setUser({
        ...authUser,
        role: data.role,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        is_verified: data.is_verified,
        last_login: data.last_login,
      })
      console.log('User state updated successfully')
      setLoading(false)
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      setUser(null)
      setLoading(false)
      throw error
    }
  }

  const signIn = async ({ email, password, role }: { email: string; password: string; role: 'admin' | 'customer' }) => {
    try {
      setLoading(true)
      
      console.log('SignIn called with:', { email, role })
      
      // Try Supabase authentication first
      console.log('Attempting Supabase sign in with:', { email, role })
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Supabase auth error:', error)
        toast.error(error.message || 'Invalid email or password')
        setLoading(false)
        throw error
      }

      if (data.user) {
        console.log('Supabase auth successful:', data.user.email)
        
        console.log('Fetching user profile...')
        
        // Fetch user profile from database
        console.log('Fetching user profile for authenticated user')
        
        await fetchUserProfile(data.user)
        toast.success('Successfully signed in!')
      }
    } catch (error: any) {
      console.error('Sign in error:', error)
      toast.error(error.message || 'Failed to sign in')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async ({ email, password, full_name, role }: { email: string; password: string; full_name: string; role: 'admin' | 'customer' }) => {
    try {
      setLoading(true)
      
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.log('Supabase not configured, using mock signup')
        // Mock signup for development
        setUser({
          id: 'mock-user-id',
          email: email,
          role: role,
          full_name: full_name,
          avatar_url: undefined,
          is_verified: true,
          last_login: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as AuthUser)
        toast.success('Account created successfully! (Demo Mode)')
        setLoading(false)
        return
      }
      
      console.log('Attempting Supabase sign up with:', { email, full_name, role })
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role,
          }
        }
      })

      if (error) {
        console.error('Supabase signup error:', error)
        toast.error(error.message || 'Failed to create account')
        throw error
      }

      if (data.user) {
        console.log('Supabase signup successful:', data.user.email)
        toast.success('Account created successfully! Please check your email to verify your account.')
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error(error.message || 'Failed to create account')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.log('Supabase not configured, using mock signout')
        setUser(null)
        toast.success('Successfully signed out! (Demo Mode)')
        setLoading(false)
        return
      }
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Supabase signout error:', error)
        toast.error(error.message || 'Failed to sign out')
        throw error
      }
      
      setUser(null)
      toast.success('Successfully signed out!')
    } catch (error: any) {
      console.error('Signout error:', error)
      toast.error(error.message || 'Failed to sign out')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      
      if (error) {
        console.error('Supabase reset password error:', error)
        toast.error(error.message || 'Failed to send reset email')
        throw error
      }
      
      toast.success('Password reset email sent!')
    } catch (error: any) {
      console.error('Reset password error:', error)
      toast.error(error.message || 'Failed to send reset email')
      throw error
    }
  }

  const updateProfile = async (updates: Partial<AuthUser>) => {
    try {
      if (!user) throw new Error('No user logged in')

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (error) {
        console.error('Supabase profile update error:', error)
        toast.error(error.message || 'Failed to update profile')
        throw error
      }

      setUser({ ...user, ...updates })
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      console.error('Update profile error:', error)
      toast.error(error.message || 'Failed to update profile')
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
