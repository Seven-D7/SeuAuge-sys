import { supabase, authOperations, withTimeout } from "../lib/supabase";
import api from "./api";

export interface PlanData {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export async function getPlans(): Promise<PlanData[]> {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('price_cents', { ascending: true });

    if (error) throw error;

    return data.map(plan => ({
      id: plan.id,
      name: plan.name,
      price: plan.price_display || `R$ ${plan.price_cents / 100}`,
      features: plan.features || [],
    }));
  } catch (error) {
    console.error("Erro ao buscar planos:", error);
    // Fallback to hardcoded plans
    return [
      { id: "B", name: "Base", price: "R$ 97", features: ["Acesso completo"] },
      {
        id: "C",
        name: "Escalada",
        price: "R$ 249",
        features: ["Acesso premium"],
      },
      { id: "D", name: "Auge", price: "R$ 780", features: ["Acesso total"] },
    ];
  }
}

// Cache para evitar múltiplas consultas desnecessárias
let planCache: { userId: string; plan: string | null; timestamp: number } | null = null;
const PLAN_CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export async function getPlanFromToken(
  forceRefresh = false,
): Promise<string | null> {
  try {
    const { data: { user }, error: userError } = await withTimeout(
      authOperations.getUser(),
      5000,
      'Get User for Plan'
    );

    if (userError || !user) return null;

    // Check cache first
    const now = Date.now();
    if (!forceRefresh && planCache &&
        planCache.userId === user.id &&
        (now - planCache.timestamp) < PLAN_CACHE_DURATION) {
      return planCache.plan;
    }

    // Get user profile with plan information
    const { data: profile, error: profileError } = await withTimeout(
      supabase
        .from('user_profiles')
        .select('plan')
        .eq('id', user.id)
        .single(),
      3000,
      'Get User Plan'
    );

    if (profileError) {
      console.error("Erro ao buscar plano do usuário:", profileError);
      // Return cached value if available, otherwise null
      return planCache?.userId === user.id ? planCache.plan : null;
    }

    const plan = profile?.plan || null;

    // Update cache
    planCache = {
      userId: user.id,
      plan,
      timestamp: now,
    };

    return plan;
  } catch (error) {
    console.error("Erro ao buscar plano:", error);
    // Return cached value if available
    return planCache?.plan || null;
  }
}

export async function updateUserPlan(plan: string): Promise<void> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Usuário não autenticado");

    // Update user plan in profile
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        plan,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) throw error;

    // Also call external API if needed for payment processing
    await api("/plan", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });

    console.log("Plano atualizado com sucesso:", plan);
  } catch (error) {
    console.error("Erro ao atualizar plano:", error);
    throw error;
  }
}

export async function getUserPlan(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('plan')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Erro ao buscar plano do usuário:", error);
      return null;
    }

    return data?.plan || null;
  } catch (error) {
    console.error("Erro ao buscar plano:", error);
    return null;
  }
}

export async function validatePlanAccess(userId: string, requiredPlan: string): Promise<boolean> {
  try {
    const userPlan = await getUserPlan(userId);
    if (!userPlan) return false;

    // Plan hierarchy: D > C > B > A
    const planHierarchy: Record<string, number> = {
      'A': 1,
      'B': 2, 
      'C': 3,
      'D': 4,
    };

    const userPlanLevel = planHierarchy[userPlan] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan] || 0;

    return userPlanLevel >= requiredPlanLevel;
  } catch (error) {
    console.error("Erro ao validar acesso ao plano:", error);
    return false;
  }
}

export async function createPlanSubscription(planId: string, userId: string): Promise<{ subscriptionId: string }> {
  try {
    // Create subscription record
    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        started_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) throw error;

    // Update user profile with new plan
    await updateUserPlan(planId);

    return { subscriptionId: data.id };
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    throw error;
  }
}

export async function cancelPlanSubscription(userId: string): Promise<void> {
  try {
    // Update subscription status
    const { error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('status', 'active');

    if (subscriptionError) throw subscriptionError;

    // Remove plan from user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({
        plan: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (profileError) throw profileError;

    console.log("Assinatura cancelada com sucesso");
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
    throw error;
  }
}
