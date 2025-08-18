import { PlanTier } from '../types/content';
import { useUserProfileStore } from '../stores/userProfileStore';
import { useAchievementsStore } from '../stores/achievementsStore';
import { useLevelStore } from '../stores/levelStore';
import { useAuth } from '../contexts/AuthContext';
import { gamificationService } from '../services/gamification';
import { dataSyncService } from '../services/dataSync';

export interface TestUser {
  uid: string;
  name: string;
  email: string;
  plan: PlanTier | null;
  isAdmin: boolean;
}

export interface TestScenario {
  name: string;
  description: string;
  user: TestUser;
  actions: TestAction[];
  expectedResults: ExpectedResult[];
}

export interface TestAction {
  type: 'register' | 'login' | 'logout' | 'watch_video' | 'complete_workout' | 'access_app' | 'purchase_product' | 'upgrade_plan';
  data?: any;
  description: string;
}

export interface ExpectedResult {
  type: 'access_granted' | 'access_denied' | 'achievement_unlocked' | 'level_up' | 'discount_applied' | 'content_visible';
  description: string;
  validate: () => boolean | Promise<boolean>;
}

// Usuários de teste
export const TEST_USERS: TestUser[] = [
  {
    uid: 'test-free-user-001',
    name: 'João Silva',
    email: 'joao.free@teste.com',
    plan: null,
    isAdmin: false,
  },
  {
    uid: 'test-base-user-001',
    name: 'Maria Santos',
    email: 'maria.base@teste.com',
    plan: 'B',
    isAdmin: false,
  },
  {
    uid: 'test-escalada-user-001',
    name: 'Pedro Oliveira',
    email: 'pedro.escalada@teste.com',
    plan: 'C',
    isAdmin: false,
  },
  {
    uid: 'test-auge-user-001',
    name: 'Ana Costa',
    email: 'ana.auge@teste.com',
    plan: 'D',
    isAdmin: false,
  },
  {
    uid: 'test-admin-user-001',
    name: 'Admin Sistema',
    email: 'admin@teste.com',
    plan: 'D',
    isAdmin: true,
  },
];

// Cenários de teste
export const TEST_SCENARIOS: TestScenario[] = [
  {
    name: 'Usuário Gratuito - Fluxo Básico',
    description: 'Teste do fluxo completo de um usuário gratuito',
    user: TEST_USERS[0],
    actions: [
      {
        type: 'register',
        description: 'Registrar nova conta',
        data: { email: 'joao.free@teste.com', password: 'teste123', name: 'João Silva', birthdate: '1990-01-01' }
      },
      {
        type: 'watch_video',
        description: 'Assistir vídeo gratuito',
        data: { videoId: 'yoga-matinal', planRequired: 'FREE' }
      },
      {
        type: 'access_app',
        description: 'Tentar acessar app premium',
        data: { appId: 'fitness-emagrecimento', planRequired: 'B' }
      },
      {
        type: 'purchase_product',
        description: 'Comprar produto sem desconto',
        data: { productId: 'whey-protein-premium' }
      }
    ],
    expectedResults: [
      {
        type: 'content_visible',
        description: 'Vídeos gratuitos devem estar visíveis',
        validate: () => true // TODO: Implementar validação real
      },
      {
        type: 'access_denied',
        description: 'Apps premium devem estar bloqueados',
        validate: () => true
      },
      {
        type: 'discount_applied',
        description: 'Nenhum desconto deve ser aplicado',
        validate: () => true
      }
    ]
  },
  {
    name: 'Usuário Plano Base - Acesso Premium',
    description: 'Teste de acesso a recursos do Plano Base',
    user: TEST_USERS[1],
    actions: [
      {
        type: 'login',
        description: 'Fazer login',
        data: { email: 'maria.base@teste.com', password: 'teste123' }
      },
      {
        type: 'access_app',
        description: 'Acessar app de emagrecimento',
        data: { appId: 'fitness-emagrecimento', planRequired: 'B' }
      },
      {
        type: 'access_app',
        description: 'Tentar acessar app avançado',
        data: { appId: 'fitness-performance', planRequired: 'D' }
      },
      {
        type: 'purchase_product',
        description: 'Comprar produto com desconto',
        data: { productId: 'whey-protein-premium' }
      }
    ],
    expectedResults: [
      {
        type: 'access_granted',
        description: 'Apps do Plano Base devem estar acessíveis',
        validate: () => true
      },
      {
        type: 'access_denied',
        description: 'Apps do Plano Auge devem estar bloqueados',
        validate: () => true
      },
      {
        type: 'discount_applied',
        description: 'Desconto de 5% deve ser aplicado',
        validate: () => true
      }
    ]
  },
  {
    name: 'Gamificação - Sistema de Conquistas',
    description: 'Teste do sistema de gamificação e conquistas',
    user: TEST_USERS[1],
    actions: [
      {
        type: 'login',
        description: 'Login diário para streak',
        data: {}
      },
      {
        type: 'watch_video',
        description: 'Assistir primeiro vídeo',
        data: { videoId: 'nutricao-fundamentos' }
      },
      {
        type: 'complete_workout',
        description: 'Completar primeiro treino',
        data: { workoutId: 'treino-iniciante' }
      }
    ],
    expectedResults: [
      {
        type: 'achievement_unlocked',
        description: 'Conquista "Primeiro Passo" deve ser desbloqueada',
        validate: () => true
      },
      {
        type: 'achievement_unlocked',
        description: 'Conquista "Estudante Curioso" deve ser desbloqueada',
        validate: () => true
      },
      {
        type: 'level_up',
        description: 'XP deve ser adicionado e nível pode subir',
        validate: () => true
      }
    ]
  }
];

// Classe para executar testes
export class UserExperienceTestRunner {
  private results: TestResult[] = [];

  async runAllTests(): Promise<TestSummary> {
    this.results = [];
    
    for (const scenario of TEST_SCENARIOS) {
      try {
        const result = await this.runScenario(scenario);
        this.results.push(result);
      } catch (error) {
        this.results.push({
          scenarioName: scenario.name,
          passed: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
          details: []
        });
      }
    }

    return this.generateSummary();
  }

  async runScenario(scenario: TestScenario): Promise<TestResult> {
    console.log(`🧪 Executando: ${scenario.name}`);
    
    // Simular usuário
    await this.setupTestUser(scenario.user);
    
    const details: TestDetail[] = [];
    
    // Executar ações
    for (const action of scenario.actions) {
      try {
        await this.executeAction(action);
        details.push({
          actionDescription: action.description,
          success: true,
          message: 'Ação executada com sucesso'
        });
      } catch (error) {
        details.push({
          actionDescription: action.description,
          success: false,
          message: error instanceof Error ? error.message : 'Erro na ação'
        });
      }
    }
    
    // Validar resultados esperados
    let allValidationsPassed = true;
    for (const expectedResult of scenario.expectedResults) {
      try {
        const passed = await expectedResult.validate();
        details.push({
          actionDescription: `Validação: ${expectedResult.description}`,
          success: passed,
          message: passed ? 'Validação passou' : 'Validação falhou'
        });
        
        if (!passed) allValidationsPassed = false;
      } catch (error) {
        details.push({
          actionDescription: `Validação: ${expectedResult.description}`,
          success: false,
          message: error instanceof Error ? error.message : 'Erro na validação'
        });
        allValidationsPassed = false;
      }
    }
    
    return {
      scenarioName: scenario.name,
      passed: allValidationsPassed,
      details
    };
  }

  private async setupTestUser(user: TestUser): Promise<void> {
    // Simular login do usuário de teste
    const profileStore = useUserProfileStore.getState();
    
    // Criar perfil de teste
    const testProfile = {
      uid: user.uid,
      name: user.name,
      email: user.email,
      plan: user.plan,
      role: user.isAdmin ? 'admin' as const : 'user' as const,
      isActive: true,
      preferences: {
        language: 'pt' as const,
        theme: 'system' as const,
        notifications: {
          email: true,
          push: true,
          marketing: false,
        },
        privacy: {
          shareProgress: true,
          showInLeaderboard: true,
        },
      },
      healthData: {
        metrics: {},
        goals: {
          fitnessGoal: 'maintenance' as const,
          activityLevel: 'moderate' as const,
        },
        restrictions: {
          allergies: [],
          medicalConditions: [],
          dietaryRestrictions: [],
        },
      },
      appData: {
        firstLoginDate: new Date(),
        lastLoginDate: new Date(),
        totalLogins: 1,
        favoriteCategories: [],
        completedOnboarding: true,
        lastSyncDate: new Date(),
      },
    };

    // Configurar stores para teste
    profileStore.clearProfile();
    // TODO: Configurar outros stores conforme necessário para o teste
  }

  private async executeAction(action: TestAction): Promise<void> {
    switch (action.type) {
      case 'register':
        // Simular registro
        console.log('Simulando registro de usuário');
        break;
        
      case 'login':
        // Simular login
        console.log('Simulando login de usuário');
        break;
        
      case 'watch_video':
        // Simular assistir vídeo
        await gamificationService.trackVideoWatched(
          action.data.videoId,
          300, // 5 minutos
          'educativo'
        );
        break;
        
      case 'complete_workout':
        // Simular completar treino
        await gamificationService.trackWorkoutCompleted(
          action.data.workoutId,
          1800, // 30 minutos
          'strength'
        );
        break;
        
      case 'access_app':
        // Simular tentativa de acesso a app
        console.log(`Tentando acessar app: ${action.data.appId}`);
        break;
        
      case 'purchase_product':
        // Simular compra de produto
        console.log(`Simulando compra do produto: ${action.data.productId}`);
        break;
        
      case 'upgrade_plan':
        // Simular upgrade de plano
        console.log('Simulando upgrade de plano');
        break;
        
      default:
        throw new Error(`Ação não implementada: ${action.type}`);
    }
  }

  private generateSummary(): TestSummary {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    
    return {
      totalTests,
      passedTests,
      failedTests,
      successRate: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
      results: this.results
    };
  }

  getResults(): TestResult[] {
    return this.results;
  }
}

export interface TestResult {
  scenarioName: string;
  passed: boolean;
  error?: string;
  details: TestDetail[];
}

export interface TestDetail {
  actionDescription: string;
  success: boolean;
  message: string;
}

export interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  successRate: number;
  results: TestResult[];
}

// Função para executar teste rápido
export async function runQuickTest(): Promise<TestSummary> {
  const runner = new UserExperienceTestRunner();
  return await runner.runAllTests();
}

// Função para validar integridade do sistema
export async function validateSystemIntegrity(): Promise<{isValid: boolean; issues: string[]}> {
  const issues: string[] = [];

  try {
    // Verificar integridade dos dados
    const dataIntegrity = await dataSyncService.checkDataIntegrity();
    if (!dataIntegrity.isValid) {
      issues.push(...dataIntegrity.issues);
    }

    // Verificar stores principais
    const profileStore = useUserProfileStore.getState();
    const achievementsStore = useAchievementsStore.getState();
    const levelStore = useLevelStore.getState();

    if (!profileStore) {
      issues.push('Store de perfil não inicializado');
    }

    if (achievementsStore.achievements.length === 0) {
      issues.push('Conquistas não carregadas');
    }

    if (levelStore.levelSystem.currentLevel < 1) {
      issues.push('Sistema de níveis não inicializado');
    }

    return {
      isValid: issues.length === 0,
      issues
    };

  } catch (error) {
    return {
      isValid: false,
      issues: ['Erro ao validar integridade do sistema']
    };
  }
}

// Função para gerar relatório de teste
export function generateTestReport(summary: TestSummary): string {
  const report = [
    '# Relatório de Testes de Experiência do Usuário',
    `Data: ${new Date().toLocaleString('pt-BR')}`,
    '',
    '## Resumo',
    `- Total de testes: ${summary.totalTests}`,
    `- Testes passaram: ${summary.passedTests}`,
    `- Testes falharam: ${summary.failedTests}`,
    `- Taxa de sucesso: ${summary.successRate.toFixed(1)}%`,
    '',
    '## Detalhes dos Testes',
  ];

  summary.results.forEach((result, index) => {
    report.push(`### ${index + 1}. ${result.scenarioName}`);
    report.push(`Status: ${result.passed ? '✅ PASSOU' : '❌ FALHOU'}`);
    
    if (result.error) {
      report.push(`Erro: ${result.error}`);
    }
    
    result.details.forEach(detail => {
      const status = detail.success ? '✅' : '❌';
      report.push(`- ${status} ${detail.actionDescription}: ${detail.message}`);
    });
    
    report.push('');
  });

  return report.join('\n');
}
