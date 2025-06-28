const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface RequestOptions extends RequestInit {
  body?: any;
}

export async function api(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Erro na API');
  }

  return response.json();
}

export default api;
export { API_URL };
