'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAuth } from '@/components/providers/auth-provider'
import { supabase } from '@/lib/supabase/client'
import { CornerCircleBar } from '@/components/ui/corner-circle-bar'
import { RotatingWheelAnimation } from '@/components/ui/rotating-wheel-animation'
import { ParticleSystem } from '@/components/ui/particle-system'
import { CredXLogo } from '@/components/ui/credX-logo'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, user } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: searchParams.get('role') as 'admin' | 'customer' || 'customer'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  // Handle redirection after successful login
  useEffect(() => {
    if (loginSuccess && user) {
      console.log('Login successful, validating portal type...')
      console.log('Selected portal type:', formData.role)
      console.log('User actual role:', user.role)
      
      // Validate that the selected portal matches the user's actual role
      if (user.role === formData.role) {
        if (user.role === 'admin') {
          console.log('Portal type matches user role, redirecting to admin dashboard')
          router.push('/admin/dashboard')
        } else if (user.role === 'customer') {
          console.log('Portal type matches user role, redirecting to customer dashboard')
          router.push('/customer/dashboard')
        }
      } else if (user.role === 'admin' && formData.role === 'customer') {
        setError('❌ This account is for Admin Portal. Please select "Admin Portal" from the dropdown.')
        setLoginSuccess(false)
      } else if (user.role === 'customer' && formData.role === 'admin') {
        setError('❌ This account is for Customer Portal. Please select "Customer Portal" from the dropdown.')
        setLoginSuccess(false)
      } else {
        console.log('Unknown role, redirecting to welcome page')
        router.push('/')
      }
    }
  }, [loginSuccess, user, formData.role, router])

  // Scroll-based animations
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 0])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      console.log('Attempting login with:', formData)
      
      // Add a timeout to prevent hanging
      const loginPromise = signIn(formData)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login timeout')), 10000)
      )
      
      await Promise.race([loginPromise, timeoutPromise])
      
      console.log('Login successful, setting success flag')
      setLoginSuccess(true)
      
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
      {/* Enhanced Particle System */}
      <ParticleSystem count={20} speed={0.3} size={1} color="rgba(255, 255, 255, 0.3)" />
      
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700"
        style={{ y }}
      />
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CredXLogo size={32} className="shadow-lg" />
            <span className="text-white text-lg font-medium">credX Platform</span>
          </motion.div>
          
          {/* Navigation */}
          <motion.nav 
            className="flex space-x-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/" className="text-white hover:text-blue-200 transition-colors">
              Home
            </Link>
            <Link href="/auth/signup" className="text-white hover:text-blue-200 transition-colors">
              Sign Up
            </Link>
          </motion.nav>
        </div>
      </header>

      {/* Rotating Wheel Animation */}
      <RotatingWheelAnimation />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 
              className="text-4xl md:text-5xl font-bold mb-8 leading-tight"
              style={{
                backgroundImage: 'linear-gradient(45deg, #00C3FF 0%, #3E6FF6 25%, #8B5CF6 50%, #F59E0B 75%, #10B981 100%)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                filter: 'contrast(1.3) brightness(1.2) saturate(1.1)',
                letterSpacing: '-0.02em',
                textShadow: '0 0 40px rgba(0,0,0,0.4)',
                animation: 'gradientShift 6s ease infinite'
              }}
            >
              Sign in to your account
            </h1>
          </motion.div>

          {/* Login Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <label className="block text-white text-sm font-medium mb-2">
                Email *
              </label>
              <div className="relative group">
                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b-2 border-white text-white placeholder-white/70 focus:outline-none focus:border-blue-300 py-2 transition-all duration-300 group-hover:border-blue-200"
                  placeholder="Enter your email"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
                  initial={{ width: 0 }}
                  whileFocus={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label className="block text-white text-sm font-medium mb-2">
                Password *
              </label>
              <div className="relative group">
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b-2 border-white text-white placeholder-white/70 focus:outline-none focus:border-blue-300 py-2 transition-all duration-300 group-hover:border-blue-200"
                  placeholder="Enter your password"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-2 text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </motion.button>
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
                  initial={{ width: 0 }}
                  whileFocus={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            {/* Role Selection */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Portal Type
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'customer' }))}
                className="w-full bg-transparent border-b-2 border-white text-white focus:outline-none focus:border-blue-300 py-2"
              >
                <option value="customer" className="bg-blue-800">Customer Portal</option>
                <option value="admin" className="bg-blue-800">Admin Portal</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-300 text-sm bg-red-900/20 border border-red-500/30 rounded p-3"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <span className="relative z-10">{isLoading ? 'Signing in...' : 'Sign In'}</span>
              
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-sm opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.form>

          {/* Additional Links */}
          <motion.div
            className="mt-8 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center">
              <Link 
                href="/auth/forgot-password" 
                className="text-white/80 hover:text-white transition-colors text-sm"
              >
                Forgot your password?
              </Link>
            </div>
            
            <div className="text-center">
              <span className="text-white/80 text-sm">
                Don't have an account?{' '}
              </span>
              <Link 
                href="/auth/signup" 
                className="text-white hover:text-blue-200 transition-colors text-sm font-medium"
              >
                Sign up
              </Link>
            </div>
          </motion.div>

          {/* Real Authentication Notice */}
          <motion.div
            className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h4 className="text-white font-medium mb-3 text-sm">Secure Authentication</h4>
            <div className="text-white/80 text-xs space-y-2">
              <div>🔒 Real Supabase authentication enabled</div>
              <div>✅ Email verification required</div>
              <div>🛡️ Secure password validation</div>
              <div>🎯 Portal type must match your account role</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex justify-between items-center">
          {/* Social Links */}
          <div className="flex space-x-4">
            <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
              LinkedIn
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
              Facebook
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
              Instagram
            </a>
          </div>
          
          {/* Privacy Policy */}
          <div className="text-white/80 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
          
          {/* Copyright */}
          <div className="text-white/60 text-xs">
            © 2024 by credX Platform. Made with Next.js
          </div>
        </div>
      </footer>

      {/* Corner Circle Bar */}
      <CornerCircleBar />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}