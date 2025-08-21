// Comprehensive input validation and sanitization utilities

// XSS and SQL injection protection
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
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
    })
    // Remove potential SQL injection patterns
    .replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi, '')
    // Remove script tags and event handlers
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
};

// HTML content sanitization for rich text
export const sanitizeHTML = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  
  // Remove dangerous elements and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*>/gi, '')
    .replace(/<link\b[^<]*>/gi, '')
    .replace(/<meta\b[^<]*>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/style\s*=\s*["'][^"']*["']/gi, ''); // Remove inline styles for security
};

// SQL injection pattern detection
export const containsSQLInjection = (input: string): boolean => {
  if (!input || typeof input !== 'string') return false;
  
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /('|(\\')|(;)|(--)|(\|\|)/gi,
    /(\b(OR|AND)\b\s*\d+\s*=\s*\d+)/gi,
    /(\b(OR|AND)\b\s*['"][\w\s]*['"]?\s*=\s*['"][\w\s]*['"]?)/gi,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

// XSS pattern detection
export const containsXSS = (input: string): boolean => {
  if (!input || typeof input !== 'string') return false;
  
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=\s*["'][^"']*["']/gi,
    /<img[^>]+src[^>]*>/gi,
    /<svg[^>]*>/gi,
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
};

// Email validation with multiple checks
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email é obrigatório' };
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Formato de email inválido' };
  }
  
  // Length check (RFC 5321 limit)
  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email muito longo' };
  }
  
  // Check for dangerous patterns
  if (containsSQLInjection(trimmedEmail) || containsXSS(trimmedEmail)) {
    return { isValid: false, error: 'Email contém caracteres inválidos' };
  }
  
  return { isValid: true };
};

// Password validation with comprehensive checks
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
} => {
  const errors: string[] = [];
  
  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['Senha é obrigatória'], strength: 'weak' };
  }
  
  // Length checks
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }
  if (password.length > 128) {
    errors.push('Senha muito longa (máximo 128 caracteres)');
  }
  
  // Character requirements
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  // Common password checks
  const commonPasswords = ['123456', 'password', '123456789', 'qwerty', 'abc123'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Senha muito comum. Use uma senha mais segura');
  }
  
  // Strength calculation
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

// Name validation
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Nome é obrigatório' };
  }
  
  const sanitized = sanitizeInput(name);
  
  if (sanitized.length < 2) {
    return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
  }
  if (sanitized.length > 50) {
    return { isValid: false, error: 'Nome deve ter no máximo 50 caracteres' };
  }
  
  // Check for numbers and special characters
  if (/[0-9]/.test(sanitized)) {
    return { isValid: false, error: 'Nome não deve conter números' };
  }
  if (/[!@#$%^&*(),.?":{}|<>]/.test(sanitized)) {
    return { isValid: false, error: 'Nome contém caracteres inválidos' };
  }
  
  // Check for dangerous patterns
  if (containsSQLInjection(sanitized) || containsXSS(sanitized)) {
    return { isValid: false, error: 'Nome contém caracteres perigosos' };
  }
  
  return { isValid: true };
};

// Age validation
export const validateBirthdate = (birthdate: string): { isValid: boolean; error?: string } => {
  if (!birthdate || typeof birthdate !== 'string') {
    return { isValid: false, error: 'Data de nascimento é obrigatória' };
  }
  
  const date = new Date(birthdate);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Data de nascimento inválida' };
  }
  
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  // Adjust age if birthday hasn't occurred this year
  const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate()) ? age - 1 : age;
  
  if (actualAge < 13) {
    return { isValid: false, error: 'Você deve ter pelo menos 13 anos' };
  }
  if (actualAge > 120) {
    return { isValid: false, error: 'Data de nascimento inválida' };
  }
  
  return { isValid: true };
};

// Numeric value validation
export const validateNumeric = (
  value: string,
  min: number,
  max: number,
  label: string
): { isValid: boolean; error?: string } => {
  if (!value || typeof value !== 'string') {
    return { isValid: true }; // Optional field
  }
  
  const num = parseFloat(value);
  if (isNaN(num)) {
    return { isValid: false, error: `${label} deve ser um número válido` };
  }
  
  if (num < min || num > max) {
    return { isValid: false, error: `${label} deve estar entre ${min} e ${max}` };
  }
  
  return { isValid: true };
};

// File validation
export const validateFile = (
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    maxNameLength?: number;
  } = {}
): { isValid: boolean; error?: string } => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    maxNameLength = 255
  } = options;
  
  // Size check
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `Arquivo muito grande. Máximo ${Math.round(maxSize / 1024 / 1024)}MB`
    };
  }
  
  // Type check
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de arquivo não permitido. Permitidos: ${allowedTypes.join(', ')}`
    };
  }
  
  // Filename length check
  if (file.name.length > maxNameLength) {
    return {
      isValid: false,
      error: `Nome do arquivo muito longo. Máximo ${maxNameLength} caracteres`
    };
  }
  
  // Check filename for dangerous patterns
  if (containsSQLInjection(file.name) || containsXSS(file.name)) {
    return {
      isValid: false,
      error: 'Nome do arquivo contém caracteres perigosos'
    };
  }
  
  return { isValid: true };
};

// URL validation
export const validateURL = (url: string): { isValid: boolean; error?: string } => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL é obrigatória' };
  }
  
  try {
    const parsedURL = new URL(url);
    
    // Only allow HTTP and HTTPS
    if (!['http:', 'https:'].includes(parsedURL.protocol)) {
      return { isValid: false, error: 'URL deve usar protocolo HTTP ou HTTPS' };
    }
    
    // Check for dangerous patterns
    if (containsXSS(url)) {
      return { isValid: false, error: 'URL contém caracteres perigosos' };
    }
    
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'URL inválida' };
  }
};

// Search query validation
export const validateSearchQuery = (query: string): { isValid: boolean; error?: string } => {
  if (!query || typeof query !== 'string') {
    return { isValid: false, error: 'Termo de busca é obrigatório' };
  }
  
  const sanitized = sanitizeInput(query);
  
  if (sanitized.length < 2) {
    return { isValid: false, error: 'Termo de busca deve ter pelo menos 2 caracteres' };
  }
  if (sanitized.length > 100) {
    return { isValid: false, error: 'Termo de busca muito longo' };
  }
  
  // Check for dangerous patterns
  if (containsSQLInjection(sanitized) || containsXSS(sanitized)) {
    return { isValid: false, error: 'Termo de busca contém caracteres inválidos' };
  }
  
  return { isValid: true };
};

// Rate limiting helper
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

// Comprehensive validation for form data
export const validateFormData = (data: Record<string, any>, rules: Record<string, any>) => {
  const errors: Record<string, string> = {};
  const sanitizedData: Record<string, any> = {};
  
  for (const [field, value] of Object.entries(data)) {
    const rule = rules[field];
    if (!rule) continue;
    
    let sanitizedValue = value;
    let validationResult = { isValid: true };
    
    // Apply sanitization
    if (typeof value === 'string') {
      sanitizedValue = sanitizeInput(value);
    }
    
    // Apply validation rules
    switch (rule.type) {
      case 'email':
        validationResult = validateEmail(value);
        break;
      case 'password':
        validationResult = validatePassword(value);
        break;
      case 'name':
        validationResult = validateName(value);
        break;
      case 'birthdate':
        validationResult = validateBirthdate(value);
        break;
      case 'numeric':
        validationResult = validateNumeric(value, rule.min, rule.max, rule.label);
        break;
      case 'url':
        validationResult = validateURL(value);
        break;
      case 'search':
        validationResult = validateSearchQuery(value);
        break;
    }
    
    if (!validationResult.isValid) {
      errors[field] = validationResult.error || `${field} é inválido`;
    } else {
      sanitizedData[field] = sanitizedValue;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
};
