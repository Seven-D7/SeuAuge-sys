// Serviço de integração com Stripe
export interface StripeCheckoutConfig {
  planId: string;
  planName: string;
  price: number;
  currency: string;
  userId?: string;
  userEmail?: string;
}

// Configuração dos planos para Stripe
const STRIPE_PLAN_CONFIG = {
  B: {
    priceId: "price_base_monthly", // Substitua pelo Price ID real do Stripe
    price: 97.0,
    name: "Plano Base - Mensal",
    interval: "month",
  },
  C: {
    priceId: "price_escalada_quarterly", // Substitua pelo Price ID real do Stripe
    price: 249.0,
    name: "Plano Escalada - Trimestral",
    interval: "quarter",
  },
  D: {
    priceId: "price_auge_yearly", // Substitua pelo Price ID real do Stripe
    price: 780.0,
    name: "Plano Auge - Anual",
    interval: "year",
  },
};

class StripeService {
  private stripePublicKey: string;
  private backendUrl: string;

  constructor() {
    this.stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";
    this.backendUrl =
      import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  }

  /**
   * Redireciona para o Stripe Checkout
   */
  async redirectToCheckout(config: StripeCheckoutConfig): Promise<void> {
    try {
      // Modo desenvolvimento - simular checkout
      if (import.meta.env.VITE_DEV_MODE === "true" || !this.stripePublicKey) {
        await this.simulateCheckout(config);
        return;
      }

      // Buscar configuração do plano
      const planConfig =
        STRIPE_PLAN_CONFIG[config.planId as keyof typeof STRIPE_PLAN_CONFIG];
      if (!planConfig) {
        throw new Error("Plano não encontrado");
      }

      // Criar sessão de checkout no backend
      const response = await fetch(
        `${this.backendUrl}/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId: planConfig.priceId,
            planId: config.planId,
            userId: config.userId,
            userEmail: config.userEmail,
            successUrl: `${window.location.origin}/payment-success?plan=${config.planId}`,
            cancelUrl: `${window.location.origin}/plans`,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao criar sessão de checkout");
      }

      const { sessionId } = await response.json();

      // Redirecionar para Stripe Checkout
      const stripe = await this.loadStripe();
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Erro no checkout:", error);
      throw error;
    }
  }

  /**
   * Carrega o Stripe.js
   */
  private async loadStripe() {
    if (!window.Stripe) {
      // Carrega o script do Stripe dinamicamente
      await this.loadStripeScript();
    }
    return window.Stripe(this.stripePublicKey);
  }

  /**
   * Carrega o script do Stripe
   */
  private loadStripeScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="stripe"]')) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Falha ao carregar Stripe"));
      document.head.appendChild(script);
    });
  }

  /**
   * Simula checkout em modo desenvolvimento
   */
  private async simulateCheckout(config: StripeCheckoutConfig): Promise<void> {
    return new Promise((resolve) => {
      // Mostrar modal de simulação
      const confirmed = window.confirm(
        `Simulação de Checkout\n\n` +
          `Plano: ${config.planName}\n` +
          `Valor: R$ ${config.price.toFixed(2)}\n\n` +
          `Clique OK para simular pagamento bem-sucedido.`,
      );

      if (confirmed) {
        // Simular redirecionamento para página de sucesso
        setTimeout(() => {
          window.location.href = `/payment-success?plan=${config.planId}&simulated=true`;
          resolve();
        }, 1000);
      } else {
        resolve();
      }
    });
  }

  /**
   * Verifica status do pagamento
   */
  async checkPaymentStatus(
    sessionId: string,
  ): Promise<{ status: string; planId?: string }> {
    try {
      // Modo desenvolvimento
      if (import.meta.env.VITE_DEV_MODE === "true") {
        return { status: "completed", planId: "B" };
      }

      const response = await fetch(
        `${this.backendUrl}/payment-status/${sessionId}`,
      );
      if (!response.ok) {
        throw new Error("Erro ao verificar status do pagamento");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao verificar status do pagamento:", error);
      return { status: "error" };
    }
  }

  /**
   * Obtém informações do plano
   */
  getPlanInfo(planId: string) {
    return (
      STRIPE_PLAN_CONFIG[planId as keyof typeof STRIPE_PLAN_CONFIG] || null
    );
  }
}

// Instância singleton
export const stripeService = new StripeService();

// Funções utilitárias
export const redirectToStripeCheckout = (config: StripeCheckoutConfig) =>
  stripeService.redirectToCheckout(config);

export const checkStripePaymentStatus = (sessionId: string) =>
  stripeService.checkPaymentStatus(sessionId);

// Declaração de tipos para Stripe
declare global {
  interface Window {
    Stripe: any;
  }
}
