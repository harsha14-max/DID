'use client';

import { useEffect, useState, useCallback } from 'react';
import { getLenisInstance } from '@/components/providers/lenis-provider';

export function ScrollProgressIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const updateScrollProgress = useCallback((progress: number) => {
    setScrollProgress(progress);
    // Show indicator only when scrolling
    setIsVisible(progress > 0.01 && progress < 0.99);
  }, []);

  useEffect(() => {
    let lenisInstance: any = null;
    let timeoutId: NodeJS.Timeout;

    // Get Lenis instance with retry logic
    const getLenisWithRetry = () => {
      lenisInstance = getLenisInstance();
      if (!lenisInstance) {
        // Retry after a short delay if Lenis isn't ready yet
        timeoutId = setTimeout(getLenisWithRetry, 100);
        return;
      }

      // Listen to Lenis scroll events for smooth progress updates
      lenisInstance.on('scroll', ({ progress }: { progress: number }) => {
        updateScrollProgress(progress);
      });

      // Initial progress update
      updateScrollProgress(lenisInstance.progress);
    };

    getLenisWithRetry();

    // Fallback to native scroll events if Lenis isn't available
    const fallbackUpdate = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      updateScrollProgress(progress);
    };

    // Use native scroll as fallback
    window.addEventListener('scroll', fallbackUpdate, { passive: true });

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (lenisInstance) {
        lenisInstance.off('scroll', updateScrollProgress);
      }
      window.removeEventListener('scroll', fallbackUpdate);
    };
  }, [updateScrollProgress]);

  return (
    <div 
      className={`scroll-indicator transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        transform: `scaleX(${scrollProgress})`,
        transformOrigin: 'left',
      }} 
    />
  );
}


