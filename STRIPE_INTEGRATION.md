# Integração com Stripe - Meu Auge

## 📋 Visão Geral

A plataforma Meu Auge agora possui integração direta com o Stripe para processamento de pagamentos. Quando o usuário clica em "Assinar Agora", ele é redirecionado diretamente para o Stripe Checkout.

## 🔧 Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Stripe configuration
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
VITE_STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 2. Configuração dos Price IDs no Stripe

No arquivo `src/services/stripe.ts`, configure os Price IDs reais do seu dashboard Stripe:

```typescript
const STRIPE_PLAN_CONFIG = {
  B: {
    priceId: "price_1234567890", // Substitua pelo Price ID real
    price: 97.0,
    name: "Plano Base - Mensal",
    interval: "month",
  },
  C: {
    priceId: "price_0987654321", // Substitua pelo Price ID real
    price: 249.0,
    name: "Plano Escalada - Trimestral",
    interval: "quarter",
  },
  D: {
    priceId: "price_1122334455", // Substitua pelo Price ID real
    price: 780.0,
    name: "Plano Auge - Anual",
    interval: "year",
  },
};
```

### 3. Backend Required

Para funcionar corretamente, você precisa de um backend que:

1. **Crie sessões de checkout**: Endpoint `POST /api/create-checkout-session`
2. **Verifique status de pagamento**: Endpoint `GET /api/payment-status/:sessionId`
3. **Processe webhooks**: Endpoint `POST /api/stripe-webhook`

#### Exemplo de endpoint para criar sessão (Node.js/Express):

```javascript
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { priceId, planId, userId, userEmail, successUrl, cancelUrl } =
      req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      metadata: {
        planId,
        userId,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🚀 Fluxo de Pagamento

1. **Usuário clica "Assinar Agora"** na página de planos
2. **Frontend chama** `redirectToStripeCheckout()`
3. **Backend cria** sessão de checkout no Stripe
4. **Usuário é redirecionado** para Stripe Checkout
5. **Após pagamento**, usuário retorna para `/payment-success`
6. **Sistema verifica** status do pagamento
7. **Plano é ativado** automaticamente

## 🛠️ Modo Desenvolvimento

Em modo desenvolvimento (`VITE_DEV_MODE=true`), o sistema:

- Simula checkout com confirmação via `window.confirm()`
- Redireciona para página de sucesso com parâmetro `simulated=true`
- Ativa o plano normalmente sem integração real com Stripe

## 📁 Arquivos Principais

- `src/services/stripe.ts` - Serviço de integração com Stripe
- `src/pages/Plans.tsx` - Página de planos com botões integrados
- `src/pages/PaymentSuccess.tsx` - Página de confirmação de pagamento
- `src/services/plan.ts` - Gerenciamento de planos do usuário

## 🔐 Segurança

- Chaves públicas do Stripe expostas no frontend são seguras
- Chaves secretas devem ficar APENAS no backend
- Validação de pagamento sempre no servidor via webhooks
- Metadata do usuário incluída nas sessões para tracking

## 🎨 Personalização

### Botões de Pagamento

Os botões são automaticamente estilizados com:

- Loading state durante processamento
- Cores diferentes para plano popular (dourado)
- Estados desabilitados para planos indisponíveis

### Página de Sucesso

Personalizada com:

- Benefícios específicos do plano contratado
- Próximos passos para o usuário
- Links para dashboard e exploração de conteúdo

## 🐛 Troubleshooting

### Erro: "Plano não encontrado"

- Verifique se o Price ID está correto no `STRIPE_PLAN_CONFIG`

### Erro: "Falha ao carregar Stripe"

- Confirme que a chave pública está correta
- Verifique conexão com internet

### Erro na verificação de pagamento

- Confirme que o backend está respondendo corretamente
- Verifique logs do webhook no dashboard Stripe

## 📞 Suporte

Para dúvidas sobre a integração:

1. Verifique os logs do console do navegador
2. Confirme configuração das variáveis de ambiente
3. Teste endpoints do backend manualmente
4. Consulte documentação oficial do Stripe

---

**Nota**: Esta integração substitui completamente a tela de pagamento anterior. Os usuários agora vão direto para o Stripe Checkout, proporcionando uma experiência mais profissional e segura.
