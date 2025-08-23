import toast from 'react-hot-toast';

export interface AppError extends Error {
  code?: string;
  status?: number;
  operation?: string;
}

/**
 * Mapeamento de mensagens de erro amigáveis
 */
const ERROR_MESSAGES: Record<string, string> = {
  // Erros de autenticação
  'auth/invalid-credentials': 'Email ou senha incorretos. Verifique suas credenciais.',
  'auth/user-not-found': 'Usuário não encontrado. Verifique o email digitado.',
  'auth/wrong-password': 'Senha incorreta. Tente novamente.',
  'auth/too-many-requests': 'Muitas tentativas de login. Aguarde alguns minutos.',
  'auth/email-not-verified': 'Email não confirmado. Verifique sua caixa de entrada.',
  'auth/user-already-exists': 'Este email já está em uso.',
  
  // Erros de rede
  'network/timeout': 'Tempo limite excedido. Verifique sua conexão.',
  'network/offline': 'Você está offline. Verifique sua conexão com a internet.',
  'network/server-error': 'Erro no servidor. Tente novamente em alguns minutos.',
  
  // Erros de validação
  'validation/email-invalid': 'Formato de email inválido.',
  'validation/password-weak': 'Senha muito fraca. Use pelo menos 8 caracteres.',
  'validation/required-field': 'Este campo é obrigatório.',
  
  // Erros gerais
  'unknown': 'Ocorreu um erro inesperado. Tente novamente.',
};

/**
 * Classifica um erro baseado na mensagem
 */
export function classifyError(error: any): string {
  const message = error?.message?.toLowerCase() || '';
  
  // Erros de autenticação
  if (message.includes('invalid login credentials') || 
      message.includes('invalid credentials')) {
    return 'auth/invalid-credentials';
  }
  
  if (message.includes('user not found')) {
    return 'auth/user-not-found';
  }
  
  if (message.includes('wrong password')) {
    return 'auth/wrong-password';
  }
  
  if (message.includes('too many requests')) {
    return 'auth/too-many-requests';
  }
  
  if (message.includes('email not confirmed') || 
      message.includes('email not verified')) {
    return 'auth/email-not-verified';
  }
  
  if (message.includes('user already registered') || 
      message.includes('already exists')) {
    return 'auth/user-already-exists';
  }
  
  // Erros de rede
  if (message.includes('timeout') || message.includes('timed out')) {
    return 'network/timeout';
  }
  
  if (message.includes('network') || message.includes('fetch')) {
    return 'network/offline';
  }
  
  if (message.includes('server error') || message.includes('internal error')) {
    return 'network/server-error';
  }
  
  // Erros de validação
  if (message.includes('invalid email') || message.includes('email format')) {
    return 'validation/email-invalid';
  }
  
  if (message.includes('password') && 
      (message.includes('weak') || message.includes('short'))) {
    return 'validation/password-weak';
  }
  
  return 'unknown';
}

/**
 * Obtém uma mensagem de erro amigável
 */
export function getFriendlyErrorMessage(error: any): string {
  const errorCode = classifyError(error);
  return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.unknown;
}

/**
 * Manipulador de erro global
 */
export function handleError(
  error: any, 
  operation?: string,
  showToast: boolean = true
): string {
  console.error(`Error in ${operation || 'unknown operation'}:`, error);
  
  const friendlyMessage = getFriendlyErrorMessage(error);
  
  if (showToast) {
    toast.error(friendlyMessage, {
      duration: 5000,
      position: 'top-center',
    });
  }
  
  return friendlyMessage;
}

/**
 * Wrapper para operações assíncronas com tratamento de erro
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  operationName: string = 'operação',
  showToast: boolean = true
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    handleError(error, operationName, showToast);
    return null;
  }
}

/**
 * Valida email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida senha
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitiza entrada do usuário
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>\"']/g, '');
}

export default {
  classifyError,
  getFriendlyErrorMessage,
  handleError,
  withErrorHandling,
  validateEmail,
  validatePassword,
  sanitizeInput
};
