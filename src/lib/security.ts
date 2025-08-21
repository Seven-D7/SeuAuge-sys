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

// Re-export validation utilities from dedicated validation module
export {
  sanitizeInput,
  sanitizeHTML,
  validateEmail,
  validatePassword,
  validateName,
  validateBirthdate,
  validateNumeric,
  validateFile,
  validateURL,
  validateSearchQuery,
  validateFormData,
  containsSQLInjection,
  containsXSS,
  rateLimiter
} from './validation';

// Password validation is now handled in validation.ts

// File validation is now handled in validation.ts

// User input validation is now handled in validation.ts
export const validateUserInput = {
  name: (name: string) => validateName(name),
  bio: (bio: string) => validateNumeric(bio, 0, SECURITY_CONFIG.INPUT.MAX_BIO_LENGTH, 'Bio'),
  comment: (comment: string) => validateNumeric(comment, 0, SECURITY_CONFIG.INPUT.MAX_COMMENT_LENGTH, 'Comentário'),
};

// Rate limiter is now handled in validation.ts

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
