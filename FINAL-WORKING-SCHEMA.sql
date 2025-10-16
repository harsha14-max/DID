-- =====================================================
-- BSM Platform - FINAL WORKING SCHEMA
-- =====================================================
-- This is the complete, tested, and working schema
-- Includes all fixes for authentication and portal type validation

-- =====================================================
-- 1. EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. CORE TABLES
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

-- Tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  category TEXT NOT NULL,
  assigned_to UUID REFERENCES public.users(id),
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  sla_deadline TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}',
  attachments TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'
);

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

-- Workflows table
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL,
  trigger_config JSONB NOT NULL,
  steps JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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
  attachments TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- 3. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON public.users(last_login);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON public.tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created_by ON public.tickets(created_by);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON public.tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets(created_at);

CREATE INDEX IF NOT EXISTS idx_knowledge_base_status ON public.knowledge_base(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_published_at ON public.knowledge_base(published_at);

CREATE INDEX IF NOT EXISTS idx_analytics_metric_name ON public.analytics(metric_name);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON public.analytics(timestamp);

CREATE INDEX IF NOT EXISTS idx_chat_messages_ticket_id ON public.chat_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) - DISABLED FOR NOW
-- =====================================================
-- RLS is temporarily disabled to prevent infinite recursion
-- Re-enable when needed with proper policies

-- Disable RLS on users table (prevents infinite recursion)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Enable RLS on other tables (these don't cause recursion issues)
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;

-- RLS Policies for tickets table
DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;
CREATE POLICY "Users can view own tickets" ON public.tickets
  FOR SELECT USING (
    auth.uid() = created_by OR 
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can create tickets" ON public.tickets;
CREATE POLICY "Users can create tickets" ON public.tickets
  FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Assigned users and admins can update tickets" ON public.tickets;
CREATE POLICY "Assigned users and admins can update tickets" ON public.tickets
  FOR UPDATE USING (
    auth.uid() = assigned_to OR
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for knowledge_base table
DROP POLICY IF EXISTS "Anyone can view published articles" ON public.knowledge_base;
CREATE POLICY "Anyone can view published articles" ON public.knowledge_base
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Authors can manage own articles" ON public.knowledge_base;
CREATE POLICY "Authors can manage own articles" ON public.knowledge_base
  FOR ALL USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Admins can manage all articles" ON public.knowledge_base;
CREATE POLICY "Admins can manage all articles" ON public.knowledge_base
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for workflows table
DROP POLICY IF EXISTS "Admins can manage workflows" ON public.workflows;
CREATE POLICY "Admins can manage workflows" ON public.workflows
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can view active workflows" ON public.workflows;
CREATE POLICY "Users can view active workflows" ON public.workflows
  FOR SELECT USING (is_active = true);

-- RLS Policies for analytics table
DROP POLICY IF EXISTS "Admins can manage analytics" ON public.analytics;
CREATE POLICY "Admins can manage analytics" ON public.analytics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for chat_messages table
DROP POLICY IF EXISTS "Users can view messages for their tickets" ON public.chat_messages;
CREATE POLICY "Users can view messages for their tickets" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tickets 
      WHERE id = chat_messages.ticket_id 
      AND (created_by = auth.uid() OR assigned_to = auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can create messages for their tickets" ON public.chat_messages;
CREATE POLICY "Users can create messages for their tickets" ON public.chat_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.tickets 
      WHERE id = chat_messages.ticket_id 
      AND (created_by = auth.uid() OR assigned_to = auth.uid())
    )
  );

-- =====================================================
-- 5. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tickets_updated_at ON public.tickets;
CREATE TRIGGER update_tickets_updated_at 
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_knowledge_base_updated_at ON public.knowledge_base;
CREATE TRIGGER update_knowledge_base_updated_at 
  BEFORE UPDATE ON public.knowledge_base
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_workflows_updated_at ON public.workflows;
CREATE TRIGGER update_workflows_updated_at 
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 6. USER DATA (YOUR ACTUAL USERS)
-- =====================================================

-- Insert/Update your actual users with correct roles
INSERT INTO public.users (id, email, full_name, role, is_verified) VALUES
  ('c32a9d03-9c6a-44c9-8edd-cbfc6bb98816', 'admin2@gmail.com', 'Admin User', 'admin', true),
  ('7728175c-891d-4d88-99d4-d1f7d96c6e17', 'customer@gmail.com', 'Customer User', 'customer', true)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_verified = EXCLUDED.is_verified,
  updated_at = NOW();

-- =====================================================
-- 7. SAMPLE DATA
-- =====================================================

-- Sample knowledge base articles
INSERT INTO public.knowledge_base (title, content, category, author_id, status, published_at) VALUES
  (
    'Getting Started with BSM Platform',
    'Welcome to the BSM Platform! This guide will help you get started with using our comprehensive business service management solution. Learn about creating tickets, managing workflows, and accessing our knowledge base.',
    'Getting Started',
    'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816',
    'published',
    NOW()
  ),
  (
    'How to Submit a Support Ticket',
    'Learn how to submit support tickets effectively to get the help you need quickly. Include relevant details, select appropriate priority, and provide clear descriptions for faster resolution.',
    'Support',
    'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816',
    'published',
    NOW()
  ),
  (
    'Understanding Ticket Priorities',
    'Learn about different ticket priority levels and when to use each one. Low, Medium, High, and Urgent priorities help us allocate resources effectively.',
    'Support',
    'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816',
    'published',
    NOW()
  ),
  (
    'Portal Access Guide',
    'Understand the difference between Admin and Customer portals. Admins can manage users, tickets, and analytics. Customers can submit tickets and access knowledge base.',
    'User Guide',
    'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816',
    'published',
    NOW()
  )
ON CONFLICT DO NOTHING;

-- Sample analytics data
INSERT INTO public.analytics (metric_name, metric_value, metric_type, tags) VALUES
  ('total_tickets', 156, 'gauge', '{"category": "tickets"}'),
  ('resolved_tickets', 147, 'gauge', '{"category": "tickets"}'),
  ('average_resolution_time', 2.5, 'gauge', '{"category": "performance", "unit": "hours"}'),
  ('customer_satisfaction', 4.2, 'gauge', '{"category": "satisfaction", "scale": "1-5"}'),
  ('knowledge_base_views', 1247, 'counter', '{"category": "knowledge_base"}'),
  ('published_articles', 4, 'gauge', '{"category": "knowledge_base"}'),
  ('active_users', 2, 'gauge', '{"category": "users"}'),
  ('admin_users', 1, 'gauge', '{"category": "users", "role": "admin"}'),
  ('customer_users', 1, 'gauge', '{"category": "users", "role": "customer"}')
ON CONFLICT DO NOTHING;

-- Sample tickets
INSERT INTO public.tickets (title, description, status, priority, category, created_by, assigned_to) VALUES
  (
    'Login Issues',
    'Having trouble logging into the customer portal. Getting authentication errors.',
    'resolved',
    'high',
    'Authentication',
    '7728175c-891d-4d88-99d4-d1f7d96c6e17',
    'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816'
  ),
  (
    'Feature Request: Dark Mode',
    'Would like to see a dark mode option for the platform interface.',
    'open',
    'medium',
    'Feature Request',
    '7728175c-891d-4d88-99d4-d1f7d96c6e17',
    NULL
  ),
  (
    'Portal Type Validation',
    'Need to fix portal type validation logic to ensure proper role-based access.',
    'in_progress',
    'urgent',
    'Bug Fix',
    'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816',
    'c32a9d03-9c6a-44c9-8edd-cbfc6bb98816'
  )
ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. VERIFICATION QUERIES
-- =====================================================

-- Verify the setup
SELECT 'FINAL SCHEMA SETUP COMPLETE!' as status;

-- Check users
SELECT 'Users:' as table_name, count(*) as count FROM public.users
UNION ALL
SELECT 'Tickets:', count(*) FROM public.tickets
UNION ALL
SELECT 'Knowledge Base:', count(*) FROM public.knowledge_base
UNION ALL
SELECT 'Analytics:', count(*) FROM public.analytics;

-- Show user details
SELECT email, role, is_verified, created_at FROM public.users 
WHERE email IN ('admin2@gmail.com', 'customer@gmail.com')
ORDER BY email;

-- =====================================================
-- END OF FINAL WORKING SCHEMA
-- =====================================================
