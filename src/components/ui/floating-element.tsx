'use client';

import { useEffect, useRef } from 'react';

interface FloatingElementProps {
  children: React.ReactNode;
  speed?: number;
  amplitude?: number;
  className?: string;
}

export function FloatingElement({ 
  children, 
  speed = 1, 
  amplitude = 10,
  className = '' 
}: FloatingElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let animationId: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) * speed * 0.001;
      const y = Math.sin(elapsed) * amplitude;
      
      element.style.transform = `translateY(${y}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [speed, amplitude]);

  return (
    <div 
      ref={elementRef}
      className={`float-on-scroll ${className}`}
    >
      {children}
    </div>
  );
}












