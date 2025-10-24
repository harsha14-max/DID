import { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  role?: 'admin' | 'customer'
  full_name?: string
  avatar_url?: string
  is_verified?: boolean
  last_login?: string
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  role: 'admin' | 'customer'
}

export interface SignupCredentials {
  email: string
  password: string
  full_name: string
  role: 'admin' | 'customer'
}

export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (credentials: LoginCredentials) => Promise<void>
  signUp: (credentials: SignupCredentials) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>
  fetchUserProfile: (authUser: User) => Promise<void>
}

