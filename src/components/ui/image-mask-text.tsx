'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface ImageMaskTextProps {
  text: string;
  imageUrl?: string;
  className?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
}

export function ImageMaskText({
  text,
  imageUrl = '', // Default to gradient if no image
  className = '',
  fontSize = 'clamp(4rem, 8vw, 8rem)',
  fontWeight = '900',
  color = '#ffffff',
  backgroundColor = '#000000'
}: ImageMaskTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Create a beautiful gradient background if no image is provided
  const backgroundStyle = imageUrl 
    ? {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 8s ease infinite'
      };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Background */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          ...backgroundStyle,
          y
        }}
      />
      
      {/* Text with Image Mask */}
      <motion.div
        className="relative z-10 flex items-center justify-center min-h-screen"
        style={{ opacity }}
      >
        <h1
          className="text-center font-black leading-none select-none"
          style={{
            fontSize,
            fontWeight,
            backgroundImage: imageUrl 
              ? `url(${imageUrl})`
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
            backgroundSize: imageUrl ? 'cover' : '400% 400%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
            filter: 'contrast(1.2) brightness(1.1)',
            textShadow: '0 0 30px rgba(0,0,0,0.3)',
            letterSpacing: '-0.02em'
          }}
        >
          {text}
        </h1>
      </motion.div>

      {/* Optional overlay for better text visibility */}
      <div 
        className="absolute inset-0 z-5"
        style={{
          background: `linear-gradient(45deg, ${backgroundColor}20, transparent, ${backgroundColor}20)`
        }}
      />
      
      {/* Add CSS animation for gradient */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

// Alternative version with more advanced masking effects
export function AdvancedImageMaskText({
  text,
  imageUrl = '', // Default to gradient if no image
  className = '',
  fontSize = 'clamp(3rem, 6vw, 6rem)',
  fontWeight = '800'
}: Omit<ImageMaskTextProps, 'color' | 'backgroundColor'>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Create a beautiful gradient background if no image is provided
  const backgroundStyle = imageUrl 
    ? {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {
        background: 'linear-gradient(45deg, #00C3FF 0%, #3E6FF6 25%, #8B5CF6 50%, #F59E0B 75%, #10B981 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 6s ease infinite'
      };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          ...backgroundStyle,
          y,
          scale
        }}
      />
      
      {/* Text Container */}
      <motion.div
        className="relative z-10 flex items-center justify-center min-h-screen px-4"
        style={{ opacity }}
      >
        <div className="text-center">
          {/* Main Text with Image Mask */}
          <h1
            className="font-black leading-none select-none mb-4"
            style={{
              fontSize,
              fontWeight,
              backgroundImage: imageUrl 
                ? `url(${imageUrl})`
                : 'linear-gradient(45deg, #00C3FF 0%, #3E6FF6 25%, #8B5CF6 50%, #F59E0B 75%, #10B981 100%)',
              backgroundSize: imageUrl ? 'cover' : '400% 400%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              filter: 'contrast(1.3) brightness(1.2) saturate(1.1)',
              letterSpacing: '-0.02em',
              textShadow: '0 0 40px rgba(0,0,0,0.4)'
            }}
          >
            {text}
          </h1>
          
          {/* Optional subtitle with different effect */}
          <motion.p
            className="text-lg md:text-xl text-white/80 font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            style={{
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            Scroll to explore the magic
          </motion.p>
        </div>
      </motion.div>

      {/* Gradient Overlays for Better Contrast */}
      <div className="absolute inset-0 z-5 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      <div className="absolute inset-0 z-5 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
      
      {/* Add CSS animation for gradient */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
