'use client';

import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

interface LenisProviderProps {
  children: React.ReactNode;
}

// Global Lenis instance for better performance
let globalLenis: Lenis | null = null;

export function LenisProvider({ children }: LenisProviderProps) {
  const rafIdRef = useRef<number>();
  const lastScrollTimeRef = useRef<number>(0);
  const cachedElementsRef = useRef<{
    parallax: HTMLElement[];
    scale: HTMLElement[];
    rotate: HTMLElement[];
    fade: HTMLElement[];
  }>({
    parallax: [],
    scale: [],
    rotate: [],
    fade: [],
  });

  // Cache DOM elements for better performance
  const cacheElements = useCallback(() => {
    cachedElementsRef.current = {
      parallax: Array.from(document.querySelectorAll('.parallax')) as HTMLElement[],
      scale: Array.from(document.querySelectorAll('.scale-on-scroll')) as HTMLElement[],
      rotate: Array.from(document.querySelectorAll('.rotate-on-scroll')) as HTMLElement[],
      fade: Array.from(document.querySelectorAll('.fade-on-scroll')) as HTMLElement[],
    };
  }, []);

  // Trackpad detection utility
  const detectTrackpad = useCallback(() => {
    let isTrackpad = false;
    
    // Listen for wheel events to detect trackpad vs mouse
    const handleWheel = (e: WheelEvent) => {
      // Trackpad typically has smaller deltaY values and more frequent events
      if (Math.abs(e.deltaY) < 100 && e.deltaMode === 0) {
        isTrackpad = true;
      } else {
        isTrackpad = false;
      }
      
      // Update CSS custom property for trackpad detection
      document.documentElement.style.setProperty('--is-trackpad', isTrackpad ? '1' : '0');
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(({ scroll, limit, velocity, direction, progress }: any) => {
    const now = performance.now();
    
    // Throttle to 60fps max
    if (now - lastScrollTimeRef.current < 16) return;
    lastScrollTimeRef.current = now;

    // Update CSS custom properties efficiently
    document.documentElement.style.setProperty('--scroll-progress', progress.toString());
    document.documentElement.style.setProperty('--scroll-velocity', velocity.toString());
    document.documentElement.style.setProperty('--scroll-direction', direction.toString());

    // Use cached elements for better performance
    const { parallax, scale, rotate, fade } = cachedElementsRef.current;

    // Parallax effects with GPU acceleration
    parallax.forEach((element) => {
      const speed = parseFloat(element.dataset.speed || '0.5');
      const yPos = -(progress * window.innerHeight * speed);
      element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });

    // Scale animations with intersection observer optimization
    scale.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const elementProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
      const scale = 0.8 + (elementProgress * 0.2);
      element.style.transform = `scale3d(${scale}, ${scale}, 1)`;
    });

    // Rotation animations
    rotate.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const elementProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
      const rotation = elementProgress * 360;
      element.style.transform = `rotate3d(0, 0, 1, ${rotation}deg)`;
    });

    // Fade animations
    fade.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const elementProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
      element.style.opacity = elementProgress.toString();
    });
  }, []);

  useEffect(() => {
    // Initialize Lenis with optimized settings for better performance
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      touchMultiplier: 2.5, // Enhanced trackpad support
      infinite: false,
      lerp: 0.08, // Smoother interpolation
      wheelMultiplier: 0.8, // Better trackpad wheel sensitivity
      // Enhanced trackpad support
      gestureOrientation: 'vertical',
      // Additional trackpad optimizations
      // normalizeWheel: true, // This property doesn't exist in LenisOptions
      // Better momentum scrolling
      // momentum: true, // This property doesn't exist in LenisOptions
      // Improved gesture detection
      // gestureMultiplier: 1.2, // This property doesn't exist in LenisOptions
      // Better handling of prevented elements
      prevent: (node) => {
        return node.hasAttribute('data-lenis-prevent') || 
               node.closest('[data-lenis-prevent]') !== null;
      },
    });

    // Store global instance
    globalLenis = lenis;
    (window as any).lenis = lenis;

    // Cache elements on mount
    cacheElements();

    // Initialize trackpad detection
    const cleanupTrackpadDetection = detectTrackpad();

    // Optimized animation frame loop with RAF
    const raf = (time: number) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };

    rafIdRef.current = requestAnimationFrame(raf);

    // Add scroll event listener with throttling
    lenis.on('scroll', handleScroll);

    // Re-cache elements when DOM changes (with debouncing)
    const observer = new MutationObserver(() => {
      setTimeout(cacheElements, 100); // Debounce DOM changes
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup function
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      lenis.destroy();
      globalLenis = null;
      (window as any).lenis = null;
      observer.disconnect();
      cleanupTrackpadDetection();
    };
  }, [handleScroll, cacheElements, detectTrackpad]);

  return <>{children}</>;
}

// Export global Lenis instance getter
export const getLenisInstance = () => globalLenis;
