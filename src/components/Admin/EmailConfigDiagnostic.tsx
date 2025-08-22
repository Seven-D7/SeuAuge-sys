import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Mail, Settings, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  action?: string;
}

const EmailConfigDiagnostic: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [testEmail, setTestEmail] = useState('');

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);
    
    const diagnostics: DiagnosticResult[] = [];

    // Test 1: Environment Variables
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        diagnostics.push({
          test: 'Variáveis de Ambiente',
          status: 'error',
          message: 'VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não configuradas',
          action: 'Configure as variáveis no arquivo .env'
        });
      } else {
        diagnostics.push({
          test: 'Variáveis de Ambiente',
          status: 'success',
          message: 'Variáveis configuradas corretamente'
        });
      }
    } catch (error) {
      diagnostics.push({
        test: 'Variáveis de Ambiente',
        status: 'error',
        message: 'Erro ao verificar variáveis'
      });
    }

    // Test 2: Supabase Connection
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error && !error.message.includes('session')) {
        diagnostics.push({
          test: 'Conexão Supabase',
          status: 'error',
          message: `Erro de conexão: ${error.message}`,
          action: 'Verifique as credenciais do Supabase'
        });
      } else {
        diagnostics.push({
          test: 'Conexão Supabase',
          status: 'success',
          message: 'Conexão estabelecida com sucesso'
        });
      }
    } catch (error) {
      diagnostics.push({
        test: 'Conexão Supabase',
        status: 'error',
        message: 'Falha na conexão com Supabase'
      });
    }

    // Test 3: URLs de callback
    const currentOrigin = window.location.origin;
    const requiredUrls = [
      `${currentOrigin}/auth/callback`,
      `${currentOrigin}/auth/confirm`,
      `${currentOrigin}/auth/reset-password`
    ];

    diagnostics.push({
      test: 'URLs de Callback',
      status: 'warning',
      message: `Configure estas URLs no painel do Supabase: ${requiredUrls.join(', ')}`,
      action: 'Ir para Authentication > URL Configuration no Supabase'
    });

    // Test 4: Rotas da aplicação
    const routes = ['/auth/callback', '/auth/confirm', '/auth/reset-password'];
    let routesOk = true;
    
    for (const route of routes) {
      try {
        const response = await fetch(`${currentOrigin}${route}`, { method: 'HEAD' });
        if (response.status === 404) {
          routesOk = false;
          break;
        }
      } catch (error) {
        // Fetch will fail with CORS for HEAD requests, which is expected
        // but 404 would have a different error
      }
    }

    diagnostics.push({
      test: 'Rotas da Aplicação',
      status: routesOk ? 'success' : 'error',
      message: routesOk ? 'Todas as rotas necessárias estão disponíveis' : 'Algumas rotas estão faltando',
      action: !routesOk ? 'Verifique se as rotas estão configuradas no App.tsx' : undefined
    });

    setResults(diagnostics);
    setIsRunning(false);
  };

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast.error('Digite um email válido');
      return;
    }

    setIsRunning(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        throw error;
      }

      toast.success('Email de teste enviado! Verifique sua caixa de entrada');
    } catch (error: any) {
      console.error('Test email error:', error);
      if (error.message?.includes('rate limit')) {
        toast.error('Aguarde alguns minutos entre os testes');
      } else {
        toast.error(`Erro ao enviar email: ${error.message}`);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">
            Diagnóstico de Email
          </h2>
        </div>
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          Executar Diagnóstico
        </button>
      </div>

      {/* Diagnostic Results */}
      <div className="space-y-4 mb-8">
        {results.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border rounded-lg p-4 ${
              result.status === 'success'
                ? 'border-green-200 bg-green-50'
                : result.status === 'warning'
                ? 'border-yellow-200 bg-yellow-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-start gap-3">
              {getStatusIcon(result.status)}
              <div className="flex-1">
                <h3 className="font-medium text-slate-900">{result.test}</h3>
                <p className={`text-sm mt-1 ${
                  result.status === 'success'
                    ? 'text-green-700'
                    : result.status === 'warning'
                    ? 'text-yellow-700'
                    : 'text-red-700'
                }`}>
                  {result.message}
                </p>
                {result.action && (
                  <p className="text-xs text-slate-600 mt-2 font-medium">
                    Ação: {result.action}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Test Email Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Teste de Email
        </h3>
        <div className="flex gap-3">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Digite um email para teste"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={sendTestEmail}
            disabled={isRunning || !testEmail}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Enviar Teste
          </button>
        </div>
        <p className="text-sm text-slate-600 mt-2">
          Isso enviará um email de recuperação de senha para o endereço especificado.
        </p>
      </div>

      {/* Configuration Guide */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Guia de Configuração
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-5 h-5 text-slate-600" />
              <h4 className="font-medium text-slate-900">Supabase Dashboard</h4>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Configure as URLs de redirecionamento no painel do Supabase.
            </p>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Abrir Dashboard
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-slate-600" />
              <h4 className="font-medium text-slate-900">SMTP Personalizado</h4>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Configure SMTP para produção nas configurações de autenticação.
            </p>
            <a
              href="/src/docs/supabase-email-config.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Ver Documentação
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfigDiagnostic;
