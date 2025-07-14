import {
  UserPreferences,
  usePreferencesStore,
} from "../../stores/preferencesStore";

export interface PersonalizedWeightLossData {
  // Dados básicos
  altura: number;
  peso_atual: number;
  peso_meta: number;
  idade: number;
  sexo: "masculino" | "feminino";
  nivel_atividade: string;
  tempo_objetivo: number;

  // Dados de preferências
  restricoes_alimentares: string[];
  alergias: string[];
  condicoes_medicas: string[];
  medicamentos: string[];
  nivel_experiencia: string;
  tempo_disponivel: number;
  objetivo_fitness: string;
}

export interface PersonalizedWeightLossResults {
  // Resultados básicos
  imc_atual: number;
  imc_meta: number;
  classificacao_imc: string;
  peso_ideal: number;
  deficit_calorico_diario: number;
  calorias_diarias: number;
  perda_semanal_segura: number;
  tempo_estimado_realista: number;

  // Personalização baseada em preferências
  plano_alimentar_personalizado: PersonalizedMealPlan;
  restricoes_consideradas: string[];
  alertas_nutricionais: string[];
  alternativas_sugeridas: { [key: string]: string[] };

  // Recomendações personalizadas
  recomendacoes_treino: PersonalizedWorkoutRecommendation[];
  recomendacoes_nutricao: PersonalizedNutritionRecommendation[];
  ajustes_por_condicoes_medicas: MedicalAdjustment[];

  // Motivação e gamificação
  probabilidade_sucesso: number;
  fatores_motivacionais: string[];
  marcos_intermediarios: Milestone[];
  score_personalizado: number;
}

export interface PersonalizedMealPlan {
  cafe_manha: MealRecommendation;
  almoco: MealRecommendation;
  jantar: MealRecommendation;
  lanches: MealRecommendation[];
  suplementacao: SupplementRecommendation[];
}

export interface MealRecommendation {
  nome: string;
  ingredientes_principais: string[];
  ingredientes_alternativos: string[];
  calorias_aproximadas: number;
  restricoes_atendidas: string[];
  alertas: string[];
  tempo_preparo: number;
  dificuldade: "fácil" | "médio" | "difícil";
}

export interface PersonalizedWorkoutRecommendation {
  tipo: string;
  duracao: number;
  intensidade: "baixa" | "moderada" | "alta";
  adequado_para_condicoes: string[];
  equipamentos_necessarios: string[];
  modificacoes_por_limitacoes: string[];
}

export interface PersonalizedNutritionRecommendation {
  categoria: string;
  recomendacao: string;
  razao: string;
  prioridade: "baixa" | "média" | "alta" | "crítica";
  baseado_em: string[];
}

export interface MedicalAdjustment {
  condicao: string;
  ajuste: string;
  impacto_no_plano: string;
  recomendacao_medica: string;
}

export interface SupplementRecommendation {
  nome: string;
  dosagem: string;
  razao: string;
  adequado_para_restricoes: boolean;
  alternativas_veganas?: string[];
}

export interface Milestone {
  peso_alvo: number;
  semana_estimada: number;
  beneficios_esperados: string[];
  recompensa_sugerida: string;
}

export class PersonalizedWeightLossCalculator {
  private preferences: UserPreferences;

  constructor(preferences: UserPreferences) {
    this.preferences = preferences;
  }

  calculate(data: PersonalizedWeightLossData): PersonalizedWeightLossResults {
    // Cálculos básicos
    const imc_atual = data.peso_atual / Math.pow(data.altura / 100, 2);
    const imc_meta = data.peso_meta / Math.pow(data.altura / 100, 2);
    const peso_ideal = this.calculateIdealWeight(data.altura, data.sexo);

    // TMB personalizada baseada em condições médicas
    let tmb = this.calculateTMB(data);
    tmb = this.adjustTMBForMedicalConditions(tmb, data.condicoes_medicas);

    // Gasto energético
    const gasto_energetico = this.calculateEnergyExpenditure(
      tmb,
      data.nivel_atividade,
    );

    // Déficit calórico seguro baseado em condições de saúde
    const deficit_base = 500; // 500 kcal/dia = 0.5kg/semana
    const deficit_ajustado = this.adjustDeficitForHealth(
      deficit_base,
      data.condicoes_medicas,
      data.idade,
    );

    const calorias_diarias = gasto_energetico - deficit_ajustado;
    const perda_semanal = (deficit_ajustado * 7) / 7700; // 7700 kcal = 1kg gordura

    // Tempo estimado realista
    const peso_a_perder = data.peso_atual - data.peso_meta;
    const tempo_estimado = Math.ceil(peso_a_perder / perda_semanal);

    // Gerar plano alimentar personalizado
    const plano_alimentar = this.generatePersonalizedMealPlan(
      calorias_diarias,
      data,
    );

    // Analisar restrições
    const restricoes_consideradas = this.analyzeRestrictions(data);
    const alertas_nutricionais = this.generateNutritionalAlerts(data);
    const alternativas = this.generateAlternatives(data);

    // Recomendações personalizadas
    const recomendacoes_treino = this.generateWorkoutRecommendations(data);
    const recomendacoes_nutricao = this.generateNutritionRecommendations(data);
    const ajustes_medicos = this.generateMedicalAdjustments(data);

    // Probabilidade de sucesso personalizada
    const probabilidade_sucesso = this.calculateSuccessProbability(data);
    const fatores_motivacionais = this.generateMotivationalFactors(data);
    const marcos = this.generateMilestones(
      data.peso_atual,
      data.peso_meta,
      perda_semanal,
    );

    return {
      imc_atual,
      imc_meta,
      classificacao_imc: this.getIMCClassification(imc_atual),
      peso_ideal,
      deficit_calorico_diario: deficit_ajustado,
      calorias_diarias,
      perda_semanal_segura: perda_semanal,
      tempo_estimado_realista: tempo_estimado,
      plano_alimentar_personalizado: plano_alimentar,
      restricoes_consideradas,
      alertas_nutricionais,
      alternativas_sugeridas: alternativas,
      recomendacoes_treino,
      recomendacoes_nutricao,
      ajustes_por_condicoes_medicas: ajustes_medicos,
      probabilidade_sucesso,
      fatores_motivacionais,
      marcos_intermediarios: marcos,
      score_personalizado: Math.round(probabilidade_sucesso * 100),
    };
  }

  private calculateTMB(data: PersonalizedWeightLossData): number {
    // Fórmula de Mifflin-St Jeor
    const base = 10 * data.peso_atual + 6.25 * data.altura - 5 * data.idade;
    return data.sexo === "masculino" ? base + 5 : base - 161;
  }

  private adjustTMBForMedicalConditions(
    tmb: number,
    conditions: string[],
  ): number {
    let adjusted = tmb;

    conditions.forEach((condition) => {
      switch (condition.toLowerCase()) {
        case "hipotireoidismo":
          adjusted *= 0.9; // 10% menor
          break;
        case "hipertireoidismo":
          adjusted *= 1.1; // 10% maior
          break;
        case "diabetes":
          adjusted *= 0.95; // 5% menor (metabolismo mais lento)
          break;
        case "sop":
        case "síndrome do ovário policístico":
          adjusted *= 0.85; // 15% menor
          break;
      }
    });

    return adjusted;
  }

  private calculateEnergyExpenditure(
    tmb: number,
    activityLevel: string,
  ): number {
    const multipliers = {
      sedentario: 1.2,
      leve: 1.375,
      moderado: 1.55,
      ativo: 1.725,
      muito_ativo: 1.9,
    };

    return (
      tmb * (multipliers[activityLevel as keyof typeof multipliers] || 1.2)
    );
  }

  private adjustDeficitForHealth(
    deficit: number,
    conditions: string[],
    age: number,
  ): number {
    let adjusted = deficit;

    // Reduzir déficit para condições médicas
    if (conditions.includes("diabetes")) {
      adjusted = Math.min(adjusted, 300); // Máximo 300 kcal
    }

    if (conditions.includes("hipertensão")) {
      adjusted = Math.min(adjusted, 400); // Máximo 400 kcal
    }

    // Reduzir déficit para idades mais avançadas
    if (age > 60) {
      adjusted = Math.min(adjusted, 350);
    } else if (age > 50) {
      adjusted = Math.min(adjusted, 400);
    }

    return adjusted;
  }

  private generatePersonalizedMealPlan(
    calorias: number,
    data: PersonalizedWeightLossData,
  ): PersonalizedMealPlan {
    const isVegan = data.restricoes_alimentares.includes("vegan");
    const isVegetarian = data.restricoes_alimentares.includes("vegetarian");
    const isLactoseIntolerant =
      data.restricoes_alimentares.includes("lactose_intolerant");
    const isGlutenFree = data.restricoes_alimentares.includes("gluten_free");
    const isDiabetic = data.condicoes_medicas.includes("diabetes");

    // Distribuição calórica: 25% café, 35% almoço, 30% jantar, 10% lanches
    const cal_cafe = Math.round(calorias * 0.25);
    const cal_almoco = Math.round(calorias * 0.35);
    const cal_jantar = Math.round(calorias * 0.3);
    const cal_lanches = Math.round(calorias * 0.1);

    return {
      cafe_manha: this.generateMeal("café da manhã", cal_cafe, data),
      almoco: this.generateMeal("almoço", cal_almoco, data),
      jantar: this.generateMeal("jantar", cal_jantar, data),
      lanches: [this.generateMeal("lanche", cal_lanches, data)],
      suplementacao: this.generateSupplements(data),
    };
  }

  private generateMeal(
    tipo: string,
    calorias: number,
    data: PersonalizedWeightLossData,
  ): MealRecommendation {
    const isVegan = data.restricoes_alimentares.includes("vegan");
    const isVegetarian = data.restricoes_alimentares.includes("vegetarian");
    const isLactoseIntolerant =
      data.restricoes_alimentares.includes("lactose_intolerant");
    const isGlutenFree = data.restricoes_alimentares.includes("gluten_free");

    const meals = {
      "café da manhã": {
        nome: this.getBreakfastName(data.restricoes_alimentares),
        ingredientes_principais: this.getBreakfastIngredients(
          data.restricoes_alimentares,
        ),
        tempo_preparo: 10,
        dificuldade: "fácil" as const,
      },
      almoço: {
        nome: this.getLunchName(data.restricoes_alimentares),
        ingredientes_principais: this.getLunchIngredients(
          data.restricoes_alimentares,
        ),
        tempo_preparo: 30,
        dificuldade: "médio" as const,
      },
      jantar: {
        nome: this.getDinnerName(data.restricoes_alimentares),
        ingredientes_principais: this.getDinnerIngredients(
          data.restricoes_alimentares,
        ),
        tempo_preparo: 25,
        dificuldade: "médio" as const,
      },
      lanche: {
        nome: this.getSnackName(data.restricoes_alimentares),
        ingredientes_principais: this.getSnackIngredients(
          data.restricoes_alimentares,
        ),
        tempo_preparo: 5,
        dificuldade: "fácil" as const,
      },
    };

    const meal = meals[tipo as keyof typeof meals];

    return {
      ...meal,
      ingredientes_alternativos: this.generateAlternativeIngredients(
        meal.ingredientes_principais,
        data.restricoes_alimentares,
      ),
      calorias_aproximadas: calorias,
      restricoes_atendidas: data.restricoes_alimentares,
      alertas: this.generateMealAlerts(
        meal.ingredientes_principais,
        data.alergias,
      ),
    };
  }

  private getBreakfastName(restrictions: string[]): string {
    if (restrictions.includes("vegan"))
      return "Bowl de Aveia Vegano com Frutas";
    if (restrictions.includes("gluten_free")) return "Tapioca com Ovo e Queijo";
    if (restrictions.includes("lactose_intolerant"))
      return "Aveia com Leite Vegetal e Banana";
    return "Aveia com Frutas e Iogurte";
  }

  private getBreakfastIngredients(restrictions: string[]): string[] {
    if (restrictions.includes("vegan")) {
      return [
        "aveia",
        "leite de amêndoas",
        "banana",
        "morango",
        "chia",
        "pasta de amendoim",
      ];
    }
    if (restrictions.includes("gluten_free")) {
      return ["tapioca", "ovo", "queijo minas", "tomate", "rúcula"];
    }
    if (restrictions.includes("lactose_intolerant")) {
      return ["aveia", "leite de aveia", "banana", "canela", "mel"];
    }
    return ["aveia", "iogurte natural", "frutas vermelhas", "granola", "mel"];
  }

  private getLunchName(restrictions: string[]): string {
    if (restrictions.includes("vegan")) return "Buddha Bowl Vegano";
    if (restrictions.includes("vegetarian"))
      return "Salada de Quinoa com Grão-de-Bico";
    return "Prato Balanceado com Proteína Magra";
  }

  private getLunchIngredients(restrictions: string[]): string[] {
    if (restrictions.includes("vegan")) {
      return [
        "quinoa",
        "grão-de-bico",
        "abacate",
        "tomate",
        "pepino",
        "tahine",
        "espinafre",
      ];
    }
    if (restrictions.includes("vegetarian")) {
      return [
        "quinoa",
        "grão-de-bico",
        "queijo de cabra",
        "rúcula",
        "tomate cereja",
        "azeite",
      ];
    }
    return [
      "peito de frango",
      "arroz integral",
      "brócolis",
      "cenoura",
      "azeite",
      "alho",
    ];
  }

  private getDinnerName(restrictions: string[]): string {
    if (restrictions.includes("vegan")) return "Tofu Grelhado com Vegetais";
    if (restrictions.includes("vegetarian"))
      return "Omelete de Claras com Salada";
    return "Peixe Assado com Legumes";
  }

  private getDinnerIngredients(restrictions: string[]): string[] {
    if (restrictions.includes("vegan")) {
      return [
        "tofu",
        "abobrinha",
        "berinjela",
        "pimentão",
        "cebola",
        "shoyu",
        "gengibre",
      ];
    }
    if (restrictions.includes("vegetarian")) {
      return [
        "claras de ovo",
        "espinafre",
        "cogumelos",
        "tomate",
        "queijo cottage",
        "ervas",
      ];
    }
    return ["salmão", "aspargos", "batata doce", "limão", "alecrim", "azeite"];
  }

  private getSnackName(restrictions: string[]): string {
    if (restrictions.includes("vegan")) return "Mix de Castanhas e Frutas";
    if (restrictions.includes("lactose_intolerant"))
      return "Maçã com Pasta de Amendoim";
    return "Iogurte com Nozes";
  }

  private getSnackIngredients(restrictions: string[]): string[] {
    if (restrictions.includes("vegan")) {
      return ["amêndoas", "castanha do pará", "tâmaras", "mirtilo"];
    }
    if (restrictions.includes("lactose_intolerant")) {
      return ["maçã", "pasta de amendoim", "canela"];
    }
    return ["iogurte grego", "nozes", "mel", "canela"];
  }

  private generateAlternativeIngredients(
    ingredients: string[],
    restrictions: string[],
  ): string[] {
    const alternatives: string[] = [];
    const { getAlternativeIngredients } = usePreferencesStore.getState();

    ingredients.forEach((ingredient) => {
      const alts = getAlternativeIngredients(ingredient);
      alternatives.push(...alts);
    });

    return [...new Set(alternatives)];
  }

  private generateMealAlerts(
    ingredients: string[],
    allergies: string[],
  ): string[] {
    const alerts: string[] = [];

    ingredients.forEach((ingredient) => {
      allergies.forEach((allergy) => {
        if (ingredient.toLowerCase().includes(allergy.toLowerCase())) {
          alerts.push(`⚠️ Contém ${allergy} - verifique alternativas`);
        }
      });
    });

    return alerts;
  }

  private generateSupplements(
    data: PersonalizedWeightLossData,
  ): SupplementRecommendation[] {
    const supplements: SupplementRecommendation[] = [];

    // Suplementos baseados em restrições
    if (data.restricoes_alimentares.includes("vegan")) {
      supplements.push({
        nome: "Vitamina B12",
        dosagem: "2.4 mcg/dia",
        razao: "Deficiência comum em dietas veganas",
        adequado_para_restricoes: true,
        alternativas_veganas: ["B12 sintética", "Alimentos fortificados"],
      });

      supplements.push({
        nome: "Proteína Vegetal",
        dosagem: "25-30g pós-treino",
        razao: "Suporte ao ganho/manutenção de massa muscular",
        adequado_para_restricoes: true,
        alternativas_veganas: [
          "Proteína de ervilha",
          "Proteína de arroz",
          "Hemp protein",
        ],
      });
    }

    if (
      !data.restricoes_alimentares.includes("vegan") &&
      !data.restricoes_alimentares.includes("lactose_intolerant")
    ) {
      supplements.push({
        nome: "Whey Protein",
        dosagem: "25-30g pós-treino",
        razao: "Suporte à massa muscular durante deficit calórico",
        adequado_para_restricoes: true,
      });
    }

    // Suplementos baseados em condições médicas
    if (data.condicoes_medicas.includes("diabetes")) {
      supplements.push({
        nome: "Cromo",
        dosagem: "200 mcg/dia",
        razao: "Auxilia no controle glicêmico",
        adequado_para_restricoes: true,
      });
    }

    return supplements;
  }

  private analyzeRestrictions(data: PersonalizedWeightLossData): string[] {
    return data.restricoes_alimentares.map((restriction) => {
      switch (restriction) {
        case "vegan":
          return "Dieta 100% vegetal - sem produtos de origem animal";
        case "vegetarian":
          return "Sem carnes - permitidos ovos e laticínios";
        case "lactose_intolerant":
          return "Sem lactose - usando alternativas vegetais";
        case "gluten_free":
          return "Sem glúten - carboidratos alternativos";
        case "diabetic":
          return "Controle de carboidratos e índice glicêmico";
        default:
          return restriction;
      }
    });
  }

  private generateNutritionalAlerts(
    data: PersonalizedWeightLossData,
  ): string[] {
    const alerts: string[] = [];

    if (data.restricoes_alimentares.includes("vegan")) {
      alerts.push("🌱 Atenção especial à B12, ferro e ômega-3");
    }

    if (data.condicoes_medicas.includes("diabetes")) {
      alerts.push("🩺 Monitore glicemia antes/depois das refeições");
    }

    if (data.condicoes_medicas.includes("hipertensão")) {
      alerts.push("🧂 Evite excesso de sódio (< 2g/dia)");
    }

    data.alergias.forEach((allergy) => {
      alerts.push(`⚠️ ALERGIA: Evite completamente ${allergy}`);
    });

    return alerts;
  }

  private generateAlternatives(data: PersonalizedWeightLossData): {
    [key: string]: string[];
  } {
    const alternatives: { [key: string]: string[] } = {};

    if (data.restricoes_alimentares.includes("lactose_intolerant")) {
      alternatives["leite"] = [
        "leite de amêndoas",
        "leite de aveia",
        "leite de coco",
      ];
      alternatives["queijo"] = [
        "queijo vegano",
        "nutritional yeast",
        "tofu temperado",
      ];
      alternatives["iogurte"] = ["iogurte de coco", "iogurte de amendoim"];
    }

    if (data.restricoes_alimentares.includes("gluten_free")) {
      alternatives["pão"] = ["pão sem glúten", "tapioca", "crepioca"];
      alternatives["macarrão"] = [
        "macarrão de arroz",
        "abobrinha em espiral",
        "shirataki",
      ];
      alternatives["farinha"] = [
        "farinha de arroz",
        "farinha de amêndoas",
        "farinha de coco",
      ];
    }

    if (data.restricoes_alimentares.includes("vegan")) {
      alternatives["carne"] = [
        "tofu",
        "tempeh",
        "seitan",
        "cogumelos",
        "leguminosas",
      ];
      alternatives["ovos"] = ["chia + água", "linhaça + água", "aquafaba"];
    }

    return alternatives;
  }

  private generateWorkoutRecommendations(
    data: PersonalizedWeightLossData,
  ): PersonalizedWorkoutRecommendation[] {
    const recommendations: PersonalizedWorkoutRecommendation[] = [];

    if (data.tempo_disponivel < 30) {
      recommendations.push({
        tipo: "HIIT",
        duracao: 20,
        intensidade: "alta",
        adequado_para_condicoes: ["hipertensão controlada"],
        equipamentos_necessarios: [],
        modificacoes_por_limitacoes: data.condicoes_medicas.includes(
          "hipertensão",
        )
          ? ["Monitore frequência cardíaca", "Pare se sentir tontura"]
          : [],
      });
    }

    recommendations.push({
      tipo: "Caminhada",
      duracao: data.tempo_disponivel,
      intensidade: "baixa",
      adequado_para_condicoes: ["todas"],
      equipamentos_necessarios: ["tênis confortável"],
      modificacoes_por_limitacoes: [],
    });

    if (data.nivel_experiencia !== "iniciante") {
      recommendations.push({
        tipo: "Musculação",
        duracao: 45,
        intensidade: "moderada",
        adequado_para_condicoes: ["diabetes", "hipertensão"],
        equipamentos_necessarios: ["academia ou pesos"],
        modificacoes_por_limitacoes: data.condicoes_medicas.includes("diabetes")
          ? ["Monitore glicemia antes/depois", "Tenha sempre um lanche"]
          : [],
      });
    }

    return recommendations;
  }

  private generateNutritionRecommendations(
    data: PersonalizedWeightLossData,
  ): PersonalizedNutritionRecommendation[] {
    const recommendations: PersonalizedNutritionRecommendation[] = [];

    recommendations.push({
      categoria: "Hidratação",
      recomendacao: "Beba 35ml por kg de peso corporal",
      razao: "Acelera metabolismo e reduz retenção",
      prioridade: "alta",
      baseado_em: ["peso corporal", "objetivo emagrecimento"],
    });

    if (data.restricoes_alimentares.includes("vegan")) {
      recommendations.push({
        categoria: "Proteína",
        recomendacao: "Combine proteínas vegetais (arroz + feijão)",
        razao: "Garantir aminoácidos essenciais completos",
        prioridade: "alta",
        baseado_em: ["dieta vegana", "preservação muscular"],
      });
    }

    if (data.condicoes_medicas.includes("diabetes")) {
      recommendations.push({
        categoria: "Carboidratos",
        recomendacao: "Prefira baixo IG: aveia, quinoa, batata doce",
        razao: "Controle glicêmico durante emagrecimento",
        prioridade: "crítica",
        baseado_em: ["diabetes", "controle glicêmico"],
      });
    }

    return recommendations;
  }

  private generateMedicalAdjustments(
    data: PersonalizedWeightLossData,
  ): MedicalAdjustment[] {
    const adjustments: MedicalAdjustment[] = [];

    data.condicoes_medicas.forEach((condition) => {
      switch (condition.toLowerCase()) {
        case "diabetes":
          adjustments.push({
            condicao: "Diabetes",
            ajuste: "Déficit calórico reduzido (300 kcal máximo)",
            impacto_no_plano: "Perda de peso mais gradual e segura",
            recomendacao_medica:
              "Monitore glicemia e ajuste medicação conforme orientação médica",
          });
          break;
        case "hipertensão":
          adjustments.push({
            condicao: "Hipertensão",
            ajuste: "Redução significativa de sódio (<2g/dia)",
            impacto_no_plano: "Temperos naturais, menos processados",
            recomendacao_medica: "Monitore pressão arterial regularmente",
          });
          break;
        case "hipotireoidismo":
          adjustments.push({
            condicao: "Hipotireoidismo",
            ajuste: "TMB reduzida, mais exercícios",
            impacto_no_plano: "Processo mais lento, paciência necessária",
            recomendacao_medica: "Mantenha medicação em dia e monitore TSH",
          });
          break;
      }
    });

    return adjustments;
  }

  private calculateSuccessProbability(
    data: PersonalizedWeightLossData,
  ): number {
    let probability = 0.7; // Base 70%

    // Fatores positivos
    if (data.nivel_experiencia !== "iniciante") probability += 0.1;
    if (data.tempo_disponivel >= 45) probability += 0.1;
    if (data.peso_atual - data.peso_meta <= 10) probability += 0.1; // Meta realista

    // Fatores negativos
    if (data.condicoes_medicas.length > 2) probability -= 0.1;
    if (data.idade > 50) probability -= 0.05;
    if (data.tempo_objetivo < 12) probability -= 0.15; // Meta muito agressiva

    return Math.max(0.3, Math.min(0.95, probability));
  }

  private generateMotivationalFactors(
    data: PersonalizedWeightLossData,
  ): string[] {
    const factors = [
      "💪 Seu plano foi personalizado para suas necessidades específicas",
      "🎯 Metas realistas aumentam chance de sucesso",
      "🏥 Consideramos suas condições de saúde para segurança máxima",
    ];

    if (data.restricoes_alimentares.length > 0) {
      factors.push("🌱 Suas restrições alimentares foram respeitadas");
    }

    if (data.tempo_disponivel >= 60) {
      factors.push("⏰ Você tem tempo adequado para bons resultados");
    }

    return factors;
  }

  private generateMilestones(
    pesoAtual: number,
    pesoMeta: number,
    perdaSemanal: number,
  ): Milestone[] {
    const milestones: Milestone[] = [];
    const totalPerda = pesoAtual - pesoMeta;
    const marcos = [0.25, 0.5, 0.75, 1.0]; // 25%, 50%, 75%, 100%

    marcos.forEach((percentual, index) => {
      const perdaMarco = totalPerda * percentual;
      const pesoMarco = pesoAtual - perdaMarco;
      const semanaEstimada = Math.ceil(perdaMarco / perdaSemanal);

      milestones.push({
        peso_alvo: Math.round(pesoMarco * 10) / 10,
        semana_estimada: semanaEstimada,
        beneficios_esperados: this.getBenefitsByPercentage(percentual),
        recompensa_sugerida: this.getRewardSuggestion(index),
      });
    });

    return milestones;
  }

  private getBenefitsByPercentage(percentage: number): string[] {
    if (percentage <= 0.25) {
      return ["Mais energia", "Melhora do humor", "Roupas mais folgadas"];
    } else if (percentage <= 0.5) {
      return [
        "Redução da pressão arterial",
        "Melhora do sono",
        "Mais autoestima",
      ];
    } else if (percentage <= 0.75) {
      return [
        "Redução de gordura visceral",
        "Melhora do condicionamento",
        "Redução de medicamentos",
      ];
    } else {
      return [
        "Meta alcançada!",
        "Transformação completa",
        "Novos hábitos consolidados",
      ];
    }
  }

  private getRewardSuggestion(index: number): string {
    const rewards = [
      "🛍️ Uma peça de roupa nova",
      "💆‍♀️ Uma sessão de spa ou massagem",
      "🏃‍♀️ Um equipamento de exercício",
      "🎉 Uma celebração especial com a família",
    ];
    return rewards[index] || "🎁 Recompensa especial";
  }

  private calculateIdealWeight(altura: number, sexo: string): number {
    // Fórmula de Robinson
    if (sexo === "masculino") {
      return 52 + 1.9 * ((altura - 152.4) / 2.54);
    } else {
      return 49 + 1.7 * ((altura - 152.4) / 2.54);
    }
  }

  private getIMCClassification(imc: number): string {
    if (imc < 18.5) return "Abaixo do peso";
    if (imc < 25) return "Peso normal";
    if (imc < 30) return "Sobrepeso";
    if (imc < 35) return "Obesidade grau I";
    if (imc < 40) return "Obesidade grau II";
    return "Obesidade grau III";
  }
}

// Função utilitária para usar o calculador
export const calculatePersonalizedWeightLoss = (
  data: PersonalizedWeightLossData,
): PersonalizedWeightLossResults => {
  const { preferences } = usePreferencesStore.getState();
  const calculator = new PersonalizedWeightLossCalculator(preferences);
  return calculator.calculate(data);
};
