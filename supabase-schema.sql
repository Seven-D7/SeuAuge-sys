-- =====================================
-- SUPABASE SCHEMA COMPLETO - HEALTHFLIX
-- =====================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================
-- USERS & AUTHENTICATION
-- =====================================

-- User profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    birthdate DATE,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    plan VARCHAR(50),
    subscription_status VARCHAR(20) DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'canceled', 'past_due')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User metrics (body measurements, health data)
CREATE TABLE IF NOT EXISTS user_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    body_fat_percentage DECIMAL(4,2),
    muscle_mass DECIMAL(5,2),
    bmi DECIMAL(4,2),
    waist_circumference DECIMAL(5,2),
    hip_circumference DECIMAL(5,2),
    neck_circumference DECIMAL(5,2),
    chest_circumference DECIMAL(5,2),
    arm_circumference DECIMAL(5,2),
    thigh_circumference DECIMAL(5,2),
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activities (workout logs, nutrition logs)
CREATE TABLE IF NOT EXISTS user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('workout', 'nutrition', 'meditation', 'sleep', 'water', 'steps', 'reading', 'challenge')),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    calories_burned INTEGER,
    intensity VARCHAR(20) CHECK (intensity IN ('low', 'moderate', 'high', 'very_high')),
    metadata JSONB DEFAULT '{}',
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User stats (aggregated statistics)
CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_workouts INTEGER DEFAULT 0,
    total_minutes_exercised INTEGER DEFAULT 0,
    total_calories_burned INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    achievements_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================
-- GAMIFICATION SYSTEM
-- =====================================

-- Achievements definitions
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) DEFAULT '🏆',
    category VARCHAR(50) NOT NULL CHECK (category IN ('workout', 'nutrition', 'streak', 'social', 'challenge', 'milestone')),
    condition_type VARCHAR(50) NOT NULL CHECK (condition_type IN ('count', 'streak', 'total', 'percentage', 'specific')),
    condition_value INTEGER NOT NULL,
    xp_reward INTEGER DEFAULT 0,
    rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements (unlocked achievements)
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Daily challenges
CREATE TABLE IF NOT EXISTS daily_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    target_value INTEGER NOT NULL,
    xp_reward INTEGER DEFAULT 10,
    difficulty VARCHAR(20) DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User challenge progress
CREATE TABLE IF NOT EXISTS user_challenge_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE,
    current_value INTEGER DEFAULT 0,
    target_value INTEGER NOT NULL,
    completed BOOLEAN DEFAULT false,
    date DATE DEFAULT CURRENT_DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, challenge_id, date)
);

-- =====================================
-- CONTENT & MEDIA
-- =====================================

-- Video categories
CREATE TABLE IF NOT EXISTS video_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    video_url TEXT NOT NULL,
    duration_seconds INTEGER,
    category_id UUID REFERENCES video_categories(id),
    instructor_name VARCHAR(100),
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    required_plan VARCHAR(50) DEFAULT 'free',
    tags TEXT[] DEFAULT '{}',
    view_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User video progress
CREATE TABLE IF NOT EXISTS user_video_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    progress_seconds INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, video_id)
);

-- User favorites (videos, workouts, etc.)
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('video', 'workout', 'recipe', 'article')),
    item_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- =====================================
-- PLANS & SUBSCRIPTIONS
-- =====================================

-- Plans
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    stripe_subscription_id VARCHAR(100) UNIQUE,
    stripe_customer_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================
-- SYSTEM TABLES
-- =====================================

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'achievement')),
    read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================
-- INDEXES FOR PERFORMANCE
-- =====================================

-- User profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- User metrics
CREATE INDEX IF NOT EXISTS idx_user_metrics_user_id ON user_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_metrics_measured_at ON user_metrics(measured_at);

-- User activities
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_date ON user_activities(completed_at);

-- User achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked_at ON user_achievements(unlocked_at);

-- Videos
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category_id);
CREATE INDEX IF NOT EXISTS idx_videos_published ON videos(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_videos_plan ON videos(required_plan);

-- User video progress
CREATE INDEX IF NOT EXISTS idx_user_video_progress_user_id ON user_video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_video_progress_completed ON user_video_progress(completed);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- =====================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- User profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- User metrics policies
DROP POLICY IF EXISTS "Users can manage their own metrics" ON user_metrics;
CREATE POLICY "Users can manage their own metrics" ON user_metrics
    FOR ALL USING (auth.uid() = user_id);

-- User activities policies
DROP POLICY IF EXISTS "Users can manage their own activities" ON user_activities;
CREATE POLICY "Users can manage their own activities" ON user_activities
    FOR ALL USING (auth.uid() = user_id);

-- User stats policies
DROP POLICY IF EXISTS "Users can view their own stats" ON user_stats;
CREATE POLICY "Users can view their own stats" ON user_stats
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can update user stats" ON user_stats;
CREATE POLICY "System can update user stats" ON user_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can modify user stats" ON user_stats;
CREATE POLICY "System can modify user stats" ON user_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- User achievements policies
DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert user achievements" ON user_achievements;
CREATE POLICY "System can insert user achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Challenge progress policies
DROP POLICY IF EXISTS "Users can manage their own challenge progress" ON user_challenge_progress;
CREATE POLICY "Users can manage their own challenge progress" ON user_challenge_progress
    FOR ALL USING (auth.uid() = user_id);

-- Video progress policies
DROP POLICY IF EXISTS "Users can manage their own video progress" ON user_video_progress;
CREATE POLICY "Users can manage their own video progress" ON user_video_progress
    FOR ALL USING (auth.uid() = user_id);

-- Favorites policies
DROP POLICY IF EXISTS "Users can manage their own favorites" ON user_favorites;
CREATE POLICY "Users can manage their own favorites" ON user_favorites
    FOR ALL USING (auth.uid() = user_id);

-- Subscriptions policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage subscriptions" ON user_subscriptions;
CREATE POLICY "Admins can manage subscriptions" ON user_subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Audit logs policies (admin only)
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Public tables (no RLS needed for read-only content)
-- These tables are readable by authenticated users
-- achievements, daily_challenges, video_categories, videos, plans

-- Grant permissions for public tables
GRANT SELECT ON achievements TO authenticated;
GRANT SELECT ON daily_challenges TO authenticated;
GRANT SELECT ON video_categories TO authenticated;
GRANT SELECT ON videos TO authenticated;
GRANT SELECT ON plans TO authenticated;

-- =====================================
-- FUNCTIONS AND TRIGGERS
-- =====================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment video views
CREATE OR REPLACE FUNCTION increment_video_views(video_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE videos 
    SET view_count = view_count + 1 
    WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to award achievement
CREATE OR REPLACE FUNCTION award_achievement(p_user_id UUID, p_achievement_id UUID)
RETURNS boolean AS $$
DECLARE
    achievement_exists boolean;
    already_awarded boolean;
BEGIN
    -- Check if achievement exists
    SELECT EXISTS(SELECT 1 FROM achievements WHERE id = p_achievement_id) INTO achievement_exists;
    
    IF NOT achievement_exists THEN
        RETURN false;
    END IF;
    
    -- Check if already awarded
    SELECT EXISTS(
        SELECT 1 FROM user_achievements 
        WHERE user_id = p_user_id AND achievement_id = p_achievement_id
    ) INTO already_awarded;
    
    IF already_awarded THEN
        RETURN false;
    END IF;
    
    -- Award achievement
    INSERT INTO user_achievements (user_id, achievement_id) 
    VALUES (p_user_id, p_achievement_id);
    
    -- Update achievement count in user stats
    INSERT INTO user_stats (user_id, achievements_count) 
    VALUES (p_user_id, 1)
    ON CONFLICT (user_id) 
    DO UPDATE SET achievements_count = user_stats.achievements_count + 1;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================
-- INITIAL DATA
-- =====================================

-- Insert default achievements
INSERT INTO achievements (name, description, icon, category, condition_type, condition_value, xp_reward, rarity) VALUES
('Primeiro Treino', 'Complete seu primeiro treino', '🎯', 'workout', 'count', 1, 50, 'common'),
('Guerreiro Semanal', 'Complete 7 treinos em uma semana', '⚡', 'workout', 'count', 7, 100, 'rare'),
('Maratonista', 'Complete 30 treinos em um mês', '🏃‍♂️', 'workout', 'count', 30, 250, 'epic'),
('Sequência de Ferro', 'Mantenha uma sequência de 7 dias', '🔥', 'streak', 'streak', 7, 100, 'rare'),
('Lenda Viva', 'Mantenha uma sequência de 30 dias', '👑', 'streak', 'streak', 30, 500, 'legendary'),
('Explorador', 'Assista a 10 vídeos diferentes', '🎬', 'social', 'count', 10, 75, 'common'),
('Mestre dos Desafios', 'Complete 50 desafios diários', '🏆', 'challenge', 'count', 50, 300, 'epic')
ON CONFLICT DO NOTHING;

-- Insert default daily challenges
INSERT INTO daily_challenges (name, description, category, target_value, xp_reward, difficulty) VALUES
('Hidratação Diária', 'Beba 8 copos de água hoje', 'nutrition', 8, 10, 'easy'),
('Passos Ativos', 'Caminhe 5000 passos hoje', 'workout', 5000, 15, 'medium'),
('Momento Zen', 'Medite por 10 minutos', 'mindfulness', 10, 20, 'easy'),
('Força Interior', 'Complete um treino de força', 'workout', 1, 25, 'medium'),
('Flexibilidade', 'Faça 15 minutos de alongamento', 'workout', 15, 15, 'easy'),
('Cardio Power', 'Faça 30 minutos de cardio', 'workout', 30, 30, 'hard'),
('Alimentação Consciente', 'Registre todas as refeições', 'nutrition', 3, 20, 'medium')
ON CONFLICT DO NOTHING;

-- Insert video categories
INSERT INTO video_categories (name, description, icon, color, sort_order) VALUES
('Emagrecimento', 'Treinos focados em perda de peso', '🔥', '#ef4444', 1),
('Ganho de Massa', 'Treinos para ganho de massa muscular', '💪', '#10b981', 2),
('Flexibilidade', 'Alongamentos e mobilidade', '🧘‍♀️', '#6366f1', 3),
('Cardio', 'Exercícios cardiovasculares', '❤️', '#f59e0b', 4),
('Força', 'Treinos de força e resistência', '⚡', '#8b5cf6', 5),
('Yoga', 'Práticas de yoga e mindfulness', '🕉️', '#06b6d4', 6),
('HIIT', 'Treinos intervalados de alta intensidade', '🏃‍♂️', '#dc2626', 7),
('Pilates', 'Exercícios de pilates', '🤸‍♀️', '#059669', 8)
ON CONFLICT DO NOTHING;

-- Insert default plans
INSERT INTO plans (name, description, price_monthly, price_yearly, features, sort_order) VALUES
('Básico', 'Acesso aos treinos básicos', 0.00, 0.00, '["Treinos básicos", "Vídeos introdutórios", "Suporte por email"]', 1),
('Premium', 'Acesso completo a todos os recursos', 29.90, 299.00, '["Todos os treinos", "Planos personalizados", "Acompanhamento nutricional", "Suporte prioritário", "Relatórios detalhados"]', 2),
('Pro', 'Para atletas e profissionais', 59.90, 599.00, '["Tudo do Premium", "Consultoria individual", "Planos avançados", "Acesso antecipado", "Suporte 24/7"]', 3)
ON CONFLICT DO NOTHING;

-- =====================================
-- STORAGE BUCKETS AND POLICIES
-- =====================================

-- Create storage buckets (run this in Supabase dashboard if not exists)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);

-- Create storage policies
-- Storage policies need to be created in Supabase dashboard or via SQL in the dashboard

COMMIT;
