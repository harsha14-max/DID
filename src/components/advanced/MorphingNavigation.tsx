'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { CredXLogo } from '@/components/ui/credX-logo'

interface MagneticButtonProps {
  onClick: () => void
  children: React.ReactNode
  className?: string
}

function SimpleButton({ onClick, children, className = '' }: MagneticButtonProps) {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        border: 'none',
        cursor: 'pointer',
        background: 'transparent',
        color: 'inherit',
        transition: 'all 0.2s ease',
        transform: 'translateZ(0)',
        opacity: 1,
        visibility: 'visible'
      }}
      onMouseEnter={(e) => {
        const target = e.target as HTMLButtonElement
        target.style.transform = 'translateZ(0) scale(1.05)'
        target.style.opacity = '1'
        target.style.visibility = 'visible'
      }}
      onMouseLeave={(e) => {
        const target = e.target as HTMLButtonElement
        target.style.transform = 'translateZ(0) scale(1)'
        target.style.opacity = '1'
        target.style.visibility = 'visible'
      }}
    >
      {children}
    </button>
  )
}

export function MorphingNavigation() {
  const navRef = useRef<HTMLElement>(null)
  
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 100], [0, -10])
  const opacity = useTransform(scrollY, [0, 100], [1, 0.95])
  const scale = useTransform(scrollY, [0, 100], [1, 0.98])

  return (
    <motion.nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1C1F2D]/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-[#2A2E39] shadow-md shadow-gray-200/30 dark:shadow-[#0F1421]/50 transition-all duration-500"
      style={{ y, opacity, scale }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              whileHover={{ 
                rotate: [0, 360],
                scale: 1.1
              }}
              transition={{ duration: 0.8 }}
            >
              <CredXLogo size={40} className="shadow-lg" />
            </motion.div>
            <motion.span
              className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300"
            >
              credX Platform
            </motion.span>
          </motion.div>

          {/* Theme Toggle & Login */}
          <div className="flex items-center space-x-4">
            <SimpleButton
              onClick={() => window.location.href = '/auth/login'}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-[#848E9C] hover:text-gray-900 dark:hover:text-[#F5F5F7] transition-colors duration-300"
            >
              Login
            </SimpleButton>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  )
}