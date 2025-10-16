// =====================================================
// BSM Platform - ZKP Proof Verification Component
// =====================================================
// Component for verifying Zero-Knowledge Proofs

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity,
  Eye,
  Upload,
  RefreshCw,
  AlertTriangle,
  Info,
  Key,
  Lock,
  FileText,
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Zap,
  Search,
  Filter,
  Download
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { 
  ZKPProofVerificationProps,
  ZKPProof,
  VerificationResult
} from '@/types/credit'
import { zkpGenerator } from '@/components/shared/credit/ZKPGenerator'

export default function ZKPProofVerification({ userId, onProofVerified }: ZKPProofVerificationProps) {
  
  const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([])
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [selectedResult, setSelectedResult] = useState<VerificationResult | null>(null)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [uploadedProof, setUploadedProof] = useState<string>('')

  // Form state for manual verification
  const [formData, setFormData] = useState({
    proof_data: '',
    verification_key: '',
    circuit_type: 'credit_score_proof'
  })

  useEffect(() => {
    loadVerificationResults()
  }, [userId])

  const loadVerificationResults = async () => {
    try {
      setLoading(true)
      
      const resultsData = await fetch(`/api/credit/zkp/verifications?user_id=${userId}`)
        .then(res => res.json())
      setVerificationResults(resultsData || [])

    } catch (error) {
      console.error('Error loading verification results:', error)
      toast.error('Failed to load verification results')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyProof = async () => {
    try {
      setVerifying(true)
      
      let proofData
      if (uploadedProof) {
        proofData = JSON.parse(uploadedProof)
      } else {
        proofData = JSON.parse(formData.proof_data)
      }

      const verificationResult = await zkpGenerator.verifyScoreProof({
        proof: proofData.proof,
        public_inputs: proofData.public_inputs,
        verification_key: formData.verification_key || proofData.verification_key
      })

      const response = await fetch('/api/credit/zkp/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          proof_id: proofData.id,
          verification_result: verificationResult,
          circuit_type: formData.circuit_type,
          verified_by: userId,
          verification_method: uploadedProof ? 'upload' : 'manual'
        })
      })

      if (response.ok) {
        toast.success(verificationResult.valid ? 'Proof verified successfully!' : 'Proof verification failed')
        setShowVerifyModal(false)
        setFormData({
          proof_data: '',
          verification_key: '',
          circuit_type: 'credit_score_proof'
        })
        setUploadedProof('')
        loadVerificationResults()
        onProofVerified?.()
      } else {
        throw new Error('Failed to verify proof')
      }
    } catch (error) {
      console.error('Error verifying proof:', error)
      toast.error('Failed to verify ZKP proof')
    } finally {
      setVerifying(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedProof(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const handleDownloadResult = async (resultId: string) => {
    try {
      const response = await fetch(`/api/credit/zkp/verifications/${resultId}/export`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `verification-result-${resultId}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Verification result downloaded successfully!')
    } catch (error) {
      console.error('Error downloading result:', error)
      toast.error('Failed to download verification result')
    }
  }

  const getResultStatusColor = (valid: boolean) => {
    return valid ? 'default' : 'destructive'
  }

  const getResultStatusIcon = (valid: boolean) => {
    return valid ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ZKP Proof Verification</h2>
          <p className="text-gray-600 dark:text-gray-400">Verify Zero-Knowledge Proofs for credit verification</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowVerifyModal(true)} className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Verify Proof</span>
          </Button>
          <Button variant="outline" onClick={loadVerificationResults} className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Verification Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Verifications</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{verificationResults.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Valid Proofs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {verificationResults.filter(r => r.valid).length}
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Invalid Proofs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {verificationResults.filter(r => !r.valid).length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {verificationResults.length > 0 ? Math.round((verificationResults.filter(r => r.valid).length / verificationResults.length) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>How ZKP Verification Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-400">
            <p>
              ZKP verification allows you to verify that a proof is valid without revealing any sensitive information. 
              The verification process checks the cryptographic integrity of the proof and ensures it was generated 
              correctly according to the specified circuit constraints.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm">Cryptographic Verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Privacy-Preserving</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Tamper-Proof</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Results */}
      <div className="grid grid-cols-1 gap-4">
        {verificationResults.map((result) => (
          <Card key={result.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Verification #{result.id.slice(0, 8)}
                    </h3>
                    <Badge variant={getResultStatusColor(result.valid)}>
                      {getResultStatusIcon(result.valid)}
                      <span className="ml-1">{result.valid ? 'Valid' : 'Invalid'}</span>
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <p><strong>Proof ID:</strong> {result.proof_id?.slice(0, 8)}</p>
                      <p><strong>Circuit Type:</strong> {result.circuit_type}</p>
                    </div>
                    <div>
                      <p><strong>Verified By:</strong> {result.verified_by?.slice(0, 8)}</p>
                      <p><strong>Method:</strong> {result.verification_method}</p>
                    </div>
                    <div>
                      <p><strong>Verified At:</strong> {new Date(result.verified_at).toLocaleDateString()}</p>
                      <p><strong>Duration:</strong> {result.verification_time}ms</p>
                    </div>
                    <div>
                      <p><strong>Confidence:</strong> {result.confidence_score}%</p>
                      {result.error_message && (
                        <p><strong>Error:</strong> {result.error_message}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedResult(result)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadResult(result.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Verify Proof Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Verify ZKP Proof</CardTitle>
              <CardDescription>Verify a Zero-Knowledge Proof</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="proof_file">Upload Proof File</Label>
                <Input
                  id="proof_file"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="mb-2"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Or paste the proof data below
                </p>
              </div>
              <div>
                <Label htmlFor="proof_data">Proof Data (JSON)</Label>
                <textarea
                  id="proof_data"
                  value={formData.proof_data}
                  onChange={(e) => setFormData({ ...formData, proof_data: e.target.value })}
                  placeholder="Paste the proof JSON data here"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="verification_key">Verification Key (Optional)</Label>
                <Input
                  id="verification_key"
                  value={formData.verification_key}
                  onChange={(e) => setFormData({ ...formData, verification_key: e.target.value })}
                  placeholder="Enter verification key if not included in proof"
                />
              </div>
              <div>
                <Label htmlFor="circuit_type">Circuit Type</Label>
                <select
                  id="circuit_type"
                  value={formData.circuit_type}
                  onChange={(e) => setFormData({ ...formData, circuit_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="credit_score_proof">Credit Score Proof</option>
                  <option value="income_proof">Income Proof</option>
                  <option value="employment_proof">Employment Proof</option>
                  <option value="identity_proof">Identity Proof</option>
                </select>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium">Verification Process:</p>
                    <p>The proof will be cryptographically verified to ensure its validity and integrity.</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowVerifyModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleVerifyProof}
                  disabled={verifying || (!formData.proof_data && !uploadedProof)}
                >
                  {verifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    'Verify Proof'
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

