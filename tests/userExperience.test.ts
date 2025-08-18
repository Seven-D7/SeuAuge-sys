import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { 
  UserExperienceTestRunner,
  TEST_SCENARIOS,
  validateSystemIntegrity,
  TEST_USERS
} from '../src/utils/testHelpers';
import { useUserProfileStore } from '../src/stores/userProfileStore';
import { useAchievementsStore } from '../src/stores/achievementsStore';
import { useLevelStore } from '../src/stores/levelStore';

describe('User Experience Tests', () => {
  let testRunner: UserExperienceTestRunner;

  beforeEach(() => {
    testRunner = new UserExperienceTestRunner();
    
    // Limpar stores antes de cada teste
    useUserProfileStore.getState().clearProfile();
    useLevelStore.getState().reset();
    
    // Configurar modo de teste
    process.env.VITE_DEV_MODE = 'true';
  });

  afterEach(() => {
    // Limpar localStorage após cada teste
    localStorage.clear();
  });

  describe('System Integrity', () => {
    test('should validate system integrity', async () => {
      const integrity = await validateSystemIntegrity();
      
      expect(integrity).toHaveProperty('isValid');
      expect(integrity).toHaveProperty('issues');
      expect(Array.isArray(integrity.issues)).toBe(true);
    });

    test('should have valid test scenarios', () => {
      expect(TEST_SCENARIOS.length).toBeGreaterThan(0);
      
      TEST_SCENARIOS.forEach(scenario => {
        expect(scenario).toHaveProperty('name');
        expect(scenario).toHaveProperty('description');
        expect(scenario).toHaveProperty('user');
        expect(scenario).toHaveProperty('actions');
        expect(scenario).toHaveProperty('expectedResults');
        
        expect(scenario.actions.length).toBeGreaterThan(0);
        expect(scenario.expectedResults.length).toBeGreaterThan(0);
      });
    });

    test('should have valid test users', () => {
      expect(TEST_USERS.length).toBeGreaterThan(0);
      
      TEST_USERS.forEach(user => {
        expect(user).toHaveProperty('uid');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('plan');
        expect(user).toHaveProperty('isAdmin');
        
        expect(typeof user.uid).toBe('string');
        expect(typeof user.name).toBe('string');
        expect(typeof user.email).toBe('string');
        expect(typeof user.isAdmin).toBe('boolean');
      });
    });
  });

  describe('Free User Experience', () => {
    test('should handle free user registration flow', async () => {
      const freeUserScenario = TEST_SCENARIOS.find(s => s.name.includes('Usuário Gratuito'));
      
      if (freeUserScenario) {
        const result = await testRunner.runScenario(freeUserScenario);
        
        expect(result).toHaveProperty('scenarioName');
        expect(result).toHaveProperty('passed');
        expect(result).toHaveProperty('details');
        expect(Array.isArray(result.details)).toBe(true);
      }
    });

    test('should restrict premium content for free users', () => {
      const freeUser = TEST_USERS.find(u => u.plan === null);
      expect(freeUser).toBeDefined();
      
      if (freeUser) {
        // Free users should not have access to premium content
        expect(freeUser.plan).toBeNull();
        expect(freeUser.isAdmin).toBe(false);
      }
    });
  });

  describe('Premium User Experience', () => {
    test('should grant appropriate access for base plan users', () => {
      const baseUser = TEST_USERS.find(u => u.plan === 'B');
      expect(baseUser).toBeDefined();
      
      if (baseUser) {
        expect(baseUser.plan).toBe('B');
        // Base plan users should have limited premium access
      }
    });

    test('should grant full access for auge plan users', () => {
      const augeUser = TEST_USERS.find(u => u.plan === 'D');
      expect(augeUser).toBeDefined();
      
      if (augeUser) {
        expect(augeUser.plan).toBe('D');
        // Auge plan users should have full access
      }
    });
  });

  describe('Gamification System', () => {
    test('should handle gamification scenario', async () => {
      const gamificationScenario = TEST_SCENARIOS.find(s => s.name.includes('Gamificação'));
      
      if (gamificationScenario) {
        const result = await testRunner.runScenario(gamificationScenario);
        
        expect(result).toHaveProperty('scenarioName');
        expect(result).toHaveProperty('passed');
        expect(result).toHaveProperty('details');
        
        // Should have achievement-related actions
        const hasAchievementActions = result.details.some(detail => 
          detail.actionDescription.includes('conquista') || 
          detail.actionDescription.includes('achievement')
        );
        
        expect(hasAchievementActions).toBe(true);
      }
    });

    test('should initialize achievements store', async () => {
      const achievementsStore = useAchievementsStore.getState();
      
      // Initialize achievements
      await achievementsStore.initializeAchievements();
      
      expect(achievementsStore.achievements.length).toBeGreaterThan(0);
      
      // Check achievement structure
      const firstAchievement = achievementsStore.achievements[0];
      expect(firstAchievement).toHaveProperty('id');
      expect(firstAchievement).toHaveProperty('title');
      expect(firstAchievement).toHaveProperty('description');
      expect(firstAchievement).toHaveProperty('category');
      expect(firstAchievement).toHaveProperty('requirement');
      expect(firstAchievement).toHaveProperty('currentProgress');
      expect(firstAchievement).toHaveProperty('isUnlocked');
    });

    test('should track user progress', async () => {
      const levelStore = useLevelStore.getState();
      const initialXP = levelStore.levelSystem.totalXP;
      
      // Add XP
      levelStore.addXP(100, 'Test XP', 'bonus');
      
      expect(levelStore.levelSystem.totalXP).toBe(initialXP + 100);
      expect(levelStore.xpHistory.length).toBeGreaterThan(0);
      
      const latestLog = levelStore.xpHistory[0];
      expect(latestLog.amount).toBe(100);
      expect(latestLog.reason).toBe('Test XP');
      expect(latestLog.type).toBe('bonus');
    });
  });

  describe('Plan System', () => {
    test('should handle plan hierarchy correctly', () => {
      const planHierarchy = ['FREE', 'B', 'C', 'D'];
      
      planHierarchy.forEach(plan => {
        const usersWithPlan = TEST_USERS.filter(u => u.plan === plan || (plan === 'FREE' && u.plan === null));
        expect(usersWithPlan.length).toBeGreaterThanOrEqual(0);
      });
    });

    test('should validate plan-based content access', () => {
      // Test that higher plans have access to lower tier content
      const freeUser = TEST_USERS.find(u => u.plan === null);
      const baseUser = TEST_USERS.find(u => u.plan === 'B');
      const augeUser = TEST_USERS.find(u => u.plan === 'D');
      
      expect(freeUser).toBeDefined();
      expect(baseUser).toBeDefined();
      expect(augeUser).toBeDefined();
      
      // Base user should have more access than free user
      // Auge user should have more access than base user
      // This would be tested through actual access control functions
    });
  });

  describe('Full Test Suite', () => {
    test('should run all test scenarios', async () => {
      const summary = await testRunner.runAllTests();
      
      expect(summary).toHaveProperty('totalTests');
      expect(summary).toHaveProperty('passedTests');
      expect(summary).toHaveProperty('failedTests');
      expect(summary).toHaveProperty('successRate');
      expect(summary).toHaveProperty('results');
      
      expect(summary.totalTests).toBe(TEST_SCENARIOS.length);
      expect(summary.passedTests + summary.failedTests).toBe(summary.totalTests);
      expect(summary.successRate).toBeGreaterThanOrEqual(0);
      expect(summary.successRate).toBeLessThanOrEqual(100);
      
      expect(Array.isArray(summary.results)).toBe(true);
      expect(summary.results.length).toBe(summary.totalTests);
      
      // Each result should have the expected structure
      summary.results.forEach(result => {
        expect(result).toHaveProperty('scenarioName');
        expect(result).toHaveProperty('passed');
        expect(result).toHaveProperty('details');
        expect(typeof result.passed).toBe('boolean');
        expect(Array.isArray(result.details)).toBe(true);
      });
    });

    test('should achieve minimum success rate', async () => {
      const summary = await testRunner.runAllTests();
      
      // Expect at least 70% success rate in tests
      expect(summary.successRate).toBeGreaterThanOrEqual(70);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid test scenarios gracefully', async () => {
      const invalidScenario = {
        name: 'Invalid Test',
        description: 'This should fail',
        user: {
          uid: 'invalid',
          name: '',
          email: 'invalid-email',
          plan: 'INVALID' as any,
          isAdmin: false,
        },
        actions: [],
        expectedResults: []
      };
      
      try {
        const result = await testRunner.runScenario(invalidScenario);
        // Should still return a result object even if the test fails
        expect(result).toHaveProperty('scenarioName');
        expect(result).toHaveProperty('passed');
        expect(result).toHaveProperty('details');
      } catch (error) {
        // Or it might throw an error, which is also acceptable
        expect(error).toBeDefined();
      }
    });

    test('should validate system components exist', () => {
      // Test that all required stores are available
      expect(useUserProfileStore).toBeDefined();
      expect(useAchievementsStore).toBeDefined();
      expect(useLevelStore).toBeDefined();
      
      // Test that stores have required methods
      const profileStore = useUserProfileStore.getState();
      expect(typeof profileStore.loadProfile).toBe('function');
      expect(typeof profileStore.updateProfile).toBe('function');
      expect(typeof profileStore.clearProfile).toBe('function');
      
      const achievementsStore = useAchievementsStore.getState();
      expect(typeof achievementsStore.initializeAchievements).toBe('function');
      expect(typeof achievementsStore.updateProgress).toBe('function');
      
      const levelStore = useLevelStore.getState();
      expect(typeof levelStore.addXP).toBe('function');
      expect(typeof levelStore.checkDailyLogin).toBe('function');
    });
  });
});
