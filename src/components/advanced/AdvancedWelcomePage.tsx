'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sun, Moon } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useTheme } from 'next-themes'
import { QuantumBackground } from './QuantumBackground'
import { MorphingNavigation } from './MorphingNavigation'
import { ImmersiveHero } from './ImmersiveHero'
import { ScrollAnimation } from '@/components/ui/scroll-animation'
import { FloatingElement } from '@/components/ui/floating-element'
import { ParticleSystem } from '@/components/ui/particle-system'
// import { InteractionEcosystem } from './InteractionEcosystem'

// Types for dynamic data
interface AnalyticsData {
  id: string
  metric_name: string
  metric_value: number
  metric_type: string
  tags: any
}

interface KnowledgeBaseArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  view_count: number
  helpful_count: number
  published_at: string
}

export function AdvancedWelcomePage() {
  const [isLoading, setIsLoading] = useState(false) // Professional fast loading
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [isFeaturesHovered, setIsFeaturesHovered] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before rendering theme-dependent content
  useEffect(() => {
    setMounted(true)
  }, [])

  // Professional scroll-based effects
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const parallax = document.querySelector('.parallax-background') as HTMLElement
      if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dynamic data states with default values for instant loading
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([
            { id: '1', metric_name: 'total_tickets', metric_value: 1250, metric_type: 'counter', tags: {} },
            { id: '2', metric_name: 'resolved_tickets', metric_value: 1100, metric_type: 'counter', tags: {} },
            { id: '3', metric_name: 'customer_satisfaction', metric_value: 4.8, metric_type: 'gauge', tags: {} },
            { id: '4', metric_name: 'response_time', metric_value: 2.3, metric_type: 'gauge', tags: {} }
          ])
  const [knowledgeBaseArticles, setKnowledgeBaseArticles] = useState<KnowledgeBaseArticle[]>([
            { id: '1', title: 'Getting Started Guide', content: 'Learn how to use the BSM Platform effectively...', category: 'Getting Started', tags: ['guide', 'tutorial'], view_count: 150, helpful_count: 45, published_at: new Date().toISOString() },
            { id: '2', title: 'Advanced Features', content: 'Explore advanced features and customization options...', category: 'Advanced', tags: ['features', 'customization'], view_count: 89, helpful_count: 23, published_at: new Date().toISOString() },
            { id: '3', title: 'Troubleshooting', content: 'Common issues and their solutions...', category: 'Support', tags: ['troubleshooting', 'help'], view_count: 67, helpful_count: 18, published_at: new Date().toISOString() }
          ])
  const [totalTickets, setTotalTickets] = useState(1250)
  const [resolvedTickets, setResolvedTickets] = useState(1100)
  const [customerSatisfaction, setCustomerSatisfaction] = useState(4.8)

  // Optimized data loading with performance enhancement
  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        // Small timeout to allow animations to start while data loads in background
        // Background loading with enhanced performance
        setTimeout(async () => {
        }, 50) // Quick animation start
        
        // Immediate load for enhanced professional experience
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.log('Professional mock data loaded instantly for enhanced UX')
          return // Using pre-loaded mock data for instant professional appearance
        }

        // Load analytics data
        const { data: analytics, error: analyticsError } = await supabase
          .from('analytics')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10)

        if (analyticsError) {
          console.error('Error loading analytics:', analyticsError)
          // Use mock data as fallback
          setAnalyticsData([
            { id: '1', metric_name: 'total_tickets', metric_value: 1250, metric_type: 'counter', tags: {} },
            { id: '2', metric_name: 'resolved_tickets', metric_value: 1100, metric_type: 'counter', tags: {} },
            { id: '3', metric_name: 'customer_satisfaction', metric_value: 4.8, metric_type: 'gauge', tags: {} },
            { id: '4', metric_name: 'response_time', metric_value: 2.3, metric_type: 'gauge', tags: {} }
          ])
          setTotalTickets(1250)
          setResolvedTickets(1100)
          setCustomerSatisfaction(4.8)
        } else {
          setAnalyticsData(analytics || [])
          
          // Extract specific metrics
          const totalTicketsMetric = analytics?.find(a => a.metric_name === 'total_tickets')
          const resolvedTicketsMetric = analytics?.find(a => a.metric_name === 'resolved_tickets')
          const satisfactionMetric = analytics?.find(a => a.metric_name === 'customer_satisfaction')
          
          if (totalTicketsMetric) setTotalTickets(totalTicketsMetric.metric_value)
          if (resolvedTicketsMetric) setResolvedTickets(resolvedTicketsMetric.metric_value)
          if (satisfactionMetric) setCustomerSatisfaction(satisfactionMetric.metric_value)
        }

        // Load knowledge base articles
        const { data: articles, error: articlesError } = await supabase
          .from('knowledge_base')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(6)

        if (articlesError) {
          console.error('Error loading articles:', articlesError)
          // Use mock data as fallback
          setKnowledgeBaseArticles([
            { id: '1', title: 'Getting Started Guide', content: 'Learn how to use the BSM Platform effectively...', category: 'Getting Started', tags: ['guide', 'tutorial'], view_count: 150, helpful_count: 45, published_at: new Date().toISOString() },
            { id: '2', title: 'Advanced Features', content: 'Explore advanced features and customization options...', category: 'Advanced', tags: ['features', 'customization'], view_count: 89, helpful_count: 23, published_at: new Date().toISOString() },
            { id: '3', title: 'Troubleshooting', content: 'Common issues and their solutions...', category: 'Support', tags: ['troubleshooting', 'help'], view_count: 67, helpful_count: 18, published_at: new Date().toISOString() }
          ])
        } else {
          setKnowledgeBaseArticles(articles || [])
        }

        // Minimal loading time for better performance
        setTimeout(() => {
          setIsLoading(false)
        }, 10)

      } catch (error) {
        console.error('Error loading dynamic data:', error)
        // Still show the page even if data loading fails
        setTimeout(() => {
          setIsLoading(false)
          }, 10)
      }
    }

    loadDynamicData()
  }, [])

  // Professional Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
          <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Professional Quantum Loading Spinner */}
          <motion.div
            className="relative w-24 h-24 mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 border-r-purple-400 rounded-full" />
            <div className="absolute inset-2 border-4 border-transparent border-b-blue-400 border-l-pink-400 rounded-full" />
            <div className="absolute inset-4 border-4 border-transparent border-t-green-400 border-r-yellow-400 rounded-full" />
          </motion.div>

          {/* Professional BSM Platform Title */}
          <motion.div
            className="text-5xl font-bold text-white mb-4"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              background: 'linear-gradient(90deg, #00FFFF, #8B5CF6, #10B981, #F59E0B, #00FFFF)',
              backgroundSize: '400% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            BSM Platform
          </motion.div>

          {/* Professional Loading Progress */}
          <div className="w-80 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

          <motion.p
            className="text-gray-400 mt-6 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Initializing enterprise-grade quantum systems...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9fafc] to-[#eef2f9] dark:bg-[#0F1421] text-gray-900 dark:text-[#F5F5F7] gpu-accelerated high-performance relative transition-colors duration-300">
      {/* Enhanced Particle System */}
      <ParticleSystem count={30} speed={0.5} size={1.5} color="rgba(0, 195, 255, 0.4)" />
      
      {/* Full Quantum Background Simulation */}
      <QuantumBackground />

      {/* Advanced Morphing Navigation */}
      <MorphingNavigation />
      
      {/* Theme Toggle Button */}
      {mounted && (
        <motion.button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          )}
        </motion.button>
      )}
      
      {/* Modern overlay for enhanced readability */}
      <div className="fixed inset-0 bg-gradient-to-br from-transparent via-gray-900/5 to-blue-900/10 pointer-events-none z-5" />

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center gpu-accelerated performance-hint">
          <ImmersiveHero />
        </section>

        {/* Platform Service Showcase Section */}
        <section id="platform-showcase" className="py-20 bg-white dark:bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation animation="slide-up" delay={200}>
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 
                  className="text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #00C3FF 0%, #3E6FF6 25%, #8B5CF6 50%, #F59E0B 75%, #10B981 100%)',
                    backgroundSize: '400% 400%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                    filter: 'contrast(1.2) brightness(1.1)',
                    letterSpacing: '-0.01em',
                    animation: 'gradientShift 8s ease infinite'
                  }}
                >
                  Platform Service Showcase
                </h2>
                <p className="text-xl text-gray-600 dark:text-[#848E9C] max-w-3xl mx-auto transition-colors duration-300">
                  Explore our core services and key features designed to transform your business operations
                </p>
              </motion.div>
            </ScrollAnimation>

            {/* Filter Tabs */}
            <ScrollAnimation animation="slide-up" delay={400}>
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {['All', 'Dashboard', 'Portal', 'Analytics', 'Automation', 'Workflow'].map((filter, index) => (
                  <FloatingElement key={filter} speed={0.8 + index * 0.1} amplitude={5}>
                    <motion.button
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        filter === 'Analytics' 
                          ? 'bg-gradient-to-r from-[#00C3FF] to-[#3E6FF6] dark:bg-gradient-to-r dark:from-[#00C3FF] dark:to-[#3E6FF6] text-white shadow-lg shadow-[#00C3FF]/25' 
                          : 'bg-white dark:bg-[#1C1F2D] text-gray-600 dark:text-[#848E9C] hover:bg-blue-50 dark:hover:bg-[#00C3FF]/10 hover:text-blue-700 dark:hover:text-[#F5F5F7] border border-gray-200 dark:border-[#2A2E39] shadow-sm shadow-gray-200/30 dark:shadow-[#0F1421]/50'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {filter}
                    </motion.button>
                  </FloatingElement>
                ))}
              </div>
            </ScrollAnimation>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Dashboard Overview',
                  description: 'Comprehensive analytics and performance metrics at a glance',
                  icon: '📊',
                  likes: 245,
                  category: 'Dashboard',
                  buttonText: 'View Dashboard',
                  buttonColor: 'from-blue-500 to-blue-600'
                },
                {
                  title: 'Customer Portal',
                  description: 'Self-service portal for customers to manage their requests',
                  icon: '👥',
                  likes: 189,
                  category: 'Portal',
                  buttonText: 'Explore Portal',
                  buttonColor: 'from-pink-500 to-pink-600'
                },
                {
                  title: 'Analytics Dashboard',
                  description: 'Advanced data visualization and comprehensive insights',
                  icon: '📈',
                  likes: 156,
                  category: 'Analytics',
                  buttonText: 'View Analytics',
                  buttonColor: 'from-teal-500 to-teal-600'
                },
                {
                  title: 'Workflow Automation',
                  description: 'Streamlined processes powered by intelligent automation',
                  icon: '⚙️',
                  likes: 203,
                  category: 'Automation',
                  buttonText: 'Configure Workflow',
                  buttonColor: 'from-purple-500 to-purple-600'
                },
                {
                  title: 'Service Management',
                  description: 'End-to-end service lifecycle management tools',
                  icon: '🔧',
                  likes: 178,
                  category: 'Workflow',
                  buttonText: 'Manage Services',
                  buttonColor: 'from-green-500 to-green-600'
                },
                {
                  title: 'Integration Hub',
                  description: 'Seamless connectivity with third-party applications',
                  icon: '🔗',
                  likes: 134,
                  category: 'Automation',
                  buttonText: 'Setup Integration',
                  buttonColor: 'from-orange-500 to-orange-600'
                }
              ].map((service, index) => (
                <motion.div
                  key={service.title}
                  className="bg-white dark:bg-[#1C1F2D] rounded-2xl p-6 shadow-md shadow-gray-200/60 dark:shadow-[#0F1421]/50 border border-gray-100 dark:border-[#2A2E39] hover:shadow-lg hover:scale-[1.01] dark:hover:shadow-[#00C3FF]/20 group cursor-pointer hover:-translate-y-1 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -8,
                    zIndex: 20
                  }}
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-[#F5F5F7] mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-[#848E9C] mb-4 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <span className="mr-1">❤️</span> {service.likes}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                      {service.category}
                    </span>
                  </div>
                  
                  <motion.button
                    className={`w-full py-3 px-4 bg-gradient-to-r ${service.buttonColor} text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {service.buttonText}
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-[#00C3FF] to-[#3E6FF6] dark:bg-gradient-to-r dark:from-[#00C3FF] dark:to-[#3E6FF6] text-white text-lg font-semibold rounded-xl shadow-lg shadow-[#00C3FF]/25 dark:shadow-[#00C3FF]/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Access Admin Dashboard
              </motion.button>
              
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-[#F7931A] to-[#E3B341] dark:bg-gradient-to-r dark:from-[#F7931A] dark:to-[#E3B341] text-white text-lg font-semibold rounded-xl shadow-lg shadow-[#F7931A]/25 dark:shadow-[#F7931A]/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Customer Portal
              </motion.button>
              
              <motion.button
                className="px-8 py-4 bg-black/10 backdrop-blur-sm border border-white/5 dark:border-white/20 text-gray-900 dark:text-[#F5F5F7] text-lg font-semibold rounded-xl hover:bg-black/20 dark:hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-[#f5f7fb] dark:bg-transparent gpu-accelerated performance-hint transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94], type: "tween" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 
                className="text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300"
                style={{
                  backgroundImage: 'linear-gradient(45deg, #00C3FF 0%, #3E6FF6 25%, #8B5CF6 50%, #F59E0B 75%, #10B981 100%)',
                  backgroundSize: '400% 400%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent',
                  filter: 'contrast(1.2) brightness(1.1)',
                  letterSpacing: '-0.01em',
                  animation: 'gradientShift 8s ease infinite'
                }}
              >
                About BSM Platform
              </h2>
              <p className="text-xl text-gray-600 dark:text-[#848E9C] max-w-4xl mx-auto leading-relaxed transition-colors duration-300">
                Our Business Service Management platform revolutionizes how organizations handle 
                customer service, workflow automation, and business operations through cutting-edge 
                AI technology and advanced analytics.
              </p>
            </motion.div>

            <div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              onMouseEnter={() => setIsFeaturesHovered(true)}
              onMouseLeave={() => setIsFeaturesHovered(false)}
            >
              {[
                {
                  title: "AI-Powered Automation",
                  description: "Intelligent workflow automation that learns and adapts to your business needs",
                  icon: "🤖"
                },
                {
                  title: "Advanced Reporting",
                  description: "Comprehensive insights and performance metrics for data-driven decisions",
                  icon: "📊"
                },
                {
                  title: "Multi-channel Support",
                  description: "Unified platform for managing all customer touchpoints and interactions",
                  icon: "🌐"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-black/5 backdrop-blur-sm rounded-xl p-8 border border-white/3 cursor-pointer transition-all duration-300 hover:bg-black/10 hover:border-white/8 hover:shadow-2xl hover:shadow-purple-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.08, 
                    y: -8,
                    zIndex: 20,
                    boxShadow: "0 25px 50px rgba(139, 92, 246, 0.4)"
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                >
                  <motion.div 
                    className="text-4xl mb-4"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: [0, -10, 10, 0]
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <motion.h3 
                    className="text-xl font-semibold text-white mb-4"
                    whileHover={{ 
                      color: "#ffffff",
                      scale: 1.05
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-400"
                    whileHover={{ 
                      color: "#e5e7eb",
                      scale: 1.02
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {feature.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Real-time Analytics Section */}
        <section id="data" className="py-20 bg-white dark:bg-transparent relative overflow-hidden transition-colors duration-300">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
              animate={{
                x: [0, 100, -100, 0],
                y: [0, -50, 50, 0],
                scale: [1, 1.2, 0.8, 1]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
              animate={{
                x: [0, -150, 150, 0],
                y: [0, 80, -80, 0],
                scale: [1.2, 0.8, 1.1, 1.2]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
              animate={{
                x: [0, -200, 200, 0],
                y: [0, 100, -100, 0]
              }}
              transition={{ duration: 12, repeat: Infinity }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl md:text-6xl font-bold text-white mb-6"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{
                  background: 'linear-gradient(90deg, #ffffff, #00ffff, #8b5cf6, #10b981, #ffffff)',
                  backgroundSize: '400% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Real-time Analytics
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Advanced data visualization and performance metrics for informed decision-making
              </motion.p>

              {/* Live Status Indicator */}
              <motion.div
                className="inline-flex items-center px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-full mb-8"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(34, 197, 94, 0.7)',
                    '0 0 0 10px rgba(34, 197, 94, 0)',
                    '0 0 0 0 rgba(34, 197, 94, 0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  className="w-3 h-3 bg-green-400 rounded-full mr-3"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-green-400 font-semibold">LIVE SYSTEM STATUS</span>
              </motion.div>
            </motion.div>
            
            {/* Enhanced Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Performance Metrics */}
              {[
                { 
                  icon: '📊', 
                  title: 'Performance Metrics', 
                  value: '2.3s', 
                  subtitle: 'Response Time',
                  gradient: 'from-green-400 to-blue-500',
                  shadowColor: 'cyan'
                },
                { 
                  icon: '⚡', 
                  title: 'System Activity', 
                  value: '4.8x', 
                  subtitle: 'Efficiency',
                  gradient: 'from-blue-500 to-purple-500',
                  shadowColor: 'purple'
                },
                { 
                  icon: '🧠', 
                  title: 'AI-Powered Network', 
                  value: '1,250', 
                  subtitle: 'Active Nodes',
                  gradient: 'from-pink-500 to-purple-500',
                  shadowColor: 'pink'
                },
                { 
                  icon: '⚛️', 
                  title: 'Quantum States', 
                  value: '99.9%', 
                  subtitle: 'Stability',
                  gradient: 'from-teal-400 to-blue-500',
                  shadowColor: 'cyan'
                }
              ].map((metric, index) => (
                <motion.div
                  key={metric.title}
                  className="relative group bg-white dark:bg-[#1C1F2D] rounded-2xl p-8 shadow-md shadow-gray-200/60 dark:shadow-[#0F1421]/50 border border-gray-100 dark:border-[#2A2E39] text-center cursor-pointer transition-all duration-500 overflow-hidden hover:shadow-lg hover:scale-[1.01] dark:hover:shadow-[#00C3FF]/20"
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1,
                    type: "spring",
                    damping: 20,
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    scale: 1.08,
                    y: -10,
                    rotateY: 5,
                    boxShadow: `0 35px 70px -12px rgba(6, 182, 212, 0.4)`
                  }}
                >
                  {/* Animated Background Gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                    style={{ backgroundSize: '300% 300%' }}
                  />

                  {/* Floating Icon */}
                  <motion.div 
                    className="relative mb-6"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: [0, -10, 10, -10, 0],
                      filter: "drop-shadow(0 0 20px currentColor)"
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${metric.gradient} rounded-xl flex items-center justify-center mx-auto border border-white/20 shadow-lg`}>
                      <span className="text-3xl">{metric.icon}</span>
                    </div>
                  </motion.div>

                  <h3 className="text-lg font-bold text-white mb-4">{metric.title}</h3>
                  
                  {/* Animated Counter */}
                  <motion.div 
                    className="text-4xl font-bold text-white mb-3"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 1, 
                      delay: index * 0.2,
                      type: "spring",
                      damping: 15
                    }}
                    viewport={{ once: true }}
                  >
                    {metric.value}
                  </motion.div>
                  
                  <div className="text-sm text-gray-400 mb-6">{metric.subtitle}</div>
                  
                  {/* Dynamic Progress Bar */}
                  <div className="relative h-3 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/30">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${metric.gradient} rounded-full relative overflow-hidden`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${75 + index * 5}%` }}
                      transition={{ duration: 2, delay: index * 0.3 }}
                      viewport={{ once: true }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      />
                    </motion.div>
                  </div>

                  {/* Active Indicator */}
                  <motion.div
                    className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full"
                    animate={{ 
                      scale: [3, 1.5, 1],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Secondary Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { value: '98.5%', label: 'Uptime', color: 'green', gradient: 'from-green-400 to-emerald-500' },
                { value: '850', label: 'Data Points', color: 'blue', gradient: 'from-blue-400 to-cyan-500' },
                { value: '2.1s', label: 'Avg Load', color: 'orange', gradient: 'from-orange-400 to-red-500' }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className={`relative group bg-white dark:bg-[#1C1F2D] rounded-xl p-6 shadow-md shadow-gray-200/60 dark:shadow-[#0F1421]/50 border border-gray-100 dark:border-[#2A2E39] text-center cursor-pointer transition-all duration-300 overflow-hidden hover:shadow-lg hover:scale-[1.01] dark:hover:shadow-[#00C3FF]/20`}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    boxShadow: `0 20px 40px -12px rgba(34, 197, 94, 0.3)`
                  }}
                >
                  <motion.div
                    className={`text-3xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent mb-2`}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ backgroundSize: '200% 200%' }}
                  >
                    {item.value}
                  </motion.div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{item.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Advanced Data Architecture Visualization */}
            <motion.div
              className="relative bg-white dark:bg-black/10 rounded-2xl p-8 shadow-md shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-white/10 text-center cursor-pointer transition-all duration-500 overflow-hidden group hover:shadow-lg hover:scale-[1.01]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 30px 60px -12px rgba(147, 51, 234, 0.4)"
              }}
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-[#F5F5F7] mb-6 relative z-10 transition-colors duration-300">Data Architecture Visualization</h3>
              
              {/* Interactive Visualization Area */}
              <div className="relative h-80 bg-gradient-to-br from-[#f9fafc] via-white to-[#f9fafc] dark:from-purple-500/20 dark:via-blue-500/20 dark:to-cyan-500/20 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden group-hover:border-blue-300 dark:group-hover:border-white/20 transition-all duration-300">
                {/* Central Hub */}
                <motion.div 
                  className="relative z-10"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity }
                  }}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                    <svg className="w-10 h-10 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </motion.div>

                {/* Orbiting Elements */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-white rounded-full"
                    style={{
                      originX: 0.5,
                      originY: 40,
                    }}
                    animate={{
                      rotate: [0, 360],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                      rotate: { duration: 15, repeat: Infinity, ease: "linear", delay: i * 0.5 },
                      scale: { duration: 3, repeat: Infinity, delay: i * 0.3 }
                    }}
                    initial={{
                      x: 0,
                      y: -40,
                    }}
                  />
                ))}

                {/* Connection Lines */}
                <motion.svg
                  className="absolute inset-0 w-full h-full"
                  animate={{
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.line
                      key={i}
                      x1="50%"
                      y1="50%"
                      x2={`${50 + Math.cos(i * 60 * Math.PI / 180) * 30}%`}
                      y2={`${50 + Math.sin(i * 60 * Math.PI / 180) * 30}%`}
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                    />
                  ))}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </motion.svg>

                {/* Floating Data Points */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center"
                    style={{
                      left: `${20 + (i % 3) * 30}%`,
                      top: `${20 + Math.floor(i / 3) * 25}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5],
                      scale: [0.8, 1.1, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  >
                    <span className="text-xs font-bold text-white">{i}</span>
                  </motion.div>
                ))}
              </div>

              {/* Status Indicators */}
              <div className="flex justify-center space-x-6 mt-6">
                {['Data Flow', 'Processing', 'Storage'].map((status, i) => (
                  <motion.div
                    key={status}
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                    />
                    <span className="text-sm text-gray-400">{status}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Visual Knowledge Base Section */}
        <section id="knowledge-base" className="py-20 bg-[#f5f7fb] dark:bg-transparent transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#F5F5F7] mb-6 transition-colors duration-300">
                Visual Knowledge Base
              </h2>
              <p className="text-xl text-gray-600 dark:text-[#848E9C] max-w-3xl mx-auto transition-colors duration-300">
                Visualize data clearly with intelligent content organization
              </p>
            </motion.div>
            
            {/* Placeholder for future knowledge base content */}
            <motion.div
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-12 border border-gray-700/50 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-6xl mb-6">📚</div>
              <h3 className="text-2xl font-semibold text-white mb-4">Knowledge Base Content Coming Soon</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Advanced AI-powered knowledge management with visual content organization, 
                intelligent search capabilities, and automated categorization.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Multi-Channel Ecosystem Section */}
        <section id="multi-channel" className="py-20 bg-white dark:bg-transparent transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#F5F5F7] mb-6 transition-colors duration-300">
                Multi-Channel Ecosystem
              </h2>
              <p className="text-xl text-gray-600 dark:text-[#848E9C] max-w-3xl mx-auto transition-colors duration-300">
                Seamless communication and collaboration across all service channels
              </p>
            </motion.div>
            
            {/* Advanced Effects Demo */}
            <motion.div
              className="bg-purple-900/50 backdrop-blur-md rounded-2xl p-8 border border-purple-700/50 mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-white mb-4">Advanced Effects Demo</h3>
              <p className="text-gray-300 mb-8 max-w-3xl">
                Our interactive visualization allows users to explore complex relationships and dependencies within the ecosystem.
              </p>
              
              {/* Animated Circles */}
              <div className="relative h-64 mb-8">
                <motion.div
                  className="absolute top-4 left-8 w-4 h-4 bg-blue-400 rounded-full"
                  animate={{
                    x: [0, 100, 50, 0],
                    y: [0, 50, 100, 0],
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute top-12 right-12 w-6 h-6 bg-purple-400 rounded-full"
                  animate={{
                    x: [0, -80, -40, 0],
                    y: [0, 80, 120, 0],
                    scale: [1, 0.5, 1.2, 1],
                    opacity: [0.3, 1, 0.7, 0.3]
                  }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                />
                <motion.div
                  className="absolute bottom-8 left-1/4 w-5 h-5 bg-pink-400 rounded-full"
                  animate={{
                    x: [0, 60, 120, 60, 0],
                    y: [0, -60, -120, -60, 0],
                    scale: [1, 1.3, 0.8, 1],
                    opacity: [0.4, 1, 0.6, 1, 0.4]
                  }}
                  transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                />
                <motion.div
                  className="absolute bottom-16 right-1/4 w-3 h-3 bg-cyan-400 rounded-full"
                  animate={{
                    x: [0, -40, -80, 0],
                    y: [0, 40, 0, -40],
                    scale: [1, 2, 1],
                    opacity: [0.6, 1, 0.4, 0.6]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                  className="absolute top-1/2 left-1/2 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.2, 1, 0.2],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
              
              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: '💬', title: 'Smart Communication', description: 'AI-powered messaging across channels' },
                  { icon: '🌐', title: 'Global Reach', description: 'Worldwide service distribution' },
                  { icon: '⚡', title: 'Real-time Updates', description: 'Instant synchronization and notifications' },
                  { icon: '📄', title: 'Integrated Documentation', description: 'Centralized knowledge management' }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/20 hover:border-gray-600/40 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="text-2xl mb-3">{feature.icon}</div>
                    <h4 className="text-lg font-medium text-white mb-2">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-[#f5f7fb] dark:bg-transparent gpu-accelerated performance-hint transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94], type: "tween" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#F5F5F7] mb-6 transition-colors duration-300">
                Platform Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-[#848E9C] max-w-3xl mx-auto transition-colors duration-300">
                Discover the comprehensive suite of tools designed to streamline your business operations
              </p>
            </motion.div>

            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              onMouseEnter={() => setIsFeaturesHovered(true)}
              onMouseLeave={() => setIsFeaturesHovered(false)}
            >
              {[
                { name: "Ticket Management", count: `${totalTickets.toLocaleString()}+`, color: "from-blue-500 to-cyan-500" },
                { name: "Resolved Tickets", count: `${resolvedTickets.toLocaleString()}+`, color: "from-purple-500 to-pink-500" },
                { name: "Customer Satisfaction", count: `${customerSatisfaction.toFixed(1)}/5`, color: "from-green-500 to-emerald-500" },
                { name: "Knowledge Base", count: `${knowledgeBaseArticles.length}+`, color: "from-yellow-500 to-orange-500" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.name}
                  className="bg-white dark:bg-[#1C1F2D] backdrop-blur-xl rounded-xl p-6 border border-gray-200 dark:border-[#2A2E39] text-center cursor-pointer transition-all duration-300 hover:bg-blue-50 dark:hover:bg-[#00C3FF]/5 hover:border-blue-300 dark:hover:border-[#00C3FF] hover:shadow-2xl hover:shadow-blue-200 dark:hover:shadow-[#00C3FF]/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  whileHover={{ 
                    scale: 1.08,
                    y: -8,
                    zIndex: 20,
                    boxShadow: "0 25px 50px rgba(139, 92, 246, 0.4)"
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                >
                  <motion.div 
                    className={`text-3xl font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent mb-2`}
                    whileHover={{ 
                      scale: 1.1,
                      textShadow: "0 0 20px rgba(139, 92, 246, 0.5)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {feature.count}
                  </motion.div>
                  <motion.div 
                    className="text-gray-300"
                    whileHover={{ 
                      color: "#ffffff",
                      scale: 1.05
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {feature.name}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Knowledge Base Section */}
        <section id="knowledge" className="py-20 bg-white dark:bg-transparent gpu-accelerated performance-hint">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94], type: "tween" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#F5F5F7] mb-6 transition-colors duration-300">
                Knowledge Base
              </h2>
              <p className="text-xl text-gray-600 dark:text-[#848E9C] max-w-3xl mx-auto transition-colors duration-300">
                Access our comprehensive knowledge base with real-time articles and guides
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {knowledgeBaseArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  className="bg-black/5 backdrop-blur-sm rounded-xl p-6 border border-white/3 cursor-pointer transition-all duration-300 hover:bg-black/10 hover:border-white/8 hover:shadow-2xl hover:shadow-purple-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.08, delay: index * 0.01, ease: [0.25, 0.46, 0.45, 0.94], type: "tween" }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ 
                    scale: 1.08, 
                    y: -8,
                    zIndex: 20,
                    boxShadow: "0 25px 50px rgba(139, 92, 246, 0.4)"
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      {article.category}
                    </span>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <span>👁️ {article.view_count}</span>
                      <span>👍 {article.helpful_count}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {article.content.substring(0, 150)}...
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-gray-500 text-sm">
                    Published: {new Date(article.published_at).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>

            {knowledgeBaseArticles.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.02, duration: 0.08, type: "tween" }}
              >
                <div className="text-gray-400 text-lg">
                  Loading knowledge base articles...
                </div>
              </motion.div>
            )}
          </div>
        </section>


        {/* Enhanced Interactive Demo Section */}
        <section id="demo" className="py-20 bg-[#f5f7fb] dark:bg-transparent relative overflow-hidden">
          {/* Floating Interactive Elements */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl md:text-6xl font-bold text-white mb-6"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{
                  background: 'linear-gradient(90deg, #ffffff, #00ffff, #8b5cf6, #10b981, #ffffff)',
                  backgroundSize: '300% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Interactive Demo Experience
              </motion.h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Experience our platform's advanced capabilities through immersive interactive demonstrations
              </p>
            </motion.div>

            {/* Animated Demo Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { title: "Quantum Dashboard", subtitle: "Multi-dimensional analytics", icon: "🔮", gradient: "from-purple-500 to-pink-500" },
                { title: "AI Automation", subtitle: "Intelligent workflow engine", icon: "🤖", gradient: "from-blue-500 to-cyan-500" },
                { title: "Real-time Sync", subtitle: "Instant data synchronization", icon: "⚡", gradient: "from-yellow-500 to-orange-500" },
                { title: "Neural Networks", subtitle: "Deep learning integration", icon: "🧠", gradient: "from-green-500 to-emerald-500" },
                { title: "Cyber Security", subtitle: "Advanced protection layer", icon: "🛡️", gradient: "from-red-500 to-pink-500" },
                { title: "Cloud Fusion", subtitle: "Distributed computing", icon: "☁️", gradient: "from-indigo-500 to-purple-500" }
              ].map((demo, index) => (
                <motion.div
                  key={demo.title}
                  className={`group bg-gradient-to-br ${demo.gradient}/20 backdrop-blur-sm border border-white/5 hover:border-white/10 rounded-lg transition-all duration-300 hover:shadow-lg`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  viewport={{ once: true }}
                >
                  <div className="p-4 h-full">
                    <motion.div
                      className="text-2xl mb-3 text-center"
                      whileHover={{
                        scale: 1.1,
                        filter: "drop-shadow(0 0 8px currentColor)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {demo.icon}
                    </motion.div>
                    
                    <h3 className="text-sm font-semibold text-white mb-1 text-center">
                      {demo.title}
                    </h3>
                    
                    <p className="text-gray-400 text-center text-xs leading-tight">
                      {demo.subtitle}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-r from-black/5 to-black/10 backdrop-blur-sm rounded-xl p-6 border border-white/5 max-w-2xl mx-auto hover:from-black/10 hover:to-black/15 transition-all duration-300">
                <motion.div 
                  className="text-3xl mb-4"
                  animate={{ 
                    rotateY: [0, 180, 360],
                    filter: [
                      "drop-shadow(0 0 10px #00ffff)",
                      "drop-shadow(0 0 20px #8b5cf6)",
                      "drop-shadow(0 0 10px #00ffff)"
                    ]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "linear"
                  }}
                >
                  🚀
                </motion.div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready for the Next Level?
                </h3>
                
                <p className="text-sm text-gray-300 mb-6 max-w-xl mx-auto">
                  Transform your business operations with our cutting-edge platform
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/auth/signup'}
                  >
                    Launch Platform
                  </motion.button>
                  
                  <motion.button
                    className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/auth/login'}
                  >
                    Access Portal
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Enterprise Features Section */}
        <section id="enterprise-features" className="py-20 bg-white dark:bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#F5F5F7] mb-6 transition-colors duration-300">
                Enterprise Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-[#848E9C] max-w-3xl mx-auto transition-colors duration-300">
                Unlock advanced capabilities tailored for enterprise-level operations
              </p>
            </motion.div>
            
            {/* Enterprise Features - Professional Dashboard Style */}
            <div className="space-y-6">
              {[
                {
                  icon: '🤖',
                  title: 'AI-Powered Automation',
                  description: 'Intelligent automation that learns from your business patterns and optimizes processes automatically.',
                  stats: '47% Efficiency Increase',
                  color: 'from-purple-500 to-purple-600',
                  progress: 87
                },
                {
                  icon: '☁️',
                  title: 'Scalable Infrastructure',
                  description: 'Cloud-native architecture that scales with your business needs without compromising performance.',
                  stats: '99.9% Uptime',
                  color: 'from-blue-500 to-blue-600',
                  progress: 95
                },
                {
                  icon: '🔒',
                  title: 'Advanced Security',
                  description: 'Enterprise-grade security with end-to-end encryption and compliance with industry standards.',
                  stats: 'Zero Data Breaches',
                  color: 'from-red-500 to-red-600',
                  progress: 100
                },
                {
                  icon: '📊',
                  title: 'Real-time Monitoring',
                  description: 'Comprehensive monitoring and alerting system to ensure optimal system performance.',
                  stats: 'Sub-second Response',
                  color: 'from-green-500 to-green-600',
                  progress: 92
                },
                {
                  icon: '🔗',
                  title: 'Integration Hub',
                  description: 'Seamless integration with existing enterprise systems and third-party applications.',
                  stats: '200+ Integrations',
                  color: 'from-orange-500 to-orange-600',
                  progress: 78
                },
                {
                  icon: '🌐',
                  title: 'Global Support',
                  description: '24/7 worldwide support with dedicated account managers and technical specialists.',
                  stats: '<5min Response Time',
                  color: 'from-cyan-500 to-cyan-600',
                  progress: 89
                }
              ].map((feature, index) => (
                <motion.div
                  key={`feature-card-${index}`}
                  className={`group bg-white dark:bg-[#1C1F2D] rounded-xl border border-gray-100 dark:border-[#2A2E39] hover:border-blue-300 dark:hover:border-[#00C3FF] shadow-md shadow-gray-200/60 dark:shadow-[#0F1421]/50 transition-all duration-500 hover:shadow-lg hover:scale-[1.01] dark:hover:shadow-[#00C3FF]/20 overflow-hidden`}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.01, 
                    x: 10
                  }}
                >
                  <div className="flex items-center p-6">
                    {/* Icon and Title Section */}
                    <div className="flex items-center flex-1">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color}/30 backdrop-blur-sm flex items-center justify-center mr-4 border border-blue-200 dark:border-white/10`}>
                        <span className="text-2xl">{feature.icon}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-[#F5F5F7] mb-1 flex items-center transition-colors duration-300">
                          {feature.title}
                          <span className="ml-3 text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                            Enterprise
                          </span>
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    {/* Stats and Progress Section */}
                    <div className="w-48 text-right">
                      <div className="mb-2">
                        <div className="text-right text-gray-900 dark:text-[#F5F5F7] font-semibold text-lg mb-1 transition-colors duration-300">
                          {feature.stats}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs transition-colors duration-300">
                          Success Rate
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="relative">
                        <div className="w-full bg-gray-800/50 rounded-full h-2 border border-gray-700/30">
                          <motion.div
                            className={`h-2 bg-gradient-to-r ${feature.color} rounded-full relative overflow-hidden`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${feature.progress}%` }}
                            transition={{ duration: 1.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                            />
                          </motion.div>
                        </div>
                        <div className="text-gray-500 text-xs mt-1 text-right">
                          {feature.progress}%
                        </div>
                      </div>

                      {/* Action Indicator */}
                      <motion.div
                        className="mt-3 flex justify-end"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1, scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={`w-8 h-8 bg-gradient-to-br ${feature.color}/20 rounded-lg flex items-center justify-center border border-white/10`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-20 bg-[#f5f7fb] dark:bg-transparent gpu-accelerated performance-hint transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94], type: "tween" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#F5F5F7] mb-6 transition-colors duration-300">
                Ready to Transform Your Operations?
              </h2>
              <p className="text-xl text-gray-600 dark:text-[#848E9C] mb-12 max-w-3xl mx-auto transition-colors duration-300">
                Experience the power of AI-driven business service management
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/auth/signup'}
                >
                  View Free Trial
                </motion.button>
                
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-lg font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/demo'}
                >
                  View Live Demo
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-black/20 border-t border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* BSM Platform */}
                <div className="md:col-span-1">
                  <h3 className="text-xl font-bold text-white mb-4">BSM Platform</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Empowering businesses with AI-driven service management solutions.
                  </p>
                  <div className="flex space-x-4">
                    {['Twitter', 'Facebook', 'LinkedIn', 'Instagram'].map((social) => (
                      <motion.button
                        key={social}
                        className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        📱
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Solutions */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Solutions</h4>
                  <ul className="space-y-2">
                    {['Customer Service', 'Workflow Automation', 'Analytics Dashboard', 'Enterprise Security'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
                  <ul className="space-y-2">
                    {['Documentation', 'API Reference', 'Blog', 'Case Studies'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
                  <ul className="space-y-2">
                    {['About Us', 'Careers', 'Contact', 'Privacy Policy'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-800 mt-8 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-gray-400 text-sm mb-4 md:mb-0">
                    © 2024 BSM Platform. All rights reserved.
                  </div>
                  <div className="flex space-x-6">
                    {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map((item) => (
                      <a key={item} href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
