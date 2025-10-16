'use client';

import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { FloatingElement } from '@/components/ui/floating-element';

export function AnimationDemo() {
  return (
    <div className="py-20 bg-gradient-to-br from-purple-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="slide-up">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Enhanced Scroll Animations Demo
          </h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Slide Up Animation */}
          <ScrollAnimation animation="slide-up" delay={200}>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Slide Up</h3>
              <p className="text-gray-300">Elements slide up smoothly as they come into view</p>
            </div>
          </ScrollAnimation>

          {/* Slide Left Animation */}
          <ScrollAnimation animation="slide-left" delay={400}>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Slide Left</h3>
              <p className="text-gray-300">Elements slide in from the left with smooth animation</p>
            </div>
          </ScrollAnimation>

          {/* Slide Right Animation */}
          <ScrollAnimation animation="slide-right" delay={600}>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Slide Right</h3>
              <p className="text-gray-300">Elements slide in from the right with smooth animation</p>
            </div>
          </ScrollAnimation>

          {/* Zoom In Animation */}
          <ScrollAnimation animation="zoom-in" delay={800}>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Zoom In</h3>
              <p className="text-gray-300">Elements zoom in dramatically as they appear</p>
            </div>
          </ScrollAnimation>

          {/* Flip Animation */}
          <ScrollAnimation animation="flip" delay={1000}>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Flip</h3>
              <p className="text-gray-300">Elements flip into view with 3D rotation</p>
            </div>
          </ScrollAnimation>

          {/* Floating Element */}
          <FloatingElement speed={1.2} amplitude={8}>
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Floating</h3>
              <p className="text-white/90">This element floats continuously with smooth motion</p>
            </div>
          </FloatingElement>
        </div>

        {/* Parallax Demo */}
        <ScrollAnimation animation="slide-up" delay={1200}>
          <div className="mt-16 text-center">
            <div className="parallax" data-speed="0.3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Parallax Effect</h3>
                <p className="text-white/90">This element moves at a different speed as you scroll</p>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
}












