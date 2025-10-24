'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CredXLogo } from '@/components/ui/credX-logo'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  CreditCard, 
  Lock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Globe,
  Database,
  Brain,
  MessageCircle,
  FileText,
  Settings,
  TrendingUp,
  Award,
  Key,
  Fingerprint,
  Building,
  Home,
  Briefcase,
  DollarSign,
  Activity,
  Clock,
  Eye,
  Download,
  Share2,
  Target,
  PieChart,
  LineChart,
  RefreshCw,
  Play,
  Pause,
  MoreHorizontal,
  ExternalLink,
  Info,
  HelpCircle,
  Bell,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Building2,
  Droplets,
  Sparkles,
  Rocket,
  Satellite,
  Planet,
  Comet,
  Asteroid,
  Galaxy,
  Nebula,
  StarField,
  Orbit,
  SolarSystem,
  Moon,
  Sun,
  Earth,
  Mars,
  Venus,
  Mercury,
  Jupiter,
  Saturn,
  Uranus,
  Neptune,
  Pluto
} from 'lucide-react'

export function SolarSystemWelcomePage() {
  const [theme, setTheme] = useState('dark')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  // Solar System Background Component
  const SolarSystemBackground = () => {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Solar system gradient - lighter space */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: theme === 'dark' 
              ? 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
              : 'radial-gradient(ellipse at center, #e6f3ff 0%, #cce7ff 50%, #b3daff 100%)'
          }}
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(150)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${
                theme === 'dark' ? 'bg-white' : 'bg-gray-400'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Sun/Moon */}
        <motion.div
          className={`absolute top-20 right-20 w-24 h-24 rounded-full ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-gray-200 to-gray-300' // Moon
              : 'bg-gradient-to-r from-yellow-300 to-orange-400' // Sun
          }`}
          style={{
            boxShadow: theme === 'dark' 
              ? '0 0 40px rgba(255, 255, 255, 0.3), 0 0 80px rgba(255, 255, 255, 0.1)'
              : '0 0 40px rgba(255, 193, 7, 0.6), 0 0 80px rgba(255, 152, 0, 0.4)'
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: {
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          {/* Moon craters (only in dark mode) */}
          {theme === 'dark' && (
            <>
              <div className="absolute top-4 left-4 w-3 h-3 bg-gray-400 rounded-full opacity-60"></div>
              <div className="absolute top-8 right-5 w-2 h-2 bg-gray-400 rounded-full opacity-50"></div>
              <div className="absolute bottom-6 left-6 w-2 h-2 bg-gray-400 rounded-full opacity-40"></div>
              <div className="absolute bottom-3 right-3 w-2.5 h-2.5 bg-gray-400 rounded-full opacity-45"></div>
            </>
          )}
        </motion.div>

        {/* Planets */}
        {theme === 'dark' && (
          <>
            {/* Mercury */}
            <motion.div
              className="absolute w-4 h-4 bg-gray-500 rounded-full top-32 right-32"
              animate={{
                rotate: 360,
                x: [0, 200, 0],
                y: [0, 100, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Venus */}
            <motion.div
              className="absolute w-6 h-6 bg-yellow-400 rounded-full top-28 right-28"
              animate={{
                rotate: 360,
                x: [0, 300, 0],
                y: [0, 150, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Earth */}
            <motion.div
              className="absolute w-8 h-8 bg-blue-500 rounded-full top-24 right-24"
              animate={{
                rotate: 360,
                x: [0, 400, 0],
                y: [0, 200, 0],
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="absolute inset-0 bg-green-400 rounded-full opacity-30"></div>
            </motion.div>

            {/* Mars */}
            <motion.div
              className="absolute w-5 h-5 bg-red-500 rounded-full top-20 right-20"
              animate={{
                rotate: 360,
                x: [0, 500, 0],
                y: [0, 250, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </>
        )}

        {/* Asteroid belt */}
        {theme === 'dark' && (
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gray-600 rounded-full"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${40 + Math.random() * 20}%`,
                }}
                animate={{
                  x: [0, 100, 0],
                  y: [0, 50, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: Math.random() * 10 + 15,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Feature cards data
  const features = [
    {
      icon: Shield,
      title: "Zero-Knowledge Proofs",
      description: "Prove creditworthiness without revealing sensitive data using advanced cryptographic proofs",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Key,
      title: "Decentralized Identity",
      description: "Own your digital identity with blockchain-based DIDs that you control completely",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: BarChart3,
      title: "AI-Powered Analytics",
      description: "Advanced credit scoring algorithms with real-time analytics and insights",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: CreditCard,
      title: "Digital Wallet",
      description: "Secure digital wallet for managing verifiable credentials and credit applications",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Users,
      title: "Dual Portal System",
      description: "Comprehensive admin dashboard and customer portal with role-based access",
      color: "from-indigo-500 to-blue-600"
    },
    {
      icon: MessageCircle,
      title: "Live Chat Support",
      description: "Real-time customer support with AI-powered responses and ticket management",
      color: "from-pink-500 to-rose-600"
    }
  ]

  // Platform capabilities
  const capabilities = [
    {
      category: "Credit Management",
      items: ["Credit Scoring", "Loan Applications", "Risk Assessment", "Credit History"]
    },
    {
      category: "Blockchain Technology",
      items: ["DID Management", "VC Issuance", "ZKP Generation", "Smart Contracts"]
    },
    {
      category: "Admin Features",
      items: ["Analytics Dashboard", "User Management", "Workflow Builder", "System Health"]
    },
    {
      category: "Customer Features",
      items: ["Digital Wallet", "Live Chat", "Knowledge Base", "Privacy Controls"]
    }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' 
        : 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
    }`}>
      
      {/* Solar System Background */}
      <SolarSystemBackground />

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <CredXLogo className="h-8 w-auto" />
          <span className={`text-3xl font-bold tracking-wide bg-clip-text text-transparent transition-all duration-500 ${
            theme === 'light'
              ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600'
              : 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
          }`}>
            credX
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className={`px-3 py-2 rounded-lg backdrop-blur-sm hover:scale-110 transition-all duration-300 transform ${
              theme === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
            }`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <Link href="/auth/login">
            <Button 
              className={`backdrop-blur-sm hover:scale-105 transition-all duration-300 ${
                theme === 'light'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-6 py-32 text-center">
          <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <motion.h1 
              className="text-7xl md:text-8xl font-bold mb-8 leading-tight cursor-default"
              style={{
                color: theme === 'light' ? '#8b5cf6' : '#60a5fa',
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                textShadow: 'none'
              }}
            >
              credX
            </motion.h1>
            
            <motion.p 
              className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed transition-all duration-500 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Revolutionizing credit management with blockchain technology, zero-knowledge proofs, and AI-powered analytics. 
              Experience the future of decentralized finance in our cosmic ecosystem.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/auth/signup">
                <Button 
                  size="lg" 
                  className={`text-lg px-8 py-4 hover:scale-105 transition-all duration-300 ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white'
                  }`}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Launch Your Journey
                </Button>
              </Link>
              
              <Link href="/auth/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className={`text-lg px-8 py-4 hover:scale-105 transition-all duration-300 ${
                    theme === 'light'
                      ? 'border-purple-600 text-purple-600 hover:bg-purple-50'
                      : 'border-blue-400 text-blue-400 hover:bg-blue-900/20'
                  }`}
                >
                  <Satellite className="h-5 w-5 mr-2" />
                  Explore Platform
                </Button>
              </Link>
            </motion.div>

            {/* Platform Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { label: "Active Users", value: "10K+", icon: Users },
                { label: "Credit Scores", value: "50K+", icon: TrendingUp },
                { label: "ZKPs Generated", value: "25K+", icon: Shield },
                { label: "DIDs Created", value: "15K+", icon: Key }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className={`text-center p-4 rounded-xl backdrop-blur-sm border ${
                    theme === 'light'
                      ? 'bg-white/80 border-gray-200'
                      : 'bg-gray-800/80 border-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <stat.icon className={`h-8 w-8 mx-auto mb-2 ${
                    theme === 'light' ? 'text-purple-600' : 'text-blue-400'
                  }`} />
                  <div className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-gray-800' : 'text-white'
                  }`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Explore the Cosmos of Credit
            </motion.h2>
            <motion.p 
              className={`text-xl max-w-3xl mx-auto ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Navigate through our galaxy of innovative financial solutions powered by cutting-edge technology
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                  theme === 'light'
                    ? 'bg-white/80 border-gray-200 hover:shadow-xl'
                    : 'bg-gray-800/80 border-gray-700 hover:shadow-2xl'
                }`}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`text-4xl mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                  <feature.icon className="h-12 w-12" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}>
                  {feature.title}
                </h3>
                <p className={`${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className={`relative z-10 py-20 ${
        theme === 'light' ? 'bg-gray-50' : 'bg-gray-900/50'
      }`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Platform Capabilities
            </motion.h2>
            <motion.p 
              className={`text-xl max-w-3xl mx-auto ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Comprehensive suite of tools and features for modern credit management
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-xl backdrop-blur-sm border ${
                  theme === 'light'
                    ? 'bg-white/80 border-gray-200'
                    : 'bg-gray-800/80 border-gray-700'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className={`text-xl font-bold mb-4 ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}>
                  {capability.category}
                </h3>
                <ul className="space-y-2">
                  {capability.items.map((item, itemIndex) => (
                    <li key={itemIndex} className={`flex items-center text-sm ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Built with Cosmic Technology
            </motion.h2>
            <motion.p 
              className={`text-xl max-w-3xl mx-auto ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Powered by the latest technologies in blockchain, AI, and web development
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: "Next.js 14", icon: "⚛️" },
              { name: "TypeScript", icon: "🔷" },
              { name: "Supabase", icon: "🗄️" },
              { name: "Tailwind CSS", icon: "🎨" },
              { name: "Framer Motion", icon: "🎭" },
              { name: "Zero-Knowledge", icon: "🔐" },
              { name: "Blockchain", icon: "⛓️" },
              { name: "AI/ML", icon: "🤖" },
              { name: "PostgreSQL", icon: "🐘" },
              { name: "Real-time", icon: "⚡" },
              { name: "Docker", icon: "🐳" },
              { name: "Vercel", icon: "▲" }
            ].map((tech, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg backdrop-blur-sm border text-center ${
                  theme === 'light'
                    ? 'bg-white/80 border-gray-200'
                    : 'bg-gray-800/80 border-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <div className="text-2xl mb-2">{tech.icon}</div>
                <div className={`text-sm font-medium ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}>
                  {tech.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`relative z-10 py-20 ${
        theme === 'light' ? 'bg-gradient-to-r from-purple-50 to-pink-50' : 'bg-gradient-to-r from-purple-900/50 to-pink-900/50'
      }`}>
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              Ready to Launch into the Future?
            </h2>
            <p className={`text-xl mb-8 max-w-3xl mx-auto ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Join thousands of users already exploring the cosmos of decentralized credit management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup">
                <Button 
                  size="lg" 
                  className={`text-lg px-8 py-4 hover:scale-105 transition-all duration-300 ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white'
                  }`}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className={`text-lg px-8 py-4 hover:scale-105 transition-all duration-300 ${
                    theme === 'light'
                      ? 'border-purple-600 text-purple-600 hover:bg-purple-50'
                      : 'border-blue-400 text-blue-400 hover:bg-blue-900/20'
                  }`}
                >
                  <Satellite className="h-5 w-5 mr-2" />
                  Explore Platform
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 py-12 ${
        theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'
      }`}>
        <div className="container mx-auto px-6 text-center">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className={`text-lg font-bold mb-4 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                Platform
              </h3>
              <ul className="space-y-2">
                <li><Link href="/auth/login" className={`hover:underline ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Admin Portal</Link></li>
                <li><Link href="/auth/login" className={`hover:underline ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Customer Portal</Link></li>
                <li><Link href="/auth/signup" className={`hover:underline ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-bold mb-4 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                Features
              </h3>
              <ul className="space-y-2">
                <li><span className={`${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Credit Scoring</span></li>
                <li><span className={`${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Zero-Knowledge Proofs</span></li>
                <li><span className={`${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Digital Wallet</span></li>
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-bold mb-4 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                Technology
              </h3>
              <ul className="space-y-2">
                <li><span className={`${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Blockchain</span></li>
                <li><span className={`${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>AI/ML</span></li>
                <li><span className={`${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Real-time</span></li>
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-bold mb-4 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                Support
              </h3>
              <ul className="space-y-2">
                <li><span className={`${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Live Chat</span></li>
                <li><span className={`${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Knowledge Base</span></li>
                <li><span className={`${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Documentation</span></li>
              </ul>
            </div>
          </div>
          <div className={`border-t pt-8 ${
            theme === 'light' ? 'border-gray-200' : 'border-gray-700'
          }`}>
            <p className={`${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              © 2024 credX Platform. Exploring the infinite possibilities of decentralized finance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SolarSystemWelcomePage
