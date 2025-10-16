'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Wallet, 
  CheckCircle, 
  Award, 
  ArrowRight,
  ArrowDown
} from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      step: 1,
      icon: Wallet,
      title: 'Connect Wallet',
      description: 'Connect your Web3 wallet (MetaMask, WalletConnect, etc.) to the BSM platform. This creates your secure, decentralized identity.',
      details: [
        'Install a Web3 wallet',
        'Connect to BSM platform',
        'Verify your identity',
        'Secure wallet connection'
      ]
    },
    {
      step: 2,
      icon: CheckCircle,
      title: 'Mark Attendance',
      description: 'Use your connected wallet to mark attendance for classes, events, or workshops. Each attendance record is permanently stored on the blockchain.',
      details: [
        'Join class or event',
        'Click "Mark Attendance"',
        'Sign transaction with wallet',
        'Record stored on blockchain'
      ]
    },
    {
      step: 3,
      icon: Award,
      title: 'Receive NFT Certificate',
      description: 'Upon completion of requirements, automatically receive a verifiable NFT certificate that proves your participation and achievement.',
      details: [
        'Complete requirements',
        'Automatic certificate generation',
        'NFT minted to your wallet',
        'Verifiable on blockchain'
      ]
    }
  ]

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Getting started with BSM is simple. Follow these three easy steps to begin 
            your journey with blockchain-powered education management.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-primary transform -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="text-center hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-8">
                    {/* Step Number */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full text-white font-bold text-xl mb-6 relative z-10">
                      {step.step}
                    </div>
                    
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                      <step.icon className="h-10 w-10 text-primary" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {step.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {step.description}
                    </p>
                    
                    {/* Details List */}
                    <ul className="text-left space-y-2 mb-6">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                {/* Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-6">
                    <ArrowDown className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of students and educators who are already using BSM to 
              revolutionize their educational experience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/demo">
                <Button size="lg" className="group">
                  Try Demo
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" size="lg">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}








