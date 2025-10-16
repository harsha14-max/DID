'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// Adaptive Background Component for Light/Dark modes
export function QuantumBackground() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fixed positions to prevent hydration mismatch
  const orbPositions = [
    { left: 15, top: 20 },
    { left: 75, top: 60 },
    { left: 30, top: 80 },
    { left: 85, top: 15 },
    { left: 50, top: 40 },
    { left: 65, top: 90 }
  ]

  const particlePositions = Array.from({ length: 20 }, (_, i) => ({
    left: (i * 5) % 100,
    top: (i * 7) % 100
  }))

  const linePositions = Array.from({ length: 8 }, (_, i) => ({
    left: (i * 12) % 80,
    top: (i * 15) % 80,
    rotate: (i * 45) % 360
  }))

  const shapePositions = Array.from({ length: 6 }, (_, i) => ({
    left: (i * 18) % 100,
    top: (i * 22) % 100,
    rotate: (i * 60) % 360
  }))

  if (!isClient) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1421] via-[#131722] to-[#0F1421] dark:block hidden" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Dark Mode Elements (hidden in light mode) */}
      
      {/* DataBoard-Inspired Deep Background - Only visible in dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F1421] via-[#131722] to-[#0F1421] dark:block hidden" />
      
      {/* Animated Background Orbs - Only visible in dark mode */}
      <div className="absolute inset-0 dark:block hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              left: `${orbPositions[i].left}%`,
              top: `${orbPositions[i].top}%`,
              background: `radial-gradient(circle at 30% 30%, rgba(${
                [147, 51, 234, 59, 130, 246][i % 6]
              }, 0.1) 0%, transparent 70%)`
            }}
            animate={{
              x: [0, (i % 2 === 0 ? 50 : -50), 0],
              y: [0, (i % 3 === 0 ? 30 : -30), 0],
              scale: [0.8, 1.4, 0.8],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 12 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* DataBoard-Inspired Grid - Only visible in dark mode */}
      <motion.div
        className="absolute inset-0 dark:block hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 195, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 195, 255, 0.08) 1px, transparent 1px),
            linear-gradient(rgba(42, 46, 57, 0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(42, 46, 57, 0.6) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px, 120px 120px, 40px 40px, 40px 40px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '120px 120px']
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Fluent Floating Particles - Only visible in dark mode */}
      <div className="absolute inset-0 dark:block hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${particlePositions[i].left}%`,
              top: `${particlePositions[i].top}%`,
            }}
            animate={{
              y: ['100vh', '-100vh'],
              x: [0, (i % 2 === 0 ? 30 : -30)],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 8 + (i % 4),
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Modern Connection Lines - Only visible in dark mode */}
      <div className="absolute inset-0 dark:block hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              width: `${100 + i * 50}px`,
              left: `${linePositions[i].left}%`,
              top: `${linePositions[i].top}%`,
              transform: `rotate(${linePositions[i].rotate}deg)`
            }}
            animate={{
              opacity: [0, 0.4, 0],
              scale: [0.5, 1.2, 0.5],
              rotate: [linePositions[i].rotate, linePositions[i].rotate + 360]
            }}
            transition={{
              duration: 10 + (i % 5),
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Animated Geometric Shapes - Only visible in dark mode */}
      <div className="absolute inset-0 overflow-hidden dark:block hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 border border-white/10"
            style={{
              left: `${shapePositions[i].left}%`,
              top: `${shapePositions[i].top}%`,
              rotate: `${shapePositions[i].rotate}deg`
            }}
            animate={{
              rotate: [shapePositions[i].rotate, shapePositions[i].rotate + 360],
              opacity: [0.1, 0.3, 0.1],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
          ))}
      </div>

      {/* Modern Breathing Overlay - Only visible in dark mode */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-900/5 via-purple-900/10 to-blue-900/5 dark:block hidden"
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Subtle Noise Texture - Only visible in dark mode */}
      <div 
        className="absolute inset-0 opacity-5 dark:block hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(120,119,198,0.3), transparent),
            radial-gradient(circle at 80% 20%, rgba(255,119,198,0.3), transparent),
            radial-gradient(circle at 40% 40%, rgba(120,219,255,0.3), transparent)
          `,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Modern Blur Zones - Only visible in dark mode */}
      <div className="absolute inset-0 dark:block hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute backdrop-blur-sm rounded-full"
            style={{
              width: `${300 + i * 100}px`,
              height: `${200 + i * 50}px`,
              left: `${20 + i * 25}%`,
              top: `${30 + i * 20}%`,
              background: `rgba(${50 + i * 30}, ${100 + i * 20}, ${150 + i * 25}, 0.05)`
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              borderRadius: ['50%', '30%', '50%']
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
          />
        ))}
      </div>

      {/* Light Mode Elements (transparent - no interference with full white background) */}
      {/* The light mode background will be handled by the main container gradient */}
    </div>
  )
}