import { useEffect, useRef, useCallback } from 'react';
import { getLenisInstance } from '@/components/providers/lenis-provider';

export function useLenis() {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Get the optimized global Lenis instance
    lenisRef.current = getLenisInstance();
  }, []);

  const scrollTo = useCallback((target: string | number | HTMLElement, options?: any) => {
    const lenis = lenisRef.current || getLenisInstance();
    if (lenis) {
      lenis.scrollTo(target, {
        duration: 1.2,
        easing: (t: number) => 1 - Math.pow(1 - t, 3), // Smooth cubic ease-out
        offset: -80, // Account for fixed headers
        ...options,
      });
    }
  }, []);

  const scrollToTop = useCallback((options?: any) => {
    const lenis = lenisRef.current || getLenisInstance();
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.0,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        ...options,
      });
    }
  }, []);

  const scrollToBottom = useCallback((options?: any) => {
    const lenis = lenisRef.current || getLenisInstance();
    if (lenis) {
      lenis.scrollTo(document.body.scrollHeight, {
        duration: 1.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        ...options,
      });
    }
  }, []);

  const stop = useCallback(() => {
    const lenis = lenisRef.current || getLenisInstance();
    if (lenis) {
      lenis.stop();
    }
  }, []);

  const start = useCallback(() => {
    const lenis = lenisRef.current || getLenisInstance();
    if (lenis) {
      lenis.start();
    }
  }, []);

  const getProgress = useCallback(() => {
    const lenis = lenisRef.current || getLenisInstance();
    return lenis ? lenis.progress : 0;
  }, []);

  const getVelocity = useCallback(() => {
    const lenis = lenisRef.current || getLenisInstance();
    return lenis ? lenis.velocity : 0;
  }, []);

  const getDirection = useCallback(() => {
    const lenis = lenisRef.current || getLenisInstance();
    return lenis ? lenis.direction : 1;
  }, []);

  return {
    scrollTo,
    scrollToTop,
    scrollToBottom,
    stop,
    start,
    getProgress,
    getVelocity,
    getDirection,
    lenis: lenisRef.current,
  };
}


