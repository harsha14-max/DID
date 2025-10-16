'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  RefreshCw,
  DollarSign,
  Calendar,
  Building,
  User,
  FileText,
  Shield,
  Target,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Banknote,
  Coins,
  Receipt,
  Calculator,
  Percent,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  HelpCircle,
  X,
  QrCode,
  Scan,
  Bell,
  Activity,
  Award,
  Star,
  Zap,
  Home,
  Briefcase,
  Settings,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Lender {
  id: string
  name: string
  did: string
  logo: string
  rating: number
  minScore: number
  maxAmount: number
  interestRate: number
  termMonths: number[]
  description: string
  verified: boolean
  active: boolean
}

interface LoanApplication {
  id: string
  userId: string
  lenderId: string
  lender: Lender
  amount: number
  purpose: string
  termMonths: number
  interestRate: number
  monthlyPayment: number
  totalPayment: number
  zkpProof: string
  status: 'pending' | 'verified' | 'approved' | 'rejected' | 'funded'
  createdAt: string
  updatedAt: string
  metadata: {
    score: number
    proofType: string
    verificationMethod: string
  }
}

interface LoanMarketplaceProps {
  userId: string
  userScore: number
  zkpProofs: any[]
  onApplicationCreated?: (application: LoanApplication) => void
  onApplicationUpdated?: (application: LoanApplication) => void
}

export default function LoanMarketplace({ userId, userScore, zkpProofs, onApplicationCreated, onApplicationUpdated }: LoanMarketplaceProps) {
  const [lenders, setLenders] = useState<Lender[]>([])
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [selectedLender, setSelectedLender] = useState<Lender | null>(null)

  useEffect(() => {
    loadLenders()
    loadApplications()
  }, [userId])

  const loadLenders = () => {
    const mockLenders: Lender[] = [
      {
        id: 'lender_1',
        name: 'CredX Bank',
        did: 'did:bank:credX',
        logo: '🏦',
        rating: 4.8,
        minScore: 650,
        maxAmount: 50000,
        interestRate: 6.5,
        termMonths: [12, 24, 36, 48, 60],
        description: 'Leading digital bank specializing in ZKP-verified loans',
        verified: true,
        active: true
      },
      {
        id: 'lender_2',
        name: 'Sovereign Credit Union',
        did: 'did:creditunion:sovereign',
        logo: '🏛️',
        rating: 4.6,
        minScore: 600,
        maxAmount: 25000,
        interestRate: 7.2,
        termMonths: [12, 24, 36],
        description: 'Community-focused credit union with competitive rates',
        verified: true,
        active: true
      },
      {
        id: 'lender_3',
        name: 'DeFi Lending Protocol',
        did: 'did:defi:protocol',
        logo: '⚡',
        rating: 4.4,
        minScore: 700,
        maxAmount: 100000,
        interestRate: 5.8,
        termMonths: [6, 12, 24, 36],
        description: 'Decentralized lending with automated ZKP verification',
        verified: true,
        active: true
      },
      {
        id: 'lender_4',
        name: 'FinTech Solutions',
        did: 'did:fintech:solutions',
        logo: '💳',
        rating: 4.2,
        minScore: 580,
        maxAmount: 15000,
        interestRate: 8.1,
        termMonths: [12, 24, 36, 48],
        description: 'Innovative fintech with instant approval process',
        verified: true,
        active: true
      }
    ]
    
    setLenders(mockLenders)
  }

  const loadApplications = () => {
    try {
      const storedApplications = localStorage.getItem(`loan_applications_${userId}`)
      if (storedApplications) {
        const parsedApplications = JSON.parse(storedApplications)
        setApplications(parsedApplications)
      }
    } catch (error) {
      console.error('Error loading applications:', error)
    }
  }

  const createApplication = async (lender: Lender) => {
    setLoading(true)
    
    try {
      const application: LoanApplication = {
        id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        lenderId: lender.id,
        lender: lender,
        amount: 5000,
        purpose: 'Personal loan',
        termMonths: 36,
        interestRate: lender.interestRate,
        monthlyPayment: 150,
        totalPayment: 5400,
        zkpProof: 'zkp_proof_demo',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          score: userScore,
          proofType: 'loan_eligibility',
          verificationMethod: 'zkp_proof'
        }
      }

      const updatedApplications = [...applications, application]
      localStorage.setItem(`loan_applications_${userId}`, JSON.stringify(updatedApplications))
      setApplications(updatedApplications)
      
      toast.success('Loan application submitted successfully!')
      setShowApplicationModal(false)
      setSelectedLender(null)
      
      if (onApplicationCreated) {
        onApplicationCreated(application)
      }
      
    } catch (error) {
      console.error('Error creating application:', error)
      toast.error('Failed to submit loan application')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'verified': return 'bg-blue-100 text-blue-800'
      case 'funded': return 'bg-purple-100 text-purple-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle
      case 'verified': return CheckCircle2
      case 'funded': return Award
      case 'pending': return Clock
      case 'rejected': return XCircle
      default: return AlertCircle
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const eligibleLenders = lenders.filter(lender => 
    lender.active && userScore >= lender.minScore
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Loan Marketplace</h2>
          <p className="text-gray-600">Apply for loans using Zero-Knowledge Proofs</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-blue-100 text-blue-800">
            Score: {userScore}
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {zkpProofs.length} ZKP Proofs
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">
                  {applications.filter(app => app.status === 'approved' || app.status === 'funded').length}
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
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {applications.filter(app => app.status === 'pending' || app.status === 'verified').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Borrowed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(applications
                    .filter(app => app.status === 'funded')
                    .reduce((sum, app) => sum + app.amount, 0)
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Lenders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Available Lenders</span>
          </CardTitle>
          <CardDescription>Lenders accepting ZKP-verified applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {eligibleLenders.map((lender, index) => (
              <motion.div
                key={lender.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{lender.logo}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{lender.name}</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{lender.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Max Amount:</span>
                        <span className="font-medium">{formatCurrency(lender.maxAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Interest Rate:</span>
                        <span className="font-medium">{lender.interestRate}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Min Score:</span>
                        <span className="font-medium">{lender.minScore}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-4">{lender.description}</p>
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => createApplication(lender)}
                      disabled={loading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      {applications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Applications</span>
            </CardTitle>
            <CardDescription>Your loan application history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.slice(0, 5).map((application, index) => {
                const StatusIcon = getStatusIcon(application.status)
                
                return (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{application.lender.logo}</div>
                      <div>
                        <h4 className="font-medium text-gray-900">{application.lender.name}</h4>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(application.amount)} • {application.termMonths} months
                        </p>
                        <p className="text-xs text-gray-500">
                          Applied: {formatDate(application.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(application.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {application.status}
                      </Badge>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}