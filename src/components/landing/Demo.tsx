'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Monitor, 
  Smartphone, 
  Award, 
  ArrowRight,
  Play,
  Eye
} from 'lucide-react'

export function Demo() {
  const demoScreens = [
    {
      title: 'Student Dashboard',
      description: 'View your attendance history, certificates, and academic progress',
      image: '/api/placeholder/400/300',
      features: ['Attendance Tracking', 'Certificate Gallery', 'Progress Analytics']
    },
    {
      title: 'Admin Panel',
      description: 'Manage classes, track attendance, and issue certificates',
      image: '/api/placeholder/400/300',
      features: ['Class Management', 'Real-time Analytics', 'Certificate Issuance']
    },
    {
      title: 'NFT Certificate',
      description: 'Verifiable digital certificates stored on the blockchain',
      image: '/api/placeholder/400/300',
      features: ['Blockchain Verification', 'Metadata Storage', 'Transferable Assets']
    }
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            See BSM in Action
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our platform through interactive demos and see how BSM transforms 
            the way we manage attendance and issue certificates.
          </p>
        </div>

        {/* Demo Screenshots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {demoScreens.map((screen, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-0">
                {/* Placeholder Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                    <div className="text-center">
                      <Monitor className="h-16 w-16 text-primary/60 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {screen.title} Screenshot
                      </p>
                    </div>
                  </div>
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Demo
                    </Button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {screen.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {screen.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {screen.features.map((feature, featureIndex) => (
                      <span 
                        key={featureIndex}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Demo Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Try Our Interactive Demo
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Experience the full BSM platform with our interactive demo. 
                Connect a test wallet, mark attendance, and see how NFT certificates are generated.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">No registration required</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Test wallet integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-purple-600 rounded-full" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Live NFT certificate generation</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo">
                  <Button size="lg" className="group">
                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Start Demo
                  </Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline" size="lg">
                    View All Features
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              {/* Demo Preview */}
              <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl p-8 text-center">
                <div className="w-full h-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Smartphone className="h-16 w-16 text-primary/60 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Interactive Demo Preview
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Experience the full BSM platform with our interactive demo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Demo Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Watch Our Platform Demo
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              See how BSM works in this comprehensive video demonstration covering 
              all key features and workflows.
            </p>
            
            {/* Video Placeholder */}
            <div className="relative max-w-4xl mx-auto">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8 ml-1" />
                  </div>
                  <p className="text-lg font-medium">Platform Demo Video</p>
                  <p className="text-sm text-gray-300">Click to play</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link href="/demo">
                <Button size="lg" className="group">
                  View Demo
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}








