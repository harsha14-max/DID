// =====================================================
// BSM Platform - Credit System TypeScript Types
// =====================================================
// Type definitions for DID & Sovereign Credit Scoring system

// =====================================================
// 1. CORE CREDIT SYSTEM TYPES
// =====================================================

export interface DID {
  id: string
  user_id: string
  did_method: string
  did_identifier: string
  public_key: string
  private_key_encrypted?: string
  created_at: string
  updated_at: string
  is_active: boolean
  metadata?: Record<string, any>
}

export interface VerifiableCredential {
  id: string
  user_id: string
  issuer_did: string
  credential_type: CredentialType
  credential_data: CredentialData
  proof_signature: string
  issued_at: string
  expires_at?: string
  is_revoked: boolean
  revocation_reason?: string
  metadata?: Record<string, any>
}

export interface CreditApplication {
  id: string
  user_id: string
  lender_did: string
  zkp_proof: string
  score_threshold: number
  loan_amount?: number
  loan_purpose?: string
  status: ApplicationStatus
  created_at: string
  verified_at?: string
  approved_at?: string
  rejected_at?: string
  rejection_reason?: string
  metadata?: Record<string, any>
}

export interface TrustedIssuer {
  id: string
  issuer_did: string
  issuer_name: string
  issuer_type: IssuerType
  issuer_description?: string
  contact_email?: string
  is_approved: boolean
  approved_by?: string
  approved_at?: string
  created_at: string
  metadata?: Record<string, any>
}

export interface CreditScoreHistory {
  id: string
  user_id: string
  score: number
  calculation_method: string
  contributing_credentials: string[]
  calculated_at: string
  metadata?: Record<string, any>
}

export interface ZKPProof {
  id: string
  user_id: string
  proof_type: string
  proof_data: Record<string, any>
  public_signals: Record<string, any>
  verification_key: string
  is_verified: boolean
  verified_at?: string
  created_at: string
  metadata?: Record<string, any>
}

// =====================================================
// 2. ENUMS AND UNION TYPES
// =====================================================

export type CredentialType = 
  | 'service_completion'
  | 'payment_history'
  | 'utility_payment'
  | 'on_time_payment'
  | 'identity_verification'
  | 'employment_verification'
  | 'income_verification'

export type ApplicationStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'expired'

export type IssuerType = 
  | 'bank'
  | 'utility'
  | 'telecom'
  | 'government'
  | 'bsm_platform'

export type ProofType = 
  | 'credit_score'
  | 'income_proof'
  | 'identity_proof'
  | 'payment_history'

// =====================================================
// 3. CREDENTIAL DATA TYPES
// =====================================================

export interface ServiceCompletionData {
  service: string
  rating: number
  completed_at: string
  ticket_id?: string
  resolution_time?: number
}

export interface PaymentHistoryData {
  months_paid: number
  total_amount: number
  average_amount: number
  last_payment_date: string
  payment_frequency: 'monthly' | 'quarterly' | 'annually'
}

export interface UtilityPaymentData {
  utility_type: 'electricity' | 'water' | 'gas' | 'internet' | 'phone'
  months_paid: number
  average_amount: number
  last_payment_date: string
  provider_name: string
}

export interface IdentityVerificationData {
  verification_method: 'government_id' | 'biometric' | 'social_security'
  verified_at: string
  verification_level: 'basic' | 'enhanced' | 'premium'
  issuing_authority: string
}

export interface EmploymentVerificationData {
  employer_name: string
  position: string
  employment_start_date: string
  employment_end_date?: string
  salary_range?: string
  verification_date: string
}

export interface IncomeVerificationData {
  income_type: 'salary' | 'freelance' | 'business' | 'investment'
  monthly_income: number
  annual_income: number
  verification_date: string
  verification_method: 'bank_statement' | 'tax_return' | 'employer_letter'
}

export type CredentialData = 
  | ServiceCompletionData
  | PaymentHistoryData
  | UtilityPaymentData
  | IdentityVerificationData
  | EmploymentVerificationData
  | IncomeVerificationData

// =====================================================
// 4. CREDIT SCORING TYPES
// =====================================================

export interface CreditScoreCalculation {
  base_score: number
  contributing_factors: CreditFactor[]
  final_score: number
  calculation_date: string
  method_version: string
}

export interface CreditFactor {
  factor_name: string
  factor_type: 'positive' | 'negative' | 'neutral'
  impact_score: number
  weight: number
  description: string
  source_credential?: string
}

export interface ScoreBreakdown {
  payment_history: number
  service_completion: number
  identity_verification: number
  credit_utilization: number
  credit_history_length: number
  new_credit_inquiries: number
}

// =====================================================
// 5. ZKP PROOF TYPES
// =====================================================

export interface ZKPProofData {
  proof: string
  publicSignals: string[]
  verificationKey: string
}

export interface CreditScoreProof {
  score: number
  threshold: number
  proof: ZKPProofData
  verification_result: boolean
}

export interface RangeProof {
  value: number
  min: number
  max: number
  proof: ZKPProofData
}

// =====================================================
// 6. API REQUEST/RESPONSE TYPES
// =====================================================

export interface CreateDIDRequest {
  user_id: string
  did_method?: string
}

export interface CreateDIDResponse {
  did: DID
  private_key: string // Only returned once during creation
}

export interface IssueCredentialRequest {
  user_id: string
  credential_type: CredentialType
  credential_data: CredentialData
  expires_at?: string
}

export interface IssueCredentialResponse {
  credential: VerifiableCredential
}

export interface CalculateScoreRequest {
  user_id: string
  include_breakdown?: boolean
}

export interface CalculateScoreResponse {
  score: number
  breakdown?: ScoreBreakdown
  calculation: CreditScoreCalculation
}

export interface GenerateProofRequest {
  user_id: string
  score_threshold: number
  proof_type: ProofType
}

export interface GenerateProofResponse {
  proof: ZKPProofData
  public_signals: Record<string, any>
}

export interface VerifyProofRequest {
  proof: ZKPProofData
  public_signals: Record<string, any>
  verification_key: string
}

export interface VerifyProofResponse {
  is_valid: boolean
  verification_details?: Record<string, any>
}

export interface SubmitCreditApplicationRequest {
  user_id: string
  lender_did: string
  score_threshold: number
  loan_amount?: number
  loan_purpose?: string
  zkp_proof: ZKPProofData
}

export interface SubmitCreditApplicationResponse {
  application: CreditApplication
}

// =====================================================
// 7. COMPONENT PROPS TYPES
// =====================================================

export interface DIDManagementProps {
  userId: string
  onDIDCreated?: (did: DID) => void
}

export interface CredentialIssuanceProps {
  userId?: string
  onCredentialIssued?: (credential: VerifiableCredential) => void
}

export interface LenderManagementProps {
  userId: string
  onLenderUpdated?: () => void
}

export interface CreditAnalyticsProps {
  userId: string
  onAnalyticsUpdated?: () => void
}

export interface DigitalWalletProps {
  userId: string
  onCredentialAdded?: (credential: VerifiableCredential) => void
}

export interface CreditScoreProps {
  userId: string
  showBreakdown?: boolean
  onScoreCalculated?: (score: number) => void
}

export interface LoanApplicationsProps {
  userId: string
  onApplicationSubmitted?: (application: CreditApplication) => void
}

export interface PrivacyControlsProps {
  userId: string
  onSettingsUpdated?: (settings: PrivacySettings) => void
}

export interface ZKPProofGenerationProps {
  userId: string
  onProofGenerated?: (proof: ZKPProof) => void
}

export interface ZKPProofVerificationProps {
  userId: string
  onProofVerified?: (result: VerificationResult) => void
}

// =====================================================
// 8. PRIVACY AND SETTINGS TYPES
// =====================================================

export interface PrivacySettings {
  share_payment_history: boolean
  share_service_ratings: boolean
  share_identity_info: boolean
  allow_auto_scoring: boolean
  data_retention_period: number // in days
  audit_log_enabled: boolean
}

export interface DataSharingConsent {
  issuer_did: string
  credential_types: CredentialType[]
  purpose: string
  expires_at: string
  granted_at: string
  is_active: boolean
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  resource_type: string
  resource_id: string
  timestamp: string
  ip_address?: string
  user_agent?: string
  metadata?: Record<string, any>
}

// =====================================================
// 9. DASHBOARD AND ANALYTICS TYPES
// =====================================================

export interface CreditSystemOverview {
  total_users_with_dids: number
  total_credentials_issued: number
  total_credit_applications: number
  approved_applications: number
  average_credit_score: number
  total_trusted_issuers: number
}

export interface UserCreditSummary {
  user_id: string
  email: string
  full_name: string
  did_identifier?: string
  current_score: number
  total_credentials: number
  total_applications: number
  approved_applications: number
}

export interface CreditAnalytics {
  score_distribution: Record<string, number>
  credential_types_issued: Record<CredentialType, number>
  application_status_distribution: Record<ApplicationStatus, number>
  average_scores_by_issuer: Record<string, number>
  monthly_trends: {
    month: string
    applications: number
    approvals: number
    average_score: number
  }[]
}

// =====================================================
// 10. ERROR TYPES
// =====================================================

export interface CreditSystemError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
}

export type CreditSystemErrorCode = 
  | 'DID_CREATION_FAILED'
  | 'CREDENTIAL_ISSUANCE_FAILED'
  | 'SCORE_CALCULATION_FAILED'
  | 'PROOF_GENERATION_FAILED'
  | 'PROOF_VERIFICATION_FAILED'
  | 'APPLICATION_SUBMISSION_FAILED'
  | 'INSUFFICIENT_CREDENTIALS'
  | 'INVALID_CREDENTIAL_FORMAT'
  | 'ISSUER_NOT_TRUSTED'
  | 'SCORE_BELOW_THRESHOLD'

// =====================================================
// 11. UTILITY TYPES
// =====================================================

export interface PaginationParams {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface FilterParams {
  status?: ApplicationStatus
  issuer_type?: IssuerType
  credential_type?: CredentialType
  date_from?: string
  date_to?: string
}

export interface SearchParams extends PaginationParams, FilterParams {
  query?: string
}

// =====================================================
// 12. CIRCUIT TYPES (for ZKP)
// =====================================================

export interface CircuitInput {
  score: number
  threshold: number
}

export interface CircuitOutput {
  out: number
}

export interface CircuitWitness {
  score: number
  threshold: number
  out: number
}

export interface VerificationKey {
  protocol: string
  curve: string
  nPublic: number
  vk_alpha_1: string[]
  vk_beta_2: string[][]
  vk_gamma_2: string[][]
  vk_delta_2: string[][]
  vk_alphabeta_12: string[][][]
  IC: string[][]
}

// =====================================================
// TYPE EXPORTS
// =====================================================

export type {
  DID,
  VerifiableCredential,
  CreditApplication,
  TrustedIssuer,
  CreditScoreHistory,
  ZKPProof,
  CredentialData,
  CreditScoreCalculation,
  CreditFactor,
  ScoreBreakdown,
  ZKPProofData,
  CreditScoreProof,
  RangeProof,
  CreateDIDRequest,
  CreateDIDResponse,
  IssueCredentialRequest,
  IssueCredentialResponse,
  CalculateScoreRequest,
  CalculateScoreResponse,
  GenerateProofRequest,
  GenerateProofResponse,
  VerifyProofRequest,
  VerifyProofResponse,
  SubmitCreditApplicationRequest,
  SubmitCreditApplicationResponse,
  PrivacySettings,
  DataSharingConsent,
  AuditLog,
  CreditSystemOverview,
  UserCreditSummary,
  CreditAnalytics,
  CreditSystemError,
  PaginationParams,
  FilterParams,
  SearchParams,
  CircuitInput,
  CircuitOutput,
  CircuitWitness,
  VerificationKey
}
