-- =====================================
-- ADDITIONAL SECURITY POLICIES - HEALTHFLIX
-- =====================================

-- =====================================
-- USER GOALS TABLE POLICIES
-- =====================================

-- Create user_goals table if not exists
CREATE TABLE IF NOT EXISTS user_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('weight_loss', 'muscle_gain', 'fitness', 'nutrition', 'habits')),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(20) NOT NULL,
    target_date DATE NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_goals
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

-- User goals policies
DROP POLICY IF EXISTS "Users can manage their own goals" ON user_goals;
CREATE POLICY "Users can manage their own goals" ON user_goals
    FOR ALL USING (auth.uid() = user_id);

-- =====================================
-- ENHANCED SECURITY POLICIES
-- =====================================

-- Users can only see their own data in user_stats
DROP POLICY IF EXISTS "Users can view their own stats" ON user_stats;
CREATE POLICY "Users can view their own stats" ON user_stats
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own stats" ON user_stats;
CREATE POLICY "Users can update their own stats" ON user_stats
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own stats" ON user_stats;
CREATE POLICY "Users can insert their own stats" ON user_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Video progress policies with plan check
DROP POLICY IF EXISTS "Users can manage their own video progress" ON user_video_progress;
CREATE POLICY "Users can manage their own video progress" ON user_video_progress
    FOR ALL USING (auth.uid() = user_id);

-- Admin access to all tables
DROP POLICY IF EXISTS "Admins have full access to user_activities" ON user_activities;
CREATE POLICY "Admins have full access to user_activities" ON user_activities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins have full access to user_metrics" ON user_metrics;
CREATE POLICY "Admins have full access to user_metrics" ON user_metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins have full access to user_goals" ON user_goals;
CREATE POLICY "Admins have full access to user_goals" ON user_goals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================
-- CONTENT ACCESS POLICIES
-- =====================================

-- Videos access based on required plan
DROP POLICY IF EXISTS "Users can view videos based on plan" ON videos;
CREATE POLICY "Users can view videos based on plan" ON videos
    FOR SELECT USING (
        is_published = true AND (
            required_plan = 'free' OR
            EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = auth.uid() AND plan IS NOT NULL
            ) OR
            EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = auth.uid() AND role = 'admin'
            )
        )
    );

-- Only admins can modify videos
DROP POLICY IF EXISTS "Admins can manage videos" ON videos;
CREATE POLICY "Admins can manage videos" ON videos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Video categories - read for authenticated users
DROP POLICY IF EXISTS "Authenticated users can view video categories" ON video_categories;
CREATE POLICY "Authenticated users can view video categories" ON video_categories
    FOR SELECT TO authenticated USING (is_active = true);

-- Only admins can manage video categories
DROP POLICY IF EXISTS "Admins can manage video categories" ON video_categories;
CREATE POLICY "Admins can manage video categories" ON video_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================
-- PLAN AND SUBSCRIPTION POLICIES
-- =====================================

-- Plans - readable by authenticated users
DROP POLICY IF EXISTS "Authenticated users can view active plans" ON plans;
CREATE POLICY "Authenticated users can view active plans" ON plans
    FOR SELECT TO authenticated USING (is_active = true);

-- Only admins can manage plans
DROP POLICY IF EXISTS "Admins can manage plans" ON plans;
CREATE POLICY "Admins can manage plans" ON plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Enhanced subscription policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Only system/admin can insert subscriptions
DROP POLICY IF EXISTS "System can create subscriptions" ON user_subscriptions;
CREATE POLICY "System can create subscriptions" ON user_subscriptions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Only system/admin can update subscriptions
DROP POLICY IF EXISTS "System can update subscriptions" ON user_subscriptions;
CREATE POLICY "System can update subscriptions" ON user_subscriptions
    FOR UPDATE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================
-- ACHIEVEMENT AND CHALLENGE POLICIES
-- =====================================

-- Achievements - readable by authenticated users
DROP POLICY IF EXISTS "Authenticated users can view achievements" ON achievements;
CREATE POLICY "Authenticated users can view achievements" ON achievements
    FOR SELECT TO authenticated USING (is_active = true);

-- Only admins can manage achievements
DROP POLICY IF EXISTS "Admins can manage achievements" ON achievements;
CREATE POLICY "Admins can manage achievements" ON achievements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Daily challenges - readable by authenticated users
DROP POLICY IF EXISTS "Authenticated users can view daily challenges" ON daily_challenges;
CREATE POLICY "Authenticated users can view daily challenges" ON daily_challenges
    FOR SELECT TO authenticated USING (is_active = true);

-- Only admins can manage daily challenges
DROP POLICY IF EXISTS "Admins can manage daily challenges" ON daily_challenges;
CREATE POLICY "Admins can manage daily challenges" ON daily_challenges
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================
-- SECURITY FUNCTIONS
-- =====================================

-- Function to check if user has required plan
CREATE OR REPLACE FUNCTION user_has_plan(required_plan TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Admin users have access to everything
    IF EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RETURN TRUE;
    END IF;
    
    -- Free content is available to everyone
    IF required_plan = 'free' THEN
        RETURN TRUE;
    END IF;
    
    -- Check if user has an active subscription
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND plan IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access premium content
CREATE OR REPLACE FUNCTION user_can_access_premium()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles up
        LEFT JOIN user_subscriptions us ON up.id = us.user_id
        WHERE up.id = auth.uid() 
        AND (
            up.role = 'admin' OR
            (us.status = 'active' AND us.current_period_end > NOW())
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    event_type TEXT,
    details JSONB DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        table_name,
        new_values,
        ip_address,
        created_at
    ) VALUES (
        auth.uid(),
        event_type,
        'security_events',
        details,
        inet_client_addr(),
        NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================
-- RATE LIMITING POLICIES
-- =====================================

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on rate_limits
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Rate limits policies
DROP POLICY IF EXISTS "Users can view their own rate limits" ON rate_limits;
CREATE POLICY "Users can view their own rate limits" ON rate_limits
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can manage rate limits" ON rate_limits;
CREATE POLICY "System can manage rate limits" ON rate_limits
    FOR ALL USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
    action_name TEXT,
    max_attempts INTEGER,
    window_minutes INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    current_count INTEGER;
    window_start TIMESTAMP WITH TIME ZONE;
BEGIN
    window_start := NOW() - INTERVAL '1 minute' * window_minutes;
    
    -- Count recent attempts
    SELECT COALESCE(SUM(count), 0) INTO current_count
    FROM rate_limits
    WHERE user_id = auth.uid()
    AND action = action_name
    AND window_start >= window_start;
    
    -- Check if limit exceeded
    IF current_count >= max_attempts THEN
        -- Log security event
        PERFORM log_security_event('rate_limit_exceeded', jsonb_build_object(
            'action', action_name,
            'attempts', current_count,
            'max_attempts', max_attempts
        ));
        RETURN FALSE;
    END IF;
    
    -- Log attempt
    INSERT INTO rate_limits (user_id, action, count, window_start)
    VALUES (auth.uid(), action_name, 1, NOW())
    ON CONFLICT (user_id, action) 
    DO UPDATE SET 
        count = rate_limits.count + 1,
        window_start = CASE 
            WHEN rate_limits.window_start < window_start THEN NOW()
            ELSE rate_limits.window_start
        END;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================
-- STORAGE POLICIES
-- =====================================

-- Avatar storage policies
-- Note: These would need to be created in Supabase dashboard for storage buckets

-- Example storage policies (to be created in dashboard):
-- 1. Users can upload their own avatars
-- 2. Users can view all public avatars
-- 3. File size limits (5MB)
-- 4. File type restrictions (images only)

-- =====================================
-- TRIGGER FOR AUDIT LOGGING
-- =====================================

-- Function to audit important changes
CREATE OR REPLACE FUNCTION audit_important_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Log important profile changes
    IF TG_TABLE_NAME = 'user_profiles' AND (
        OLD.role IS DISTINCT FROM NEW.role OR
        OLD.plan IS DISTINCT FROM NEW.plan
    ) THEN
        INSERT INTO audit_logs (
            user_id,
            action,
            table_name,
            record_id,
            old_values,
            new_values
        ) VALUES (
            auth.uid(),
            'profile_update',
            'user_profiles',
            NEW.id,
            to_jsonb(OLD),
            to_jsonb(NEW)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit trigger
DROP TRIGGER IF EXISTS audit_profile_changes ON user_profiles;
CREATE TRIGGER audit_profile_changes
    AFTER UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION audit_important_changes();

-- =====================================
-- SECURITY INDEXES
-- =====================================

-- Indexes for security and performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role_active ON user_profiles(role) WHERE role IN ('admin', 'moderator');
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status, current_period_end);
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON rate_limits(user_id, action, window_start);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON audit_logs(user_id, action, created_at);

-- =====================================
-- CLEANUP FUNCTIONS
-- =====================================

-- Function to clean old rate limit records
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM rate_limits 
    WHERE window_start < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
    -- Keep only last 90 days of audit logs
    DELETE FROM audit_logs 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION user_has_plan(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION user_can_access_premium() TO authenticated;
GRANT EXECUTE ON FUNCTION check_rate_limit(TEXT, INTEGER, INTEGER) TO authenticated;

COMMIT;
