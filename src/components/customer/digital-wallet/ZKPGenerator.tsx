'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  Eye, 
  Copy, 
  RefreshCw,
  Key,
  Target,
  Award,
  Activity,
  Plus,
  X,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Info,
  HelpCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface ZKPProof {
  id: string
  type: 'loan_eligibility' | 'credit_score' | 'income_verification' | 'identity_verification'
  proof: string
  createdAt: string
  expiresAt: string
  status: 'valid' | 'expired' | 'revoked'
  used: boolean
  metadata: {
    score: number
    amount: number
    purpose: string
  }
}

interface ZKPGeneratorProps {
  userId: string
  onProofGenerated?: (proof: ZKPProof) => void
  onProofUsed?: (proofId: string) => void
}

export default function ZKPGenerator({ userId, onProofGenerated, onProofUsed }: ZKPGeneratorProps) {
  const [proofs, setProofs] = useState<ZKPProof[]>([])
  const [generating, setGenerating] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)

  useEffect(() => {
    loadProofs()
  }, [userId])

  const loadProofs = () => {
    try {
      const storedProofs = localStorage.getItem(`zkp_proofs_${userId}`)
      if (storedProofs) {
        const parsedProofs = JSON.parse(storedProofs)
        const validProofs = parsedProofs.filter((proof: ZKPProof) => {
          const now = new Date()
          const expiresAt = new Date(proof.expiresAt)
          return expiresAt > now && proof.status !== 'revoked'
        })
        setProofs(validProofs)
      }
    } catch (error) {
      console.error('Error loading proofs:', error)
    }
  }

  const generateZKPProof = async () => {
    setGenerating(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const proofId = `zkp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const now = new Date()
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      
      const newProof: ZKPProof = {
        id: proofId,
        type: 'loan_eligibility',
        proof: `zkp_proof_${proofId}`,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        status: 'valid',
        used: false,
        metadata: {
          score: 680,
          amount: 5000,
          purpose: 'Personal loan'
        }
      }
      
      const updatedProofs = [...proofs, newProof]
      localStorage.setItem(`zkp_proofs_${userId}`, JSON.stringify(updatedProofs))
      setProofs(updatedProofs)
      
      toast.success('ZKP Proof generated successfully!')
      setShowGenerator(false)
      
      if (onProofGenerated) {
        onProofGenerated(newProof)
      }
      
    } catch (error) {
      console.error('Error generating ZKP proof:', error)
      toast.error('Failed to generate ZKP proof')
    } finally {
      setGenerating(false)
    }
  }

  const getTimeUntilExpiry = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffMs = expiry.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m`
    } else {
      return 'Expired'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">ZKP Proof Management</h2>
          <p className="text-gray-600">Generate and manage Zero-Knowledge Proofs</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowGenerator(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Generate Proof
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Proofs</p>
                <p className="text-3xl font-bold text-gray-900">{proofs.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Key className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Valid Proofs</p>
                <p className="text-3xl font-bold text-green-600">
                  {proofs.filter(p => p.status === 'valid' && !p.used).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Used Proofs</p>
                <p className="text-3xl font-bold text-purple-600">
                  {proofs.filter(p => p.used).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Expired</p>
                <p className="text-3xl font-bold text-red-600">
                  {proofs.filter(p => p.status === 'expired').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proofs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {proofs.map((proof, index) => (
            <motion.div
              key={proof.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {proof.type.replace('_', ' ')}
                        </h4>
                        <p className="text-sm text-gray-600">#{proof.id.slice(-8)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        proof.status === 'valid' ? 'bg-green-100 text-green-800' :
                        proof.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {proof.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Score:</span>
                      <span className="font-semibold text-gray-900">{proof.metadata.score}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Amount:</span>
                      <span className="font-medium text-gray-900">${proof.metadata.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Expires in:</span>
                      <span className="font-medium text-gray-900">{getTimeUntilExpiry(proof.expiresAt)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Used:</span>
                      <Badge className={proof.used ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}>
                        {proof.used ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {!proof.used && proof.status === 'valid' && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          const updatedProofs = proofs.map(p => 
                            p.id === proof.id ? { ...p, used: true } : p
                          )
                          setProofs(updatedProofs)
                          localStorage.setItem(`zkp_proofs_${userId}`, JSON.stringify(updatedProofs))
                          toast.success('ZKP Proof used successfully!')
                          if (onProofUsed) {
                            onProofUsed(proof.id)
                          }
                        }}
                      >
                        <Target className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {proofs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No ZKP Proofs</h3>
            <p className="text-gray-600 mb-6">
              You haven't generated any Zero-Knowledge Proofs yet. Generate your first proof to get started.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowGenerator(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Your First Proof
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Proof Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Generate ZKP Proof</h2>
              <Button variant="ghost" onClick={() => setShowGenerator(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Proof Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Type:</span>
                    <span className="font-semibold text-blue-900 ml-2">Loan Eligibility</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Validity:</span>
                    <span className="font-semibold text-blue-900 ml-2">24 hours</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Score:</span>
                    <span className="font-semibold text-blue-900 ml-2">680</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Amount:</span>
                    <span className="font-semibold text-blue-900 ml-2">$5,000</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 pt-6">
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                onClick={generateZKPProof}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Generate Proof
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowGenerator(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}