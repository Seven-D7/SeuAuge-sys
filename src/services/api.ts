const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface RequestOptions extends RequestInit {
  body?: any;
}

export async function api(path: string, options: RequestOptions = {}) {
  // Validate API URL
  if (!API_URL) {
    throw new Error('API URL not configured');
  }
  
  // Sanitize path to prevent path traversal
  const sanitizedPath = path.replace(/\.\./g, '').replace(/\/+/g, '/');
  
  const response = await fetch(`${API_URL}${sanitizedPath}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    // Don't expose detailed error messages from API
    const status = response.status;
    if (status === 401) {
      throw new Error('Não autorizado');
    } else if (status === 403) {
      throw new Error('Acesso negado');
    } else if (status === 404) {
      throw new Error('Recurso não encontrado');
    } else if (status >= 500) {
      throw new Error('Erro interno do servidor');
    } else {
      throw new Error('Erro na requisição');
    }
  }

  return response.json();
}

export default api;
export { API_URL };
