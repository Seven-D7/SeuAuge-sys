import { supabase, authOperations, type UserProfile } from '../lib/supabase';
import type { User as SupabaseUser, AuthError } from '@supabase/supabase-js';

// Input sanitization
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>\"']/g, '');
};

// Enhanced password validation
const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'A senha deve ter pelo menos 8 caracteres' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos uma letra maiúscula' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos uma letra minúscula' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos um número' };
  }
  return { isValid: true };
};

// Email validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Age validation
const validateAge = (birthdate: string): boolean => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return age >= 13 && age <= 120;
};

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  birthdate: string;
  weight?: number;
  height?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: SupabaseUser | null;
  error: string | null;
}

class AuthService {
  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Input validation and sanitization
      const { email, password, name, birthdate, weight, height } = data;
      
      if (!email || !password || !name || !birthdate) {
        return { user: null, error: 'Todos os campos obrigatórios devem ser preenchidos' };
      }

      const sanitizedEmail = sanitizeInput(email.toLowerCase());
      const sanitizedName = sanitizeInput(name);

      // Validate email format
      if (!validateEmail(sanitizedEmail)) {
        return { user: null, error: 'Formato de email inválido' };
      }

      // Validate password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return { user: null, error: passwordValidation.message || 'Senha inválida' };
      }

      // Validate name
      if (sanitizedName.length < 2 || sanitizedName.length > 50) {
        return { user: null, error: 'Nome deve ter entre 2 e 50 caracteres' };
      }

      // Validate age
      if (!validateAge(birthdate)) {
        return { user: null, error: 'Data de nascimento inválida' };
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await authOperations.signUp(
        sanitizedEmail,
        password,
        {
          data: {
            name: sanitizedName,
            birthdate,
            role: 'user',
          },
        }
      );

      if (authError) {
        console.error('Registration auth error:', authError);
        if (authError.message.includes('User already registered')) {
          return { user: null, error: 'Este email já está em uso' };
        } else if (authError.message.includes('Password should be at least')) {
          return { user: null, error: 'Senha muito fraca. Use uma senha mais forte' };
        } else if (authError.message.includes('Signups not allowed')) {
          return { user: null, error: 'Registro não permitido. Entre em contato com o suporte' };
        } else {
          return { user: null, error: 'Erro no registro. Tente novamente' };
        }
      }

      if (!authData.user) {
        return { user: null, error: 'Erro ao criar usuário' };
      }

      // Create user profile in database
      const profileData: any = {
        id: authData.user.id,
        email: sanitizedEmail,
        name: sanitizedName,
        birthdate,
        role: 'user',
      };

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert(profileData);

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Don't return error here as auth user is already created
      }

      // Create initial user stats
      const { error: statsError } = await supabase
        .from('user_stats')
        .insert({
          user_id: authData.user.id,
          total_workouts: 0,
          total_minutes_exercised: 0,
          total_calories_burned: 0,
          current_streak: 0,
          longest_streak: 0,
          total_xp: 50, // Welcome bonus
          level: 1,
          achievements_count: 0,
        });

      if (statsError) {
        console.error('Error creating user stats:', statsError);
      }

      // Create initial metrics if provided
      if (weight || height) {
        const metricsData: any = {
          user_id: authData.user.id,
        };
        
        if (weight) metricsData.weight = weight;
        if (height) metricsData.height = height;
        
        // Calculate BMI if both weight and height provided
        if (weight && height) {
          const heightInMeters = height / 100;
          metricsData.bmi = weight / (heightInMeters * heightInMeters);
        }

        const { error: metricsError } = await supabase
          .from('user_metrics')
          .insert(metricsData);

        if (metricsError) {
          console.error('Error creating user metrics:', metricsError);
        }
      }

      return { user: authData.user, error: null };

    } catch (error: any) {
      console.error('Registration service error:', error);
      return { user: null, error: 'Erro interno. Tente novamente mais tarde' };
    }
  }

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const { email, password } = data;

      if (!email || !password) {
        return { user: null, error: 'Email e senha são obrigatórios' };
      }

      const sanitizedEmail = sanitizeInput(email.toLowerCase());

      // Validate email format
      if (!validateEmail(sanitizedEmail)) {
        return { user: null, error: 'Formato de email inválido' };
      }

      // Attempt login
      const { data: authData, error: authError } = await authOperations.signInWithPassword(
        sanitizedEmail,
        password
      );

      if (authError) {
        console.error('Login error:', authError);
        if (authError.message.includes('Invalid login credentials')) {
          return { user: null, error: 'Credenciais inválidas' };
        } else if (authError.message.includes('Too many requests')) {
          return { user: null, error: 'Muitas tentativas de login. Tente novamente mais tarde' };
        } else if (authError.message.includes('Email not confirmed')) {
          return { user: null, error: 'Email não confirmado. Verifique sua caixa de entrada' };
        } else {
          return { user: null, error: 'Falha na autenticação' };
        }
      }

      if (!authData.user) {
        return { user: null, error: 'Erro no login' };
      }

      // Log daily activity for login streak
      try {
        await this.logDailyActivity(authData.user.id, 'login');
      } catch (error) {
        console.error('Error logging daily activity:', error);
        // Don't fail login for this
      }

      return { user: authData.user, error: null };

    } catch (error: any) {
      console.error('Login service error:', error);
      return { user: null, error: 'Erro interno. Tente novamente mais tarde' };
    }
  }

  // Logout user
  async logout(): Promise<{ error: string | null }> {
    try {
      const { error } = await authOperations.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        return { error: 'Erro ao fazer logout' };
      }

      return { error: null };

    } catch (error: any) {
      console.error('Logout service error:', error);
      return { error: 'Erro interno. Tente novamente mais tarde' };
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const sanitizedEmail = sanitizeInput(email.toLowerCase());

      if (!validateEmail(sanitizedEmail)) {
        return { error: 'Formato de email inválido' };
      }

      const { error } = await authOperations.resetPasswordForEmail(sanitizedEmail);

      if (error) {
        console.error('Reset password error:', error);
        return { error: 'Erro ao enviar email de recuperação' };
      }

      return { error: null };

    } catch (error: any) {
      console.error('Reset password service error:', error);
      return { error: 'Erro interno. Tente novamente mais tarde' };
    }
  }

  // Update password
  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      // Validate new password
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return { error: passwordValidation.message || 'Senha inválida' };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Update password error:', error);
        return { error: 'Erro ao atualizar senha' };
      }

      return { error: null };

    } catch (error: any) {
      console.error('Update password service error:', error);
      return { error: 'Erro interno. Tente novamente mais tarde' };
    }
  }

  // Update email
  async updateEmail(newEmail: string): Promise<{ error: string | null }> {
    try {
      const sanitizedEmail = sanitizeInput(newEmail.toLowerCase());

      if (!validateEmail(sanitizedEmail)) {
        return { error: 'Formato de email inválido' };
      }

      const { error } = await supabase.auth.updateUser({
        email: sanitizedEmail
      });

      if (error) {
        console.error('Update email error:', error);
        if (error.message.includes('already in use')) {
          return { error: 'Este email já está em uso' };
        }
        return { error: 'Erro ao atualizar email' };
      }

      return { error: null };

    } catch (error: any) {
      console.error('Update email service error:', error);
      return { error: 'Erro interno. Tente novamente mais tarde' };
    }
  }

  // Get current user session
  async getCurrentUser(): Promise<{ user: SupabaseUser | null; error: string | null }> {
    try {
      const { data: { user }, error } = await authOperations.getUser();

      if (error) {
        console.error('Get current user error:', error);
        return { user: null, error: 'Erro ao obter usuário atual' };
      }

      return { user, error: null };

    } catch (error: any) {
      console.error('Get current user service error:', error);
      return { user: null, error: 'Erro interno. Tente novamente mais tarde' };
    }
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<{ profile: UserProfile | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Get user profile error:', error);
        return { profile: null, error: 'Erro ao obter perfil do usuário' };
      }

      return { profile: data, error: null };

    } catch (error: any) {
      console.error('Get user profile service error:', error);
      return { profile: null, error: 'Erro interno. Tente novamente mais tarde' };
    }
  }

  // Log daily activity for streak tracking
  private async logDailyActivity(userId: string, activityType: string): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0]; // Get date in YYYY-MM-DD format

      // Check if already logged today
      const { data: existingActivity } = await supabase
        .from('user_activities')
        .select('id')
        .eq('user_id', userId)
        .eq('activity_type', activityType)
        .gte('completed_at', `${today}T00:00:00`)
        .lt('completed_at', `${today}T23:59:59`)
        .single();

      if (existingActivity) {
        return; // Already logged today
      }

      // Log the activity
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: userId,
          activity_type: activityType,
          title: 'Login diário',
          description: 'Usuário fez login',
          duration_minutes: 0,
        });

      if (error) {
        console.error('Error logging daily activity:', error);
      }

    } catch (error) {
      console.error('Log daily activity error:', error);
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
