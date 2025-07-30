// Environment validation and configuration for production

interface EnvironmentConfig {
  isProduction: boolean;
  isDevelopment: boolean;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  features: {
    analytics: boolean;
    performanceMonitoring: boolean;
    errorTracking: boolean;
  };
  security: {
    enableCSP: boolean;
    adminEmail?: string;
  };
}

// Validate required environment variables
function validateEnvironment(): void {
  const requiredProdVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  if (import.meta.env.PROD) {
    const missingVars = requiredProdVars.filter(
      varName => !import.meta.env[varName] || import.meta.env[varName].includes('demo')
    );

    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables for production:', missingVars);
      throw new Error(`Production build requires these environment variables: ${missingVars.join(', ')}`);
    }

    // Validate Firebase config format
    if (!import.meta.env.VITE_FIREBASE_API_KEY?.startsWith('AIza')) {
      console.warn('⚠️ Firebase API key format seems incorrect');
    }

    if (!import.meta.env.VITE_FIREBASE_PROJECT_ID?.match(/^[a-z0-9-]+$/)) {
      console.warn('⚠️ Firebase project ID format seems incorrect');
    }
  }
}

// Create environment configuration
function createEnvironmentConfig(): EnvironmentConfig {
  validateEnvironment();

  return {
    isProduction: import.meta.env.PROD,
    isDevelopment: import.meta.env.DEV,
    
    firebase: {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    },

    features: {
      analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
      performanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
      errorTracking: !!import.meta.env.VITE_SENTRY_DSN,
    },

    security: {
      enableCSP: import.meta.env.PROD,
      adminEmail: import.meta.env.VITE_ADMIN_EMAIL,
    },
  };
}

// Production readiness checker
export function checkProductionReadiness(): { ready: boolean; issues: string[] } {
  const issues: string[] = [];

  try {
    const config = createEnvironmentConfig();

    // Check Firebase configuration
    if (!config.firebase.apiKey) {
      issues.push('Missing Firebase API key');
    }

    if (!config.firebase.projectId) {
      issues.push('Missing Firebase project ID');
    }

    // Check security configuration
    if (config.isProduction && !config.security.adminEmail) {
      issues.push('Admin email not configured for production');
    }

    // Check for demo/development values in production
    if (config.isProduction) {
      Object.values(config.firebase).forEach(value => {
        if (value.includes('demo') || value.includes('localhost')) {
          issues.push('Demo/development values found in production configuration');
        }
      });
    }

    return {
      ready: issues.length === 0,
      issues,
    };
  } catch (error) {
    return {
      ready: false,
      issues: [error instanceof Error ? error.message : 'Environment validation failed'],
    };
  }
}

// Log environment status
export function logEnvironmentStatus(): void {
  const config = createEnvironmentConfig();
  const readiness = checkProductionReadiness();

  console.log(`🚀 Environment: ${config.isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`🔧 Firebase Project: ${config.firebase.projectId || 'Not configured'}`);
  console.log(`📊 Analytics: ${config.features.analytics ? 'Enabled' : 'Disabled'}`);
  console.log(`⚡ Performance Monitoring: ${config.features.performanceMonitoring ? 'Enabled' : 'Disabled'}`);
  console.log(`🐛 Error Tracking: ${config.features.errorTracking ? 'Enabled' : 'Disabled'}`);

  if (!readiness.ready) {
    console.warn('⚠️ Production readiness issues:');
    readiness.issues.forEach(issue => console.warn(`  - ${issue}`));
  } else {
    console.log('✅ Production ready');
  }
}

export const env = createEnvironmentConfig();
export default env;
