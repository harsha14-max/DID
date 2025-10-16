-- =====================================================
-- BSM Platform - Credit System Schema Extensions
-- =====================================================
-- This extends the existing BSM Platform with DID & Sovereign Credit Scoring
-- Run this after the main FINAL-WORKING-SCHEMA.sql

-- =====================================================
-- 1. CREDIT SYSTEM TABLES
-- =====================================================

-- DIDs Table - Decentralized Identifiers
CREATE TABLE IF NOT EXISTS public.dids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  did_method TEXT NOT NULL DEFAULT 'did:bsm',
  did_identifier TEXT NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  private_key_encrypted TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'
);

-- Verifiable Credentials Table
CREATE TABLE IF NOT EXISTS public.verifiable_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  issuer_did TEXT NOT NULL,
  credential_type TEXT NOT NULL,
  credential_data JSONB NOT NULL,
  proof_signature TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_revoked BOOLEAN DEFAULT false,
  revocation_reason TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Credit Applications Table
CREATE TABLE IF NOT EXISTS public.credit_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  lender_did TEXT NOT NULL,
  zkp_proof TEXT NOT NULL,
  score_threshold INTEGER NOT NULL,
  loan_amount DECIMAL(15,2),
  loan_purpose TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'expired')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Trusted Issuers Table
CREATE TABLE IF NOT EXISTS public.trusted_issuers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issuer_did TEXT NOT NULL UNIQUE,
  issuer_name TEXT NOT NULL,
  issuer_type TEXT CHECK (issuer_type IN ('bank', 'utility', 'telecom', 'government', 'bsm_platform')) NOT NULL,
  issuer_description TEXT,
  contact_email TEXT,
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Credit Score History Table
CREATE TABLE IF NOT EXISTS public.credit_score_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 300 AND score <= 850),
  calculation_method TEXT NOT NULL,
  contributing_credentials TEXT[] DEFAULT '{}',
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- ZKP Proofs Table (for verification tracking)
CREATE TABLE IF NOT EXISTS public.zkp_proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  proof_type TEXT NOT NULL,
  proof_data JSONB NOT NULL,
  public_signals JSONB NOT NULL,
  verification_key TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- 2. INDEXES FOR PERFORMANCE
-- =====================================================

-- DID indexes
CREATE INDEX IF NOT EXISTS idx_dids_user_id ON public.dids(user_id);
CREATE INDEX IF NOT EXISTS idx_dids_identifier ON public.dids(did_identifier);
CREATE INDEX IF NOT EXISTS idx_dids_active ON public.dids(is_active);

-- Verifiable Credentials indexes
CREATE INDEX IF NOT EXISTS idx_vc_user_id ON public.verifiable_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_vc_issuer ON public.verifiable_credentials(issuer_did);
CREATE INDEX IF NOT EXISTS idx_vc_type ON public.verifiable_credentials(credential_type);
CREATE INDEX IF NOT EXISTS idx_vc_expires ON public.verifiable_credentials(expires_at);
CREATE INDEX IF NOT EXISTS idx_vc_revoked ON public.verifiable_credentials(is_revoked);

-- Credit Applications indexes
CREATE INDEX IF NOT EXISTS idx_credit_apps_user_id ON public.credit_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_apps_lender ON public.credit_applications(lender_did);
CREATE INDEX IF NOT EXISTS idx_credit_apps_status ON public.credit_applications(status);
CREATE INDEX IF NOT EXISTS idx_credit_apps_created ON public.credit_applications(created_at);

-- Credit Score History indexes
CREATE INDEX IF NOT EXISTS idx_credit_score_user_id ON public.credit_score_history(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_score_calculated ON public.credit_score_history(calculated_at);

-- ZKP Proofs indexes
CREATE INDEX IF NOT EXISTS idx_zkp_user_id ON public.zkp_proofs(user_id);
CREATE INDEX IF NOT EXISTS idx_zkp_type ON public.zkp_proofs(proof_type);
CREATE INDEX IF NOT EXISTS idx_zkp_verified ON public.zkp_proofs(is_verified);

-- =====================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.dids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifiable_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_issuers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zkp_proofs ENABLE ROW LEVEL SECURITY;

-- DIDs RLS Policies
CREATE POLICY "Users can view their own DIDs" ON public.dids
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own DIDs" ON public.dids
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all DIDs" ON public.dids
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Verifiable Credentials RLS Policies
CREATE POLICY "Users can view their own VCs" ON public.verifiable_credentials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all VCs" ON public.verifiable_credentials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert VCs" ON public.verifiable_credentials
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Credit Applications RLS Policies
CREATE POLICY "Users can view their own credit applications" ON public.credit_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credit applications" ON public.credit_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all credit applications" ON public.credit_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update credit applications" ON public.credit_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trusted Issuers RLS Policies
CREATE POLICY "Everyone can view approved issuers" ON public.trusted_issuers
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Admins can manage all issuers" ON public.trusted_issuers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Credit Score History RLS Policies
CREATE POLICY "Users can view their own credit score history" ON public.credit_score_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all credit score history" ON public.credit_score_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert credit score history" ON public.credit_score_history
  FOR INSERT WITH CHECK (true);

-- ZKP Proofs RLS Policies
CREATE POLICY "Users can view their own ZKP proofs" ON public.zkp_proofs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ZKP proofs" ON public.zkp_proofs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all ZKP proofs" ON public.zkp_proofs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- 4. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to automatically create DID for new users
CREATE OR REPLACE FUNCTION create_user_did()
RETURNS TRIGGER AS $$
DECLARE
  did_identifier TEXT;
  keypair RECORD;
BEGIN
  -- Generate DID identifier (simplified for demo)
  did_identifier := 'did:bsm:' || NEW.id::TEXT;
  
  -- Generate keypair (in real implementation, this would be done client-side)
  -- For now, we'll use placeholder values
  keypair.public_key := 'placeholder_public_key_' || NEW.id::TEXT;
  keypair.private_key := 'placeholder_private_key_' || NEW.id::TEXT;
  
  -- Insert DID record
  INSERT INTO public.dids (user_id, did_identifier, public_key, private_key_encrypted)
  VALUES (NEW.id, did_identifier, keypair.public_key, keypair.private_key);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create DID when user is created
CREATE TRIGGER trigger_create_user_did
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_did();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trigger_dids_updated_at
  BEFORE UPDATE ON public.dids
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample trusted issuers
INSERT INTO public.trusted_issuers (issuer_did, issuer_name, issuer_type, issuer_description, is_approved, approved_at)
VALUES 
  ('did:bsm:issuer:bsm-platform', 'BSM Platform', 'bsm_platform', 'Internal BSM Platform issuer for service completion credentials', true, NOW()),
  ('did:bsm:issuer:utility-company', 'City Utilities', 'utility', 'Local utility company for payment history', true, NOW()),
  ('did:bsm:issuer:bank-partner', 'Community Bank', 'bank', 'Partner bank for financial credentials', true, NOW())
ON CONFLICT (issuer_did) DO NOTHING;

-- =====================================================
-- 6. VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for user credit summary
CREATE OR REPLACE VIEW public.user_credit_summary AS
SELECT 
  u.id as user_id,
  u.email,
  u.full_name,
  d.did_identifier,
  COALESCE(csh.score, 300) as current_score,
  COUNT(vc.id) as total_credentials,
  COUNT(ca.id) as total_applications,
  COUNT(CASE WHEN ca.status = 'approved' THEN 1 END) as approved_applications
FROM public.users u
LEFT JOIN public.dids d ON u.id = d.user_id AND d.is_active = true
LEFT JOIN public.verifiable_credentials vc ON u.id = vc.user_id AND vc.is_revoked = false
LEFT JOIN public.credit_applications ca ON u.id = ca.user_id
LEFT JOIN LATERAL (
  SELECT score FROM public.credit_score_history csh2 
  WHERE csh2.user_id = u.id 
  ORDER BY csh2.calculated_at DESC 
  LIMIT 1
) csh ON true
GROUP BY u.id, u.email, u.full_name, d.did_identifier, csh.score;

-- View for admin credit analytics
CREATE OR REPLACE VIEW public.admin_credit_analytics AS
SELECT 
  COUNT(DISTINCT u.id) as total_users_with_dids,
  COUNT(DISTINCT vc.id) as total_credentials_issued,
  COUNT(DISTINCT ca.id) as total_credit_applications,
  COUNT(DISTINCT CASE WHEN ca.status = 'approved' THEN ca.id END) as approved_applications,
  AVG(csh.score) as average_credit_score,
  COUNT(DISTINCT ti.id) as total_trusted_issuers
FROM public.users u
LEFT JOIN public.dids d ON u.id = d.user_id AND d.is_active = true
LEFT JOIN public.verifiable_credentials vc ON u.id = vc.user_id AND vc.is_revoked = false
LEFT JOIN public.credit_applications ca ON u.id = ca.user_id
LEFT JOIN public.credit_score_history csh ON u.id = csh.user_id
LEFT JOIN public.trusted_issuers ti ON ti.is_approved = true;

-- =====================================================
-- 7. COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.dids IS 'Decentralized Identifiers for users in the credit system';
COMMENT ON TABLE public.verifiable_credentials IS 'Verifiable Credentials issued to users for credit scoring';
COMMENT ON TABLE public.credit_applications IS 'Credit applications with ZKP proofs';
COMMENT ON TABLE public.trusted_issuers IS 'Approved credential issuers in the system';
COMMENT ON TABLE public.credit_score_history IS 'Historical credit score calculations';
COMMENT ON TABLE public.zkp_proofs IS 'Zero-Knowledge Proofs for privacy-preserving verification';

COMMENT ON COLUMN public.dids.did_method IS 'DID method (e.g., did:bsm, did:key)';
COMMENT ON COLUMN public.dids.did_identifier IS 'Full DID identifier';
COMMENT ON COLUMN public.dids.public_key IS 'Public key for DID verification';
COMMENT ON COLUMN public.dids.private_key_encrypted IS 'Encrypted private key (client-side encryption)';

COMMENT ON COLUMN public.verifiable_credentials.credential_type IS 'Type of credential (service_completion, payment_history, etc.)';
COMMENT ON COLUMN public.verifiable_credentials.credential_data IS 'JSON data of the credential';
COMMENT ON COLUMN public.verifiable_credentials.proof_signature IS 'Cryptographic proof of credential authenticity';

COMMENT ON COLUMN public.credit_applications.zkp_proof IS 'Zero-knowledge proof that score >= threshold';
COMMENT ON COLUMN public.credit_applications.score_threshold IS 'Minimum score required for approval';

-- =====================================================
-- SCHEMA EXTENSION COMPLETE
-- =====================================================

