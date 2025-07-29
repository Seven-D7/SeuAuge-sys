// Security configuration and utilities

export const SECURITY_CONFIG = {
  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: false, // Optional for better UX
    MAX_LENGTH: 128,
  },
  
  // File upload restrictions
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
    MAX_FILENAME_LENGTH: 255,
  },
  
  // Input validation
  INPUT: {
    MAX_NAME_LENGTH: 50,
    MIN_NAME_LENGTH: 2,
    MAX_BIO_LENGTH: 500,
    MAX_COMMENT_LENGTH: 1000,
  },
  
  // Rate limiting (frontend hints - real limiting should be server-side)
  RATE_LIMITS: {
    LOGIN_ATTEMPTS: 5,
    PASSWORD_RESET_ATTEMPTS: 3,
    FORM_SUBMISSIONS_PER_MINUTE: 10,
  },
  
  // Session security
  SESSION: {
    IDLE_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
    MAX_SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  },
} as const;

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>\"'&]/g, (match) => {
      const entityMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return entityMap[match] || match;
    });
};

// HTML sanitization for rich text (basic implementation)
export const sanitizeHTML = (html: string): string => {
  // In production, use a proper HTML sanitization library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
};

// Password strength validation
export const validatePassword = (password: string): { 
  isValid: boolean; 
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
} => {
  const errors: string[] = [];
  
  if (password.length < SECURITY_CONFIG.PASSWORD.MIN_LENGTH) {
    errors.push(`Senha deve ter pelo menos ${SECURITY_CONFIG.PASSWORD.MIN_LENGTH} caracteres`);
  }
  
  if (password.length > SECURITY_CONFIG.PASSWORD.MAX_LENGTH) {
    errors.push(`Senha deve ter no máximo ${SECURITY_CONFIG.PASSWORD.MAX_LENGTH} caracteres`);
  }
  
  if (SECURITY_CONFIG.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (SECURITY_CONFIG.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }
  
  if (SECURITY_CONFIG.PASSWORD.REQUIRE_NUMBER && !/[0-9]/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  if (SECURITY_CONFIG.PASSWORD.REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial');
  }
  
  // Calculate strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  if (password.length >= 16) score++;
  
  if (score >= 5) strength = 'strong';
  else if (score >= 3) strength = 'medium';
  
  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

// File validation
export const validateFile = (file: File, type: 'image' | 'video' = 'image'): { 
  isValid: boolean; 
  error?: string 
} => {
  const config = SECURITY_CONFIG.UPLOAD;
  
  // Size check
  if (file.size > config.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Arquivo muito grande. Máximo ${Math.round(config.MAX_FILE_SIZE / 1024 / 1024)}MB`
    };
  }
  
  // Type check
  const allowedTypes = type === 'image' ? config.ALLOWED_IMAGE_TYPES : config.ALLOWED_VIDEO_TYPES;
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de arquivo não permitido. Permitidos: ${allowedTypes.join(', ')}`
    };
  }
  
  // Filename length check
  if (file.name.length > config.MAX_FILENAME_LENGTH) {
    return {
      isValid: false,
      error: `Nome do arquivo muito longo. Máximo ${config.MAX_FILENAME_LENGTH} caracteres`
    };
  }
  
  return { isValid: true };
};

// User input validation
export const validateUserInput = {
  name: (name: string): { isValid: boolean; error?: string } => {
    const sanitized = sanitizeInput(name);
    if (sanitized.length < SECURITY_CONFIG.INPUT.MIN_NAME_LENGTH) {
      return { isValid: false, error: `Nome deve ter pelo menos ${SECURITY_CONFIG.INPUT.MIN_NAME_LENGTH} caracteres` };
    }
    if (sanitized.length > SECURITY_CONFIG.INPUT.MAX_NAME_LENGTH) {
      return { isValid: false, error: `Nome deve ter no máximo ${SECURITY_CONFIG.INPUT.MAX_NAME_LENGTH} caracteres` };
    }
    return { isValid: true };
  },
  
  bio: (bio: string): { isValid: boolean; error?: string } => {
    const sanitized = sanitizeInput(bio);
    if (sanitized.length > SECURITY_CONFIG.INPUT.MAX_BIO_LENGTH) {
      return { isValid: false, error: `Bio deve ter no máximo ${SECURITY_CONFIG.INPUT.MAX_BIO_LENGTH} caracteres` };
    }
    return { isValid: true };
  },
  
  comment: (comment: string): { isValid: boolean; error?: string } => {
    const sanitized = sanitizeInput(comment);
    if (sanitized.length > SECURITY_CONFIG.INPUT.MAX_COMMENT_LENGTH) {
      return { isValid: false, error: `Comentário deve ter no máximo ${SECURITY_CONFIG.INPUT.MAX_COMMENT_LENGTH} caracteres` };
    }
    return { isValid: true };
  },
};

// Rate limiting helper (client-side tracking)
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  checkLimit(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Clean old attempts
    const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return true; // Within limit
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// Content Security Policy helpers
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'img-src': ["'self'", 'data:', 'https:'],
  'connect-src': ["'self'", 'https://api.stripe.com', 'https://*.firebase.com'],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
} as const;

// Security headers that should be set by the server
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const;

// Environment validation
export const validateEnvironment = (): { isValid: boolean; warnings: string[] } => {
  const warnings: string[] = [];
  
  // Check for demo mode in production
  if (import.meta.env.PROD && import.meta.env.VITE_DEV_MODE === 'true') {
    warnings.push('Demo mode is enabled in production');
  }
  
  // Check for default admin email
  if (import.meta.env.VITE_ADMIN_EMAIL === 'admin@seuauge.com') {
    warnings.push('Using default admin email - should be changed in production');
  }
  
  // Check for missing environment variables in production
  if (import.meta.env.PROD) {
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
    ];
    
    for (const varName of requiredVars) {
      if (!import.meta.env[varName] || import.meta.env[varName].includes('demo')) {
        warnings.push(`Missing or demo value for ${varName}`);
      }
    }
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
  };
};

// Session timeout handler
let sessionTimeout: NodeJS.Timeout | null = null;
let sessionStartTime: number | null = null;

export const initializeSessionTimeout = (onTimeout: () => void): void => {
  sessionStartTime = Date.now();
  
  const resetTimeout = () => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }
    
    sessionTimeout = setTimeout(() => {
      onTimeout();
    }, SECURITY_CONFIG.SESSION.IDLE_TIMEOUT);
  };
  
  // Reset timeout on user activity
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  events.forEach(event => {
    document.addEventListener(event, resetTimeout, true);
  });
  
  // Initial timeout
  resetTimeout();
  
  // Check for maximum session duration
  setTimeout(() => {
    if (sessionStartTime && Date.now() - sessionStartTime > SECURITY_CONFIG.SESSION.MAX_SESSION_DURATION) {
      onTimeout();
    }
  }, SECURITY_CONFIG.SESSION.MAX_SESSION_DURATION);
};

export const clearSessionTimeout = (): void => {
  if (sessionTimeout) {
    clearTimeout(sessionTimeout);
    sessionTimeout = null;
  }
  sessionStartTime = null;
};
