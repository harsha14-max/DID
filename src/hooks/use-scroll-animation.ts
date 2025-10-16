'use client';

import { useEffect, useRef, useCallback } from 'react';
import { getLenisInstance } from '@/components/providers/lenis-provider';

export interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export interface ScrollAnimationCallbacks {
  onEnter?: () => void;
  onExit?: () => void;
  onProgress?: (progress: number) => void;
}

/**
 * Hook for creating performant scroll-based animations
 * Uses Intersection Observer for better performance than scroll events
 */
export function useScrollAnimation(
  options: ScrollAnimationOptions = {},
  callbacks: ScrollAnimationCallbacks = {}
) {
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isVisibleRef = useRef(false);
  const hasTriggeredRef = useRef(false);

  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = false,
    delay = 0,
  } = options;

  const { onEnter, onExit, onProgress } = callbacks;

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      const isIntersecting = entry.isIntersecting;
      const intersectionRatio = entry.intersectionRatio;

      // Handle enter/exit callbacks
      if (isIntersecting && !isVisibleRef.current) {
        isVisibleRef.current = true;
        if (delay > 0) {
          setTimeout(() => {
            if (!triggerOnce || !hasTriggeredRef.current) {
              onEnter?.();
              hasTriggeredRef.current = true;
            }
          }, delay);
        } else {
          if (!triggerOnce || !hasTriggeredRef.current) {
            onEnter?.();
            hasTriggeredRef.current = true;
          }
        }
      } else if (!isIntersecting && isVisibleRef.current) {
        isVisibleRef.current = false;
        if (!triggerOnce) {
          onExit?.();
        }
      }

      // Handle progress callback
      if (isIntersecting && onProgress) {
        onProgress(intersectionRatio);
      }
    },
    [onEnter, onExit, onProgress, triggerOnce, delay]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create intersection observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  return elementRef;
}

/**
 * Hook for scroll-based parallax effects with optimized performance
 */
export function useParallaxScroll(speed: number = 0.5) {
  const elementRef = useRef<HTMLElement>(null);
  const animationIdRef = useRef<number>();

  const updateParallax = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    const lenis = getLenisInstance();
    if (!lenis) return;

    const progress = lenis.progress;
    const yPos = -(progress * window.innerHeight * speed);
    
    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    animationIdRef.current = requestAnimationFrame(updateParallax);
  }, [speed]);

  useEffect(() => {
    const lenis = getLenisInstance();
    if (!lenis) return;

    // Start parallax animation
    animationIdRef.current = requestAnimationFrame(updateParallax);

    // Listen to scroll events
    lenis.on('scroll', updateParallax);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      lenis.off('scroll', updateParallax);
    };
  }, [updateParallax]);

  return elementRef;
}

/**
 * Utility function to add scroll-based classes to elements
 */
export function addScrollClasses(element: HTMLElement, classes: string[]) {
  classes.forEach(className => {
    element.classList.add(className);
  });
}

/**
 * Utility function to remove scroll-based classes from elements
 */
export function removeScrollClasses(element: HTMLElement, classes: string[]) {
  classes.forEach(className => {
    element.classList.remove(className);
  });
}

/**
 * Performance-optimized scroll event throttler
 */
export function throttleScroll(callback: () => void, delay: number = 16) {
  let lastCall = 0;
  return () => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback();
    }
  };
}

/**
 * Debounced scroll event handler
 */
export function debounceScroll(callback: () => void, delay: number = 100) {
  let timeoutId: NodeJS.Timeout;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
}










