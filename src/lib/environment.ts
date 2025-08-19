// Environment validation and configuration for production

interface EnvironmentConfig {
  isProduction: boolean;
  isDevelopment: boolean;
  supabase: {
    url: string;
    anonKey: string;
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
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];

  if (import.meta.env.PROD) {
    const missingVars = requiredProdVars.filter(
      varName => !import.meta.env[varName]
    );

    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables for production:', missingVars);
      throw new Error(`Production build requires these environment variables: ${missingVars.join(', ')}`);
    }

    // Validate Supabase URL format
    if (!import.meta.env.VITE_SUPABASE_URL?.startsWith('https://')) {
      console.warn('⚠️ Supabase URL should start with https://');
    }

    if (!import.meta.env.VITE_SUPABASE_URL?.includes('.supabase.co')) {
      console.warn('⚠️ Supabase URL format seems incorrect');
    }
  }
}

// Create environment configuration
function createEnvironmentConfig(): EnvironmentConfig {
  if (import.meta.env.PROD) {
    validateEnvironment();
  }

  return {
    isProduction: import.meta.env.PROD,
    isDevelopment: import.meta.env.DEV,
    
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL || '',
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
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

    // Check Supabase configuration
    if (!config.supabase.url) {
      issues.push('Missing Supabase URL');
    }

    if (!config.supabase.anonKey) {
      issues.push('Missing Supabase anon key');
    }

    // Check security configuration
    if (config.isProduction && !config.security.adminEmail) {
      issues.push('Admin email not configured for production');
    }

    // Check for local/demo values in production
    if (config.isProduction) {
      if (config.supabase.url.includes('localhost') || config.supabase.url.includes('demo')) {
        issues.push('Demo/development values found in production Supabase configuration');
      }
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
  try {
    const config = createEnvironmentConfig();
    const readiness = checkProductionReadiness();

    console.log(`🚀 Environment: ${config.isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`🗃️ Supabase: ${config.supabase.url ? 'Configured' : 'Not configured'}`);
    console.log(`📊 Analytics: ${config.features.analytics ? 'Enabled' : 'Disabled'}`);
    console.log(`⚡ Performance Monitoring: ${config.features.performanceMonitoring ? 'Enabled' : 'Disabled'}`);
    console.log(`🐛 Error Tracking: ${config.features.errorTracking ? 'Enabled' : 'Disabled'}`);

    if (!readiness.ready) {
      console.warn('⚠️ Production readiness issues:');
      readiness.issues.forEach(issue => console.warn(`  - ${issue}`));
    } else {
      console.log('✅ Production ready');
    }
  } catch (error) {
    console.error('❌ Environment configuration error:', error);
  }
}

export const env = createEnvironmentConfig();
export default env;
