'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useSpring as useReactSpring, animated } from '@react-spring/web'
import { useGesture } from '@use-gesture/react'
import { MousePointer, Zap, Target, Sparkles } from 'lucide-react'

export function InteractionEcosystem() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [activeInteraction, setActiveInteraction] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 })

  // Mouse tracking for gravitational effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
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

  // Gravitational Pull Component
  function GravitationalElement({ 
    children, 
    strength = 0.1, 
    size = 100,
    color = '#00FFFF'
  }: { 
    children: React.ReactNode, 
    strength?: number,
    size?: number,
    color?: string
  }) {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const updatePosition = () => {
        if (elementRef.current) {
          const rect = elementRef.current.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          
          const deltaX = (mousePosition.x - centerX) * strength
          const deltaY = (mousePosition.y - centerY) * strength
          
          setPosition({ x: deltaX, y: deltaY })
        }
      }

      const interval = setInterval(updatePosition, 16) // 60fps
      return () => clearInterval(interval)
    }, [mousePosition, strength])

    return (
      <motion.div
        ref={elementRef}
        className="absolute"
        animate={{
          x: position.x,
          y: position.y,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        whileHover={{ scale: 1.2 }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20"
          style={{
            background: `radial-gradient(circle, ${color}20, transparent)`,
            boxShadow: `0 0 20px ${color}40`
          }}
        >
          {children}
        </div>
      </motion.div>
    )
  }

  // Magnetic Repulsion Component
  function MagneticRepulsion({ 
    children, 
    strength = 0.2,
    color = '#FF6B6B'
  }: { 
    children: React.ReactNode, 
    strength?: number,
    color?: string
  }) {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const updatePosition = () => {
        if (elementRef.current) {
          const rect = elementRef.current.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          
          const deltaX = centerX - mousePosition.x
          const deltaY = centerY - mousePosition.y
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
          
          if (distance < 100) {
            const force = (100 - distance) / 100 * strength
            setPosition({ 
              x: (deltaX / distance) * force * 50, 
              y: (deltaY / distance) * force * 50 
            })
          } else {
            setPosition({ x: 0, y: 0 })
          }
        }
      }

      const interval = setInterval(updatePosition, 16)
      return () => clearInterval(interval)
    }, [mousePosition, strength])

    return (
      <motion.div
        ref={elementRef}
        className="absolute"
        animate={{
          x: position.x,
          y: position.y
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20"
          style={{
            background: `radial-gradient(circle, ${color}20, transparent)`,
            boxShadow: `0 0 15px ${color}40`
          }}
        >
          {children}
        </div>
      </motion.div>
    )
  }

  // Quantum Field Distortion
  function QuantumFieldDistortion() {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.path
              key={i}
              d={`M ${0}%, ${50}% Q ${25}%, ${25}%, ${50}%, ${50}% T ${100}%, ${50}%`}
              stroke="#8B5CF6"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
              animate={{
                d: [
                  `M ${Math.random() * 100}%,${Math.random() * 100}% Q ${mousePosition.x / window.innerWidth * 100}%,${mousePosition.y / window.innerHeight * 100}% ${Math.random() * 100}%,${Math.random() * 100}%`,
                  `M ${Math.random() * 100}%,${Math.random() * 100}% Q ${mousePosition.x / window.innerWidth * 100}%,${mousePosition.y / window.innerHeight * 100}% ${Math.random() * 100}%,${Math.random() * 100}%`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </svg>
      </div>
    )
  }

  // Liquid Displacement Effect
  function LiquidDisplacement() {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              x: [
                0,
                (mousePosition.x - window.innerWidth / 2) * 0.01,
                0
              ],
              y: [
                0,
                (mousePosition.y - window.innerHeight / 2) * 0.01,
                0
              ]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    )
  }

  // Ripple Cascade Effect
  function RippleCascade({ trigger }: { trigger: boolean }) {
    return (
      <AnimatePresence>
        {trigger && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute border-2 border-cyan-400 rounded-full"
                style={{
                  left: clickPosition.x - 50,
                  top: clickPosition.y - 50,
                  width: 100,
                  height: 100
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 4],
                  opacity: [1, 0]
                }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.01,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "tween"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Particle Emission Effect
  function ParticleEmission({ trigger }: { trigger: boolean }) {
    return (
      <AnimatePresence>
        {trigger && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                style={{
                  left: mousePosition.x,
                  top: mousePosition.y
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, (Math.random() - 0.5) * 200],
                  scale: [0, 1, 0],
                  opacity: [1, 0]
                }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.01,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "tween"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Energy Absorption Effect
  function EnergyAbsorption({ trigger }: { trigger: boolean }) {
    return (
      <AnimatePresence>
        {trigger && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute w-64 h-64 rounded-full border-2 border-purple-400"
              style={{
                left: mousePosition.x - 128,
                top: mousePosition.y - 128
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: [0, 1.5],
                opacity: [1, 0],
              }}
              transition={{
                duration: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "tween"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Holographic Reconstruction Effect
  function HolographicReconstruction({ trigger }: { trigger: boolean }) {
    return (
      <AnimatePresence>
        {trigger && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-16 bg-gradient-to-t from-transparent to-cyan-400"
                style={{
                  left: mousePosition.x,
                  top: mousePosition.y - 32
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                  scaleY: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: i * 45
                }}
                transition={{
                  duration: 0.25,
                  delay: i * 0.01,
                  ease: [0.4, 0, 0.2, 1],
                  type: "tween"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Interactive effect triggers
  const [rippleTrigger, setRippleTrigger] = useState(false)
  const [particleTrigger, setParticleTrigger] = useState(false)
  const [energyTrigger, setEnergyTrigger] = useState(false)
  const [holographicTrigger, setHolographicTrigger] = useState(false)
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })

  // Handle click interactions to trigger effects
  const handleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setClickPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      
      // Trigger ripple effect
      setRippleTrigger(true)
      setTimeout(() => setRippleTrigger(false), 300)
      
      // Trigger other effects with delays
      setTimeout(() => {
        setParticleTrigger(true)
        setTimeout(() => setParticleTrigger(false), 300)
      }, 25)
      
      setTimeout(() => {
        setEnergyTrigger(true)
        setTimeout(() => setEnergyTrigger(false), 200)
      }, 50)
      
      setTimeout(() => {
        setHolographicTrigger(true)
        setTimeout(() => setHolographicTrigger(false), 250)
      }, 75)
    }
  }

  // Auto-trigger effects occasionally for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 8 seconds
        setClickPosition({
          x: Math.random() * 800 + 100,
          y: Math.random() * 300 + 100
        })
        setRippleTrigger(true)
        setTimeout(() => setRippleTrigger(false), 300)
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section 
      ref={containerRef}
      className="relative py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden gpu-accelerated"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Advanced Effects Demo
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Click anywhere in the interactive area below to trigger expansion animations - 
            Ripple cascades, particle emissions, energy absorption, and holographic reconstruction
          </p>
        </motion.div>

        {/* Interactive Elements Grid */}
        <div 
          className="relative h-96 mb-16 cursor-pointer gpu-accelerated"
          onClick={handleClick}
        >
          {/* Gravitational Elements */}
          <GravitationalElement strength={0.1} color="#00FFFF" size={100}>
            <MousePointer className="h-6 w-6 text-cyan-400" />
          </GravitationalElement>
          
          <GravitationalElement strength={0.15} color="#10B981" size={80}>
            <Zap className="h-5 w-5 text-emerald-400" />
          </GravitationalElement>
          
          <GravitationalElement strength={0.08} color="#8B5CF6" size={120}>
            <Target className="h-6 w-6 text-purple-400" />
          </GravitationalElement>

          {/* Magnetic Repulsion Elements */}
          <MagneticRepulsion strength={0.2} color="#FF6B6B">
            <Sparkles className="h-4 w-4 text-red-400" />
          </MagneticRepulsion>

          {/* Quantum Field Distortion */}
          <QuantumFieldDistortion />

          {/* Liquid Displacement */}
          <LiquidDisplacement />

          {/* Interactive Clickable Circles */}
          <motion.div
            className="absolute top-1/2 left-1/4 w-20 h-20 rounded-full border-2 border-cyan-400 bg-cyan-400/10 cursor-pointer gpu-accelerated"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              setClickPosition({ x: e.currentTarget.offsetLeft + 40, y: e.currentTarget.offsetTop + 40 })
              setRippleTrigger(true)
              setTimeout(() => setRippleTrigger(false), 300)
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: [0.4, 0, 0.2, 1],
              type: "tween"
            }}
          />
          
          <motion.div
            className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full border-2 border-purple-400 bg-purple-400/10 cursor-pointer gpu-accelerated"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              setClickPosition({ x: e.currentTarget.offsetLeft + 32, y: e.currentTarget.offsetTop + 32 })
              setParticleTrigger(true)
              setTimeout(() => setParticleTrigger(false), 300)
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 0.45,
              repeat: Infinity,
              ease: [0.4, 0, 0.2, 1],
              delay: 0.08,
              type: "tween"
            }}
          />
          
          <motion.div
            className="absolute bottom-1/3 left-1/3 w-24 h-24 rounded-full border-2 border-emerald-400 bg-emerald-400/10 cursor-pointer gpu-accelerated"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              setClickPosition({ x: e.currentTarget.offsetLeft + 48, y: e.currentTarget.offsetTop + 48 })
              setEnergyTrigger(true)
              setTimeout(() => setEnergyTrigger(false), 200)
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: [0.4, 0, 0.2, 1],
              delay: 0.15,
              type: "tween"
            }}
          />

          {/* Effect Triggers */}
          <RippleCascade trigger={rippleTrigger} />
          <ParticleEmission trigger={particleTrigger} />
          <EnergyAbsorption trigger={energyTrigger} />
          <HolographicReconstruction trigger={holographicTrigger} />
        </div>

        {/* Platform Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Smart Automation', description: 'AI-powered workflow optimization', icon: MousePointer, color: '#00FFFF' },
            { title: 'Real-time Analytics', description: 'Live insights and performance metrics', icon: Zap, color: '#FF6B6B' },
            { title: 'Advanced AI', description: 'Machine learning and predictive analysis', icon: Target, color: '#8B5CF6' },
            { title: 'Seamless Integration', description: 'Connect with your existing tools', icon: Sparkles, color: '#10B981' }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="flex items-center mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  <item.icon className="h-6 w-6" style={{ color: item.color }} />
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              </div>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
