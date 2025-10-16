'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Monitor, Palette } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  // Quick theme cycle on hover
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
    }
    
    const timeout = setTimeout(() => {
      if (isHovering && !isOpen) {
        // Cycle through themes on hover
        const themes = ['light', 'dark', 'midnight', 'system']
        const currentIndex = themes.indexOf(theme || 'system')
        const nextIndex = (currentIndex + 1) % themes.length
        setTheme(themes[nextIndex])
      }
    }, 500) // Quick toggle after 500ms hover
    
    setHoverTimeout(timeout)
  }, [theme, setTheme, isHovering, isOpen, hoverTimeout])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
  }, [hoverTimeout])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  if (!mounted) {
    return (
      <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 gpu-accelerated">
        <Sun className="h-5 w-5 text-yellow-500" />
      </div>
    )
  }

  const themes = [
    { name: 'light', label: 'Light', icon: Sun, color: 'text-yellow-500' },
    { name: 'dark', label: 'Dark', icon: Moon, color: 'text-blue-400' },
    { name: 'midnight', label: 'Midnight', icon: Monitor, color: 'text-purple-400' },
    { name: 'system', label: 'System', icon: Palette, color: 'text-gray-400' }
  ]

  const currentTheme = themes.find(t => t.name === theme) || themes[3]

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 group gpu-accelerated will-change-transform"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ 
          duration: 0.05, 
          type: "spring", 
          stiffness: 600, 
          damping: 30 
        }}
        style={{ 
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
      >
        <motion.div
          className={`h-5 w-5 ${currentTheme.color} transition-colors duration-75`}
          animate={{ 
            rotate: isHovering ? 180 : 0,
            scale: isHovering ? 1.1 : 1
          }}
          transition={{ 
            duration: 0.1, 
            type: "spring", 
            stiffness: 500, 
            damping: 25 
          }}
        >
          <currentTheme.icon className="h-5 w-5" />
        </motion.div>
        
        {/* Hover indicator */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0"
          animate={{ opacity: isHovering ? 1 : 0 }}
          transition={{ duration: 0.05 }}
        />
      </motion.button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.05 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Theme Menu */}
            <motion.div
              className="absolute top-14 right-0 z-50 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-2 min-w-[160px] gpu-accelerated"
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ 
                duration: 0.1, 
                type: "spring", 
                stiffness: 500, 
                damping: 30 
              }}
              style={{ 
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
            >
              {themes.map((themeOption, index) => (
                <motion.button
                  key={themeOption.name}
                  onClick={() => {
                    setTheme(themeOption.name)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium gpu-accelerated ${
                    theme === themeOption.name
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.01,
                    duration: 0.05,
                    type: "spring",
                    stiffness: 600
                  }}
                  whileHover={{ 
                    x: 4,
                    scale: 1.02
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className={`h-4 w-4 ${themeOption.color}`}
                    animate={{ 
                      rotate: theme === themeOption.name ? 360 : 0,
                      scale: theme === themeOption.name ? 1.2 : 1
                    }}
                    transition={{ duration: 0.1 }}
                  >
                    <themeOption.icon className="h-4 w-4" />
                  </motion.div>
                  <span>{themeOption.label}</span>
                  {theme === themeOption.name && (
                    <motion.div
                      className="ml-auto w-2 h-2 bg-green-400 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        delay: 0.05,
                        type: "spring",
                        stiffness: 600
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
