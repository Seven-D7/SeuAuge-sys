# Configuração do Firebase

## Modo Atual: DEMO

O projeto está atualmente rodando em **modo demo** com autenticação simulada. Isso significa que:

- ✅ Todas as funcionalidades da interface funcionam normalmente
- ✅ Login/registro simulados (aceita qualquer email/senha)
- ✅ Todos os recursos estão disponíveis
- ❌ Dados não são persistidos no Firebase real
- ❌ Funcionalidades que dependem do Firebase real estão simuladas

## Para Produção: Configurar Firebase Real

### 1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Siga o assistente de criação

### 2. Configurar Authentication

1. No console Firebase, vá para **Authentication**
2. Clique em **Começar**
3. Na aba **Sign-in method**, ative **Email/Password**

### 3. Configurar Firestore Database

1. Vá para **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha modo de **produção** ou **teste**
4. Selecione uma localização

### 4. Configurar Storage

1. Vá para **Storage**
2. Clique em **Começar**
3. Configure as regras de segurança

### 5. Obter Configurações

1. Vá para **Configurações do projeto** (ícone de engrenagem)
2. Na seção **Geral**, role até **Seus aplicativos**
3. Clique em **Web** (ícone `</>`)
4. Registre seu app e copie a configuração

### 6. Atualizar Variáveis de Ambiente

Substitua as variáveis no arquivo `.env`:

```env
# Firebase configuration REAL
VITE_FIREBASE_API_KEY=sua_api_key_real
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### 7. Configurar Regras de Segurança

#### Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### Storage Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Status Atual

- ✅ **Configuração demo funcionando**
- ⏳ **Aguardando configuração de produção**
- 🔧 **Modo demo ativo no console do navegador**

## Verificação

Após configurar o Firebase real:

1. Reinicie o servidor (`npm run dev`)
2. Verifique se não há mais mensagens de "modo demo" no console
3. Teste login/registro com dados reais
4. Confirme que os dados são persistidos no Firestore

---

**Nota**: O projeto continua funcionando perfeitamente em modo demo para desenvolvimento e demonstrações.
