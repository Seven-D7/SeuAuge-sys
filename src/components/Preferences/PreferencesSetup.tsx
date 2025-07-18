import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  User,
  Target,
  Activity,
  AlertTriangle,
  Heart,
  Clock,
  ChefHat,
  Dumbbell,
  Save,
  X,
} from "lucide-react";
import {
  usePreferencesStore,
  UserPreferences,
  getDietaryRestrictionsOptions,
  getFoodPreferencesOptions,
} from "../../stores/preferencesStore";

interface PreferencesSetupProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: number;
}

const PreferencesSetup: React.FC<PreferencesSetupProps> = ({
  isOpen,
  onClose,
  initialStep = 0,
}) => {
  const { preferences, updatePreferences, dietaryRestrictions } =
    usePreferencesStore();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] =
    useState<Partial<UserPreferences>>(preferences);

  const steps = [
    { id: "basic", title: "Informações Básicas", icon: User },
    { id: "goals", title: "Objetivos", icon: Target },
    { id: "activity", title: "Atividade Física", icon: Activity },
    { id: "dietary", title: "Alimentação", icon: ChefHat },
    { id: "health", title: "Saúde", icon: Heart },
    { id: "preferences", title: "Preferências", icon: Clock },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    updatePreferences(formData);
    toast.success("Preferências salvas com sucesso!");
    onClose();
  };

  const updateFormData = (field: keyof UserPreferences, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof UserPreferences, item: string) => {
    setFormData((prev) => {
      const currentArray = (prev[field] as string[]) || [];
      const isIncluded = currentArray.includes(item);
      const newArray = isIncluded
        ? currentArray.filter((i) => i !== item)
        : [...currentArray, item];

      return { ...prev, [field]: newArray };
    });
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case "basic":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Informações Básicas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Idade
                </label>
                <input
                  type="number"
                  min="16"
                  max="100"
                  value={formData.age || 25}
                  onChange={(e) =>
                    updateFormData("age", parseInt(e.target.value))
                  }
                  className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Gênero
                </label>
                <select
                  value={formData.gender || "other"}
                  onChange={(e) => updateFormData("gender", e.target.value)}
                  className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="other">Prefiro não informar</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Peso Atual (kg)
                </label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  value={formData.currentWeight || ""}
                  onChange={(e) =>
                    updateFormData("currentWeight", parseFloat(e.target.value))
                  }
                  className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Peso Meta (kg) - Opcional
                </label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  value={formData.targetWeight || ""}
                  onChange={(e) =>
                    updateFormData("targetWeight", parseFloat(e.target.value))
                  }
                  className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        );

      case "goals":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Qual é o seu objetivo principal?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: "weight_loss",
                  title: "Perda de Peso",
                  desc: "Reduzir peso corporal e gordura",
                  icon: "📉",
                },
                {
                  id: "muscle_gain",
                  title: "Ganho de Massa",
                  desc: "Aumentar massa muscular",
                  icon: "💪",
                },
                {
                  id: "maintenance",
                  title: "Manutenção",
                  desc: "Manter peso e forma atual",
                  icon: "⚖️",
                },
                {
                  id: "endurance",
                  title: "Resistência",
                  desc: "Melhorar condicionamento físico",
                  icon: "🏃",
                },
                {
                  id: "strength",
                  title: "Força",
                  desc: "Aumentar força e potência",
                  icon: "🏋️",
                },
              ].map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => updateFormData("fitnessGoal", goal.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    formData.fitnessGoal === goal.id
                      ? "border-primary bg-primary/10 dark:bg-primary/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <div className="text-2xl mb-2">{goal.icon}</div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {goal.title}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {goal.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "activity":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Atividade Física
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nível de Atividade Atual
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: "sedentary",
                    title: "Sedentário",
                    desc: "Pouco ou nenhum exercício",
                  },
                  {
                    id: "light",
                    title: "Leve",
                    desc: "Exercício leve 1-3 dias/semana",
                  },
                  {
                    id: "moderate",
                    title: "Moderado",
                    desc: "Exercício moderado 3-5 dias/semana",
                  },
                  {
                    id: "active",
                    title: "Ativo",
                    desc: "Exercício intenso 6-7 dias/semana",
                  },
                  {
                    id: "very_active",
                    title: "Muito Ativo",
                    desc: "Exercício muito intenso, trabalho físico",
                  },
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => updateFormData("activityLevel", level.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                      formData.activityLevel === level.id
                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="font-medium text-slate-900 dark:text-white">
                      {level.title}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {level.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tempo Disponível por Dia (minutos)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={formData.timeAvailable || 60}
                onChange={(e) =>
                  updateFormData("timeAvailable", parseInt(e.target.value))
                }
                className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nível de Experiência
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "beginner", title: "Iniciante" },
                  { id: "intermediate", title: "Intermediário" },
                  { id: "advanced", title: "Avançado" },
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => updateFormData("experienceLevel", level.id)}
                    className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                      formData.experienceLevel === level.id
                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="font-medium text-slate-900 dark:text-white">
                      {level.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "dietary":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Restrições e Preferências Alimentares
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Restrições Alimentares
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getDietaryRestrictionsOptions().map((restriction) => (
                  <button
                    key={restriction.id}
                    onClick={() =>
                      toggleArrayItem("dietaryRestrictions", restriction.id)
                    }
                    className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                      formData.dietaryRestrictions?.includes(restriction.id)
                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="font-medium text-slate-900 dark:text-white">
                      {restriction.name}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {restriction.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Alergias Alimentares (separadas por vírgula)
              </label>
              <input
                type="text"
                placeholder="Ex: amendoim, camarão, ovos"
                value={formData.allergies?.join(", ") || ""}
                onChange={(e) =>
                  updateFormData(
                    "allergies",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s),
                  )
                }
                className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Habilidade Culinária
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "beginner", title: "Iniciante" },
                  { id: "intermediate", title: "Intermediário" },
                  { id: "advanced", title: "Avançado" },
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => updateFormData("cookingSkill", level.id)}
                    className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                      formData.cookingSkill === level.id
                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="font-medium text-slate-900 dark:text-white">
                      {level.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "health":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Informações de Saúde
            </h3>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Importante:</strong> Essas informações ajudam a
                  personalizar suas recomendações. Sempre consulte um
                  profissional de saúde antes de fazer mudanças significativas
                  na dieta ou exercícios.
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Condições Médicas (separadas por vírgula)
              </label>
              <input
                type="text"
                placeholder="Ex: diabetes, hipertensão, hipotireoidismo"
                value={formData.medicalConditions?.join(", ") || ""}
                onChange={(e) =>
                  updateFormData(
                    "medicalConditions",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s),
                  )
                }
                className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Medicamentos em Uso (separados por vírgula)
              </label>
              <input
                type="text"
                placeholder="Ex: metformina, losartana"
                value={formData.medications?.join(", ") || ""}
                onChange={(e) =>
                  updateFormData(
                    "medications",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s),
                  )
                }
                className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Preferências Finais
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    Recomendações Inteligentes
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Receber sugestões personalizadas baseadas nas suas
                    preferências
                  </div>
                </div>
                <button
                  onClick={() =>
                    updateFormData(
                      "enableSmartRecommendations",
                      !formData.enableSmartRecommendations,
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.enableSmartRecommendations
                      ? "bg-primary"
                      : "bg-slate-300 dark:bg-slate-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.enableSmartRecommendations
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    Alertas Nutricionais
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Receber avisos sobre ingredientes que você deve evitar
                  </div>
                </div>
                <button
                  onClick={() =>
                    updateFormData(
                      "enableNutritionalAlerts",
                      !formData.enableNutritionalAlerts,
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.enableNutritionalAlerts
                      ? "bg-primary"
                      : "bg-slate-300 dark:bg-slate-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.enableNutritionalAlerts
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Orçamento para Alimentação
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: "low",
                    title: "Econômico",
                    desc: "Opções mais baratas",
                  },
                  {
                    id: "medium",
                    title: "Moderado",
                    desc: "Equilíbrio custo-benefício",
                  },
                  {
                    id: "high",
                    title: "Premium",
                    desc: "Ingredientes premium",
                  },
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => updateFormData("budgetLevel", level.id)}
                    className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                      formData.budgetLevel === level.id
                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="font-medium text-slate-900 dark:text-white text-sm">
                      {level.title}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {level.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Configurar Preferências
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Personalize sua experiência para recomendações mais precisas
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.id}>
                  <div
                    className={`flex items-center space-x-2 ${
                      index === currentStep
                        ? "text-primary"
                        : index < currentStep
                          ? "text-green-500"
                          : "text-slate-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 ${
                        index < currentStep
                          ? "bg-green-500"
                          : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">{renderStep()}</div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            {currentStep + 1} de {steps.length}
          </div>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              <Save className="w-4 h-4" />
              <span>Salvar</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
            >
              Próximo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreferencesSetup;
