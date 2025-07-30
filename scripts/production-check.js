#!/usr/bin/env node

// Production Readiness Check Script
const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - Missing: ${filePath}`, 'red');
    return false;
  }
}

function checkEnvVar(varName, description, required = true) {
  const value = process.env[varName];
  if (value && !value.includes('demo') && !value.includes('localhost')) {
    log(`✅ ${description}`, 'green');
    return true;
  } else if (required) {
    log(`❌ ${description} - Missing or invalid: ${varName}`, 'red');
    return false;
  } else {
    log(`⚠️  ${description} - Optional: ${varName}`, 'yellow');
    return true;
  }
}

function checkDependencies() {
  log('\n📦 Checking Dependencies...', 'blue');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    'react', 'react-dom', 'firebase', 'react-router-dom',
    'zustand', '@sentry/react', 'lucide-react'
  ];
  
  let allFound = true;
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      log(`✅ ${dep}`, 'green');
    } else {
      log(`❌ ${dep} - Missing dependency`, 'red');
      allFound = false;
    }
  });
  
  return allFound;
}

function checkBuildFiles() {
  log('\n🏗️  Checking Build Files...', 'blue');
  
  const checks = [
    ['src/firebase.ts', 'Firebase configuration'],
    ['src/contexts/AuthContext.tsx', 'Authentication context'],
    ['src/components/ErrorBoundary.tsx', 'Error boundary component'],
    ['src/lib/security.ts', 'Security utilities'],
    ['src/lib/environment.ts', 'Environment validation'],
    ['vite.config.ts', 'Vite configuration'],
    ['PRODUCTION.md', 'Production documentation'],
    ['firebase-functions-template.js', 'Firebase Functions template']
  ];
  
  return checks.every(([file, desc]) => checkFile(file, desc));
}

function checkEnvironmentVariables() {
  log('\n🔧 Checking Environment Variables...', 'blue');
  
  // Load .env.local if exists
  const envLocalPath = '.env.local';
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key] = value.replace(/"/g, '');
      }
    });
  }
  
  const requiredVars = [
    ['VITE_FIREBASE_API_KEY', 'Firebase API Key'],
    ['VITE_FIREBASE_AUTH_DOMAIN', 'Firebase Auth Domain'],
    ['VITE_FIREBASE_PROJECT_ID', 'Firebase Project ID'],
    ['VITE_FIREBASE_STORAGE_BUCKET', 'Firebase Storage Bucket'],
    ['VITE_FIREBASE_MESSAGING_SENDER_ID', 'Firebase Messaging Sender ID'],
    ['VITE_FIREBASE_APP_ID', 'Firebase App ID']
  ];
  
  const optionalVars = [
    ['VITE_ADMIN_EMAIL', 'Admin Email'],
    ['VITE_SENTRY_DSN', 'Sentry DSN'],
    ['VITE_ENABLE_ANALYTICS', 'Analytics Flag'],
    ['VITE_ENABLE_PERFORMANCE_MONITORING', 'Performance Monitoring Flag']
  ];
  
  let allRequired = true;
  
  requiredVars.forEach(([varName, desc]) => {
    if (!checkEnvVar(varName, desc, true)) {
      allRequired = false;
    }
  });
  
  optionalVars.forEach(([varName, desc]) => {
    checkEnvVar(varName, desc, false);
  });
  
  return allRequired;
}

function checkSecurityConfiguration() {
  log('\n🔒 Checking Security Configuration...', 'blue');
  
  const securityChecks = [
    {
      name: 'Error boundary implemented',
      check: () => fs.existsSync('src/components/ErrorBoundary.tsx')
    },
    {
      name: 'Security utilities implemented',
      check: () => fs.existsSync('src/lib/security.ts')
    },
    {
      name: 'Environment validation implemented',
      check: () => fs.existsSync('src/lib/environment.ts')
    },
    {
      name: 'Production documentation exists',
      check: () => fs.existsSync('PRODUCTION.md')
    },
    {
      name: 'Firebase Functions template available',
      check: () => fs.existsSync('firebase-functions-template.js')
    }
  ];
  
  return securityChecks.every(({ name, check }) => {
    if (check()) {
      log(`✅ ${name}`, 'green');
      return true;
    } else {
      log(`❌ ${name}`, 'red');
      return false;
    }
  });
}

function checkBuildConfiguration() {
  log('\n⚙️  Checking Build Configuration...', 'blue');
  
  const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
  
  const buildChecks = [
    {
      name: 'Build target set to es2020',
      check: () => viteConfig.includes("target: 'es2020'")
    },
    {
      name: 'Source maps disabled for production',
      check: () => viteConfig.includes('sourcemap: false')
    },
    {
      name: 'Console removal configured',
      check: () => viteConfig.includes('drop_console: true')
    },
    {
      name: 'Manual chunks configured',
      check: () => viteConfig.includes('manualChunks')
    }
  ];
  
  return buildChecks.every(({ name, check }) => {
    if (check()) {
      log(`✅ ${name}`, 'green');
      return true;
    } else {
      log(`❌ ${name}`, 'red');
      return false;
    }
  });
}

function generateReport(results) {
  log('\n📊 Production Readiness Report', 'blue');
  log('================================', 'blue');
  
  const totalChecks = Object.keys(results).length;
  const passedChecks = Object.values(results).filter(Boolean).length;
  const score = Math.round((passedChecks / totalChecks) * 100);
  
  log(`Score: ${score}%`, score >= 90 ? 'green' : score >= 70 ? 'yellow' : 'red');
  log(`Passed: ${passedChecks}/${totalChecks}`, 'blue');
  
  if (score >= 90) {
    log('\n�� Application is ready for production!', 'green');
    log('Next steps:', 'blue');
    log('1. Run: npm run prepare-deploy', 'blue');
    log('2. Configure Firebase Functions using firebase-functions-template.js', 'blue');
    log('3. Set up monitoring and alerting', 'blue');
    log('4. Configure CDN and security headers', 'blue');
  } else if (score >= 70) {
    log('\n⚠️  Application needs some improvements before production', 'yellow');
    log('Please address the failed checks above', 'yellow');
  } else {
    log('\n🚨 Application is NOT ready for production', 'red');
    log('Critical issues must be resolved before deploying', 'red');
  }
  
  return score >= 90;
}

function main() {
  log('🚀 HealthFlix Production Readiness Check', 'blue');
  log('========================================', 'blue');
  
  const results = {
    dependencies: checkDependencies(),
    buildFiles: checkBuildFiles(),
    environment: checkEnvironmentVariables(),
    security: checkSecurityConfiguration(),
    buildConfig: checkBuildConfiguration()
  };
  
  const isReady = generateReport(results);
  process.exit(isReady ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = { main };
