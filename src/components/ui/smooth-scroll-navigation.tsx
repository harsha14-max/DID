'use client';

import { useLenis } from '@/hooks/use-lenis';
import { useCallback, useState } from 'react';

export function SmoothScrollNavigation() {
  const { scrollTo } = useLenis();
  const [activeSection, setActiveSection] = useState('hero');

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    scrollTo(`#${sectionId}`, {
      duration: 1.2, // Optimized duration for better responsiveness
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // Smooth cubic ease-out
      offset: -80, // Account for fixed header
    });
  }, [scrollTo]);

  const navigationItems = [
    { id: 'hero', label: 'Home' },
    { id: 'platform-showcase', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'data', label: 'Analytics' },
    { id: 'enterprise-features', label: 'Features' },
    { id: 'cta', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 transition-all duration-300 hover:bg-white/15">
      <div className="flex space-x-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 ease-out rounded-full ${
              activeSection === item.id
                ? 'text-cyan-400 bg-white/10 scale-105'
                : 'text-white hover:text-cyan-400 hover:bg-white/5'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}


