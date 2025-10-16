'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Zap, Shield, Users, BarChart3 } from 'lucide-react'


export function ImmersiveHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [activeText, setActiveText] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 })

  // Scroll-based animation for masked text
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 0]);

  // Updated text content to match screenshots
  const morphingTexts = [
    "Integrate advanced workflow automation, AI-powered smart handling, and real-time analytics to transform your business service management.",
    "Integrate innovative automation, intelligent solutions, and comprehensive analytics to revolutionize your service management.",
    "Embrace cutting-edge AI, seamless automation, and powerful insights to elevate your business operations.",
    "Transform your operations with advanced AI, automated workflows, and real-time analytics."
  ]

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        mouseX.set(e.clientX - centerX)
        mouseY.set(e.clientY - centerY)
        setMousePosition({ x: e.clientX, y: e.clientY })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Simplified - no text morphing for faster loading
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setActiveText((prev) => (prev + 1) % morphingTexts.length)
  //   }, 3000)
  //   return () => clearInterval(interval)
  // }, [])

  // Simple Button Component - No Magnetic Effect
  function SimpleButton({ children, onClick, variant = 'primary' }: { 
    children: React.ReactNode, 
    onClick: () => void,
    variant?: 'primary' | 'secondary'
  }) {
    return (
      <button
        onClick={onClick}
        style={{
          padding: '16px 32px',
          borderRadius: '12px',
          fontSize: '18px',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: variant === 'primary' 
            ? 'linear-gradient(135deg, #00C3FF 0%, #3E6FF6 100%)'
            : '#ffffff',
          color: variant === 'primary' ? '#ffffff' : '#1f2937',
          boxShadow: variant === 'primary' 
            ? '0 10px 25px rgba(0, 195, 255, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
          transform: 'translateZ(0)',
          willChange: 'transform, box-shadow',
          opacity: 1,
          visibility: 'visible'
        }}
        onMouseEnter={(e) => {
          const target = e.target as HTMLButtonElement
          target.style.transform = 'translateZ(0) scale(1.05)'
          target.style.boxShadow = variant === 'primary' 
            ? '0 15px 35px rgba(0, 195, 255, 0.4)'
            : '0 8px 20px rgba(0, 0, 0, 0.15)'
        }}
        onMouseLeave={(e) => {
          const target = e.target as HTMLButtonElement
          target.style.transform = 'translateZ(0) scale(1)'
          target.style.boxShadow = variant === 'primary' 
            ? '0 10px 25px rgba(0, 195, 255, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
        onMouseDown={(e) => {
          const target = e.target as HTMLButtonElement
          target.style.transform = 'translateZ(0) scale(0.98)'
        }}
        onMouseUp={(e) => {
          const target = e.target as HTMLButtonElement
          target.style.transform = 'translateZ(0) scale(1.05)'
        }}
      >
        {children}
      </button>
    )
  }

  // Kinetic Typography Component
  function KineticText({ text, className }: { text: string, className?: string }) {
    return (
      <div className={`${className} relative`}>
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.05,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{
              scale: 1.2,
              color: "#00FFFF",
              textShadow: "0 0 20px #00FFFF",
              transition: { duration: 0.2 }
            }}
            style={{
              transformOrigin: "center bottom",
              display: "inline-block"
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </div>
    )
  }

  // Energy Orb Component
  function EnergyOrb({ delay = 0 }: { delay?: number }) {
    return (
      <motion.div
        className="absolute w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          x: [0, Math.random() * 200 - 100],
          y: [0, Math.random() * 200 - 100]
        }}
        transition={{
          duration: 3,
          delay,
          repeat: Infinity,
          repeatDelay: 2
        }}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
      />
    )
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#f9fafc] to-[#eef2f9] dark:bg-gradient-to-br dark:from-[#0F1421] dark:via-[#131722] dark:to-[#0F1421] transition-colors duration-300"
    >

      {/* Transform Container */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="max-w-5xl mx-auto">
          {/* Updated Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md border border-blue-200/20 dark:border-blue-800/20 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
              🚀 Next-Gen AI Technology
            </span>
          </motion.div>

         {/* Main Headline with Image Mask Effect */}
         <motion.h1
           className="text-5xl md:text-7xl font-bold leading-tight mb-6 relative"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
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
           Scale with enterprise grade security
           
           {/* Electric blue underline effect */}
           <motion.div
             className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#00C3FF] via-[#3E6FF6] to-[#00C3FF] rounded-full dark:opacity-80"
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1.5, delay: 0.5 }}
             whileHover={{ scaleX: 1.05 }}
           />
         </motion.h1>
         
         <motion.p
           className="text-xl md:text-2xl text-gray-700 dark:text-[#848E9C] mb-12 max-w-3xl mx-auto transition-colors duration-300"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
         >
           Connect work to goals and automate workflows with AI as your teammate.
         </motion.p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <SimpleButton
              onClick={() => window.location.href = '/auth/signup'}
              variant="primary"
            >
              Get Started →
            </SimpleButton>

            <SimpleButton
              onClick={() => window.location.href = '/auth/login'}
              variant="secondary"
            >
              Try For Free →
            </SimpleButton>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-white/60 mb-16 transition-colors duration-300">
            * No credit card required. Free 1 month trial
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
            {[
              { icon: Users, value: "10k+", label: "Companies", color: "from-blue-500 to-blue-600" },
              { icon: Shield, value: "99.9%", label: "Uptime", color: "from-green-500 to-green-600" },
              { icon: Zap, value: "24/7", label: "Support", color: "from-purple-500 to-purple-600" },
              { icon: BarChart3, value: "$2M+", label: "Revenue", color: "from-orange-500 to-orange-600" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group bg-white dark:bg-[#1C1F2D] rounded-2xl p-6 shadow-md shadow-gray-200/60 dark:shadow-[#0F1421]/50 border border-gray-100 dark:border-[#2A2E39] hover:shadow-lg hover:scale-[1.01] dark:hover:shadow-[#00C3FF]/20 transition-all duration-500 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#00C3FF]/10 to-[#3E6FF6]/10 dark:from-[#00C3FF]/20 dark:to-[#3E6FF6]/20 border border-[#00C3FF]/20 dark:border-[#00C3FF]/20"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="h-6 w-6 text-blue-600 dark:text-[#00C3FF] transition-colors duration-300" />
                </motion.div>
                
                <motion.div
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{
                    background: 'linear-gradient(45deg, #3B82F6, #8B5CF6, #3B82F6)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    backgroundPosition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 0.3 }
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.value}
                </motion.div>
                
                <div className="text-gray-600 dark:text-[#848E9C] text-sm font-medium transition-colors duration-300 group-hover:text-gray-800 dark:group-hover:text-[#F5F5F7]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Clean Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        whileHover={{ scale: 1.2 }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <div className="w-6 h-10 border-2 border-gray-300/30 dark:border-white/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-gray-400/60 dark:bg-white/60 rounded-full mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}

