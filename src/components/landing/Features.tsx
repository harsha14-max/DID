'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Wallet, 
  Award, 
  User, 
  Settings, 
  ArrowRight,
  Shield,
  Clock,
  Users
} from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: Wallet,
      title: 'Attendance Tracking with Web3 Wallet',
      description: 'Connect your Web3 wallet to mark attendance securely on the blockchain. No more paper-based systems or centralized databases.',
      benefits: ['Blockchain Security', 'Wallet Integration', 'Real-time Tracking'],
      href: '/features/attendance-tracking'
    },
    {
      icon: Award,
      title: 'NFT Certificates for Events',
      description: 'Receive verifiable NFT certificates for completed courses, workshops, and events. Your achievements are permanently recorded on-chain.',
      benefits: ['NFT Certificates', 'Verifiable Credentials', 'Permanent Records'],
      href: '/features/nft-certificates'
    },
    {
      icon: User,
      title: 'Student Dashboard',
      description: 'Comprehensive dashboard to view your attendance history, certificates, and academic progress in one place.',
      benefits: ['Personal Dashboard', 'Progress Tracking', 'Certificate Gallery'],
      href: '/features/student-dashboard'
    },
    {
      icon: Settings,
      title: 'Admin Dashboard',
      description: 'Powerful admin tools for educators to manage classes, track attendance, and issue certificates efficiently.',
      benefits: ['Class Management', 'Analytics', 'Certificate Issuance'],
      href: '/features/admin-dashboard'
    }
  ]

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the comprehensive suite of tools designed to revolutionize 
            how we track attendance and manage educational achievements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">
                      {feature.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 mb-4 text-base">
                  {feature.description}
                </CardDescription>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <span 
                      key={benefitIndex}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>

                <Link href={feature.href}>
                  <Button variant="outline" className="group/btn">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
              <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Secure & Private
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Your data is protected with enterprise-grade security and privacy controls.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
              <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Updates
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Get instant notifications and updates about your attendance and certificates.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-4">
              <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Community Driven
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Join a growing community of students and educators embracing Web3 education.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}








