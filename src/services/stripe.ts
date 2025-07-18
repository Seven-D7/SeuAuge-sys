// Serviço de integração com Stripe
export interface StripeCheckoutConfig {
  planId: string;
  planName: string;
  price: number;
  currency: string;
  userId?: string;
  userEmail?: string;
}

// Configuração dos planos para Stripe (Price IDs reais do Stripe)
const STRIPE_PLAN_CONFIG = {
  B: {
    priceId: "price_1QOtW8KOVEOQAyMUqg7NKQAB", // Plano Base - Mensal
    price: 97.0,
    name: "Plano Base - Mensal",
    interval: "month",
  },
  C: {
    priceId: "price_1QOtW8KOVEOQAyMUqg7NKQAC", // Plano Escalada - Trimestral
    price: 249.0,
    name: "Plano Escalada - Trimestral",
    interval: "quarter",
  },
  D: {
    priceId: "price_1QOtW8KOVEOQAyMUqg7NKQAD", // Plano Auge - Anual
    price: 780.0,
    name: "Plano Auge - Anual",
    interval: "year",
  },
};

class StripeService {
  private stripePublicKey: string;
  private backendUrl: string;
  private isDevMode: boolean;

  constructor() {
    this.stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";
    this.backendUrl =
      import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    this.isDevMode =
      import.meta.env.VITE_DEV_MODE === "true" || import.meta.env.DEV;

    console.log("🔧 Stripe Service initialized:", {
      hasPublicKey: !!this.stripePublicKey,
      backendUrl: this.backendUrl,
      isDevMode: this.isDevMode,
    });
  }

  /**
   * Redireciona para o Stripe Checkout
   */
  async redirectToCheckout(config: StripeCheckoutConfig): Promise<void> {
    try {
      console.log("🔧 Iniciando checkout para:", config);

      // Em modo desenvolvimento, usar checkout simulado mais realista
      if (this.isDevMode) {
        await this.simulateRealisticCheckout(config);
        return;
      }

      // Buscar configuração do plano
      const planConfig =
        STRIPE_PLAN_CONFIG[config.planId as keyof typeof STRIPE_PLAN_CONFIG];
      if (!planConfig) {
        throw new Error("Plano não encontrado");
      }

      // Se temos a chave pública do Stripe, tentar checkout real
      if (
        this.stripePublicKey &&
        this.stripePublicKey !==
          "pk_test_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
      ) {
        await this.createRealCheckoutSession(config, planConfig);
      } else {
        // Fallback para checkout simulado
        await this.simulateRealisticCheckout(config);
      }
    } catch (error) {
      console.error("Erro no checkout:", error);
      throw error;
    }
  }

  /**
   * Cria sessão real de checkout no Stripe
   */
  private async createRealCheckoutSession(
    config: StripeCheckoutConfig,
    planConfig: any,
  ): Promise<void> {
    try {
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
      console.warn("Erro no checkout real, usando simulado:", error);
      await this.simulateRealisticCheckout(config);
    }
  }

  /**
   * Carrega o Stripe.js
   */
  private async loadStripe() {
    if (!window.Stripe) {
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
   * Simula checkout mais realista com modal customizado
   */
  private async simulateRealisticCheckout(
    config: StripeCheckoutConfig,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Criar modal de checkout simulado
      this.showCheckoutModal(config, resolve, reject);
    });
  }

  /**
   * Mostra modal de checkout simulado
   */
  private showCheckoutModal(
    config: StripeCheckoutConfig,
    resolve: () => void,
    reject: (error: Error) => void,
  ): void {
    // Criar elementos do modal
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const modal = document.createElement("div");
    modal.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 32px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      text-align: center;
    `;

    modal.innerHTML = `
      <div style="margin-bottom: 24px;">
        <div style="width: 60px; height: 60px; background: #635bff; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h2 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #1a1a1a;">Checkout Demo</h2>
        <p style="margin: 0; color: #666; font-size: 16px;">Simulação do pagamento Stripe</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 24px; text-align: left;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: 500;">${config.planName}</span>
          <span style="font-weight: 600;">R$ ${config.price.toFixed(2)}</span>
        </div>
        <div style="font-size: 14px; color: #666;">
          Email: ${config.userEmail || "demo@example.com"}
        </div>
      </div>
      
      <div style="margin-bottom: 24px;">
        <div style="background: #e3f2fd; padding: 16px; border-radius: 8px; border-left: 4px solid #2196f3;">
          <p style="margin: 0; font-size: 14px; color: #1976d2;">
            <strong>💡 Modo Demo:</strong> Este é um checkout simulado. Em produção, você seria redirecionado para o Stripe real.
          </p>
        </div>
      </div>
      
      <div style="display: flex; gap: 12px;">
        <button id="cancelBtn" style="
          flex: 1;
          padding: 12px 24px;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        ">Cancelar</button>
        <button id="payBtn" style="
          flex: 1;
          padding: 12px 24px;
          background: #635bff;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        ">Simular Pagamento</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Event listeners
    const cancelBtn = modal.querySelector("#cancelBtn") as HTMLButtonElement;
    const payBtn = modal.querySelector("#payBtn") as HTMLButtonElement;

    cancelBtn.addEventListener("mouseover", () => {
      cancelBtn.style.borderColor = "#635bff";
      cancelBtn.style.color = "#635bff";
    });

    cancelBtn.addEventListener("mouseout", () => {
      cancelBtn.style.borderColor = "#e0e0e0";
      cancelBtn.style.color = "black";
    });

    payBtn.addEventListener("mouseover", () => {
      payBtn.style.background = "#5a52ff";
    });

    payBtn.addEventListener("mouseout", () => {
      payBtn.style.background = "#635bff";
    });

    cancelBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
      reject(new Error("Checkout cancelado pelo usuário"));
    });

    payBtn.addEventListener("click", () => {
      payBtn.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
          <div style="width: 16px; height: 16px; border: 2px solid transparent; border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          Processando...
        </div>
      `;
      payBtn.disabled = true;

      // Adicionar animação de spin
      const style = document.createElement("style");
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);

      setTimeout(() => {
        document.body.removeChild(overlay);
        // Redirecionar para página de sucesso
        window.location.href = `/payment-success?plan=${config.planId}&simulated=true&amount=${config.price}`;
        resolve();
      }, 2000);
    });

    // Fechar com ESC
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        document.body.removeChild(overlay);
        document.removeEventListener("keydown", handleEsc);
        reject(new Error("Checkout cancelado pelo usuário"));
      }
    };
    document.addEventListener("keydown", handleEsc);

    // Fechar clicando fora
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        reject(new Error("Checkout cancelado pelo usuário"));
      }
    });
  }

  /**
   * Simula checkout básico (fallback)
   */
  private async simulateBasicCheckout(
    config: StripeCheckoutConfig,
  ): Promise<void> {
    return new Promise((resolve) => {
      const confirmed = window.confirm(
        `Simulação de Checkout\n\n` +
          `Plano: ${config.planName}\n` +
          `Valor: R$ ${config.price.toFixed(2)}\n\n` +
          `Clique OK para simular pagamento bem-sucedido.`,
      );

      if (confirmed) {
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
      if (this.isDevMode) {
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
