'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function RotatingWheelAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border border-white/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-6 right-6 z-50">
      <motion.div
        className="relative w-32 h-32"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Large Circular Arc with Glowing Dashes */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Create a large arc with glowing dashes */}
          <svg
            className="w-full h-full"
            viewBox="0 0 128 128"
            style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }}
          >
            {/* Define the arc path */}
            <defs>
              <linearGradient id="dashGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="50%" stopColor="rgba(0,195,255,0.8)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.8)" />
              </linearGradient>
            </defs>
            
            {/* Create dashes along the arc - Fixed coordinates to prevent hydration mismatch */}
            {Array.from({ length: 16 }).map((_, index) => {
              const angle = (index * 22.5) - 90; // Start from top, create arc
              const radius = 50;
              const centerX = 64;
              const centerY = 64;
              
              // Round coordinates to prevent hydration mismatch
              const x1 = Math.round((centerX + radius * Math.cos((angle - 5) * Math.PI / 180)) * 100) / 100;
              const y1 = Math.round((centerY + radius * Math.sin((angle - 5) * Math.PI / 180)) * 100) / 100;
              const x2 = Math.round((centerX + radius * Math.cos((angle + 5) * Math.PI / 180)) * 100) / 100;
              const y2 = Math.round((centerY + radius * Math.sin((angle + 5) * Math.PI / 180)) * 100) / 100;
              
              const isEven = index % 2 === 0;
              
              return (
                <motion.line
                  key={index}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isEven ? "white" : "#00C3FF"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0.8, 1],
                    scale: [0, 1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  style={{
                    filter: 'blur(0.5px)',
                    strokeDasharray: '2,2'
                  }}
                />
              );
            })}
          </svg>
        </motion.div>

        {/* Center Glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-cyan-400/10 blur-sm"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Outer Ring Glow */}
        <motion.div
          className="absolute inset-0 rounded-full border border-white/20"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
}
