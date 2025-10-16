'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users, Award, Zap } from 'lucide-react'

export function About() {
  const features = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Immutable attendance records secured on the blockchain'
    },
    {
      icon: Users,
      title: 'Student-Centric',
      description: 'Designed with students and educators in mind'
    },
    {
      icon: Award,
      title: 'NFT Certificates',
      description: 'Verifiable digital certificates as NFTs'
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Real-time attendance tracking and verification'
    }
  ]

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About BSM Platform
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            BSM (Blockchain Student Management) is a revolutionary platform that combines 
            traditional education management with cutting-edge Web3 technology to create 
            a transparent, secure, and verifiable system for student attendance and certification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-2xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose BSM Platform?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Our platform addresses the growing need for digital transformation in education. 
              By leveraging blockchain technology, we ensure that student achievements are 
              permanently recorded, easily verifiable, and tamper-proof. This creates a new 
              standard for academic integrity and credential verification.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/about">
                <Button size="lg">
                  Explore Platform
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg">
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}








