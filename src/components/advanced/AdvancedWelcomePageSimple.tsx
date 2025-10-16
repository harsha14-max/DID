'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { ParticleSystem } from '@/components/ui/particle-system'
import { QuantumBackground } from './QuantumBackground'
import { MorphingNavigation } from './MorphingNavigation'
import { ImmersiveHero } from './ImmersiveHero'

export function AdvancedWelcomePageSimple() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9fafc] to-[#eef2f9] dark:bg-[#0F1421] text-gray-900 dark:text-[#F5F5F7] relative">
      <QuantumBackground />
      <ParticleSystem />
      <MorphingNavigation />
      <ImmersiveHero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            BSM Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-[#848E9C] mb-12 max-w-3xl mx-auto">
            Business Service Management Platform
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Current theme: {theme}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Get Started
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white dark:bg-[#1C1F2D] text-gray-900 dark:text-[#F5F5F7] text-lg font-semibold rounded-xl border border-gray-200 dark:border-[#2A2E39] hover:shadow-lg transition-all duration-300"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
