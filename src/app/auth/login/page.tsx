'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/components/providers/auth-provider'
import { supabase } from '@/lib/supabase/client'
import { CornerCircleBar } from '@/components/ui/corner-circle-bar'
import { RotatingWheelAnimation } from '@/components/ui/rotating-wheel-animation'
import { ParticleSystem } from '@/components/ui/particle-system'
import { CredXLogo } from '@/components/ui/credX-logo'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, Shield, Sparkles, Zap, ArrowRight, CheckCircle, HelpCircle, Users, Settings, Monitor, BarChart3 } from 'lucide-react'

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
    <div className="h-screen flex relative overflow-hidden">
      {/* Home Button - Top Right Corner */}
      <Link 
        href="/"
        className="absolute top-6 right-6 z-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <span className="text-gray-700 font-medium text-sm">Home</span>
            </Link>

      {/* Left Panel - Login Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Welcome Title */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome to credX
            </h1>
          </motion.div>

          {/* Login Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="yatingzang0215@gmail.com"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="********"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Portal Type Selection - Improved Design */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <label className="block text-gray-700 text-sm font-medium mb-3">
                Choose Your Portal
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Customer Portal Option */}
                <motion.button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'customer' }))}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.role === 'customer'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      formData.role === 'customer' ? 'bg-blue-500' : 'bg-gray-200'
                    }`}>
                      <Users className={`w-4 h-4 ${
                        formData.role === 'customer' ? 'text-white' : 'text-gray-500'
                      }`} />
                    </div>
                    <span className={`text-sm font-medium ${
                      formData.role === 'customer' ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      Customer
                    </span>
                  </div>
                </motion.button>

                {/* Admin Portal Option */}
                <motion.button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.role === 'admin'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      formData.role === 'admin' ? 'bg-blue-500' : 'bg-gray-200'
                    }`}>
                      <Settings className={`w-4 h-4 ${
                        formData.role === 'admin' ? 'text-white' : 'text-gray-500'
                      }`} />
                    </div>
                    <span className={`text-sm font-medium ${
                      formData.role === 'admin' ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      Admin
                    </span>
                  </div>
                </motion.button>
            </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}
            </AnimatePresence>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {isLoading ? 'Signing in...' : 'Login in'}
            </motion.button>
          </motion.form>

          {/* Sign Up Link */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <span className="text-gray-600 text-sm">
                Don't have an account?{' '}
              </span>
              <Link 
                href="/auth/signup" 
              className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
              Sign Up!
              </Link>
          </motion.div>

          {/* Help Section - Redesigned */}
          <motion.div
            className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-start space-x-3">
              {/* Question Mark Icon in Circle */}
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-4 h-4 text-gray-600" />
              </div>
              
              <div className="flex-1">
                {/* Question/Heading */}
                <h3 className="text-gray-800 text-sm font-medium mb-2">
                  Can you change your plan?
                </h3>
                
                {/* Descriptive Text */}
                <p className="text-gray-600 text-xs mb-3 leading-relaxed">
                  Whenever you want. credX will also change with you according to your needs.
                </p>
                
                {/* Contact Us Link */}
                <Link 
                  href="/contact" 
                  className="text-blue-600 hover:text-blue-700 text-xs font-medium underline transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Professional credX Showcase */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Rounded top-right corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-bl-full z-10"></div>
        
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 opacity-20">
          {/* Main Bubbles */}
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
              y: [0, -20, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full"
            animate={{
              scale: [1, 1.4, 1],
              rotate: [360, 180, 0],
              y: [0, 15, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div
            className="absolute bottom-20 left-16 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, -180, -360],
              y: [0, -10, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />
          <motion.div
            className="absolute bottom-32 right-10 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [360, 0, -360],
              y: [0, 25, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute top-40 left-1/2 w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full"
            animate={{
              scale: [1, 1.6, 1],
              rotate: [0, 90, 180, 270, 360],
              y: [0, -15, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />
          
          {/* Additional Floating Elements */}
          <motion.div
            className="absolute top-20 right-1/3 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 360, 720],
              x: [0, 20, 0],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          />
          <motion.div
            className="absolute bottom-40 left-1/3 w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [360, 0, -360],
              x: [0, -15, 0],
              y: [0, 20, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.5
            }}
          />
          <motion.div
            className="absolute top-60 right-1/4 w-4 h-4 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full"
            animate={{
              scale: [1, 1.8, 1],
              rotate: [0, -180, -360],
              x: [0, 25, 0],
              y: [0, -25, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4.5
            }}
          />
          
          {/* Geometric Shapes */}
          <motion.div
            className="absolute top-16 right-1/2 w-14 h-14 bg-gradient-to-br from-violet-400 to-violet-600 transform rotate-45"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [45, 225, 405],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div
            className="absolute bottom-16 left-1/4 w-18 h-18 bg-gradient-to-br from-rose-400 to-rose-600 transform rotate-12"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [12, 192, 372],
              opacity: [0.1, 0.25, 0.1]
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3.5
            }}
          />
          </div>
          
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center h-full relative p-4">
          {/* Professional Header */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-lg font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-1"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Welcome to
            </motion.h2>
            <p className="text-slate-600 text-sm font-medium">Enterprise Credit Management</p>
          </motion.div>
          
          {/* Portal Screenshots */}
          <motion.div
            className="w-full max-w-4xl mb-8"
            animate={{
              y: [0, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Screenshot Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer Portal Screenshot */}
              <motion.div
                className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 relative"
                animate={{
                  scale: [1, 1.02, 1],
                  rotateY: [0, 2, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Browser Header */}
                <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2 border-b">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500 ml-4">
                    credx.com/customer/dashboard
                  </div>
                </div>
                
                {/* Screenshot Content */}
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Customer Dashboard</h3>
                        <p className="text-sm text-gray-500">Welcome back, John Doe</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs">🔔</span>
                      </div>
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs">👤</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dashboard Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <motion.div
                      className="bg-blue-50 rounded-lg p-3"
                      animate={{
                        scale: [1, 1.02, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    >
                      <div className="text-2xl font-bold text-blue-600">$12,450</div>
                      <div className="text-sm text-gray-600">Credit Score</div>
                    </motion.div>
                    <motion.div
                      className="bg-green-50 rounded-lg p-3"
                      animate={{
                        scale: [1, 1.02, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    >
                      <div className="text-2xl font-bold text-green-600">3</div>
                      <div className="text-sm text-gray-600">Active Loans</div>
                    </motion.div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">Recent Activity</h4>
                    <motion.div
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      animate={{
                        x: [0, 2, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Payment received</span>
                      </div>
                      <span className="text-xs text-gray-500">2h ago</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      animate={{
                        x: [0, -1, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Credit report updated</span>
                      </div>
                      <span className="text-xs text-gray-500">1d ago</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              {/* Admin Portal Screenshot */}
              <motion.div
                className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 relative"
                animate={{
                  scale: [1, 1.02, 1],
                  rotateY: [0, -2, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: -5,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Browser Header */}
                <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2 border-b">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500 ml-4">
                    credx.com/admin/dashboard
                  </div>
                </div>
                
                {/* Screenshot Content */}
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Admin Dashboard</h3>
                        <p className="text-sm text-gray-500">System Overview</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs">🔔</span>
                      </div>
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs">⚙️</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <motion.div
                      className="bg-purple-50 rounded-lg p-3"
                      animate={{
                        scale: [1, 1.02, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2.5
                      }}
                    >
                      <div className="text-2xl font-bold text-purple-600">1,247</div>
                      <div className="text-sm text-gray-600">Total Users</div>
                    </motion.div>
                    <motion.div
                      className="bg-orange-50 rounded-lg p-3"
                      animate={{
                        scale: [1, 1.02, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 3
                      }}
                    >
                      <div className="text-2xl font-bold text-orange-600">99.9%</div>
                      <div className="text-sm text-gray-600">Uptime</div>
                    </motion.div>
                  </div>
                  
                  {/* System Status */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">System Status</h4>
                    <motion.div
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      animate={{
                        x: [0, -2, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 3.5
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">API Services</span>
                      </div>
                      <span className="text-xs text-green-600">Operational</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      animate={{
                        x: [0, 1, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 4
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Database</span>
                      </div>
                      <span className="text-xs text-yellow-600">Maintenance</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Professional credX Logo */}
          <motion.h1
            className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6"
            animate={{
              rotateY: [0, 360],
              scale: [1, 1.05, 1],
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            credX
          </motion.h1>
          
          {/* Professional Stats */}
          <motion.div
            className="grid grid-cols-3 gap-6 w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">50K+</div>
              <div className="text-sm text-slate-500">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">99.5%</div>
              <div className="text-sm text-slate-500">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">24/7</div>
              <div className="text-sm text-slate-500">Support</div>
          </div>
          </motion.div>
          
          {/* Subtle Floating Elements */}
          <motion.div
            className="absolute top-20 right-16 w-2 h-2 bg-blue-500 rounded-full opacity-40"
            animate={{
              y: [0, -15, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-24 left-12 w-1.5 h-1.5 bg-indigo-500 rounded-full opacity-40"
            animate={{
              y: [0, 12, 0],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          </div>
        </div>
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