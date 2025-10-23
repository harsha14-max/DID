'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CredXLogo } from '@/components/ui/credX-logo'

export function StaticWelcomePage() {
  const [theme, setTheme] = useState('dark')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  // Dynamic Morphing Background Component
  const MorphingBackground = () => {
    const [scrollY, setScrollY] = useState(0)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

    // Define warm-to-cool gradient colors inspired by the image
    const getColors = () => {
      if (theme === 'light') {
        return {
          // Warm to cool gradient inspired by the image
          primary: ['#FF6B6B', '#FF8E53', '#FF6B9D', '#C44569', '#6C5CE7'],
          secondary: ['#FF8E53', '#FF6B9D', '#C44569', '#6C5CE7', '#A29BFE'],
          tertiary: ['#FF6B6B', '#FF8E53', '#FF6B9D', '#C44569'],
          accent: ['#FF6B6B', '#FF8E53'],
          floating: ['#FF6B9D', '#C44569'],
          confetti: ['#FF6B6B', '#FF8E53', '#FF6B9D', '#C44569', '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E']
        }
      } else {
        return {
          // Darker, more muted versions for dark theme
          primary: ['#E17055', '#FDCB6E', '#E84393', '#A29BFE', '#6C5CE7'],
          secondary: ['#FDCB6E', '#E84393', '#A29BFE', '#6C5CE7', '#74B9FF'],
          tertiary: ['#E17055', '#FDCB6E', '#E84393', '#A29BFE'],
          accent: ['#E17055', '#FDCB6E'],
          floating: ['#E84393', '#A29BFE'],
          confetti: ['#E17055', '#FDCB6E', '#E84393', '#A29BFE', '#6C5CE7', '#74B9FF', '#FD79A8', '#00B894']
        }
      }
    }

    const colors = getColors()

    useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY)
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100
        })
      }
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }

      // Initialize window size
      handleResize()

      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
      window.addEventListener('resize', handleResize, { passive: true })
      
      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('resize', handleResize)
      }
    }, [])

    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Primary Morphing Shape - Inspired by the Image Gradient */}
        <div 
          className={`absolute w-[1000px] h-[800px] ${theme === 'light' ? 'opacity-35' : 'opacity-25'} blur-3xl transition-all duration-1200 ease-out animate-morph`}
          style={{
            left: `${10 + (scrollY * 0.015) + (mousePosition.x * 0.06)}%`,
            top: `${-5 + (scrollY * 0.008) + (mousePosition.y * 0.04)}%`,
            background: `linear-gradient(135deg, 
              ${colors.primary[0]} ${15 + Math.sin(scrollY * 0.008) * 15}%, 
              ${colors.primary[1]} ${30 + Math.cos(scrollY * 0.012) * 20}%, 
              ${colors.primary[2]} ${50 + Math.sin(scrollY * 0.01) * 25}%, 
              ${colors.primary[3]} ${70 + Math.cos(scrollY * 0.009) * 15}%, 
              ${colors.primary[4]} ${85 + Math.sin(scrollY * 0.007) * 15}%
            )`,
            borderRadius: `${30 + Math.sin(scrollY * 0.006) * 30}% ${70 + Math.cos(scrollY * 0.008) * 25}% ${40 + Math.sin(scrollY * 0.01) * 35}% ${60 + Math.cos(scrollY * 0.007) * 20}%`,
            transform: `rotate(${scrollY * 0.06 + mousePosition.x * 0.12}deg) scale(${1 + Math.sin(scrollY * 0.003) * 0.3})`
          }}
        />

        {/* Secondary Wave - Warm-to-Cool Gradient */}
        <div 
          className={`absolute w-[700px] h-[500px] ${theme === 'light' ? 'opacity-25' : 'opacity-15'} blur-2xl transition-all duration-1400 ease-out`}
          style={{
            right: `${-8 + (scrollY * 0.012) - (mousePosition.x * 0.06)}%`,
            top: `${15 + (scrollY * 0.006) + (mousePosition.y * 0.025)}%`,
            background: `linear-gradient(45deg, 
              ${colors.secondary[0]} ${25 + Math.cos(scrollY * 0.01) * 20}%, 
              ${colors.secondary[1]} ${45 + Math.sin(scrollY * 0.008) * 25}%, 
              ${colors.secondary[2]} ${65 + Math.cos(scrollY * 0.006) * 20}%, 
              ${colors.secondary[3]} ${80 + Math.sin(scrollY * 0.004) * 15}%
            )`,
            borderRadius: `${50 + Math.cos(scrollY * 0.008) * 35}% ${60 + Math.sin(scrollY * 0.01) * 25}% ${45 + Math.cos(scrollY * 0.007) * 30}% ${55 + Math.sin(scrollY * 0.009) * 20}%`,
            transform: `rotate(${-scrollY * 0.05 + mousePosition.y * 0.2}deg) scale(${1 + Math.cos(scrollY * 0.004) * 0.3})`
          }}
        />

        {/* Tertiary Organic Blob - Warm-to-Cool Gradient */}
        <div 
          className={`absolute w-[600px] h-[600px] ${theme === 'light' ? 'opacity-20' : 'opacity-12'} blur-2xl transition-all duration-1600 ease-out animate-morph`}
          style={{
            left: `${45 + (scrollY * 0.015) - (mousePosition.x * 0.05)}%`,
            bottom: `${-10 + (scrollY * 0.01) + (mousePosition.y * 0.03)}%`,
            background: `linear-gradient(225deg, 
              ${colors.tertiary[0]} ${25 + Math.sin(scrollY * 0.012) * 20}%, 
              ${colors.tertiary[1]} ${45 + Math.cos(scrollY * 0.009) * 25}%, 
              ${colors.tertiary[2]} ${65 + Math.sin(scrollY * 0.007) * 20}%, 
              ${colors.tertiary[3]} ${80 + Math.cos(scrollY * 0.011) * 15}%
            )`,
            borderRadius: `${35 + Math.sin(scrollY * 0.005) * 40}% ${70 + Math.cos(scrollY * 0.011) * 25}% ${30 + Math.sin(scrollY * 0.009) * 35}% ${60 + Math.cos(scrollY * 0.006) * 30}%`,
            transform: `rotate(${scrollY * 0.08 + mousePosition.x * 0.12 + mousePosition.y * 0.08}deg) scale(${1 + Math.sin(scrollY * 0.005) * 0.35})`
          }}
        />

        {/* Floating Accent Orbs - Warm-to-Cool Gradient */}
        <div 
          className={`absolute w-[250px] h-[250px] ${theme === 'light' ? 'opacity-20' : 'opacity-12'} blur-xl transition-all duration-1000 ease-out animate-float`}
          style={{
            left: `${12 + Math.sin(scrollY * 0.004) * 25}%`,
            top: `${55 + Math.cos(scrollY * 0.006) * 20}%`,
            background: `radial-gradient(circle, ${colors.accent[0]}, ${colors.accent[1]})`,
            borderRadius: '50%',
            transform: `scale(${1 + Math.sin(scrollY * 0.002) * 0.5})`
          }}
        />

        <div 
          className={`absolute w-[180px] h-[180px] ${theme === 'light' ? 'opacity-15' : 'opacity-8'} blur-lg transition-all duration-800 ease-out animate-float animation-delay-2000`}
          style={{
            right: `${20 + Math.cos(scrollY * 0.003) * 22}%`,
            top: `${65 + Math.sin(scrollY * 0.005) * 15}%`,
            background: `radial-gradient(circle, ${colors.floating[0]}, ${colors.floating[1]})`,
            borderRadius: '50%',
            transform: `scale(${1 + Math.cos(scrollY * 0.003) * 0.6})`
          }}
        />

        {/* Additional Floating Elements - Warm-to-Cool Gradient */}
        <div 
          className={`absolute w-[350px] h-[250px] ${theme === 'light' ? 'opacity-15' : 'opacity-8'} blur-xl transition-all duration-1200 ease-out animate-float animation-delay-4000`}
          style={{
            left: `${65 + Math.sin(scrollY * 0.002) * 20}%`,
            top: `${25 + Math.cos(scrollY * 0.003) * 15}%`,
            background: `linear-gradient(60deg, ${colors.tertiary[0]}, ${colors.tertiary[1]}, ${colors.tertiary[2]})`,
            borderRadius: `${40 + Math.sin(scrollY * 0.004) * 25}% ${50 + Math.cos(scrollY * 0.006) * 20}% ${55 + Math.sin(scrollY * 0.003) * 30}% ${35 + Math.cos(scrollY * 0.005) * 25}%`,
            transform: `rotate(${scrollY * 0.03 + mousePosition.x * 0.08}deg) scale(${1 + Math.sin(scrollY * 0.002) * 0.2})`
          }}
        />

        {/* Interactive Glow Effects - Warm-to-Cool Gradient */}
        <div 
          className={`absolute w-[500px] h-[400px] ${theme === 'light' ? 'opacity-12' : 'opacity-6'} blur-2xl transition-all duration-1000 ease-out animate-glow`}
          style={{
            left: `${mousePosition.x * 0.25}%`,
            top: `${mousePosition.y * 0.15}%`,
            background: `radial-gradient(circle, ${theme === 'light' ? 'rgba(255, 107, 107, 0.5)' : 'rgba(225, 112, 85, 0.4)'}, ${theme === 'light' ? 'rgba(255, 142, 83, 0.4)' : 'rgba(253, 203, 110, 0.3)'}, ${theme === 'light' ? 'rgba(108, 92, 231, 0.3)' : 'rgba(162, 155, 254, 0.2)'}, transparent)`,
            borderRadius: '50%',
            transform: `scale(${1 + Math.sin(Date.now() * 0.0008) * 0.15})`
          }}
        />

        {/* Confetti particles - Warm-to-Cool Gradient */}
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: colors.confetti[Math.floor(Math.random() * colors.confetti.length)],
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
              transform: `translate(${(Math.sin(scrollY * 0.0008 + i) * 40)}px, ${(Math.cos(scrollY * 0.0008 + i) * 25)}px) scale(${0.3 + Math.sin(scrollY * 0.0015 + i) * 0.7})`
            }}
          />
        ))}

        {/* Scroll Progress Indicator - Warm-to-Cool Gradient */}
        {typeof window !== 'undefined' && (
          <div 
            className={`absolute top-0 left-0 h-1 ${theme === 'light' ? 'bg-gradient-to-r from-red-500 via-orange-500 via-pink-500 via-purple-500 to-blue-500' : 'bg-gradient-to-r from-red-400 via-orange-400 via-pink-400 via-purple-400 to-blue-400'} transition-all duration-300 ease-out z-50`}
            style={{
              width: `${Math.min((scrollY / Math.max(window.innerHeight * 2, 1000)) * 100, 100)}%`
            }}
          />
        )}

        {/* Additional Morphing Shapes for Depth - Warm-to-Cool Gradient */}
        <div 
          className={`absolute w-[300px] h-[300px] ${theme === 'light' ? 'opacity-12' : 'opacity-6'} blur-3xl transition-all duration-2200 ease-out animate-morph`}
          style={{
            right: `${8 + Math.sin(scrollY * 0.001) * 25}%`,
            bottom: `${15 + Math.cos(scrollY * 0.002) * 20}%`,
            background: `linear-gradient(315deg, 
              ${colors.tertiary[0]} ${30 + Math.sin(scrollY * 0.006) * 25}%, 
              ${colors.tertiary[1]} ${50 + Math.cos(scrollY * 0.004) * 25}%, 
              ${colors.tertiary[2]} ${70 + Math.sin(scrollY * 0.003) * 20}%, 
              ${colors.tertiary[3]} ${85 + Math.cos(scrollY * 0.005) * 15}%
            )`,
            transform: `rotate(${scrollY * 0.02 + mousePosition.y * 0.15}deg) scale(${1 + Math.sin(scrollY * 0.002) * 0.25})`
          }}
        />

        <div 
          className={`absolute w-[220px] h-[220px] ${theme === 'light' ? 'opacity-15' : 'opacity-8'} blur-2xl transition-all duration-1800 ease-out animate-float animation-delay-1000`}
          style={{
            left: `${25 + Math.cos(scrollY * 0.003) * 30}%`,
            top: `${65 + Math.sin(scrollY * 0.004) * 25}%`,
            background: `radial-gradient(circle, ${colors.tertiary[0]}, ${colors.tertiary[1]}, ${colors.tertiary[2]})`,
            borderRadius: `${50 + Math.sin(scrollY * 0.007) * 45}% ${60 + Math.cos(scrollY * 0.005) * 35}% ${40 + Math.sin(scrollY * 0.009) * 40}% ${55 + Math.cos(scrollY * 0.006) * 30}%`,
            transform: `rotate(${-scrollY * 0.04 + mousePosition.x * 0.12}deg) scale(${1 + Math.cos(scrollY * 0.003) * 0.4})`
          }}
        />
      </div>
    )
  }

  // Prevent SSR issues with client-only components
  if (typeof window === 'undefined') {
    return (
      <div className={`min-h-screen transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-800 via-indigo-900 to-blue-800 text-white' 
          : 'bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900'
      }`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            credX
          </div>
        </div>
      </div>
    )
  }

  return (
           <div className={`min-h-screen transition-all duration-500 ${
             theme === 'dark' 
               ? 'bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white' 
               : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
           }`}>
      
      {/* Custom CSS for enhanced animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
        }
        
        @keyframes morph {
          0% { border-radius: 40% 60% 50% 35%; }
          25% { border-radius: 60% 40% 35% 50%; }
          50% { border-radius: 50% 35% 60% 40%; }
          75% { border-radius: 35% 50% 40% 60%; }
          100% { border-radius: 40% 60% 50% 35%; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        .animate-morph {
          animation: morph 8s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Enhanced blur effects */
        .blur-xl {
          filter: blur(24px);
        }
        
        .blur-2xl {
          filter: blur(40px);
        }
        
        .blur-3xl {
          filter: blur(64px);
        }
      `}</style>
      
      {/* Dynamic Morphing Background */}
      <MorphingBackground />
      
      {/* Navigation */}
      <nav className={`relative z-50 flex items-center justify-between p-6 backdrop-blur-md border-b transition-all duration-300 ${
        theme === 'light' 
          ? 'bg-white/80 border-gray-200/50 hover:bg-white/90' 
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}>
        <div className="flex items-center space-x-3 group">
          <div className="group-hover:scale-110 transition-transform duration-300">
            <CredXLogo />
          </div>
          <span className={`text-2xl font-bold bg-clip-text text-transparent group-hover:transition-all duration-300 ${
            theme === 'light'
              ? 'bg-gradient-to-r from-purple-600 to-violet-600 group-hover:from-violet-600 group-hover:to-pink-600'
              : 'bg-gradient-to-r from-blue-400 to-purple-400 group-hover:from-purple-400 group-hover:to-pink-400'
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
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {theme === 'light' ? '≡ƒîÖ' : 'ΓÿÇ∩╕Å'}
          </button>
          
          <Link href="/auth/login">
            <Button variant="outline" className={`border hover:scale-105 transition-all duration-300 transform ${
              theme === 'light'
                ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}>
              Login
            </Button>
          </Link>
          
          <Link href="/auth/login">
            <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 hover:scale-105 transition-all duration-300 transform shadow-lg hover:shadow-xl text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          
          {/* Moon in Dark Mode */}
          {theme === 'dark' && (
            <div className="fixed top-20 right-20 z-20 pointer-events-none">
              <div className="relative">
                {/* Moon */}
                <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full shadow-2xl"
                     style={{
                       boxShadow: '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)'
                     }}>
                  {/* Moon craters */}
                  <div className="absolute top-3 left-3 w-2 h-2 bg-gray-400 rounded-full opacity-60"></div>
                  <div className="absolute top-6 right-4 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-50"></div>
                  <div className="absolute bottom-4 left-5 w-1 h-1 bg-gray-400 rounded-full opacity-40"></div>
                  <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-45"></div>
                </div>
                {/* Moon glow effect */}
                <div className="absolute inset-0 w-16 h-16 bg-white rounded-full opacity-20 blur-xl"></div>
              </div>
            </div>
          )}

        <div className="relative z-10 container mx-auto px-6 py-32 text-center">
          <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className={`text-7xl md:text-8xl font-bold mb-8 bg-clip-text text-transparent leading-tight transition-all duration-500 cursor-default ${
              theme === 'light'
                ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 hover:from-pink-600 hover:via-violet-600 hover:to-purple-600'
                : 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:from-pink-400 hover:via-purple-400 hover:to-blue-400'
            }`}>
              credX
            </h1>
            
            <h2 className={`text-3xl md:text-4xl font-semibold mb-6 transition-colors duration-300 ${
              theme === 'light'
                ? 'text-gray-800 hover:text-gray-900'
                : 'text-white/90 hover:text-white'
            }`}>
              The Future of Fair Finance
            </h2>
            
            <p className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed transition-colors duration-300 ${
              theme === 'light'
                ? 'text-gray-600 hover:text-gray-700'
                : 'text-blue-200/80 hover:text-blue-200'
            }`}>
              We're the trusted bridge between lenders and borrowers, redefining credit through AI, DeFi, and trustless verification.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              <Link href="/auth/login">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-lg px-8 py-4 hover:scale-105 transition-all duration-300 transform shadow-lg hover:shadow-xl text-white">
                  Get Started
                </Button>
              </Link>
              
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className={`w-full sm:w-auto border hover:scale-105 transition-all duration-300 transform text-lg px-8 py-4 ${
                  theme === 'light'
                    ? 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                }`}>
                  Explore the Platform
                </Button>
              </Link>
              
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className={`w-full sm:w-auto border hover:scale-105 transition-all duration-300 transform text-lg px-8 py-4 ${
                  theme === 'light'
                    ? 'border-purple-300 bg-purple-100 text-purple-700 hover:bg-purple-200'
                    : 'border-purple-400/50 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
                }`}>
                  Book a Demo
                </Button>
              </Link>
            </div>

            {/* Data Flow Animation */}
            <div className="relative max-w-4xl mx-auto mb-20 group">
              <div className={`flex items-center justify-between p-8 backdrop-blur-sm rounded-2xl border hover:scale-105 transition-all duration-500 transform ${
                theme === 'light'
                  ? 'bg-white/80 border-gray-200/50 hover:bg-white/90'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}>
                <div className="flex flex-col items-center space-y-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <span className="text-2xl">≡ƒÅª</span>
                  </div>
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    theme === 'light' ? 'text-gray-600' : 'text-blue-300'
                  }`}>Lenders</span>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex space-x-2">
                    {[...Array(8)].map((_, i) => (
                      <div 
                        key={i}
                        className={`w-3 h-3 rounded-full animate-pulse hover:scale-125 transition-transform duration-300 ${
                          theme === 'light' ? 'bg-purple-500' : 'bg-blue-400'
                        }`}
                        style={{ animationDelay: `${i * 0.2}s` }}
                      ></div>
                    ))}
                  </div>
                  <div className={`ml-4 font-semibold transition-colors duration-300 ${
                    theme === 'light' 
                      ? 'text-gray-700 group-hover:text-gray-900' 
                      : 'text-blue-300 group-hover:text-white'
                  }`}>credX Bridge</div>
                </div>
                
                <div className="flex flex-col items-center space-y-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <span className="text-2xl">≡ƒæñ</span>
                  </div>
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    theme === 'light' ? 'text-gray-600' : 'text-purple-300'
                  }`}>Borrowers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About credX */}
      <section className={`relative py-24 backdrop-blur-sm ${
        theme === 'light' ? 'bg-gray-50/80' : 'bg-white/5'
      }`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-5xl font-bold mb-8 bg-clip-text text-transparent transition-all duration-500 cursor-default ${
              theme === 'light'
                ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-violet-600 hover:to-pink-600'
                : 'bg-gradient-to-r from-blue-400 to-purple-400 hover:from-purple-400 hover:to-pink-400'
            }`}>
              About credX
            </h2>
            <p className={`text-xl max-w-4xl mx-auto leading-relaxed transition-colors duration-300 ${
              theme === 'light'
                ? 'text-gray-600 hover:text-gray-700'
                : 'text-blue-200/80 hover:text-blue-200'
            }`}>
              credX is the intelligent middleman connecting lenders and borrowers securely through 
              a hybrid Business Service Management (BSM) + Decentralized Finance (DeFi) ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className={`p-6 backdrop-blur-sm rounded-xl border hover:scale-105 transition-all duration-300 transform group ${
                theme === 'light'
                  ? 'bg-white/80 border-gray-200/50 hover:bg-white/90'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}>
                <h3 className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                  theme === 'light'
                    ? 'text-gray-800 group-hover:text-purple-600'
                    : 'text-white group-hover:text-blue-300'
                }`}>≡ƒöù Trusted Middleman</h3>
                <p className={`transition-colors duration-300 ${
                  theme === 'light'
                    ? 'text-gray-600 group-hover:text-gray-700'
                    : 'text-blue-200/80 group-hover:text-blue-200'
                }`}>
                  We connect lenders and borrowers securely, empowering unbanked users to prove 
                  creditworthiness using alternative data sources like rental payments, bills, and gig work.
                </p>
              </div>
              
              <div className={`p-6 backdrop-blur-sm rounded-xl border hover:scale-105 transition-all duration-300 transform group ${
                theme === 'light'
                  ? 'bg-white/80 border-gray-200/50 hover:bg-white/90'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}>
                <h3 className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                  theme === 'light'
                    ? 'text-gray-800 group-hover:text-purple-600'
                    : 'text-white group-hover:text-purple-300'
                }`}>≡ƒ¢í∩╕Å Self-Sovereign Identity</h3>
                <p className={`transition-colors duration-300 ${
                  theme === 'light'
                    ? 'text-gray-600 group-hover:text-gray-700'
                    : 'text-blue-200/80 group-hover:text-blue-200'
                }`}>
                  Designed for transparency, automation, and self-sovereign financial identity 
                  through decentralized technology and AI-driven insights.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className={`p-8 backdrop-blur-sm rounded-2xl border hover:scale-105 transition-all duration-500 transform ${
                theme === 'light'
                  ? 'bg-gradient-to-br from-purple-100/80 to-violet-100/80 border-gray-200/50 hover:from-violet-100/80 hover:to-pink-100/80'
                  : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-white/20 hover:from-purple-500/20 hover:to-pink-500/20'
              }`}>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-300 group">
                    <div className="w-3 h-3 bg-green-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                    <span className={`transition-colors duration-300 ${
                      theme === 'light'
                        ? 'text-gray-700 group-hover:text-green-600'
                        : 'text-white group-hover:text-green-300'
                    }`}>Blockchain Verification</span>
                  </div>
                  <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-300 group">
                    <div className="w-3 h-3 bg-blue-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                    <span className={`transition-colors duration-300 ${
                      theme === 'light'
                        ? 'text-gray-700 group-hover:text-blue-600'
                        : 'text-white group-hover:text-blue-300'
                    }`}>AI Credit Scoring</span>
                  </div>
                  <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-300 group">
                    <div className="w-3 h-3 bg-purple-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                    <span className={`transition-colors duration-300 ${
                      theme === 'light'
                        ? 'text-gray-700 group-hover:text-purple-600'
                        : 'text-white group-hover:text-purple-300'
                    }`}>Zero-Knowledge Proofs</span>
                  </div>
                  <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-300 group">
                    <div className="w-3 h-3 bg-pink-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                    <span className={`transition-colors duration-300 ${
                      theme === 'light'
                        ? 'text-gray-700 group-hover:text-pink-600'
                        : 'text-white group-hover:text-pink-300'
                    }`}>Automated Workflows</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Portal Overview */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-5xl font-bold mb-8 bg-clip-text transition-all duration-500 cursor-default ${
              theme === 'light'
                ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-blue-600 hover:to-green-600'
                : 'bg-gradient-to-r from-green-400 to-blue-400 hover:from-blue-400 hover:to-green-400 text-transparent'
            }`}>
              Customer Portal
            </h2>
            <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${
              theme === 'light'
                ? 'text-gray-600 hover:text-gray-700'
                : 'text-blue-200/80 hover:text-blue-200'
            }`}>
              Interactive dashboard for borrowers to manage their financial journey
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { icon: '≡ƒôè', title: 'Dashboard', desc: 'Overview of tickets, services, and financial actions', color: 'from-blue-500/20 to-cyan-500/20' },
              { icon: '≡ƒÄ½', title: 'Tickets', desc: 'Create, track, and filter support requests', color: 'from-green-500/20 to-emerald-500/20' },
              { icon: 'Γ¡É', title: 'Ratings', desc: 'Rate resolved tickets and log feedback securely', color: 'from-yellow-500/20 to-orange-500/20' },
              { icon: '≡ƒÅ¬', title: 'Services', desc: 'Browse offered lender products and services', color: 'from-purple-500/20 to-pink-500/20' },
              { icon: 'Γ¥ô', title: 'Help', desc: 'Access knowledge base and FAQ resources', color: 'from-indigo-500/20 to-blue-500/20' }
            ].map((feature, index) => (
              <div key={index} className={`p-6 bg-gradient-to-br ${feature.color} backdrop-blur-sm rounded-xl border hover:scale-110 hover:rotate-1 transition-all duration-300 transform group cursor-pointer ${
                theme === 'light'
                  ? 'border-gray-200/50 hover:bg-gray-100/50'
                  : 'border-white/10 hover:bg-white/10'
              }`}>
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">{feature.icon}</div>
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                  theme === 'light'
                    ? 'text-gray-800 group-hover:text-blue-600'
                    : 'text-white group-hover:text-blue-300'
                }`}>{feature.title}</h3>
                <p className={`text-sm transition-colors duration-300 ${
                  theme === 'light'
                    ? 'text-gray-600 group-hover:text-gray-700'
                    : 'text-blue-200/80 group-hover:text-blue-200'
                }`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Portal Overview */}
      <section className={`relative py-24 backdrop-blur-sm ${
        theme === 'light' ? 'bg-gray-50/80' : 'bg-white/5'
      }`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-5xl font-bold mb-8 bg-clip-text transition-all duration-500 cursor-default ${
              theme === 'light'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600'
                : 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-pink-400 hover:to-purple-400 text-transparent'
            }`}>
              Admin Portal
            </h2>
            <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${
              theme === 'light'
                ? 'text-gray-600 hover:text-gray-700'
                : 'text-blue-200/80 hover:text-blue-200'
            }`}>
              Powerful backend for managing the entire credX ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              { icon: '≡ƒôè', title: 'Dashboard', desc: 'Complete system overview and analytics', color: 'from-blue-500/20 to-indigo-500/20' },
              { icon: '≡ƒÄ½', title: 'Tickets', desc: 'Approve and manage borrower requests', color: 'from-green-500/20 to-teal-500/20' },
              { icon: '≡ƒæÑ', title: 'Users', desc: 'Manage borrower and lender profiles', color: 'from-purple-500/20 to-violet-500/20' },
              { icon: '≡ƒÅª', title: 'Assets', desc: 'Financial partners and lending pools', color: 'from-emerald-500/20 to-green-500/20' },
              { icon: 'ΓÜÖ∩╕Å', title: 'Rules Engine', desc: 'Automate actions with if-then logic', color: 'from-orange-500/20 to-red-500/20' },
              { icon: '≡ƒöä', title: 'Workflow', desc: 'Visual builder for operations lifecycle', color: 'from-cyan-500/20 to-blue-500/20' },
              { icon: '≡ƒôê', title: 'Analytics', desc: 'Centralized insights and visualization', color: 'from-pink-500/20 to-rose-500/20' },
              { icon: '≡ƒôÜ', title: 'Knowledge Base', desc: 'Add FAQs and resources for users', color: 'from-amber-500/20 to-yellow-500/20' },
              { icon: '≡ƒöî', title: 'Integrations', desc: 'REST APIs for third-party connections', color: 'from-slate-500/20 to-gray-500/20' },
              { icon: 'ΓÜÖ∩╕Å', title: 'Settings', desc: 'Manage global configurations', color: 'from-indigo-500/20 to-purple-500/20' }
            ].map((feature, index) => (
              <div key={index} className={`p-6 bg-gradient-to-br ${feature.color} backdrop-blur-sm rounded-xl border hover:scale-105 hover:-rotate-1 transition-all duration-300 transform group cursor-pointer ${
                theme === 'light'
                  ? 'border-gray-200/50 hover:bg-gray-100/50'
                  : 'border-white/10 hover:bg-white/10'
              }`}>
                <div className="text-3xl mb-3 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">{feature.icon}</div>
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                  theme === 'light'
                    ? 'text-gray-800 group-hover:text-purple-600'
                    : 'text-white group-hover:text-purple-300'
                }`}>{feature.title}</h3>
                <p className={`text-sm transition-colors duration-300 ${
                  theme === 'light'
                    ? 'text-gray-600 group-hover:text-gray-700'
                    : 'text-blue-200/80 group-hover:text-blue-200'
                }`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DID & Credit Scoring */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-5xl font-bold mb-8 bg-clip-text transition-all duration-500 cursor-default ${
              theme === 'light'
                ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-green-600 hover:to-blue-600'
                : 'bg-gradient-to-r from-blue-400 to-green-400 hover:from-green-400 hover:to-blue-400 text-transparent'
            }`}>
              Build, Own, and Prove Your Credit Independently
            </h2>
            <p className={`text-xl max-w-4xl mx-auto transition-colors duration-300 ${
              theme === 'light'
                ? 'text-gray-600 hover:text-gray-700'
                : 'text-blue-200/80 hover:text-blue-200'
            }`}>
              Decentralized Identity and Privacy-Preserving Credit Scoring
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 hover:rotate-6 transition-all duration-300 transform shadow-lg hover:shadow-xl">
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">≡ƒæñ</span>
              </div>
              <h3 className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === 'light'
                  ? 'text-gray-800 group-hover:text-blue-600'
                  : 'text-white group-hover:text-blue-300'
              }`}>1. Digital Wallet Setup</h3>
              <p className={`transition-colors duration-300 ${
                theme === 'light'
                  ? 'text-gray-600 group-hover:text-gray-700'
                  : 'text-blue-200/80 group-hover:text-blue-200'
              }`}>
                Borrowers configure digital wallets for verified identity and alternative data sources
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 hover:rotate-6 transition-all duration-300 transform shadow-lg hover:shadow-xl">
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">≡ƒöÉ</span>
              </div>
              <h3 className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === 'light'
                  ? 'text-gray-800 group-hover:text-purple-600'
                  : 'text-white group-hover:text-purple-300'
              }`}>2. AI Credit Scoring</h3>
              <p className={`transition-colors duration-300 ${
                theme === 'light'
                  ? 'text-gray-600 group-hover:text-gray-700'
                  : 'text-blue-200/80 group-hover:text-blue-200'
              }`}>
                On-device AI model computes privacy-preserving credit score using Verifiable Credentials
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 hover:rotate-6 transition-all duration-300 transform shadow-lg hover:shadow-xl">
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">Γ£à</span>
              </div>
              <h3 className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === 'light'
                  ? 'text-gray-800 group-hover:text-pink-600'
                  : 'text-white group-hover:text-pink-300'
              }`}>3. ZKP Verification</h3>
              <p className={`transition-colors duration-300 ${
                theme === 'light'
                  ? 'text-gray-600 group-hover:text-gray-700'
                  : 'text-blue-200/80 group-hover:text-blue-200'
              }`}>
                Zero-Knowledge Proof generated to prove creditworthiness without revealing private data
              </p>
            </div>
          </div>

          {/* 3-Step Flow Visualization */}
          <div className={`mt-16 p-8 backdrop-blur-sm rounded-2xl border hover:scale-105 transition-all duration-500 transform group ${
            theme === 'light'
              ? 'bg-gradient-to-r from-blue-100/80 to-purple-100/80 border-gray-200/50 hover:from-purple-100/80 hover:to-pink-100/80'
              : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-white/20 hover:from-purple-500/20 hover:to-pink-500/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="text-center group-hover:scale-110 transition-transform duration-300">
                <div className="text-2xl mb-2 group-hover:rotate-12 transition-transform duration-300">≡ƒæñ</div>
                <span className={`font-semibold transition-colors duration-300 ${
                  theme === 'light'
                    ? 'text-gray-800 group-hover:text-blue-600'
                    : 'text-white group-hover:text-blue-300'
                }`}>Borrower</span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300"></div>
                <span className={`mx-4 transition-colors duration-300 ${
                  theme === 'light'
                    ? 'text-gray-700 group-hover:text-gray-900'
                    : 'text-blue-300 group-hover:text-white'
                }`}>credX Verification</span>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded group-hover:from-pink-400 group-hover:to-red-400 transition-all duration-300"></div>
              </div>
              <div className="text-center group-hover:scale-110 transition-transform duration-300">
                <div className="text-2xl mb-2 group-hover:rotate-12 transition-transform duration-300">≡ƒÅª</div>
                <span className={`font-semibold transition-colors duration-300 ${
                  theme === 'light'
                    ? 'text-gray-800 group-hover:text-green-600'
                    : 'text-white group-hover:text-green-300'
                }`}>Lender Payment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className={`relative py-24 backdrop-blur-sm ${
        theme === 'light' ? 'bg-gray-50/80' : 'bg-white/5'
      }`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-5xl font-bold mb-8 bg-clip-text transition-all duration-500 cursor-default ${
              theme === 'light'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-600 hover:to-pink-600'
                : 'bg-gradient-to-r from-pink-400 to-purple-400 hover:from-purple-400 hover:to-pink-400 text-transparent'
            }`}>
              Feature Highlights
            </h2>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {[
              { icon: '≡ƒñû', title: 'AI Credit Scoring', desc: 'Privacy-preserving and decentralized', color: 'from-blue-500/20 to-indigo-500/20' },
              { icon: '≡ƒöÆ', title: 'ZKP Verification', desc: 'Zero data exposure', color: 'from-green-500/20 to-emerald-500/20' },
              { icon: 'ΓÜÖ∩╕Å', title: 'BSM Integration', desc: 'Tickets, workflows, analytics', color: 'from-purple-500/20 to-violet-500/20' },
              { icon: '≡ƒöä', title: 'Rules Engine', desc: 'Automated approval system', color: 'from-orange-500/20 to-red-500/20' },
              { icon: 'Γ¢ô∩╕Å', title: 'Blockchain DID', desc: 'Self-sovereign identity', color: 'from-cyan-500/20 to-blue-500/20' }
            ].map((feature, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className={`w-24 h-24 bg-gradient-to-r ${feature.color} backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 border hover:shadow-xl ${
                  theme === 'light'
                    ? 'border-gray-200 hover:border-gray-400'
                    : 'border-white/20 hover:border-white/40'
                }`}>
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{feature.icon}</span>
                </div>
                <h3 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${
                  theme === 'light'
                    ? 'text-gray-800 group-hover:text-pink-600'
                    : 'text-white group-hover:text-pink-300'
                }`}>{feature.title}</h3>
                <p className={`transition-colors duration-300 ${
                  theme === 'light'
                    ? 'text-gray-600 group-hover:text-gray-800'
                    : 'text-blue-200/80 group-hover:text-blue-200'
                }`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-5xl font-bold mb-8 bg-clip-text transition-all duration-500 cursor-default ${
              theme === 'light'
                ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-green-600 hover:to-blue-600'
                : 'bg-gradient-to-r from-blue-400 to-green-400 hover:from-green-400 hover:to-blue-400 text-transparent'
            }`}>
              Technology Stack
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { name: 'Blockchain', icon: 'Γ¢ô∩╕Å', color: 'from-slate-500/20 to-gray-500/20' },
              { name: 'AI & ML', icon: '≡ƒñû', color: 'from-blue-500/20 to-indigo-500/20' },
              { name: 'Decentralized Ledger', icon: '≡ƒôè', color: 'from-green-500/20 to-emerald-500/20' },
              { name: 'REST APIs', icon: '≡ƒöî', color: 'from-purple-500/20 to-violet-500/20' },
              { name: 'Secure Wallet', icon: '≡ƒöÉ', color: 'from-orange-500/20 to-red-500/20' },
              { name: 'Workflow Automation', icon: '≡ƒöä', color: 'from-cyan-500/20 to-blue-500/20' }
            ].map((tech, index) => (
              <div key={index} className={`text-center p-6 bg-gradient-to-br ${tech.color} backdrop-blur-sm rounded-xl border hover:scale-110 hover:rotate-2 transition-all duration-300 transform group cursor-pointer ${
                theme === 'light'
                  ? 'border-gray-200/50 hover:bg-gray-100/50'
                  : 'border-white/10 hover:bg-white/10'
              }`}>
                <div className="text-2xl mb-3 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">{tech.icon}</div>
                <span className={`font-semibold transition-colors duration-300 ${
                  theme === 'light'
                    ? 'text-gray-800 group-hover:text-blue-600'
                    : 'text-white group-hover:text-blue-300'
                }`}>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className={`relative py-24 backdrop-blur-sm ${
        theme === 'light' ? 'bg-gray-50/80' : 'bg-white/5'
      }`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className={`text-5xl font-bold mb-8 bg-clip-text transition-all duration-500 cursor-default ${
            theme === 'light'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600'
              : 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-pink-400 hover:to-purple-400 text-transparent'
          }`}>
            Join the New Era of Financial Credibility
          </h2>
          <p className={`text-xl mb-12 max-w-3xl mx-auto transition-colors duration-300 ${
            theme === 'light'
              ? 'text-gray-600 hover:text-gray-700'
              : 'text-blue-200/80 hover:text-blue-200'
          }`}>
            Be part of the revolution that's redefining trust in finance through AI, blockchain, and decentralized identity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/login?role=lender">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg px-8 py-4 hover:scale-105 transition-all duration-300 transform shadow-lg hover:shadow-xl">
                Join as Lender
              </Button>
            </Link>
            
            <Link href="/auth/login?role=customer">
              <Button size="lg" variant="outline" className={`w-full sm:w-auto border-purple-400/50 hover:scale-105 transition-all duration-300 transform text-lg px-8 py-4 ${
                theme === 'light'
                  ? 'bg-purple-100/50 text-purple-700 hover:bg-purple-200/50'
                  : 'bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
              }`}>
                Sign up as Borrower
              </Button>
            </Link>
            
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className={`w-full sm:w-auto hover:scale-105 transition-all duration-300 transform text-lg px-8 py-4 ${
                theme === 'light'
                  ? 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'border-white/30 bg-white/10 text-white hover:bg-white/20'
              }`}>
                Request Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative py-12 backdrop-blur-sm border-t transition-all duration-300 ${
        theme === 'light'
          ? 'bg-gray-100/80 border-gray-200 hover:bg-gray-200/80'
          : 'bg-black/20 border-white/10 hover:bg-black/30'
      }`}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="group">
              <div className="flex items-center space-x-3 mb-4 group-hover:scale-105 transition-transform duration-300">
                <CredXLogo />
                <span className={`text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300 ${
                  theme === 'light' ? 'text-gray-800' : 'text-transparent'
                }`}>
                  credX
                </span>
              </div>
              <p className={`transition-colors duration-300 ${
                theme === 'light'
                  ? 'text-gray-600 group-hover:text-gray-800'
                  : 'text-blue-200/80 group-hover:text-blue-200'
              }`}>
                The future of fair finance through AI, DeFi, and trustless verification.
              </p>
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                theme === 'light'
                  ? 'text-gray-800 hover:text-blue-600'
                  : 'text-white hover:text-blue-300'
              }`}>Platform</h3>
              <div className="space-y-2">
                <Link href="/auth/login?role=admin" className={`block hover:translate-x-1 transition-all duration-300 ${
                  theme === 'light'
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-blue-200/80 hover:text-white'
                }`}>Admin Portal</Link>
                <Link href="/auth/login?role=customer" className={`block hover:translate-x-1 transition-all duration-300 ${
                  theme === 'light'
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-blue-200/80 hover:text-white'
                }`}>Customer Portal</Link>
                <Link href="/auth/login" className={`block hover:translate-x-1 transition-all duration-300 ${
                  theme === 'light'
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-blue-200/80 hover:text-white'
                }`}>Get Started</Link>
              </div>
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                theme === 'light'
                  ? 'text-gray-800 hover:text-purple-600'
                  : 'text-white hover:text-purple-300'
              }`}>Resources</h3>
              <div className="space-y-2">
                <Link href="#" className={`block hover:translate-x-1 transition-all duration-300 ${
                  theme === 'light'
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-blue-200/80 hover:text-white'
                }`}>Documentation</Link>
                <Link href="#" className={`block hover:translate-x-1 transition-all duration-300 ${
                  theme === 'light'
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-blue-200/80 hover:text-white'
                }`}>Knowledge Base</Link>
                <Link href="#" className={`block hover:translate-x-1 transition-all duration-300 ${
                  theme === 'light'
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-blue-200/80 hover:text-white'
                }`}>Support</Link>
              </div>
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                theme === 'light'
                  ? 'text-gray-800 hover:text-pink-600'
                  : 'text-white hover:text-pink-300'
              }`}>Legal</h3>
              <div className="space-y-2">
                <Link href="#" className={`block hover:translate-x-1 transition-all duration-300 ${
                  theme === 'light'
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-blue-200/80 hover:text-white'
                }`}>Privacy Policy</Link>
                <Link href="#" className={`block hover:translate-x-1 transition-all duration-300 ${
                  theme === 'light'
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-blue-200/80 hover:text-white'
                }`}>Terms of Service</Link>
                <Link href="#" className={`block hover:translate-x-1 transition-all duration-300 ${
                  theme === 'light'
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-blue-200/80 hover:text-white'
                }`}>Security</Link>
              </div>
            </div>
          </div>
          
          <div className={`border-t mt-8 pt-8 text-center transition-colors duration-300 ${
            theme === 'light'
              ? 'border-gray-200 text-gray-600 hover:text-gray-800'
              : 'border-white/10 text-blue-200/60 hover:text-blue-200/80'
          }`}>
            <p>&copy; 2024 credX. Built for the future of finance.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
