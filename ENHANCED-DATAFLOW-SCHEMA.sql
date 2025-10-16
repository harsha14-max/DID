-- =====================================================
-- BSM Platform - ENHANCED DATAFLOW SCHEMA
-- =====================================================
-- This schema implements the complete data flow:
-- Services/Assets -> Customer View -> Tickets -> Admin Approval -> Customer Rating

-- =====================================================
-- 1. EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. CORE TABLES (Existing)
-- =====================================================

-- Users table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'customer')) DEFAULT 'customer',
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- 3. SERVICES & ASSETS MANAGEMENT
-- =====================================================

-- Services table (what services are offered to customers)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive', 'maintenance', 'deprecated')) DEFAULT 'active',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  sla_hours INTEGER DEFAULT 24,
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Assets table (resources, tools, systems)
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('hardware', 'software', 'infrastructure', 'documentation', 'other')) NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('operational', 'degraded', 'maintenance', 'outage')) DEFAULT 'operational',
  location TEXT,
  owner_id UUID REFERENCES public.users(id),
  service_id UUID REFERENCES public.services(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- 4. ENHANCED TICKETS SYSTEM
-- =====================================================

-- Tickets table (enhanced with approval workflow)
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('open', 'pending_approval', 'approved', 'in_progress', 'resolved', 'closed', 'rejected')) DEFAULT 'open',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  category TEXT NOT NULL,
  service_id UUID REFERENCES public.services(id),
  asset_id UUID REFERENCES public.assets(id),
  assigned_to UUID REFERENCES public.users(id),
  created_by UUID REFERENCES public.users(id) NOT NULL,
  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  sla_deadline TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}',
  attachments TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- 5. RULE ENGINE & AUTOMATION
-- =====================================================

-- Rules table (for automated ticket approval)
CREATE TABLE IF NOT EXISTS public.rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  conditions JSONB NOT NULL, -- JSON conditions for when rule applies
  actions JSONB NOT NULL,    -- JSON actions to take (approve, assign, etc.)
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Rule executions log
CREATE TABLE IF NOT EXISTS public.rule_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id UUID REFERENCES public.rules(id) NOT NULL,
  ticket_id UUID REFERENCES public.tickets(id) NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  result TEXT CHECK (result IN ('success', 'failed', 'skipped')) NOT NULL,
  details JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- 6. WORKFLOWS & APPROVAL PROCESS
-- =====================================================

-- Workflows table (enhanced)
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT CHECK (trigger_type IN ('ticket_created', 'ticket_approved', 'manual', 'scheduled')) NOT NULL,
  trigger_config JSONB NOT NULL,
  steps JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Workflow executions
CREATE TABLE IF NOT EXISTS public.workflow_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES public.workflows(id) NOT NULL,
  ticket_id UUID REFERENCES public.tickets(id) NOT NULL,
  status TEXT CHECK (status IN ('running', 'completed', 'failed', 'paused')) DEFAULT 'running',
  current_step INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  details JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- 7. RATING & FEEDBACK SYSTEM
-- =====================================================

-- Ratings table (for customer feedback on approved tickets)
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES public.tickets(id) NOT NULL,
  customer_id UUID REFERENCES public.users(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  category TEXT, -- Technical Support, Account Management, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  UNIQUE(ticket_id, customer_id) -- One rating per ticket per customer
);

-- =====================================================
-- 8. ACCOUNTS & ORGANIZATIONS
-- =====================================================

-- Accounts table (customer organizations/companies)
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('individual', 'business', 'enterprise')) DEFAULT 'individual',
  status TEXT CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
  contact_email TEXT,
  contact_phone TEXT,
  address JSONB DEFAULT '{}',
  billing_info JSONB DEFAULT '{}',
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Account users (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.account_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES public.accounts(id) NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  role TEXT CHECK (role IN ('owner', 'admin', 'member', 'viewer')) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  UNIQUE(account_id, user_id)
);

-- =====================================================
-- 9. EXISTING TABLES (Knowledge Base, Analytics, Chat)
-- =====================================================

-- Knowledge base table
CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES public.users(id) NOT NULL,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'
);

-- Analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type TEXT CHECK (metric_type IN ('counter', 'gauge', 'histogram')) NOT NULL,
  tags JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  sender_id UUID REFERENCES public.users(id) NOT NULL,
  sender_type TEXT CHECK (sender_type IN ('user', 'agent', 'system')) NOT NULL,
  ticket_id UUID REFERENCES public.tickets(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- 10. INDEXES FOR PERFORMANCE
-- =====================================================

-- Tickets indexes
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_by ON public.tickets(created_by);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON public.tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_service_id ON public.tickets(service_id);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets(created_at);

-- Services indexes
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);

-- Assets indexes
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_service_id ON public.assets(service_id);

-- Ratings indexes
CREATE INDEX IF NOT EXISTS idx_ratings_ticket_id ON public.ratings(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ratings_customer_id ON public.ratings(customer_id);

-- Rules indexes
CREATE INDEX IF NOT EXISTS idx_rules_active ON public.rules(is_active);
CREATE INDEX IF NOT EXISTS idx_rules_priority ON public.rules(priority);

-- =====================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rule_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Users policies (disable RLS to prevent recursion)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Services policies
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Only admins can manage services" ON public.services FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Assets policies
CREATE POLICY "Assets are viewable by everyone" ON public.assets FOR SELECT USING (true);
CREATE POLICY "Only admins can manage assets" ON public.assets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Tickets policies
CREATE POLICY "Users can view their own tickets" ON public.tickets FOR SELECT USING (
  created_by = auth.uid() OR 
  assigned_to = auth.uid() OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can create tickets" ON public.tickets FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Assigned users and admins can update tickets" ON public.tickets FOR UPDATE USING (
  assigned_to = auth.uid() OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Ratings policies
CREATE POLICY "Users can view ratings for their tickets" ON public.ratings FOR SELECT USING (
  customer_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.tickets WHERE id = ticket_id AND created_by = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Customers can create ratings for their approved tickets" ON public.ratings FOR INSERT WITH CHECK (
  customer_id = auth.uid() AND
  EXISTS (SELECT 1 FROM public.tickets WHERE id = ticket_id AND created_by = auth.uid() AND status = 'approved')
);

-- Rules policies (admin only)
CREATE POLICY "Only admins can manage rules" ON public.rules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Workflows policies (admin only)
CREATE POLICY "Only admins can manage workflows" ON public.workflows FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Accounts policies
CREATE POLICY "Users can view their accounts" ON public.accounts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.account_users WHERE account_id = id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage accounts" ON public.accounts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Knowledge base policies
CREATE POLICY "Published knowledge base is viewable by everyone" ON public.knowledge_base FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can manage their knowledge base" ON public.knowledge_base FOR ALL USING (
  author_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Analytics policies (admin only)
CREATE POLICY "Only admins can manage analytics" ON public.analytics FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Chat messages policies
CREATE POLICY "Users can view messages for their tickets" ON public.chat_messages FOR SELECT USING (
  sender_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.tickets WHERE id = ticket_id AND (created_by = auth.uid() OR assigned_to = auth.uid())) OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can create messages" ON public.chat_messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- =====================================================
-- 12. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN NEW.email = 'admin2@gmail.com' THEN 'admin'
      WHEN NEW.email = 'customer@gmail.com' THEN 'customer'
      ELSE 'customer'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rules_updated_at BEFORE UPDATE ON public.rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON public.workflows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON public.ratings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON public.knowledge_base FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically approve tickets based on rules
CREATE OR REPLACE FUNCTION public.auto_approve_ticket()
RETURNS TRIGGER AS $$
DECLARE
  rule_record RECORD;
  conditions_met BOOLEAN;
BEGIN
  -- Only process new tickets
  IF TG_OP = 'INSERT' AND NEW.status = 'open' THEN
    -- Check each active rule
    FOR rule_record IN 
      SELECT * FROM public.rules 
      WHERE is_active = true 
      ORDER BY priority DESC
    LOOP
      -- Evaluate conditions (simplified - in real implementation, you'd have a proper condition evaluator)
      conditions_met := true; -- Placeholder - implement actual condition evaluation
      
      IF conditions_met THEN
        -- Execute actions (simplified - in real implementation, you'd have a proper action executor)
        NEW.status := 'approved';
        NEW.approved_at := NOW();
        
        -- Log the rule execution
        INSERT INTO public.rule_executions (rule_id, ticket_id, result, details)
        VALUES (rule_record.id, NEW.id, 'success', '{"action": "auto_approve"}');
        
        EXIT; -- Exit after first matching rule
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic ticket approval
DROP TRIGGER IF EXISTS auto_approve_ticket_trigger ON public.tickets;
CREATE TRIGGER auto_approve_ticket_trigger
  BEFORE INSERT ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.auto_approve_ticket();

-- =====================================================
-- 13. SAMPLE DATA
-- =====================================================

-- Insert sample services
INSERT INTO public.services (id, name, description, category, status, priority, sla_hours, created_by) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Email Support', 'Technical support for email-related issues', 'Technical', 'active', 'medium', 24, 'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Account Management', 'Help with account settings and preferences', 'Account', 'active', 'high', 12, 'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816'),
  ('550e8400-e29b-41d4-a716-446655440003', 'API Integration', 'Support for API development and integration', 'Technical', 'active', 'high', 48, 'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Billing Support', 'Assistance with billing and payment issues', 'Billing', 'active', 'medium', 24, 'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816')
ON CONFLICT (id) DO NOTHING;

-- Insert sample assets
INSERT INTO public.assets (id, name, type, description, status, service_id, created_at) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Email Server', 'infrastructure', 'Primary email server infrastructure', 'operational', '550e8400-e29b-41d4-a716-446655440001', NOW()),
  ('660e8400-e29b-41d4-a716-446655440002', 'User Database', 'infrastructure', 'Customer user database', 'operational', '550e8400-e29b-41d4-a716-446655440002', NOW()),
  ('660e8400-e29b-41d4-a716-446655440003', 'API Gateway', 'infrastructure', 'API gateway for external integrations', 'operational', '550e8400-e29b-41d4-a716-446655440003', NOW()),
  ('660e8400-e29b-41d4-a716-446655440004', 'Payment Processor', 'software', 'Third-party payment processing system', 'operational', '550e8400-e29b-41d4-a716-446655440004', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample rules for auto-approval
INSERT INTO public.rules (id, name, description, conditions, actions, priority, created_by) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'Auto-approve low priority tickets', 'Automatically approve low priority tickets', 
   '{"priority": "low", "category": "general"}', 
   '{"action": "approve", "assign_to": "auto"}', 
   1, 'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816'),
  ('770e8400-e29b-41d4-a716-446655440002', 'Auto-approve account management tickets', 'Automatically approve account management tickets', 
   '{"category": "Account Management"}', 
   '{"action": "approve", "assign_to": "account_team"}', 
   2, 'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816')
ON CONFLICT (id) DO NOTHING;

-- Insert sample workflows
INSERT INTO public.workflows (id, name, description, trigger_type, trigger_config, steps, created_by) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', 'Standard Ticket Workflow', 'Standard workflow for ticket processing', 
   'ticket_approved', 
   '{"status": "approved"}', 
   '[{"step": 1, "action": "assign", "assign_to": "next_available"}, {"step": 2, "action": "notify", "notify": ["customer", "assignee"]}]', 
   'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816')
ON CONFLICT (id) DO NOTHING;

-- Insert sample accounts
INSERT INTO public.accounts (id, name, type, status, contact_email, created_by) VALUES
  ('990e8400-e29b-41d4-a716-446655440001', 'Customer Account', 'individual', 'active', 'customer@gmail.com', 'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816')
ON CONFLICT (id) DO NOTHING;

-- Link customer to account
INSERT INTO public.account_users (account_id, user_id, role) VALUES
  ('990e8400-e29b-41d4-a716-446655440001', '7728175c-891d-4d88-99d4-d1f7d6c6e17', 'owner')
ON CONFLICT (account_id, user_id) DO NOTHING;

-- Insert sample knowledge base articles
INSERT INTO public.knowledge_base (id, title, content, category, author_id, status, published_at) VALUES
  ('aa0e8400-e29b-41d4-a716-446655440001', 'How to Reset Your Password', 'Step-by-step guide to reset your password using the forgot password feature.', 'Account Management', 'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816', 'published', NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440002', 'Setting Up Two-Factor Authentication', 'Learn how to enable 2FA for better security on your account.', 'Security', 'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816', 'published', NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440003', 'API Integration Guide', 'Complete guide for integrating with our API services.', 'Technical', 'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816', 'published', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample analytics data
INSERT INTO public.analytics (metric_name, metric_value, metric_type, tags) VALUES
  ('total_tickets', 150, 'counter', '{"period": "month"}'),
  ('resolved_tickets', 120, 'counter', '{"period": "month"}'),
  ('average_resolution_time', 2.5, 'gauge', '{"unit": "hours"}'),
  ('customer_satisfaction', 4.2, 'gauge', '{"scale": "1-5"}')
ON CONFLICT DO NOTHING;

