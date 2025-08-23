import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  message: string;
  operation: string | null;
}

/**
 * Hook para gerenciar estado de loading global
 * Útil para operações que precisam bloquear a interface
 */
export function useGlobalLoader() {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: 'Carregando...',
    operation: null
  });

  const startLoading = useCallback((message: string = 'Carregando...', operation?: string) => {
    setLoadingState({
      isLoading: true,
      message,
      operation: operation || null
    });
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingState({
      isLoading: false,
      message: 'Carregando...',
      operation: null
    });
  }, []);

  const updateMessage = useCallback((message: string) => {
    setLoadingState(prev => ({
      ...prev,
      message
    }));
  }, []);

  /**
   * Executa uma operação assíncrona com loading automático
   */
  const withLoading = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    loadingMessage: string = 'Processando...',
    operationName?: string
  ): Promise<T> => {
    try {
      startLoading(loadingMessage, operationName);
      const result = await asyncOperation();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    ...loadingState,
    startLoading,
    stopLoading,
    updateMessage,
    withLoading
  };
}

export default useGlobalLoader;
