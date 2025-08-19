# Configuração do Supabase

Este projeto foi configurado para usar Supabase como backend principal, substituindo o Firebase.

## Configuração Inicial

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização
5. Configure o nome do projeto, senha do banco de dados e região
6. Aguarde a criação do projeto (pode levar alguns minutos)

### 2. Obter Credenciais

No dashboard do seu projeto Supabase:

1. Vá para Settings > API
2. Copie a "Project URL" 
3. Copie a "anon public" key
4. Cole essas informações no arquivo `.env`

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima

# Admin Configuration
VITE_ADMIN_EMAIL=admin@seuauge.com
```

### 4. Executar Migrações do Banco de Dados

#### Opção 1: Via Dashboard (Recomendado)
1. No dashboard do Supabase, vá para "SQL Editor"
2. Copie e cole o conteúdo do arquivo `supabase/schema.sql`
3. Execute o script

#### Opção 2: Via CLI do Supabase
```bash
# Instalar CLI do Supabase
npm install -g supabase

# Fazer login
supabase login

# Conectar ao projeto
supabase link --project-ref SEU_PROJECT_REF

# Executar migrações
supabase db push
```

### 5. Configurar Autenticação

No dashboard do Supabase:

1. Vá para Authentication > Settings
2. Configure os provedores de autenticação desejados
3. Para email/senha, certifique-se de que está habilitado
4. Configure URLs de redirecionamento se necessário

### 6. Configurar RLS (Row Level Security)

O esquema já inclui políticas RLS para segurança. Certifique-se de que:

1. RLS está habilitado em todas as tabelas
2. As políticas estão funcionando corretamente
3. Usuários só podem acessar seus próprios dados

## Estrutura do Banco de Dados

### Tabelas Principais

- **profiles**: Perfis dos usuários
- **videos**: Catálogo de vídeos
- **user_progress**: Progresso dos usuários nos v��deos
- **user_favorites**: Vídeos favoritos dos usuários
- **user_achievements**: Conquistas dos usuários
- **user_goals**: Metas dos usuários
- **user_activity**: Registro de atividades
- **user_level**: Sistema de níveis e XP
- **products**: Produtos da loja de apps
- **user_purchases**: Compras dos usuários

### Políticas de Segurança (RLS)

Todas as tabelas possuem políticas RLS que garantem:

- Usuários só acessam seus próprios dados
- Admins têm acesso completo quando necessário
- Dados públicos (como vídeos) são acessíveis a todos

## Integração com o Frontend

### Contexto de Autenticação

O projeto usa `SupabaseAuthContext` que fornece:

```typescript
{
  user: User | null,
  session: Session | null,
  login: (email, password) => Promise<void>,
  register: (email, password, name, birthdate) => Promise<void>,
  logout: () => Promise<void>,
  updateUser: (data) => Promise<void>,
  refreshPlan: () => Promise<void>,
  loading: boolean
}
```

### Serviços Disponíveis

- `src/services/supabase/user.ts`: Operações de usuário
- `src/services/supabase/video.ts`: Operações de vídeo

### Modo Demo

Para desenvolvimento, o sistema funciona em modo demo quando as variáveis de ambiente não estão configuradas.

## Migração do Firebase

Se você est�� migrando do Firebase:

1. Exporte seus dados do Firebase
2. Adapte o formato para o esquema Supabase
3. Importe os dados via dashboard ou API
4. Teste todas as funcionalidades
5. Atualize as variáveis de ambiente para usar Supabase

## Monitoramento e Logs

- Use o dashboard do Supabase para monitorar queries
- Ative logs de autenticação se necessário
- Configure alertas para erros

## Backup e Recovery

- Supabase faz backup automático
- Para backups manuais, use o CLI ou dashboard
- Teste procedures de recovery regularmente

## Troubleshooting

### Problema: "Invalid JWT"
- Verifique se as chaves no .env estão corretas
- Confirme se o projeto está ativo no Supabase

### Problema: "RLS violation"
- Verifique as políticas RLS
- Confirme se o usuário está autenticado
- Teste as políticas no SQL Editor

### Problema: "Connection failed"
- Verifique a URL do projeto
- Confirme a conectividade de rede
- Verifique se o projeto não foi pausado

## Próximos Passos

1. Configure as variáveis de ambiente
2. Execute as migrações do banco
3. Teste a autenticação
4. Importe dados se necessário
5. Configure monitoramento

Para conectar facilmente ao Supabase, você também pode usar o MCP (Model Context Protocol) através do botão "Open MCP popover" na interface.
