'use client';

import { useEffect, useState, useCallback } from 'react';
import { getLenisInstance } from '@/components/providers/lenis-provider';

interface PerformanceMetrics {
  fps: number;
  scrollVelocity: number;
  scrollProgress: number;
  isScrolling: boolean;
  lastFrameTime: number;
}

export function ScrollPerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    scrollVelocity: 0,
    scrollProgress: 0,
    isScrolling: false,
    lastFrameTime: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  const updateMetrics = useCallback(() => {
    const lenis = getLenisInstance();
    if (!lenis) return;

    const now = performance.now();
    const deltaTime = now - metrics.lastFrameTime;
    const fps = deltaTime > 0 ? Math.round(1000 / deltaTime) : 0;

    setMetrics({
      fps,
      scrollVelocity: lenis.velocity,
      scrollProgress: lenis.progress,
      isScrolling: Math.abs(lenis.velocity) > 0.1,
      lastFrameTime: now,
    });

    // Show monitor when scrolling
    setIsVisible(Math.abs(lenis.velocity) > 0.1);
  }, [metrics.lastFrameTime]);

  useEffect(() => {
    const lenis = getLenisInstance();
    if (!lenis) return;

    let animationId: number;
    let timeoutId: NodeJS.Timeout;

    const animate = () => {
      updateMetrics();
      animationId = requestAnimationFrame(animate);
    };

    // Start monitoring
    animate();

    // Listen to scroll events
    lenis.on('scroll', updateMetrics);

    // Auto-hide after scrolling stops
    const hideMonitor = () => {
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    };

    lenis.on('scroll', hideMonitor);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      lenis.off('scroll', updateMetrics);
      lenis.off('scroll', hideMonitor);
    };
  }, [updateMetrics]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm text-white text-xs p-3 rounded-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${metrics.fps >= 55 ? 'bg-green-400' : metrics.fps >= 45 ? 'bg-yellow-400' : 'bg-red-400'}`} />
          <span>FPS: {metrics.fps}</span>
        </div>
        <div>Velocity: {metrics.scrollVelocity.toFixed(2)}</div>
        <div>Progress: {(metrics.scrollProgress * 100).toFixed(1)}%</div>
        <div className={`text-xs ${metrics.isScrolling ? 'text-green-400' : 'text-gray-400'}`}>
          {metrics.isScrolling ? 'Scrolling' : 'Idle'}
        </div>
      </div>
    </div>
  );
}










