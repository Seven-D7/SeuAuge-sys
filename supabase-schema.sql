-- ==================================================
-- SUPABASE DATABASE SCHEMA
-- ==================================================
-- Este arquivo contém o schema necessário para o projeto
-- Execute no SQL Editor do Supabase Dashboard

-- ==================================================
-- 1. USER PROFILES TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  plan VARCHAR(10),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  birthdate DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ==================================================
-- 2. PLANS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS plans (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price_cents INTEGER NOT NULL,
  price_display VARCHAR(20) NOT NULL,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- All users can view active plans
CREATE POLICY "Users can view active plans" ON plans FOR SELECT USING (is_active = true);

-- Insert default plans
INSERT INTO plans (id, name, price_cents, price_display, features) VALUES
  ('B', 'Base', 9700, 'R$ 97', '["Acesso completo a vídeos", "Suporte básico"]'),
  ('C', 'Escalada', 24900, 'R$ 249', '["Acesso premium", "Apps exclusivos", "Suporte prioritário"]'),
  ('D', 'Auge', 78000, 'R$ 780', '["Acesso total", "Conteúdo exclusivo", "Consultoria personalizada", "Suporte VIP"]')
ON CONFLICT (id) DO NOTHING;

-- ==================================================
-- 3. USER SUBSCRIPTIONS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  plan_id VARCHAR(10) REFERENCES plans(id) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);

-- ==================================================
-- 4. USER METRICS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS user_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  body_fat DECIMAL(5,2),
  muscle_mass DECIMAL(5,2),
  water_percentage DECIMAL(5,2),
  bone_mass DECIMAL(5,2),
  metabolic_age INTEGER,
  visceral_fat INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;

-- Users can manage their own metrics
CREATE POLICY "Users can manage own metrics" ON user_metrics FOR ALL USING (auth.uid() = user_id);

-- ==================================================
-- 5. USER ACTIVITIES TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS user_activities (
  id VARCHAR(100) PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('login', 'workout_completed', 'video_watched', 'goal_completed', 'challenge_completed')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Users can manage their own activities
CREATE POLICY "Users can manage own activities" ON user_activities FOR ALL USING (auth.uid() = user_id);

-- ==================================================
-- 6. USER STATS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE NOT NULL,
  total_activities INTEGER DEFAULT 0,
  total_workouts INTEGER DEFAULT 0,
  total_videos_watched INTEGER DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own stats
CREATE POLICY "Users can manage own stats" ON user_stats FOR ALL USING (auth.uid() = user_id);

-- ==================================================
-- 7. USER GAMIFICATION DATA TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS user_gamification_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_gamification_data ENABLE ROW LEVEL SECURITY;

-- Users can manage their own gamification data
CREATE POLICY "Users can manage own gamification data" ON user_gamification_data FOR ALL USING (auth.uid() = user_id);

-- ==================================================
-- 8. AUDIT LOGS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  target_user UUID REFERENCES auth.users ON DELETE SET NULL,
  old_role VARCHAR(20),
  new_role VARCHAR(20),
  performed_by UUID REFERENCES auth.users ON DELETE SET NULL NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ==================================================
-- 6. STORAGE BUCKETS
-- ==================================================

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for avatars bucket
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (
  bucket_id = 'avatars'
);

-- ==================================================
-- 7. FUNCTIONS AND TRIGGERS
-- ==================================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_plans_updated_at ON plans;
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_metrics_updated_at ON user_metrics;
CREATE TRIGGER update_user_metrics_updated_at
  BEFORE UPDATE ON user_metrics
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_stats_updated_at ON user_stats;
CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_gamification_data_updated_at ON user_gamification_data;
CREATE TRIGGER update_user_gamification_data_updated_at
  BEFORE UPDATE ON user_gamification_data
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- ==================================================
-- 8. INDEXES FOR PERFORMANCE
-- ==================================================

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_metrics_user_id ON user_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_timestamp ON user_activities(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_gamification_data_user_id ON user_gamification_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_gamification_data_last_sync ON user_gamification_data(last_sync_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_performed_by ON audit_logs(performed_by);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ==================================================
-- SETUP COMPLETE
-- ==================================================
-- 
-- PRÓXIMOS PASSOS:
-- 1. Configure as variáveis de ambiente no seu projeto:
--    VITE_SUPABASE_URL=https://seu-projeto.supabase.co
--    VITE_SUPABASE_ANON_KEY=sua-chave-anon
-- 
-- 2. Configure o Storage no Supabase Dashboard:
--    - Vá para Storage > Settings
--    - Configure as policies de upload conforme necessário
-- 
-- 3. Configure Authentication:
--    - Vá para Authentication > Settings
--    - Configure providers de email/senha
--    - Configure templates de email
-- 
-- 4. Teste a aplicação em modo desenvolvimento
-- 
-- ==================================================
