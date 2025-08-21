import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  Database, 
  Key, 
  Users, 
  Shield,
  Activity,
  Trophy,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import { authService } from '../../services/auth';
import { progressService } from '../../services/progress';
import { metricsService } from '../../services/metrics';
import { gamificationService } from '../../services/gamification';
import { supabase } from '../../lib/supabase';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  duration?: number;
  icon: React.ReactNode;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  status: 'pending' | 'running' | 'complete';
}

const SupabaseTestRunner: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      name: 'Conexão com Supabase',
      status: 'pending',
      tests: [
        {
          name: 'Verificar variáveis de ambiente',
          status: 'pending',
          message: '',
          icon: <Key className="w-4 h-4" />
        },
        {
          name: 'Conectar com banco de dados',
          status: 'pending',
          message: '',
          icon: <Database className="w-4 h-4" />
        },
        {
          name: 'Verificar tabelas essenciais',
          status: 'pending',
          message: '',
          icon: <BarChart3 className="w-4 h-4" />
        }
      ]
    },
    {
      name: 'Sistema de Autenticação',
      status: 'pending',
      tests: [
        {
          name: 'Testar registro de usuário',
          status: 'pending',
          message: '',
          icon: <Users className="w-4 h-4" />
        },
        {
          name: 'Testar login',
          status: 'pending',
          message: '',
          icon: <Shield className="w-4 h-4" />
        },
        {
          name: 'Testar logout',
          status: 'pending',
          message: '',
          icon: <Shield className="w-4 h-4" />
        }
      ]
    },
    {
      name: 'Sistema de Progresso',
      status: 'pending',
      tests: [
        {
          name: 'Salvar métricas do usuário',
          status: 'pending',
          message: '',
          icon: <Activity className="w-4 h-4" />
        },
        {
          name: 'Registrar atividade',
          status: 'pending',
          message: '',
          icon: <Activity className="w-4 h-4" />
        },
        {
          name: 'Calcular progresso',
          status: 'pending',
          message: '',
          icon: <BarChart3 className="w-4 h-4" />
        }
      ]
    },
    {
      name: 'Sistema de Gamificação',
      status: 'pending',
      tests: [
        {
          name: 'Buscar conquistas',
          status: 'pending',
          message: '',
          icon: <Trophy className="w-4 h-4" />
        },
        {
          name: 'Testar desafios diários',
          status: 'pending',
          message: '',
          icon: <Trophy className="w-4 h-4" />
        },
        {
          name: 'Calcular nível do usuário',
          status: 'pending',
          message: '',
          icon: <Trophy className="w-4 h-4" />
        }
      ]
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentTestSuite, setCurrentTestSuite] = useState(0);

  const updateTestResult = useCallback((suiteIndex: number, testIndex: number, updates: Partial<TestResult>) => {
    setTestSuites(prev => prev.map((suite, sIndex) => {
      if (sIndex === suiteIndex) {
        return {
          ...suite,
          tests: suite.tests.map((test, tIndex) => {
            if (tIndex === testIndex) {
              return { ...test, ...updates };
            }
            return test;
          })
        };
      }
      return suite;
    }));
  }, []);

  const updateSuiteStatus = useCallback((suiteIndex: number, status: TestSuite['status']) => {
    setTestSuites(prev => prev.map((suite, index) => {
      if (index === suiteIndex) {
        return { ...suite, status };
      }
      return suite;
    }));
  }, []);

  // Test Suite 1: Supabase Connection
  const testSupabaseConnection = async (suiteIndex: number) => {
    updateSuiteStatus(suiteIndex, 'running');

    // Test 1: Environment Variables
    const startTime1 = Date.now();
    updateTestResult(suiteIndex, 0, { status: 'running', message: 'Verificando variáveis...' });
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Variáveis de ambiente não configuradas');
      }
      
      if (!supabaseUrl.includes('supabase.co')) {
        throw new Error('URL do Supabase inválida');
      }

      updateTestResult(suiteIndex, 0, {
        status: 'success',
        message: 'Variáveis configuradas corretamente',
        duration: Date.now() - startTime1
      });
    } catch (error: any) {
      updateTestResult(suiteIndex, 0, {
        status: 'error',
        message: error.message,
        duration: Date.now() - startTime1
      });
    }

    // Test 2: Database Connection
    const startTime2 = Date.now();
    updateTestResult(suiteIndex, 1, { status: 'running', message: 'Conectando ao banco...' });
    
    try {
      const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
      
      if (error) {
        throw new Error(`Erro de conexão: ${error.message}`);
      }

      updateTestResult(suiteIndex, 1, {
        status: 'success',
        message: 'Conexão estabelecida com sucesso',
        duration: Date.now() - startTime2
      });
    } catch (error: any) {
      updateTestResult(suiteIndex, 1, {
        status: 'error',
        message: error.message,
        duration: Date.now() - startTime2
      });
    }

    // Test 3: Essential Tables
    const startTime3 = Date.now();
    updateTestResult(suiteIndex, 2, { status: 'running', message: 'Verificando tabelas...' });
    
    try {
      const tables = ['user_profiles', 'user_stats', 'achievements', 'daily_challenges'];
      const tableChecks = await Promise.all(
        tables.map(async (table) => {
          const { error } = await supabase.from(table).select('*').limit(1);
          return { table, exists: !error };
        })
      );

      const missingTables = tableChecks.filter(check => !check.exists).map(check => check.table);
      
      if (missingTables.length > 0) {
        throw new Error(`Tabelas não encontradas: ${missingTables.join(', ')}`);
      }

      updateTestResult(suiteIndex, 2, {
        status: 'success',
        message: `${tables.length} tabelas verificadas`,
        duration: Date.now() - startTime3
      });
    } catch (error: any) {
      updateTestResult(suiteIndex, 2, {
        status: 'error',
        message: error.message,
        duration: Date.now() - startTime3
      });
    }

    updateSuiteStatus(suiteIndex, 'complete');
  };

  // Test Suite 2: Authentication
  const testAuthentication = async (suiteIndex: number) => {
    updateSuiteStatus(suiteIndex, 'running');
    const testEmail = `test_${Date.now()}@healthflix.test`;
    const testPassword = 'TestPassword123';

    // Test 1: User Registration
    const startTime1 = Date.now();
    updateTestResult(suiteIndex, 0, { status: 'running', message: 'Registrando usuário de teste...' });
    
    try {
      const result = await authService.register({
        email: testEmail,
        password: testPassword,
        name: 'Test User',
        birthdate: '1990-01-01'
      });

      if (result.error) {
        throw new Error(result.error);
      }

      updateTestResult(suiteIndex, 0, {
        status: 'success',
        message: 'Usuário registrado com sucesso',
        duration: Date.now() - startTime1
      });
    } catch (error: any) {
      updateTestResult(suiteIndex, 0, {
        status: 'error',
        message: error.message,
        duration: Date.now() - startTime1
      });
    }

    // Test 2: User Login
    const startTime2 = Date.now();
    updateTestResult(suiteIndex, 1, { status: 'running', message: 'Testando login...' });
    
    try {
      const result = await authService.login({
        email: testEmail,
        password: testPassword
      });

      if (result.error) {
        throw new Error(result.error);
      }

      updateTestResult(suiteIndex, 1, {
        status: 'success',
        message: 'Login realizado com sucesso',
        duration: Date.now() - startTime2
      });
    } catch (error: any) {
      updateTestResult(suiteIndex, 1, {
        status: 'error',
        message: error.message,
        duration: Date.now() - startTime2
      });
    }

    // Test 3: User Logout
    const startTime3 = Date.now();
    updateTestResult(suiteIndex, 2, { status: 'running', message: 'Testando logout...' });
    
    try {
      const result = await authService.logout();

      if (result.error) {
        throw new Error(result.error);
      }

      updateTestResult(suiteIndex, 2, {
        status: 'success',
        message: 'Logout realizado com sucesso',
        duration: Date.now() - startTime3
      });
    } catch (error: any) {
      updateTestResult(suiteIndex, 2, {
        status: 'error',
        message: error.message,
        duration: Date.now() - startTime3
      });
    }

    updateSuiteStatus(suiteIndex, 'complete');
  };

  // Test Suite 3: Progress System
  const testProgressSystem = async (suiteIndex: number) => {
    updateSuiteStatus(suiteIndex, 'running');

    // Test 1: Save Metrics
    const startTime1 = Date.now();
    updateTestResult(suiteIndex, 0, { status: 'running', message: 'Salvando métricas...' });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado para teste');
      }

      const result = await metricsService.saveMetrics({
        user_id: user.id,
        weight: 70,
        height: 175,
        bmi: 22.86,
        measured_at: new Date().toISOString()
      });

      if (result.error) {
        throw new Error(result.error);
      }

      updateTestResult(suiteIndex, 0, {
        status: 'success',
        message: 'Métricas salvas com sucesso',
        duration: Date.now() - startTime1
      });
    } catch (error: any) {
      updateTestResult(suiteIndex, 0, {
        status: 'error',
        message: error.message,
        duration: Date.now() - startTime1
      });
    }

    // Test 2: Log Activity
    const startTime2 = Date.now();
    updateTestResult(suiteIndex, 1, { status: 'running', message: 'Registrando atividade...' });
    
    try {
      const result = await progressService.logWorkout(30, 200, 'Cardio');

      if (result.error) {
        throw new Error(result.error);
      }

      updateTestResult(suiteIndex, 1, {
        status: 'success',
        message: 'Atividade registrada com sucesso',
        duration: Date.now() - startTime2
      });
    } catch (error: any) {
      updateTestResult(suiteIndex, 1, {
        status: 'error',
        message: error.message,
        duration: Date.now() - startTime2
      });
    }

    // Test 3: Get Progress
    const startTime3 = Date.now();
    updateTestResult(suiteIndex, 2, { status: 'running', message: 'Calculando progresso...' });
    
    try {
      const result = await progressService.getUserProgress();

      if (result.error) {
        throw new Error(result.error);
      }

      updateTestResult(suiteIndex, 2, {
        status: 'success',
        message: 'Progresso calculado com sucesso',
        duration: Date.now() - startTime3
      });
    } catch (error: any) {
      updateTestResult(suiteIndex, 2, {
        status: 'error',
        message: error.message,
        duration: Date.now() - startTime3
      });
    }

    updateSuiteStatus(suiteIndex, 'complete');
  };

  // Test Suite 4: Gamification
  const testGamification = async (suiteIndex: number) => {
    updateSuiteStatus(suiteIndex, 'running');

    // Test 1: Get Achievements
    const startTime1 = Date.now();
    updateTestResult(suiteIndex, 0, { status: 'running', message: 'Buscando conquistas...' });
    
    try {
      const result = await gamificationService.getAchievements();

      if (result.error) {
        throw new Error(result.error);
      }

      updateTestResult(suiteIndex, 0, {
        status: 'success',
        message: `${result.data?.length || 0} conquistas encontradas`,
        duration: Date.now() - startTime1
      });
    } catch (error: any) {
      updateTestResult(suiteIndex, 0, {
        status: 'error',
        message: error.message,
        duration: Date.now() - startTime1
      });
    }

    // Test 2: Daily Challenges
    const startTime2 = Date.now();
    updateTestResult(suiteIndex, 1, { status: 'running', message: 'Testando desafios...' });
    
    try {
      const result = await gamificationService.getDailyChallenges();

      if (result.error) {
        throw new Error(result.error);
      }

      updateTestResult(suiteIndex, 1, {
        status: 'success',
        message: `${result.data?.length || 0} desafios encontrados`,
        duration: Date.now() - startTime2
      });
    } catch (error: any) {
      updateTestResult(suiteIndex, 1, {
        status: 'error',
        message: error.message,
        duration: Date.now() - startTime2
      });
    }

    // Test 3: Level Calculation
    const startTime3 = Date.now();
    updateTestResult(suiteIndex, 2, { status: 'running', message: 'Calculando nível...' });
    
    try {
      const levelInfo = gamificationService.calculateLevel(1250);

      if (levelInfo.level <= 0) {
        throw new Error('Cálculo de nível inválido');
      }

      updateTestResult(suiteIndex, 2, {
        status: 'success',
        message: `Nível ${levelInfo.level} calculado`,
        duration: Date.now() - startTime3
      });
    } catch (error: any) {
      updateTestResult(suiteIndex, 2, {
        status: 'error',
        message: error.message,
        duration: Date.now() - startTime3
      });
    }

    updateSuiteStatus(suiteIndex, 'complete');
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setCurrentTestSuite(0);

    try {
      await testSupabaseConnection(0);
      setCurrentTestSuite(1);
      
      await testAuthentication(1);
      setCurrentTestSuite(2);
      
      await testProgressSystem(2);
      setCurrentTestSuite(3);
      
      await testGamification(3);
    } catch (error) {
      console.error('Test execution error:', error);
    } finally {
      setIsRunning(false);
      setCurrentTestSuite(0);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSuiteStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'border-blue-500 bg-blue-50';
      case 'complete':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Teste de Integração Supabase
        </h1>
        <p className="text-gray-600">
          Valide a configuração completa do sistema HealthFlix
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isRunning
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Executando Testes...' : 'Executar Todos os Testes'}
        </button>
      </div>

      <div className="space-y-4">
        {testSuites.map((suite, suiteIndex) => (
          <motion.div
            key={suite.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: suiteIndex * 0.1 }}
            className={`border rounded-lg p-4 ${getSuiteStatusColor(suite.status)}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-gray-900">{suite.name}</h3>
              {getStatusIcon(suite.status)}
              {isRunning && currentTestSuite === suiteIndex && (
                <span className="text-sm text-blue-600 font-medium">Em andamento...</span>
              )}
            </div>

            <div className="space-y-2">
              {suite.tests.map((test, testIndex) => (
                <div
                  key={test.name}
                  className="flex items-center justify-between p-2 bg-white rounded border"
                >
                  <div className="flex items-center gap-2">
                    {test.icon}
                    <span className="text-sm font-medium">{test.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {test.duration && (
                      <span className="text-xs text-gray-500">
                        {test.duration}ms
                      </span>
                    )}
                    {test.message && (
                      <span className={`text-xs ${
                        test.status === 'error' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {test.message}
                      </span>
                    )}
                    {getStatusIcon(test.status)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Importante</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Antes de executar os testes, certifique-se de que:
            </p>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
              <li>• As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão configuradas</li>
              <li>• O schema SQL foi executado no Supabase</li>
              <li>• As políticas RLS estão ativas</li>
              <li>• Você tem acesso de admin (se necessário)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTestRunner;
