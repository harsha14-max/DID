'use client';

import { useScrollAnimation, ScrollAnimationOptions, ScrollAnimationCallbacks } from '@/hooks/use-scroll-animation';

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: 'slide-up' | 'slide-left' | 'slide-right' | 'zoom-in' | 'flip' | 'fade';
  delay?: number;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function ScrollAnimation({ 
  children, 
  animation = 'slide-up', 
  delay = 0,
  className = '',
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
}: ScrollAnimationProps) {
  
  const options: ScrollAnimationOptions = {
    threshold,
    rootMargin,
    triggerOnce,
    delay,
  };

  const callbacks: ScrollAnimationCallbacks = {
    onEnter: () => {
      // Animation will be handled by CSS classes
    },
  };

  const elementRef = useScrollAnimation(options, callbacks);

  const getAnimationClass = () => {
    switch (animation) {
      case 'slide-up':
        return 'slide-up-on-scroll';
      case 'slide-left':
        return 'slide-left-on-scroll';
      case 'slide-right':
        return 'slide-right-on-scroll';
      case 'zoom-in':
        return 'zoom-in-on-scroll';
      case 'flip':
        return 'flip-on-scroll';
      case 'fade':
        return 'fade-on-scroll';
      default:
        return 'slide-up-on-scroll';
    }
  };

  return (
    <div 
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`${getAnimationClass()} ${className}`}
    >
      {children}
    </div>
  );
}


