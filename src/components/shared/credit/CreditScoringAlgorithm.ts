// =====================================================
// BSM Platform - Credit Scoring Algorithm
// =====================================================
// Local credit scoring algorithm for sovereign credit scoring

import { 
  VerifiableCredential, 
  CredentialType, 
  CreditScoreCalculation, 
  CreditFactor,
  ScoreBreakdown,
  ServiceCompletionData,
  PaymentHistoryData,
  UtilityPaymentData,
  IdentityVerificationData,
  EmploymentVerificationData,
  IncomeVerificationData
} from '@/types/credit'

export class CreditScoringAlgorithm {
  private readonly BASE_SCORE = 300
  private readonly MAX_SCORE = 850
  private readonly MIN_SCORE = 300

  // Weight factors for different credential types
  private readonly CREDENTIAL_WEIGHTS = {
    service_completion: 0.25,
    payment_history: 0.30,
    utility_payment: 0.20,
    identity_verification: 0.15,
    employment_verification: 0.05,
    income_verification: 0.05
  }

  // Maximum points for each credential type
  private readonly MAX_POINTS = {
    service_completion: 150,
    payment_history: 200,
    utility_payment: 100,
    identity_verification: 75,
    employment_verification: 25,
    income_verification: 25
  }

  /**
   * Calculate credit score based on verifiable credentials
   */
  calculateScore(credentials: VerifiableCredential[]): CreditScoreCalculation {
    const contributingFactors: CreditFactor[] = []
    let totalScore = this.BASE_SCORE

    // Group credentials by type
    const credentialsByType = this.groupCredentialsByType(credentials)

    // Calculate score for each credential type
    for (const [credentialType, creds] of Object.entries(credentialsByType)) {
      const factor = this.calculateFactorScore(
        credentialType as CredentialType,
        creds
      )
      contributingFactors.push(factor)
      totalScore += factor.impact_score
    }

    // Apply penalties for missing critical credentials
    const penaltyFactors = this.calculatePenaltyFactors(credentialsByType)
    contributingFactors.push(...penaltyFactors)
    totalScore += penaltyFactors.reduce((sum, factor) => sum + factor.impact_score, 0)

    // Ensure score is within bounds
    totalScore = Math.max(this.MIN_SCORE, Math.min(this.MAX_SCORE, totalScore))

    return {
      base_score: this.BASE_SCORE,
      contributing_factors: contributingFactors,
      final_score: Math.round(totalScore),
      calculation_date: new Date().toISOString(),
      method_version: '1.0.0'
    }
  }

  /**
   * Calculate detailed score breakdown
   */
  calculateScoreBreakdown(credentials: VerifiableCredential[]): ScoreBreakdown {
    const credentialsByType = this.groupCredentialsByType(credentials)

    return {
      payment_history: this.calculatePaymentHistoryScore(credentialsByType.payment_history || []),
      service_completion: this.calculateServiceCompletionScore(credentialsByType.service_completion || []),
      identity_verification: this.calculateIdentityVerificationScore(credentialsByType.identity_verification || []),
      credit_utilization: this.calculateCreditUtilizationScore(credentials),
      credit_history_length: this.calculateHistoryLengthScore(credentials),
      new_credit_inquiries: this.calculateInquiryScore(credentials)
    }
  }

  /**
   * Group credentials by type
   */
  private groupCredentialsByType(credentials: VerifiableCredential[]): Record<CredentialType, VerifiableCredential[]> {
    const grouped: Record<string, VerifiableCredential[]> = {}

    credentials.forEach(credential => {
      if (!grouped[credential.credential_type]) {
        grouped[credential.credential_type] = []
      }
      grouped[credential.credential_type].push(credential)
    })

    return grouped as Record<CredentialType, VerifiableCredential[]>
  }

  /**
   * Calculate factor score for a specific credential type
   */
  private calculateFactorScore(
    credentialType: CredentialType,
    credentials: VerifiableCredential[]
  ): CreditFactor {
    let impactScore = 0
    let description = ''

    switch (credentialType) {
      case 'service_completion':
        impactScore = this.calculateServiceCompletionScore(credentials)
        description = `Service completion score based on ${credentials.length} service records`
        break

      case 'payment_history':
        impactScore = this.calculatePaymentHistoryScore(credentials)
        description = `Payment history score based on ${credentials.length} payment records`
        break

      case 'utility_payment':
        impactScore = this.calculateUtilityPaymentScore(credentials)
        description = `Utility payment score based on ${credentials.length} utility records`
        break

      case 'identity_verification':
        impactScore = this.calculateIdentityVerificationScore(credentials)
        description = `Identity verification score based on ${credentials.length} verification records`
        break

      case 'employment_verification':
        impactScore = this.calculateEmploymentVerificationScore(credentials)
        description = `Employment verification score based on ${credentials.length} employment records`
        break

      case 'income_verification':
        impactScore = this.calculateIncomeVerificationScore(credentials)
        description = `Income verification score based on ${credentials.length} income records`
        break

      default:
        impactScore = 0
        description = `Unknown credential type: ${credentialType}`
    }

    return {
      factor_name: credentialType,
      factor_type: impactScore >= 0 ? 'positive' : 'negative',
      impact_score: impactScore,
      weight: this.CREDENTIAL_WEIGHTS[credentialType] || 0,
      description,
      source_credential: credentials.length > 0 ? credentials[0].id : undefined
    }
  }

  /**
   * Calculate service completion score
   */
  private calculateServiceCompletionScore(credentials: VerifiableCredential[]): number {
    if (credentials.length === 0) return 0

    let totalScore = 0
    let totalWeight = 0

    credentials.forEach(credential => {
      const data = credential.credential_data as ServiceCompletionData
      const rating = data.rating || 0
      const weight = this.calculateServiceWeight(data)

      // Score based on rating (1-5 scale)
      const ratingScore = (rating / 5) * 50 // Max 50 points per service
      
      // Bonus for on-time completion
      const completionBonus = data.resolution_time && data.resolution_time < 24 ? 10 : 0
      
      totalScore += (ratingScore + completionBonus) * weight
      totalWeight += weight
    })

    return totalWeight > 0 ? Math.min(totalScore / totalWeight, this.MAX_POINTS.service_completion) : 0
  }

  /**
   * Calculate payment history score
   */
  private calculatePaymentHistoryScore(credentials: VerifiableCredential[]): number {
    if (credentials.length === 0) return 0

    let totalScore = 0
    let totalMonths = 0

    credentials.forEach(credential => {
      const data = credential.credential_data as PaymentHistoryData
      const months = data.months_paid || 0
      const averageAmount = data.average_amount || 0

      // Score based on months of consistent payments
      const monthsScore = Math.min(months * 2, 100) // Max 100 points for 50+ months
      
      // Score based on payment amount consistency
      const amountScore = averageAmount > 0 ? Math.min(averageAmount / 100, 50) : 0 // Max 50 points
      
      totalScore += monthsScore + amountScore
      totalMonths += months
    })

    return Math.min(totalScore, this.MAX_POINTS.payment_history)
  }

  /**
   * Calculate utility payment score
   */
  private calculateUtilityPaymentScore(credentials: VerifiableCredential[]): number {
    if (credentials.length === 0) return 0

    let totalScore = 0
    const utilityTypes = new Set<string>()

    credentials.forEach(credential => {
      const data = credential.credential_data as UtilityPaymentData
      const months = data.months_paid || 0
      const utilityType = data.utility_type || 'unknown'

      utilityTypes.add(utilityType)

      // Score based on months of payments
      const monthsScore = Math.min(months * 1.5, 30) // Max 30 points per utility type
      totalScore += monthsScore
    })

    // Bonus for multiple utility types
    const diversityBonus = Math.min(utilityTypes.size * 5, 20) // Max 20 points for diversity

    return Math.min(totalScore + diversityBonus, this.MAX_POINTS.utility_payment)
  }

  /**
   * Calculate identity verification score
   */
  private calculateIdentityVerificationScore(credentials: VerifiableCredential[]): number {
    if (credentials.length === 0) return 0

    let totalScore = 0
    const verificationMethods = new Set<string>()

    credentials.forEach(credential => {
      const data = credential.credential_data as IdentityVerificationData
      const method = data.verification_method || 'unknown'
      const level = data.verification_level || 'basic'

      verificationMethods.add(method)

      // Score based on verification level
      const levelScore = {
        'basic': 15,
        'enhanced': 25,
        'premium': 35
      }[level] || 10

      totalScore += levelScore
    })

    // Bonus for multiple verification methods
    const methodBonus = Math.min(verificationMethods.size * 5, 15)

    return Math.min(totalScore + methodBonus, this.MAX_POINTS.identity_verification)
  }

  /**
   * Calculate employment verification score
   */
  private calculateEmploymentVerificationScore(credentials: VerifiableCredential[]): number {
    if (credentials.length === 0) return 0

    let totalScore = 0

    credentials.forEach(credential => {
      const data = credential.credential_data as EmploymentVerificationData
      const startDate = new Date(data.employment_start_date)
      const endDate = data.employment_end_date ? new Date(data.employment_end_date) : new Date()
      const monthsEmployed = Math.max(0, (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))

      // Score based on employment duration
      const durationScore = Math.min(monthsEmployed * 0.5, 20) // Max 20 points
      totalScore += durationScore
    })

    return Math.min(totalScore, this.MAX_POINTS.employment_verification)
  }

  /**
   * Calculate income verification score
   */
  private calculateIncomeVerificationScore(credentials: VerifiableCredential[]): number {
    if (credentials.length === 0) return 0

    let totalScore = 0

    credentials.forEach(credential => {
      const data = credential.credential_data as IncomeVerificationData
      const monthlyIncome = data.monthly_income || 0

      // Score based on income level (simplified)
      const incomeScore = Math.min(monthlyIncome / 1000, 20) // Max 20 points for $20k+ monthly income
      totalScore += incomeScore
    })

    return Math.min(totalScore, this.MAX_POINTS.income_verification)
  }

  /**
   * Calculate credit utilization score (simplified)
   */
  private calculateCreditUtilizationScore(credentials: VerifiableCredential[]): number {
    // This would typically be based on credit card usage vs limits
    // For now, we'll use a simplified calculation based on payment consistency
    const paymentCreds = credentials.filter(c => c.credential_type === 'payment_history')
    if (paymentCreds.length === 0) return 0

    let totalUtilization = 0
    paymentCreds.forEach(credential => {
      const data = credential.credential_data as PaymentHistoryData
      // Simplified utilization calculation
      const utilization = Math.min(data.average_amount / 1000, 1) // Assume $1000 as "limit"
      totalUtilization += utilization
    })

    const avgUtilization = totalUtilization / paymentCreds.length
    // Lower utilization is better (0-30% is optimal)
    return avgUtilization <= 0.3 ? 50 : Math.max(0, 50 - (avgUtilization - 0.3) * 100)
  }

  /**
   * Calculate credit history length score
   */
  private calculateHistoryLengthScore(credentials: VerifiableCredential[]): number {
    if (credentials.length === 0) return 0

    const oldestCredential = credentials.reduce((oldest, current) => {
      return new Date(current.issued_at) < new Date(oldest.issued_at) ? current : oldest
    })

    const monthsSinceOldest = Math.max(0, 
      (new Date().getTime() - new Date(oldestCredential.issued_at).getTime()) / (1000 * 60 * 60 * 24 * 30)
    )

    // Score based on history length (max 50 points for 5+ years)
    return Math.min(monthsSinceOldest * 0.83, 50)
  }

  /**
   * Calculate inquiry score (simplified)
   */
  private calculateInquiryScore(credentials: VerifiableCredential[]): number {
    // This would typically track recent credit inquiries
    // For now, we'll use a simplified calculation
    const recentApplications = credentials.filter(c => 
      c.credential_type === 'service_completion' && 
      new Date(c.issued_at) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
    )

    // Fewer recent applications is better
    return Math.max(0, 25 - recentApplications.length * 5)
  }

  /**
   * Calculate penalty factors for missing credentials
   */
  private calculatePenaltyFactors(credentialsByType: Record<CredentialType, VerifiableCredential[]>): CreditFactor[] {
    const penalties: CreditFactor[] = []

    // Check for missing critical credentials
    const criticalTypes: CredentialType[] = ['identity_verification', 'payment_history']
    
    criticalTypes.forEach(type => {
      if (!credentialsByType[type] || credentialsByType[type].length === 0) {
        penalties.push({
          factor_name: `missing_${type}`,
          factor_type: 'negative',
          impact_score: -50, // Penalty for missing critical credential
          weight: 0.1,
          description: `Penalty for missing ${type} credential`,
          source_credential: undefined
        })
      }
    })

    return penalties
  }

  /**
   * Calculate service weight based on service type
   */
  private calculateServiceWeight(data: ServiceCompletionData): number {
    // Different services have different weights
    const serviceWeights: Record<string, number> = {
      'technical_support': 1.0,
      'billing_support': 0.8,
      'account_management': 1.2,
      'feature_request': 0.6,
      'bug_report': 0.9
    }

    return serviceWeights[data.service] || 1.0
  }

  /**
   * Validate credentials before scoring
   */
  validateCredentials(credentials: VerifiableCredential[]): { valid: VerifiableCredential[], invalid: VerifiableCredential[] } {
    const valid: VerifiableCredential[] = []
    const invalid: VerifiableCredential[] = []

    credentials.forEach(credential => {
      // Check if credential is not revoked
      if (credential.is_revoked) {
        invalid.push(credential)
        return
      }

      // Check if credential is not expired
      if (credential.expires_at && new Date(credential.expires_at) < new Date()) {
        invalid.push(credential)
        return
      }

      // Check if credential data is valid
      if (!this.isValidCredentialData(credential.credential_type, credential.credential_data)) {
        invalid.push(credential)
        return
      }

      valid.push(credential)
    })

    return { valid, invalid }
  }

  /**
   * Validate credential data based on type
   */
  private isValidCredentialData(type: CredentialType, data: any): boolean {
    switch (type) {
      case 'service_completion':
        return data && typeof data.rating === 'number' && data.rating >= 1 && data.rating <= 5
      
      case 'payment_history':
        return data && typeof data.months_paid === 'number' && data.months_paid > 0
      
      case 'utility_payment':
        return data && typeof data.months_paid === 'number' && data.months_paid > 0
      
      case 'identity_verification':
        return data && data.verification_method && data.verification_level
      
      case 'employment_verification':
        return data && data.employer_name && data.employment_start_date
      
      case 'income_verification':
        return data && typeof data.monthly_income === 'number' && data.monthly_income > 0
      
      default:
        return false
    }
  }

  /**
   * Get score interpretation
   */
  getScoreInterpretation(score: number): { category: string, description: string, color: string } {
    if (score >= 750) {
      return {
        category: 'Excellent',
        description: 'Outstanding creditworthiness',
        color: 'green'
      }
    } else if (score >= 700) {
      return {
        category: 'Good',
        description: 'Good creditworthiness',
        color: 'blue'
      }
    } else if (score >= 650) {
      return {
        category: 'Fair',
        description: 'Fair creditworthiness',
        color: 'yellow'
      }
    } else if (score >= 600) {
      return {
        category: 'Poor',
        description: 'Poor creditworthiness',
        color: 'orange'
      }
    } else {
      return {
        category: 'Very Poor',
        description: 'Very poor creditworthiness',
        color: 'red'
      }
    }
  }
}

// Export singleton instance
export const creditScoringAlgorithm = new CreditScoringAlgorithm()

