'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Mail, Users, Award } from 'lucide-react'

export function CTA() {
  const stats = [
    {
      icon: Users,
      value: '1000+',
      label: 'Students Registered'
    },
    {
      icon: Award,
      value: '500+',
      label: 'NFT Certificates Issued'
    },
    {
      icon: Mail,
      value: '50+',
      label: 'Educational Institutions'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-purple-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main CTA */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Join the Future of
              <span className="block">Attendance Today</span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Be part of the educational revolution. Start using blockchain-powered 
              attendance tracking and NFT certificates to secure your academic achievements.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="group">
                  Sign Up Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Additional CTAs */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Transform Your Education?
            </h3>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students and educators who are already using BSM 
              to revolutionize their educational experience with Web3 technology.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="group">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Try Demo First
                </Button>
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16">
            <p className="text-white/70 text-sm mb-4">Trusted by educational institutions worldwide</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              {/* Placeholder for institution logos */}
              <div className="w-24 h-12 bg-white/20 rounded flex items-center justify-center">
                <span className="text-white text-xs font-medium">University A</span>
              </div>
              <div className="w-24 h-12 bg-white/20 rounded flex items-center justify-center">
                <span className="text-white text-xs font-medium">College B</span>
              </div>
              <div className="w-24 h-12 bg-white/20 rounded flex items-center justify-center">
                <span className="text-white text-xs font-medium">School C</span>
              </div>
              <div className="w-24 h-12 bg-white/20 rounded flex items-center justify-center">
                <span className="text-white text-xs font-medium">Institute D</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
