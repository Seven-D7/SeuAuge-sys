import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authService } from '../services/auth';
import { supabase } from '../lib/supabase';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      updateUser: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
    })),
  },
  authOperations: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    resetPasswordForEmail: vi.fn(),
  },
}));

describe('Authentication Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User',
          birthdate: '1990-01-01',
        },
      };

      const mockAuthResponse = {
        data: { user: mockUser },
        error: null,
      };

      const mockSupabaseInsert = {
        error: null,
      };

      // Mock Supabase auth.signUp
      vi.mocked(supabase.auth.signUp).mockResolvedValue(mockAuthResponse);
      
      // Mock database inserts
      const mockFromChain = {
        insert: vi.fn().mockReturnValue({ error: null }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockFromChain as any);

      const registrationData = {
        email: 'test@example.com',
        password: 'TestPassword123',
        name: 'Test User',
        birthdate: '1990-01-01',
        weight: 70,
        height: 175,
      };

      const result = await authService.register(registrationData);

      expect(result.error).toBeNull();
      expect(result.user).toEqual(mockUser);
      expect(supabase.auth.signUp).toHaveBeenCalledWith(
        'test@example.com',
        'TestPassword123',
        {
          data: {
            name: 'Test User',
            birthdate: '1990-01-01',
            role: 'user',
          },
        }
      );
    });

    it('should reject registration with invalid email', async () => {
      const registrationData = {
        email: 'invalid-email',
        password: 'TestPassword123',
        name: 'Test User',
        birthdate: '1990-01-01',
      };

      const result = await authService.register(registrationData);

      expect(result.error).toBe('Formato de email inválido');
      expect(result.user).toBeNull();
      expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });

    it('should reject registration with weak password', async () => {
      const registrationData = {
        email: 'test@example.com',
        password: 'weak',
        name: 'Test User',
        birthdate: '1990-01-01',
      };

      const result = await authService.register(registrationData);

      expect(result.error).toContain('senha');
      expect(result.user).toBeNull();
      expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });

    it('should reject registration with invalid age', async () => {
      const registrationData = {
        email: 'test@example.com',
        password: 'TestPassword123',
        name: 'Test User',
        birthdate: '2020-01-01', // Too young
      };

      const result = await authService.register(registrationData);

      expect(result.error).toBe('Data de nascimento inválida');
      expect(result.user).toBeNull();
      expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });

    it('should handle existing user error', async () => {
      const mockAuthResponse = {
        data: { user: null },
        error: { message: 'User already registered' },
      };

      vi.mocked(supabase.auth.signUp).mockResolvedValue(mockAuthResponse);

      const registrationData = {
        email: 'existing@example.com',
        password: 'TestPassword123',
        name: 'Test User',
        birthdate: '1990-01-01',
      };

      const result = await authService.register(registrationData);

      expect(result.error).toBe('Este email já está em uso');
      expect(result.user).toBeNull();
    });
  });

  describe('User Login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
      };

      const mockAuthResponse = {
        data: { user: mockUser },
        error: null,
      };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(mockAuthResponse);

      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123',
      };

      const result = await authService.login(loginData);

      expect(result.error).toBeNull();
      expect(result.user).toEqual(mockUser);
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith(
        'test@example.com',
        'TestPassword123'
      );
    });

    it('should reject login with invalid email format', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'TestPassword123',
      };

      const result = await authService.login(loginData);

      expect(result.error).toBe('Formato de email inválido');
      expect(result.user).toBeNull();
      expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
    });

    it('should reject login with empty fields', async () => {
      const loginData = {
        email: '',
        password: '',
      };

      const result = await authService.login(loginData);

      expect(result.error).toBe('Email e senha são obrigatórios');
      expect(result.user).toBeNull();
      expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
    });

    it('should handle invalid credentials error', async () => {
      const mockAuthResponse = {
        data: { user: null },
        error: { message: 'Invalid login credentials' },
      };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(mockAuthResponse);

      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const result = await authService.login(loginData);

      expect(result.error).toBe('Credenciais inválidas');
      expect(result.user).toBeNull();
    });

    it('should handle too many requests error', async () => {
      const mockAuthResponse = {
        data: { user: null },
        error: { message: 'Too many requests' },
      };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(mockAuthResponse);

      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123',
      };

      const result = await authService.login(loginData);

      expect(result.error).toBe('Muitas tentativas de login. Tente novamente mais tarde');
      expect(result.user).toBeNull();
    });
  });

  describe('User Logout', () => {
    it('should logout user successfully', async () => {
      const mockAuthResponse = {
        error: null,
      };

      vi.mocked(supabase.auth.signOut).mockResolvedValue(mockAuthResponse);

      const result = await authService.logout();

      expect(result.error).toBeNull();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle logout error', async () => {
      const mockAuthResponse = {
        error: { message: 'Logout failed' },
      };

      vi.mocked(supabase.auth.signOut).mockResolvedValue(mockAuthResponse);

      const result = await authService.logout();

      expect(result.error).toBe('Erro ao fazer logout');
    });
  });

  describe('Password Reset', () => {
    it('should send password reset email successfully', async () => {
      const mockAuthResponse = {
        error: null,
      };

      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue(mockAuthResponse);

      const result = await authService.resetPassword('test@example.com');

      expect(result.error).toBeNull();
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should reject invalid email for password reset', async () => {
      const result = await authService.resetPassword('invalid-email');

      expect(result.error).toBe('Formato de email inválido');
      expect(supabase.auth.resetPasswordForEmail).not.toHaveBeenCalled();
    });

    it('should handle password reset error', async () => {
      const mockAuthResponse = {
        error: { message: 'User not found' },
      };

      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue(mockAuthResponse);

      const result = await authService.resetPassword('notfound@example.com');

      expect(result.error).toBe('Erro ao enviar email de recuperação');
    });
  });

  describe('Password Update', () => {
    it('should update password successfully', async () => {
      const mockAuthResponse = {
        error: null,
      };

      vi.mocked(supabase.auth.updateUser).mockResolvedValue(mockAuthResponse);

      const result = await authService.updatePassword('NewPassword123');

      expect(result.error).toBeNull();
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'NewPassword123'
      });
    });

    it('should reject weak password update', async () => {
      const result = await authService.updatePassword('weak');

      expect(result.error).toContain('senha');
      expect(supabase.auth.updateUser).not.toHaveBeenCalled();
    });
  });

  describe('Email Update', () => {
    it('should update email successfully', async () => {
      const mockAuthResponse = {
        error: null,
      };

      vi.mocked(supabase.auth.updateUser).mockResolvedValue(mockAuthResponse);

      const result = await authService.updateEmail('newemail@example.com');

      expect(result.error).toBeNull();
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        email: 'newemail@example.com'
      });
    });

    it('should reject invalid email update', async () => {
      const result = await authService.updateEmail('invalid-email');

      expect(result.error).toBe('Formato de email inválido');
      expect(supabase.auth.updateUser).not.toHaveBeenCalled();
    });

    it('should handle email already in use error', async () => {
      const mockAuthResponse = {
        error: { message: 'Email already in use' },
      };

      vi.mocked(supabase.auth.updateUser).mockResolvedValue(mockAuthResponse);

      const result = await authService.updateEmail('existing@example.com');

      expect(result.error).toBe('Este email já está em uso');
    });
  });

  describe('Get Current User', () => {
    it('should get current user successfully', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
      };

      const mockAuthResponse = {
        data: { user: mockUser },
        error: null,
      };

      vi.mocked(supabase.auth.getUser).mockResolvedValue(mockAuthResponse);

      const result = await authService.getCurrentUser();

      expect(result.error).toBeNull();
      expect(result.user).toEqual(mockUser);
    });

    it('should handle no user error', async () => {
      const mockAuthResponse = {
        data: { user: null },
        error: { message: 'No user found' },
      };

      vi.mocked(supabase.auth.getUser).mockResolvedValue(mockAuthResponse);

      const result = await authService.getCurrentUser();

      expect(result.error).toBe('Erro ao obter usuário atual');
      expect(result.user).toBeNull();
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize malicious input in registration', async () => {
      const registrationData = {
        email: 'test@example.com',
        password: 'TestPassword123',
        name: '<script>alert("xss")</script>Test User',
        birthdate: '1990-01-01',
      };

      const result = await authService.register(registrationData);

      // Should sanitize the name but may still fail validation
      expect(supabase.auth.signUp).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({
          data: expect.objectContaining({
            name: '<script>alert("xss")</script>Test User'
          })
        })
      );
    });

    it('should trim whitespace from email', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
      };

      const mockAuthResponse = {
        data: { user: mockUser },
        error: null,
      };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(mockAuthResponse);

      const loginData = {
        email: '  test@example.com  ',
        password: 'TestPassword123',
      };

      const result = await authService.login(loginData);

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith(
        'test@example.com',
        'TestPassword123'
      );
    });
  });
});
