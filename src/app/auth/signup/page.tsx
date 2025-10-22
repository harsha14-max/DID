'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/providers/auth-provider'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, Users, Settings, User, Sparkles, Shield } from 'lucide-react'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signUp, loading } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: searchParams.get('role') as 'admin' | 'customer' || 'customer'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [signupSuccess, setSignupSuccess] = useState(false)

  // Handle redirection after successful signup
  useEffect(() => {
    if (signupSuccess) {
      console.log('Signup successful, redirecting to login...')
      router.push('/auth/login')
    }
  }, [signupSuccess, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!formData.email || !formData.password || !formData.full_name) {
      setError('Please fill in all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      console.log('Attempting signup with:', { email: formData.email, role: formData.role })
      await signUp(formData)
      console.log('Signup successful, setting success flag')
      setSignupSuccess(true)
    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message || 'Signup failed')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Dynamic Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100"
        animate={{
          background: [
            "linear-gradient(135deg, #dbeafe 0%, #f3e8ff 50%, #e0e7ff 100%)",
            "linear-gradient(135deg, #f0f9ff 0%, #fdf2f8 50%, #f0f4ff 100%)",
            "linear-gradient(135deg, #ecfdf5 0%, #fef3c7 50%, #ede9fe 100%)",
            "linear-gradient(135deg, #dbeafe 0%, #f3e8ff 50%, #e0e7ff 100%)"
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Animated Grid Pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px', '0px 0px']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Floating Geometric Shapes */}
      <motion.div
        className="absolute top-20 left-20 w-16 h-16 border-2 border-blue-300/30 rotate-45"
        animate={{
          rotate: [45, 405, 45],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-32 right-32 w-12 h-12 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 180, 360],
          opacity: [0.2, 0.5, 0.2],
          x: [0, -25, 0],
          y: [0, 15, 0]
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />
      <motion.div
        className="absolute top-1/2 right-20 w-8 h-8 border-2 border-emerald-300/40 transform rotate-12"
        animate={{
          rotate: [12, 372, 12],
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 20, 0],
          y: [0, -25, 0]
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6
        }}
      />
      
      {/* Interactive Light Rays */}
      <motion.div
        className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-300/20 to-transparent"
        animate={{
          opacity: [0, 0.5, 0],
          scaleY: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-300/20 to-transparent"
        animate={{
          opacity: [0, 0.4, 0],
          scaleY: [0.6, 1.4, 0.6]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div
        className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-indigo-300/20 to-transparent"
        animate={{
          opacity: [0, 0.3, 0],
          scaleY: [0.9, 1.1, 0.9]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />
      
      {/* Floating Text Elements */}
      <motion.div
        className="absolute top-1/4 left-10 text-blue-300/20 font-bold text-6xl select-none pointer-events-none"
        animate={{
          y: [0, -20, 0],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        credX
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 right-10 text-purple-300/20 font-bold text-4xl select-none pointer-events-none"
        animate={{
          y: [0, 15, 0],
          opacity: [0.1, 0.15, 0.1],
          rotate: [0, -3, 0]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      >
        secure
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-1/4 text-indigo-300/20 font-bold text-3xl select-none pointer-events-none"
        animate={{
          x: [0, 10, 0],
          opacity: [0.1, 0.18, 0.1],
          rotate: [0, 2, 0]
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8
        }}
      >
        future
      </motion.div>
      {/* Enhanced Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Floating Circles with Enhanced Effects */}
        <motion.div
          className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{
            scale: 1.3,
            transition: { duration: 0.3 }
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
            rotate: [0, -90, -180],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
          whileHover={{
            scale: 1.4,
            transition: { duration: 0.3 }
          }}
        />
        
        {/* Additional Large Bubbles */}
        <motion.div
          className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-cyan-200/25 to-blue-200/25 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-br from-emerald-200/25 to-teal-200/25 rounded-full blur-3xl"
          animate={{
            x: [0, 35, 0],
            y: [0, -25, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 7
          }}
        />
        
        {/* Medium Floating Elements */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-full blur-2xl"
          animate={{
            y: [0, -40, 0],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-gradient-to-br from-orange-200/40 to-red-200/40 rounded-full blur-2xl"
          animate={{
            y: [0, 30, 0],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8
          }}
        />
        
        {/* More Medium Bubbles */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-28 h-28 bg-gradient-to-br from-violet-200/35 to-purple-200/35 rounded-full blur-2xl"
          animate={{
            x: [0, 25, 0],
            y: [0, -20, 0],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-36 h-36 bg-gradient-to-br from-rose-200/35 to-pink-200/35 rounded-full blur-2xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 25, 0],
            rotate: [360, 270, 180, 90, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
        />
        <motion.div
          className="absolute top-2/3 right-1/5 w-20 h-20 bg-gradient-to-br from-indigo-200/40 to-blue-200/40 rounded-full blur-2xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 9
          }}
        />
        
        {/* Small Floating Particles - Many More */}
        <motion.div
          className="absolute top-20 left-20 w-4 h-4 bg-blue-300/60 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-40 w-3 h-3 bg-purple-300/60 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div
          className="absolute bottom-40 left-40 w-5 h-5 bg-green-300/60 rounded-full"
          animate={{
            y: [0, -25, 0],
            opacity: [0.5, 0.9, 0.5],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        
        {/* Additional Small Bubbles */}
        <motion.div
          className="absolute top-32 left-1/3 w-2 h-2 bg-cyan-300/70 rounded-full"
          animate={{
            y: [0, -18, 0],
            x: [0, 10, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.4, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        <motion.div
          className="absolute top-60 right-1/4 w-3 h-3 bg-emerald-300/60 rounded-full"
          animate={{
            y: [0, -22, 0],
            x: [0, -8, 0],
            opacity: [0.4, 0.9, 0.4],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5
          }}
        />
        <motion.div
          className="absolute bottom-32 right-1/5 w-4 h-4 bg-violet-300/60 rounded-full"
          animate={{
            y: [0, -28, 0],
            x: [0, 12, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        <motion.div
          className="absolute bottom-60 left-1/5 w-2 h-2 bg-rose-300/70 rounded-full"
          animate={{
            y: [0, -16, 0],
            x: [0, -6, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/5 w-3 h-3 bg-teal-300/60 rounded-full"
          animate={{
            y: [0, -24, 0],
            x: [0, 15, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3.5
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/6 w-2 h-2 bg-indigo-300/70 rounded-full"
          animate={{
            y: [0, -20, 0],
            x: [0, -10, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.4, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-orange-300/60 rounded-full"
          animate={{
            y: [0, -26, 0],
            x: [0, 8, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute top-1/4 left-1/6 w-3 h-3 bg-pink-300/60 rounded-full"
          animate={{
            y: [0, -19, 0],
            x: [0, -12, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4.5
          }}
        />
        <motion.div
          className="absolute bottom-1/5 left-1/3 w-2 h-2 bg-sky-300/70 rounded-full"
          animate={{
            y: [0, -17, 0],
            x: [0, 14, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.6, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6.5
          }}
        />
        <motion.div
          className="absolute top-3/4 left-1/4 w-3 h-3 bg-lime-300/60 rounded-full"
          animate={{
            y: [0, -23, 0],
            x: [0, -9, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        
        {/* Extra Tiny Bubbles */}
        <motion.div
          className="absolute top-16 right-1/3 w-1 h-1 bg-blue-400/80 rounded-full"
          animate={{
            y: [0, -12, 0],
            opacity: [0.3, 0.9, 0.3],
            scale: [1, 2, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
        />
        <motion.div
          className="absolute bottom-16 left-1/4 w-1 h-1 bg-purple-400/80 rounded-full"
          animate={{
            y: [0, -14, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 2.2, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.8
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/2 w-1 h-1 bg-green-400/80 rounded-full"
          animate={{
            y: [0, -10, 0],
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.8, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4.2
          }}
        />
        <motion.div
          className="absolute bottom-1/2 left-1/2 w-1 h-1 bg-cyan-400/80 rounded-full"
          animate={{
            y: [0, -13, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 2.5, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2
          }}
        />
      </div>

      {/* Interactive Cursor Trail */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-blue-400/30 rounded-full pointer-events-none z-50"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      {/* Floating Interactive Elements */}
      <motion.div
        className="absolute top-1/4 left-1/2 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full cursor-pointer"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.5, 1],
          opacity: [0.4, 0.9, 0.4]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{
          scale: 2,
          transition: { duration: 0.2 }
        }}
        whileTap={{
          scale: 0.5,
          transition: { duration: 0.1 }
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full cursor-pointer"
        animate={{
          y: [0, 25, 0],
          x: [0, -15, 0],
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        whileHover={{
          scale: 2.5,
          transition: { duration: 0.2 }
        }}
        whileTap={{
          scale: 0.3,
          transition: { duration: 0.1 }
        }}
      />
      
      {/* Dynamic Wave Effects */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-100/20 to-transparent"
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scaleY: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-100/15 to-transparent rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
          rotate: [0, 90, 180]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />
      
      {/* Home Button */}
      <Link 
        href="/"
        className="absolute top-6 right-6 z-10 bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <span className="text-gray-700 font-medium text-sm">Home</span>
      </Link>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* credX Logo - Similar to Login Page */}
            <motion.h1
              className="text-5xl font-bold mb-6"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.span
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                animate={{
                  textShadow: [
                    "0 0 0px rgba(59, 130, 246, 0)",
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                    "0 0 0px rgba(59, 130, 246, 0)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                credX
              </motion.span>
            </motion.h1>

            {/* Title */}
            <motion.h1
              className="text-4xl font-bold mb-3"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Create Account
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-gray-600 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Join the future of credit management
            </motion.p>

            {/* Decorative Elements */}
            <motion.div
              className="flex items-center justify-center space-x-2 mt-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.div
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="w-2 h-2 bg-purple-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              <motion.div
                className="w-2 h-2 bg-indigo-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.div>
          </motion.div>

          {/* Signup Form */}
          <motion.div
            className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            {/* Form Background Effects */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, 90, 180]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.25, 0.1],
                rotate: [0, -90, -180]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <motion.input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/50"
                    placeholder="Enter your full name"
                    required
                    whileFocus={{
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    animate={{
                      borderColor: formData.full_name ? '#3b82f6' : '#e5e7eb'
                    }}
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/50"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/50"
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/50"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Role Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <label className="block text-gray-700 text-sm font-semibold mb-3">
                  Choose Your Role
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Customer */}
                  <motion.button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'customer' }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      formData.role === 'customer'
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        formData.role === 'customer' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}>
                        <Users className={`w-5 h-5 ${
                          formData.role === 'customer' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <span className={`text-sm font-semibold ${
                        formData.role === 'customer' ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        Customer
                      </span>
                    </div>
                  </motion.button>

                  {/* Admin */}
                  <motion.button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      formData.role === 'admin'
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        formData.role === 'admin' ? 'bg-purple-500' : 'bg-gray-300'
                      }`}>
                        <Settings className={`w-5 h-5 ${
                          formData.role === 'admin' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <span className={`text-sm font-semibold ${
                        formData.role === 'admin' ? 'text-purple-700' : 'text-gray-700'
                      }`}>
                        Admin
                      </span>
                    </div>
                  </motion.button>
                </div>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Create Account</span>
                  </div>
                )}
              </motion.button>

              {/* Google Auth */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <GoogleAuthButton role={formData.role} />
              </motion.div>
            </form>

            {/* Sign In Link */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <span className="text-gray-600 text-sm">
                Already have an account?{' '}
              </span>
              <motion.div className="inline-block">
                <Link 
                  href="/auth/login" 
                  className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors"
                >
                  Sign In
                </Link>
                <motion.div
                  className="h-0.5 bg-blue-600 mt-1"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
            
            {/* Floating Success Particles */}
            {signupSuccess && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-green-400 rounded-full"
                    initial={{
                      x: '50%',
                      y: '50%',
                      scale: 0
                    }}
                    animate={{
                      x: `${50 + (Math.random() - 0.5) * 200}%`,
                      y: `${50 + (Math.random() - 0.5) * 200}%`,
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  )
}