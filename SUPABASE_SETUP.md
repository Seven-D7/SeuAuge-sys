# 🚀 Configuração do Supabase

Este projeto agora usa **Supabase** como backend principal para autenticação, banco de dados e storage. O Firebase é mantido apenas para hospedagem.

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Node.js e npm instalados
3. Projeto criado no Supabase Dashboard

## 🛠️ Configuração Inicial

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login/cadastro
3. Clique em "New project"
4. Escolha uma organização
5. Configure:
   - **Name**: Meu Auge (ou nome do seu projeto)
   - **Database Password**: Senha segura (salve em local seguro!)
   - **Region**: South America (São Paulo) para melhor performance no Brasil
   - **Pricing Plan**: Pode começar com o Free tier

### 2. Configurar Schema do Banco

1. No Dashboard do Supabase, vá para **SQL Editor**
2. Clique em "New query"
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em "Run"
5. Aguarde a execução (pode levar alguns segundos)

### 3. Configurar Variáveis de Ambiente

1. No Dashboard do Supabase, vá para **Settings > API**
2. Copie os valores de:
   - **Project URL** 
   - **anon public** key

3. Crie/edite o arquivo `.env` na raiz do projeto:

```env
# ===================================
# SUPABASE CONFIGURATION (Principal)
# ===================================
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# ===================================
# FIREBASE CONFIGURATION (Hospedagem)
# ===================================
VITE_FIREBASE_PROJECT_ID=seu-projeto-firebase

# ===================================
# APPLICATION CONFIGURATION
# ===================================
VITE_ADMIN_EMAIL=seu-email@dominio.com
```

### 4. Configurar Storage

1. No Dashboard do Supabase, vá para **Storage**
2. Verifique se o bucket `avatars` foi criado
3. Se não existir, crie um novo bucket:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Sim
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/*`

### 5. Configurar Authentication

1. No Dashboard do Supabase, vá para **Authentication > Settings**
2. Configure **Site URL**: `http://localhost:5173` (desenvolvimento)
3. Configure **Email Templates** conforme necessário
4. Em **Auth Providers**, certifique-se que **Email** está habilitado

## 🔧 Testando a Configuração

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Teste o sistema:
   - Acesse `http://localhost:5173`
   - Tente criar uma conta
   - Faça login
   - Verifique se o perfil é criado no Supabase

## 📊 Verificando no Dashboard

### Dados dos Usuários
- **Authentication > Users**: Lista de usuários registrados
- **Table Editor > user_profiles**: Perfis dos usuários

### Logs e Monitoramento
- **Logs**: Visualizar logs da API
- **Database > Logs**: Logs do PostgreSQL

## 🔒 Segurança e RLS

O projeto está configurado com **Row Level Security (RLS)** ativado:

- ✅ Usuários só podem ver/editar seus próprios dados
- ✅ Admins têm acesso completo
- ✅ Policies configuradas para cada tabela
- ✅ Storage com acesso controlado

## 🚀 Deploy para Produção

### 1. Configurar Domínio de Produção

No Supabase Dashboard:
1. **Authentication > Settings**
2. **Site URL**: `https://seu-dominio.com`
3. **Redirect URLs**: Adicionar URLs de produção

### 2. Variáveis de Ambiente de Produção

Configure as mesmas variáveis no seu serviço de hosting (Vercel, Netlify, etc.)

### 3. Configurar CORS

Se necessário, configure CORS no Supabase para seu domínio de produção.

## 🎯 Recursos Disponíveis

### Autenticação
- ✅ Login/Registro com email/senha
- ✅ Recuperação de senha
- ✅ Perfis de usuário
- ✅ Sistema de roles (user/admin/moderator)

### Banco de Dados
- ✅ Perfis de usuário
- ✅ Sistema de planos
- ✅ Métricas corporais
- ✅ Logs de auditoria
- ✅ Assinaturas

### Storage
- ✅ Upload de avatars
- ✅ Imagens públicas
- ✅ Validação de arquivos

## 🆘 Troubleshooting

### Erro "Invalid API key"
- Verifique se as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão corretas
- Certifique-se que o arquivo `.env` está na raiz do projeto

### Erro "relation does not exist" 
- Execute o script `supabase-schema.sql` no SQL Editor
- Verifique se todas as tabelas foram criadas

### Erro de permissão (RLS)
- Verifique se as policies estão ativas
- Confirme se o usuário está autenticado

### Upload de imagens falha
- Verifique se o bucket `avatars` existe
- Confirme as políticas de storage
- Verifique tamanho/tipo do arquivo

## 📞 Suporte

Se encontrar problemas:

1. **Logs do Supabase**: Verifique os logs no Dashboard
2. **Console do Browser**: Verifique erros no DevTools
3. **Documentação**: [docs.supabase.com](https://docs.supabase.com)

## 🔄 Migração de Dados

Se você tinha dados no Firebase, será necessário migrar:

1. Exporte dados do Firestore
2. Transforme para formato PostgreSQL
3. Importe no Supabase via SQL ou API

> **Nota**: Este projeto foi migrado para usar Supabase como backend principal. O Firebase permanece configurado apenas para hospedagem.
