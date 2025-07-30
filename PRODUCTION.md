# Guia de Produção - HealthFlix

Este documento contém as instruções para configurar e fazer deploy da aplicação HealthFlix em produção.

## 🚀 Configuração para Produção

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` com as seguintes variáveis:

```bash
# Firebase Configuration (OBRIGATÓRIO)
VITE_FIREBASE_API_KEY=sua_chave_firebase_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id

# Admin Configuration
VITE_ADMIN_EMAIL=admin@seudominio.com

# Monitoramento (Opcional)
VITE_SENTRY_DSN=seu_sentry_dsn_aqui

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

### 2. Configuração do Firebase

#### Custom Claims para Admin
Execute no Firebase Functions ou Firebase CLI:

```javascript
// Firebase Functions
const admin = require('firebase-admin');

exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Verificar se o usuário atual é admin
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can set admin claims');
  }

  const uid = data.uid;
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  
  return { message: 'Admin claim set successfully' };
});
```

#### Regras de Segurança do Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        resource.data.role in ['admin', 'moderator'] &&
        request.auth.token.admin == true;
    }
    
    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Public read-only data
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

#### Regras de Storage
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User avatars
    match /avatars/{userId}_{timestamp} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin uploads
    match /admin/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## 🔒 Segurança em Produção

### Headers de Segurança
Configure no seu servidor/CDN:

```nginx
# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://*.firebase.com; frame-src 'none'; object-src 'none';" always;

# Security headers
add_header X-Content-Type-Options nosniff always;
add_header X-Frame-Options DENY always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

### HTTPS Obrigatório
- Configure SSL/TLS com certificado válido
- Redirecione HTTP para HTTPS
- Use HSTS (HTTP Strict Transport Security)

## 📦 Build e Deploy

### 1. Preparação para Deploy
```bash
# Instalar dependências
npm install

# Verificar tipos TypeScript
npm run type-check

# Executar linting
npm run lint:fix

# Executar testes
npm run test:coverage

# Build para produção
npm run build:prod
```

### 2. Deploy Options

#### Netlify
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Firebase Hosting
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy
firebase deploy --only hosting
```

## 🔍 Monitoramento

### 1. Sentry (Error Tracking)
- Configure VITE_SENTRY_DSN no .env.local
- Monitore erros em tempo real
- Configure alertas para erros críticos

### 2. Analytics
- Configure Google Analytics 4
- Firebase Analytics já está integrado
- Monitore métricas de performance

### 3. Performance Monitoring
```bash
# Analisar bundle
npm run build:analyze

# Lighthouse CI para monitoramento contínuo
npm install -g @lhci/cli
lhci autorun
```

## ✅ Checklist de Produção

### Antes do Deploy
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Firebase Custom Claims configurado para admin
- [ ] Regras de segurança do Firestore/Storage aplicadas
- [ ] SSL/TLS configurado
- [ ] Headers de segurança configurados
- [ ] Tests passando (> 80% coverage)
- [ ] Build sem warnings
- [ ] Performance auditado (Lighthouse > 90)

### Após o Deploy
- [ ] Testar fluxo de autenticação
- [ ] Verificar admin access
- [ ] Testar upload de arquivos
- [ ] Verificar integração de pagamentos
- [ ] Monitorar logs de erro
- [ ] Configurar backups automáticos

## 🚨 Troubleshooting

### Problemas Comuns

1. **"Missing Firebase config"**
   - Verificar se todas as variáveis VITE_FIREBASE_* estão configuradas
   - Executar `npm run dev` para ver logs detalhados

2. **"Admin access denied"**
   - Verificar se Custom Claims está configurado
   - Usar Firebase Console para definir claims manualmente

3. **"CSP violations"**
   - Ajustar Content Security Policy headers
   - Verificar recursos externos carregados

### Logs e Debug
```bash
# Ver logs detalhados de build
DEBUG=* npm run build:prod

# Preview local com configuração de produção
npm run preview:prod
```

## 📞 Suporte

Para problemas específicos de produção:
1. Verificar logs do Sentry
2. Consultar Firebase Console
3. Revisar métricas de performance
4. Verificar status dos serviços externos

---

**⚠️ Importante:** Nunca commite arquivos `.env.*` com dados reais para o repositório. Use sempre variáveis de ambiente do sistema de deploy.
