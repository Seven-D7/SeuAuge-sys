# 🚀 Configuração do Stripe para Produção

Este guia te ajudará a configurar o Stripe adequadamente para processar pagamentos reais no seu sistema.

## 📋 Pré-requisitos

1. Conta no [Stripe](https://stripe.com)
2. Planos configurados no Dashboard do Stripe
3. Backend/API configurado para processar webhooks

## 🛠️ Configuração no Dashboard do Stripe

### 1. Criar Conta e Ativar Pagamentos

1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Complete o processo de verificação da conta
3. Configure os métodos de pagamento aceitos
4. Configure as informações bancárias para recebimento

### 2. Criar Produtos e Preços

Os seguintes Price IDs já estão configurados no código e devem ser criados no Stripe:

```
Plano Base (Mensal):    price_1QOtW8KOVEOQAyMUqg7NKQAB   - R$ 97,00
Plano Escalada (Trim.): price_1QOtW8KOVEOQAyMUqg7NKQAC   - R$ 249,00  
Plano Auge (Anual):     price_1QOtW8KOVEOQAyMUqg7NKQAD   - R$ 780,00
```

**Como criar:**
1. Dashboard → Products → Create product
2. Configure nome, descrição e preço
3. **IMPORTANTE**: Use exatamente os Price IDs listados acima

### 3. Configurar Webhooks

1. Dashboard → Developers → Webhooks
2. Add endpoint: `https://sua-api.com/api/stripe-webhook`
3. Eventos a escutar:
   - `checkout.session.completed`
   - `payment_intent.succeeded` 
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

## 🔑 Configuração das Credenciais

### 1. Obter Chaves do Stripe

No Dashboard do Stripe:
1. Developers → API keys
2. Copie a **Publishable key** (pk_live_...)
3. Copie a **Secret key** (sk_live_...) - NUNCA exponha no frontend

### 2. Configurar Variáveis de Ambiente

**Frontend (já configuradas via DevServerControl):**
```env
VITE_STRIPE_PUBLIC_KEY=pk_live_SUA_CHAVE_PUBLICA_AQUI
VITE_API_URL=https://sua-api.com/api
```

**Backend (.env do servidor):**
```env
STRIPE_SECRET_KEY=sk_live_SUA_CHAVE_SECRETA_AQUI
STRIPE_WEBHOOK_SECRET=whsec_SUA_WEBHOOK_SECRET_AQUI
```

## 🖥️ Backend - Exemplo de Implementação

### Estrutura mínima necessária:

```
api/
├── create-checkout-session    # POST - Criar sessão de checkout
├── payment-status/:sessionId  # GET  - Verificar status do pagamento
└── stripe-webhook            # POST - Receber webhooks do Stripe
```

### Exemplo em Node.js/Express:

```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

// Middleware para webhook (raw body)
app.use('/api/stripe-webhook', express.raw({type: 'application/json'}));
app.use(express.json());

// Criar sessão de checkout
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, planId, userId, userEmail, successUrl, cancelUrl } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // ou 'subscription' para recorrente
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      customer_email: userEmail,
      metadata: {
        userId,
        planId
      },
      success_url: successUrl + '&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verificar status do pagamento
app.get('/api/payment-status/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    
    res.json({
      status: session.payment_status,
      planId: session.metadata.planId,
      userId: session.metadata.userId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook do Stripe
app.post('/api/stripe-webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed.`);
  }

  // Processar eventos
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Ativar plano do usuário no banco de dados
      console.log('Payment succeeded for session:', session.id);
      break;
      
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

## 🧪 Testes

### 1. Modo Teste (Sandbox)

Para testar, use as chaves de teste:
- `pk_test_...` (frontend)
- `sk_test_...` (backend)

**Cartões de teste:**
- Sucesso: `4242 4242 4242 4242`
- Falha: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

### 2. Validação da Configuração

O sistema automaticamente:
✅ Detecta se há chave real configurada  
✅ Usa checkout real se configurado corretamente  
✅ Fallback para simulação se não configurado  

## 🔒 Segurança

**NUNCA faça:**
- ❌ Expor a Secret Key no frontend
- ❌ Processar pagamentos no frontend
- ❌ Confiar apenas na resposta do frontend

**SEMPRE faça:**
- ✅ Validar pagamentos via webhook no backend
- ✅ Usar HTTPS em produção
- ✅ Verificar assinatura dos webhooks
- ✅ Implementar logs de auditoria

## 📞 Suporte

**Problemas comuns:**
1. **Webhook não funciona**: Verifique URL e assinatura
2. **Pagamento não ativa plano**: Verifique processamento do webhook
3. **Erro de CORS**: Configure headers no backend

**Recursos úteis:**
- [Documentação Stripe](https://stripe.com/docs)
- [Dashboard Stripe](https://dashboard.stripe.com)
- [Logs de webhook](https://dashboard.stripe.com/webhooks)

---

## ✅ Checklist de Produção

- [ ] Conta Stripe verificada e ativa
- [ ] Produtos/preços criados com Price IDs corretos
- [ ] Webhooks configurados
- [ ] Backend implementado e funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Testes realizados com cartões de teste
- [ ] SSL/HTTPS configurado
- [ ] Logs e monitoramento implementados

## 🚀 Próximos Passos

1. **Configure suas chaves reais**: Substitua os placeholders pelas chaves do Stripe
2. **Implemente o backend**: Use o exemplo fornecido
3. **Configure webhooks**: Essencial para ativar planos automaticamente
4. **Teste tudo**: Use cartões de teste antes de ir ao ar

**Após configurar, o sistema processará pagamentos reais automaticamente!**
