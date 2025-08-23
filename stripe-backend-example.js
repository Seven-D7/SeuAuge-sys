/**
 * Exemplo de backend para processar pagamentos Stripe
 * 
 * Para usar:
 * 1. npm init -y
 * 2. npm install express stripe cors dotenv
 * 3. Configure as variáveis de ambiente
 * 4. node stripe-backend-example.js
 */

require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Middleware especial para webhook (precisa do raw body)
app.use('/api/stripe-webhook', express.raw({type: 'application/json'}));

// Middleware JSON para outras rotas
app.use(express.json());

// Configuração dos planos (deve estar sincronizado com o frontend)
const PLAN_CONFIG = {
  B: {
    priceId: "price_1QOtW8KOVEOQAyMUqg7NKQAB",
    name: "Plano Base - Mensal",
    price: 97.00
  },
  C: {
    priceId: "price_1QOtW8KOVEOQAyMUqg7NKQAC", 
    name: "Plano Escalada - Trimestral",
    price: 249.00
  },
  D: {
    priceId: "price_1QOtW8KOVEOQAyMUqg7NKQAD",
    name: "Plano Auge - Anual", 
    price: 780.00
  }
};

/**
 * Endpoint: POST /api/create-checkout-session
 * Cria uma sessão de checkout no Stripe
 */
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    console.log('🔧 Criando sessão de checkout:', req.body);

    const { priceId, planId, userId, userEmail, successUrl, cancelUrl } = req.body;

    // Validar dados obrigatórios
    if (!priceId || !planId || !userId || !userEmail || !successUrl || !cancelUrl) {
      return res.status(400).json({ 
        error: 'Dados obrigatórios faltando',
        required: ['priceId', 'planId', 'userId', 'userEmail', 'successUrl', 'cancelUrl']
      });
    }

    // Verificar se o plano existe
    const planConfig = PLAN_CONFIG[planId];
    if (!planConfig) {
      return res.status(400).json({ error: 'Plano não encontrado' });
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // Para pagamento único. Use 'subscription' para recorrente
      
      line_items: [{
        price: priceId,
        quantity: 1,
      }],

      // Informações do cliente
      customer_email: userEmail,
      
      // Metadados para identificar o pagamento
      metadata: {
        userId: userId,
        planId: planId,
        planName: planConfig.name,
        environment: process.env.NODE_ENV || 'development'
      },

      // URLs de redirecionamento
      success_url: successUrl + '&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl,

      // Configurações adicionais
      billing_address_collection: 'required',
      payment_intent_data: {
        metadata: {
          userId: userId,
          planId: planId
        }
      }
    });

    console.log('✅ Sessão criada:', session.id);

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('❌ Erro ao criar sessão:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

/**
 * Endpoint: GET /api/payment-status/:sessionId
 * Verifica o status de um pagamento
 */
app.get('/api/payment-status/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    console.log('🔧 Verificando status do pagamento:', sessionId);

    // Buscar sessão no Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    const response = {
      status: session.payment_status,
      planId: session.metadata.planId,
      userId: session.metadata.userId,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total,
      currency: session.currency
    };

    console.log('✅ Status encontrado:', response);

    res.json(response);

  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    res.status(500).json({ 
      error: 'Erro ao verificar status do pagamento',
      message: error.message 
    });
  }
});

/**
 * Endpoint: POST /api/stripe-webhook  
 * Recebe notificações do Stripe quando eventos acontecem
 */
app.post('/api/stripe-webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verificar assinatura do webhook
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('🔧 Webhook recebido:', event.type);

  // Processar eventos do Stripe
  switch (event.type) {
    case 'checkout.session.completed':
      handleCheckoutCompleted(event.data.object);
      break;

    case 'payment_intent.succeeded':
      handlePaymentSucceeded(event.data.object);
      break;

    case 'payment_intent.payment_failed':
      handlePaymentFailed(event.data.object);
      break;

    case 'customer.subscription.created':
      handleSubscriptionCreated(event.data.object);
      break;

    case 'customer.subscription.updated':
      handleSubscriptionUpdated(event.data.object);
      break;

    case 'customer.subscription.deleted':
      handleSubscriptionCanceled(event.data.object);
      break;

    default:
      console.log(`🔧 Evento não tratado: ${event.type}`);
  }

  // Sempre responder com sucesso para o Stripe
  res.json({received: true});
});

/**
 * Processa checkout concluído com sucesso
 */
async function handleCheckoutCompleted(session) {
  console.log('✅ Checkout concluído:', session.id);
  
  const { userId, planId } = session.metadata;
  
  try {
    // AQUI: Implementar lógica para ativar o plano do usuário
    // Exemplos:
    // - Atualizar banco de dados
    // - Enviar email de confirmação  
    // - Criar entrada na tabela de assinaturas
    // - Integrar com Supabase
    
    console.log(`🎉 Ativando plano ${planId} para usuário ${userId}`);
    
    // Exemplo de integração com Supabase:
    /*
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY // Use a service key no backend
    );

    await supabase
      .from('user_profiles')
      .update({ 
        plan: planId,
        plan_activated_at: new Date().toISOString(),
        stripe_session_id: session.id
      })
      .eq('id', userId);
    */

  } catch (error) {
    console.error('❌ Erro ao ativar plano:', error);
  }
}

/**
 * Processa pagamento bem-sucedido
 */
async function handlePaymentSucceeded(paymentIntent) {
  console.log('✅ Pagamento confirmado:', paymentIntent.id);
  
  // Implementar lógica adicional se necessário
}

/**
 * Processa pagamento falhado
 */
async function handlePaymentFailed(paymentIntent) {
  console.log('❌ Pagamento falhou:', paymentIntent.id);
  
  // Implementar lógica para lidar com falhas:
  // - Notificar usuário
  // - Log para análise
  // - Reverter mudanças se necessário
}

/**
 * Processa criação de assinatura (para planos recorrentes)
 */
async function handleSubscriptionCreated(subscription) {
  console.log('✅ Assinatura criada:', subscription.id);
  
  // Implementar lógica para assinaturas recorrentes
}

/**
 * Processa atualização de assinatura
 */
async function handleSubscriptionUpdated(subscription) {
  console.log('🔧 Assinatura atualizada:', subscription.id);
  
  // Implementar lógica para mudanças na assinatura
}

/**
 * Processa cancelamento de assinatura
 */
async function handleSubscriptionCanceled(subscription) {
  console.log('❌ Assinatura cancelada:', subscription.id);
  
  // Implementar lógica para cancelamentos:
  // - Remover acesso premium
  // - Enviar email de confirmação
  // - Atualizar banco de dados
}

/**
 * Endpoint de health check
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    stripe: !!process.env.STRIPE_SECRET_KEY,
    webhook: !!process.env.STRIPE_WEBHOOK_SECRET
  });
});

/**
 * Tratamento de erros global
 */
app.use((error, req, res, next) => {
  console.error('❌ Erro não capturado:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

/**
 * Inicializar servidor
 */
app.listen(PORT, () => {
  console.log(`🚀 Servidor Stripe rodando na porta ${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Stripe configurado: ${!!process.env.STRIPE_SECRET_KEY}`);
  console.log(`🪝 Webhook configurado: ${!!process.env.STRIPE_WEBHOOK_SECRET}`);
  
  // Validar configuração crítica
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  STRIPE_SECRET_KEY não configurada!');
  }
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn('⚠️  STRIPE_WEBHOOK_SECRET não configurada!');
  }
});

module.exports = app;
