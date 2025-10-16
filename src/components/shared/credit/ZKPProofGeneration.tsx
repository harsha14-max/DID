// =====================================================
// BSM Platform - ZKP Proof Generation Component
// =====================================================
// Component for generating Zero-Knowledge Proofs for credit scoring

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  Info,
  Key,
  Lock,
  Unlock,
  FileText,
  BarChart3,
  TrendingUp,
  Target,
  Award
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { 
  ZKPProofGenerationProps,
  ZKPProof,
  CircuitInput,
  CircuitOutput,
  CircuitWitness
} from '@/types/credit'
import { zkpGenerator } from '@/components/shared/credit/ZKPGenerator'

export default function ZKPProofGeneration({ userId, onProofGenerated }: ZKPProofGenerationProps) {
  
  const [proofs, setProofs] = useState<ZKPProof[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedProof, setSelectedProof] = useState<ZKPProof | null>(null)
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  // Form state for generating proofs
  const [formData, setFormData] = useState({
    score_threshold: 650,
    loan_amount: 10000,
    purpose: 'personal_loan',
    lender_did: ''
  })

  useEffect(() => {
    loadProofs()
  }, [userId])

  const loadProofs = async () => {
    try {
      setLoading(true)
      
      const proofsData = await fetch(`/api/credit/zkp/proofs?user_id=${userId}`)
        .then(res => res.json())
      setProofs(proofsData || [])

    } catch (error) {
      console.error('Error loading proofs:', error)
      toast.error('Failed to load proofs')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateProof = async () => {
    try {
      setGenerating(true)
      
      const proofData = await zkpGenerator.generateScoreProof({
        user_id: userId,
        score_threshold: formData.score_threshold,
        loan_amount: formData.loan_amount,
        purpose: formData.purpose,
        lender_did: formData.lender_did
      })

      const response = await fetch('/api/credit/zkp/proofs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          proof_data: proofData,
          circuit_type: 'credit_score_proof',
          metadata: {
            score_threshold: formData.score_threshold,
            loan_amount: formData.loan_amount,
            purpose: formData.purpose,
            lender_did: formData.lender_did
          }
        })
      })

      if (response.ok) {
        toast.success('ZKP proof generated successfully!')
        setShowGenerateModal(false)
        setFormData({
          score_threshold: 650,
          loan_amount: 10000,
          purpose: 'personal_loan',
          lender_did: ''
        })
        loadProofs()
        onProofGenerated?.()
      } else {
        throw new Error('Failed to generate proof')
      }
    } catch (error) {
      console.error('Error generating proof:', error)
      toast.error('Failed to generate ZKP proof')
    } finally {
      setGenerating(false)
    }
  }

  const handleVerifyProof = async (proofId: string) => {
    try {
      const response = await fetch(`/api/credit/zkp/proofs/${proofId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.valid) {
          toast.success('Proof verified successfully!')
        } else {
          toast.error('Proof verification failed')
        }
        loadProofs()
      } else {
        throw new Error('Failed to verify proof')
      }
    } catch (error) {
      console.error('Error verifying proof:', error)
      toast.error('Failed to verify proof')
    }
  }

  const handleDownloadProof = async (proofId: string) => {
    try {
      const response = await fetch(`/api/credit/zkp/proofs/${proofId}/export`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `zkp-proof-${proofId}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Proof downloaded successfully!')
    } catch (error) {
      console.error('Error downloading proof:', error)
      toast.error('Failed to download proof')
    }
  }

  const getProofStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'default'
      case 'invalid': return 'destructive'
      case 'pending': return 'secondary'
      case 'expired': return 'outline'
      default: return 'secondary'
    }
  }

  const getProofStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'invalid': return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'expired': return <AlertTriangle className="h-4 w-4 text-gray-600" />
      default: return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ZKP Proof Generation</h2>
          <p className="text-gray-600 dark:text-gray-400">Generate and manage Zero-Knowledge Proofs for privacy-preserving credit verification</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowGenerateModal(true)} className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Generate Proof</span>
          </Button>
          <Button variant="outline" onClick={loadProofs} className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* ZKP Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Proofs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{proofs.length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Valid Proofs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {proofs.filter(p => p.status === 'valid').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Verification</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {proofs.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {proofs.length > 0 ? Math.round((proofs.filter(p => p.status === 'valid').length / proofs.length) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ZKP Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>What are Zero-Knowledge Proofs?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-400">
            <p>
              Zero-Knowledge Proofs (ZKPs) allow you to prove that you meet certain criteria (like having a credit score above a threshold) 
              without revealing the actual value of your credit score or other sensitive information. This enables privacy-preserving 
              credit verification while maintaining the security and trust required for financial transactions.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm">Privacy-Preserving</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Cryptographically Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Verifiable</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proofs List */}
      <div className="grid grid-cols-1 gap-4">
        {proofs.map((proof) => (
          <Card key={proof.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Proof #{proof.id.slice(0, 8)}
                    </h3>
                    <Badge variant={getProofStatusColor(proof.status)}>
                      {getProofStatusIcon(proof.status)}
                      <span className="ml-1">{proof.status}</span>
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <p><strong>Circuit Type:</strong> {proof.circuit_type}</p>
                      <p><strong>Score Threshold:</strong> {proof.metadata?.score_threshold}</p>
                    </div>
                    <div>
                      <p><strong>Loan Amount:</strong> ${proof.metadata?.loan_amount?.toLocaleString()}</p>
                      <p><strong>Purpose:</strong> {proof.metadata?.purpose}</p>
                    </div>
                    <div>
                      <p><strong>Generated:</strong> {new Date(proof.generated_at).toLocaleDateString()}</p>
                      {proof.verified_at && (
                        <p><strong>Verified:</strong> {new Date(proof.verified_at).toLocaleDateString()}</p>
                      )}
                    </div>
                    <div>
                      <p><strong>Expires:</strong> {proof.expires_at ? new Date(proof.expires_at).toLocaleDateString() : 'Never'}</p>
                      <p><strong>Size:</strong> {proof.proof_size} bytes</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedProof(proof)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVerifyProof(proof.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadProof(proof.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generate Proof Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Generate ZKP Proof</CardTitle>
              <CardDescription>Create a new Zero-Knowledge Proof for credit verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="score_threshold">Minimum Score Threshold</Label>
                <Input
                  id="score_threshold"
                  type="number"
                  min="300"
                  max="850"
                  value={formData.score_threshold}
                  onChange={(e) => setFormData({ ...formData, score_threshold: parseInt(e.target.value) })}
                  placeholder="Enter minimum score threshold"
                />
              </div>
              <div>
                <Label htmlFor="loan_amount">Loan Amount</Label>
                <Input
                  id="loan_amount"
                  type="number"
                  value={formData.loan_amount}
                  onChange={(e) => setFormData({ ...formData, loan_amount: parseInt(e.target.value) })}
                  placeholder="Enter loan amount"
                />
              </div>
              <div>
                <Label htmlFor="purpose">Loan Purpose</Label>
                <select
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="personal_loan">Personal Loan</option>
                  <option value="home_loan">Home Loan</option>
                  <option value="car_loan">Car Loan</option>
                  <option value="business_loan">Business Loan</option>
                  <option value="education_loan">Education Loan</option>
                </select>
              </div>
              <div>
                <Label htmlFor="lender_did">Lender DID (Optional)</Label>
                <Input
                  id="lender_did"
                  value={formData.lender_did}
                  onChange={(e) => setFormData({ ...formData, lender_did: e.target.value })}
                  placeholder="Enter lender DID"
                />
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium">Privacy Notice:</p>
                    <p>This proof will verify that your credit score meets the threshold without revealing the actual score value.</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowGenerateModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerateProof}
                  disabled={generating || !formData.score_threshold || !formData.loan_amount}
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    'Generate Proof'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

