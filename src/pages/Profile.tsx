import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  User,
  Camera,
  Edit3,
  Save,
  X,
  TrendingUp,
  Award,
  Heart,
  Activity,
  Target,
  Zap,
  Settings,
  Moon,
  Sun,
  BarChart3,
  Timer,
  Flame,
  Trophy,
  Star,
  Plus,
  CheckCircle,
  Circle,
  Gift,
  Lightbulb,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { PLANS } from "../data/plans";
import { updateUserProfile, getUserData } from "@/services/user";
import { updateUserPlan } from "../services/plan";
import { useProgressStore } from "../stores/progressStore";
import { useGoalsStore } from "../stores/goalsStore";
import { useLevelStore } from "../stores/levelStore";
import { getUserMetrics } from "../services/user";
import LevelProgressBar from "../components/Common/LevelProgressBar";
import XPHistory from "../components/Common/XPHistory";
import PreferencesSetup from "../components/Preferences/PreferencesSetup";

const Profile: React.FC = () => {
  const { user, refreshPlan } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const planName =
    PLANS.find((p) => p.id === (user?.plan ?? "A"))?.name ?? "Gratuito";
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState<{
    name?: string;
    birthdate?: string;
    peso?: number;
    altura?: number;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
  });
  const { metrics, setMetrics } = useProgressStore();
  const {
    goals,
    dailyChallenges,
    totalPoints,
    currentStreak,
    longestStreak,
    updateGoalProgress,
    completeChallenge,
    generateSmartGoals,
  } = useGoalsStore();
  const { levelSystem, checkDailyLogin } = useLevelStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const saved = await getUserMetrics();
      if (saved) {
        setMetrics(saved);
      }
      const data = await getUserData(user.id);
      if (data) {
        setFormData({ name: data.name ?? "", birthdate: data.birthdate ?? "" });
      } else {
        setFormData({ name: user.name, birthdate: "" });
      }

      // Gerar metas inteligentes se ainda não existirem
      if (goals.length === 0) {
        generateSmartGoals(user);
      }

      // Verificar login diário para XP
      checkDailyLogin();
    }
    load();
  }, [user, setMetrics, goals.length, generateSmartGoals]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith("image/")) {
        toast.error("Por favor, selecione uma imagem válida.");
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async () => {
    if (formData.name.trim().length < 2 || formData.name.trim().length > 50) {
      toast.error("Nome deve ter entre 2 e 50 caracteres");
      return;
    }
    const birth = new Date(formData.birthdate);
    const age = new Date().getFullYear() - birth.getFullYear();
    if (age > 100 || age < 16) {
      toast.error("Idade deve estar entre 16 e 100 anos.");
      return;
    }
    try {
      setSaving(true);
      await updateUserProfile({
        name: formData.name,
        birthdate: formData.birthdate,
        file,
      });
      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      toast.error("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (user) {
      const data = await getUserData(user.id);
      if (data) {
        setFormData({ name: data.name ?? "", birthdate: data.birthdate ?? "" });
      }
    }
    setFile(null);
    setPreview(null);
    setIsEditing(false);
  };

  const handleCancelSubscription = async () => {
    try {
      await updateUserPlan("A");
      await refreshPlan();
    } catch (err) {
      console.error("Erro ao cancelar assinatura", err);
    }
  };

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: Activity },
    { id: "goals", label: "Metas", icon: Target },
    { id: "metrics", label: "Progresso", icon: TrendingUp },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  const quickStats = [
    {
      label: "Nível Atual",
      value: `Nível ${levelSystem.currentLevel}`,
      change: `${levelSystem.xpToNextLevel} XP para próximo`,
      icon: Star,
      color: "text-yellow-500",
    },
    {
      label: "XP Total",
      value: levelSystem.totalXP.toString(),
      change: "+25 hoje",
      icon: Zap,
      color: "text-purple-500",
    },
    {
      label: "Streak Atual",
      value: `${currentStreak} dias`,
      change: "Novo recorde!",
      icon: Flame,
      color: "text-orange-400",
    },
  ];

  const bodyMetrics = [
    {
      label: "Peso Corporal",
      value: metrics.totalWeight || 70,
      unit: "kg",
      trend: "down",
      icon: BarChart3,
    },
    {
      label: "IMC",
      value: metrics.bmi || 23.5,
      unit: "",
      trend: "stable",
      icon: Target,
    },
    {
      label: "Gordura Corporal",
      value: metrics.bodyFatPercent || 15,
      unit: "%",
      trend: "down",
      icon: TrendingUp,
    },
    {
      label: "Massa Muscular",
      value: metrics.skeletalMuscleMass || 32,
      unit: "kg",
      trend: "up",
      icon: Trophy,
    },
    {
      label: "Água Corporal",
      value: metrics.totalBodyWater || 45,
      unit: "L",
      trend: "stable",
      icon: Timer,
    },
    {
      label: "TMB",
      value: metrics.bmr || 1850,
      unit: "kcal",
      trend: "up",
      icon: Flame,
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "down":
        return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "from-purple-500 to-pink-500";
    if (streak >= 14) return "from-orange-500 to-red-500";
    if (streak >= 7) return "from-green-500 to-emerald-500";
    return "from-blue-500 to-cyan-500";
  };

  const handleGoalProgress = (goalId: string, increment: number) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      const newValue = Math.min(
        goal.currentValue + increment,
        goal.targetValue,
      );
      updateGoalProgress(goalId, newValue);
      if (newValue >= goal.targetValue) {
        toast.success(`🎉 Meta "${goal.title}" concluída!`);
      }
    }
  };

  const handleCompleteChallenge = (challengeId: string) => {
    completeChallenge(challengeId);
    const challenge = dailyChallenges.find((c) => c.id === challengeId);
    if (challenge) {
      toast.success(`+${challenge.points} pontos! 🎯`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Meu Perfil
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Gerencie suas informações e acompanhe seu progresso
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing ? (
              <>
                {user?.plan && user.plan !== "A" && (
                  <button
                    onClick={handleCancelSubscription}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar Assinatura</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsEditing(true);
                  }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar Perfil</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg ${saving ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Salvando..." : "Salvar"}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                >
                  <X className="w-4 h-4" />
                  <span>Cancelar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <section className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="h-32 bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            <div className="absolute top-4 right-4">
              <div className="inline-flex items-center px-4 py-2 bg-black/30 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/20">
                <Award className="w-4 h-4 mr-2" />
                {planName}
              </div>
            </div>
            {/* Streak Badge */}
            <div className="absolute top-4 left-4">
              <div
                className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${getStreakColor(currentStreak)} text-white rounded-full text-sm font-medium shadow-lg`}
              >
                <Flame className="w-4 h-4 mr-2" />
                {currentStreak} dias
              </div>
            </div>
          </div>

          <div className="-mt-16 p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center ring-4 ring-white dark:ring-slate-800 shadow-2xl transition-all duration-300 group-hover:scale-105">
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </div>
              </div>

              {/* Info do usuário */}
              <div className="flex-1 text-center lg:text-left">
                {!isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        {formData.name || user?.name || "Usuário"}
                      </h2>
                      <div className="flex items-center justify-center lg:justify-start gap-4 text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {totalPoints} pontos
                        </span>
                        <span className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-purple-500" />
                          Recorde: {longestStreak} dias
                        </span>
                      </div>
                    </div>

                    {/* Quick metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                      {[
                        {
                          label: "Peso",
                          value: `${metrics.totalWeight || 70}kg`,
                          color: "text-blue-600 dark:text-blue-400",
                        },
                        {
                          label: "IMC",
                          value: (metrics.bmi || 23.5).toString(),
                          color: "text-green-600 dark:text-green-400",
                        },
                        {
                          label: "Gordura",
                          value: `${metrics.bodyFatPercent || 15}%`,
                          color: "text-yellow-600 dark:text-yellow-400",
                        },
                        {
                          label: "Músculo",
                          value: `${metrics.skeletalMuscleMass || 32}kg`,
                          color: "text-purple-600 dark:text-purple-400",
                        },
                      ].map((metric, index) => (
                        <div
                          key={index}
                          className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 sm:p-4 text-center hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-all duration-200 border border-slate-200 dark:border-slate-600/50"
                        >
                          <div
                            className={`text-lg sm:text-xl font-bold ${metric.color}`}
                          >
                            {metric.value}
                          </div>
                          <div className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 max-w-2xl">
                    {/* Informações básicas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const value = e.target.value;
                            if (value.length <= 50)
                              setFormData({ ...formData, name: value });
                          }}
                          className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Data de Nascimento
                        </label>
                        <input
                          type="date"
                          value={formData.birthdate}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const age =
                              new Date().getFullYear() -
                              new Date(e.target.value).getFullYear();
                            if (age >= 16 && age <= 100) {
                              setFormData({
                                ...formData,
                                birthdate: e.target.value,
                              });
                            }
                          }}
                          className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tabs de navega��ão */}
        <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Conteúdo das tabs */}
        <div>
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:scale-105 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Icon
                          className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform duration-200`}
                        />
                        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-full">
                          {stat.change}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-sm">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </section>

              {/* Desafios Diários */}
              <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <Zap className="w-6 h-6 mr-3 text-yellow-500" />
                  Desafios Diários
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dailyChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        challenge.completed
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                          : "bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600/50 hover:border-slate-300 dark:hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{challenge.icon}</span>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {challenge.title}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {challenge.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            +{challenge.points}pts
                          </span>
                          <button
                            onClick={() =>
                              !challenge.completed &&
                              handleCompleteChallenge(challenge.id)
                            }
                            disabled={challenge.completed}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                              challenge.completed
                                ? "bg-green-500 text-white"
                                : "bg-slate-200 dark:bg-slate-600 hover:bg-primary hover:text-white"
                            }`}
                          >
                            {challenge.completed ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <Plus className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Barra de Progresso de Nível */}
              <LevelProgressBar size="lg" />

              {/* Histórico de XP */}
              <XPHistory limit={5} />
            </div>
          )}

          {activeTab === "goals" && (
            <section className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-primary" />
                  Metas Inteligentes
                </h3>
                <div className="space-y-6">
                  {goals.map((goal) => {
                    const progressPercentage =
                      (goal.currentValue / goal.targetValue) * 100;
                    return (
                      <div
                        key={goal.id}
                        className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                          goal.completed
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            : "bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600/50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-2xl">{goal.icon}</span>
                              <div>
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                                  {goal.title}
                                  {goal.completed && (
                                    <span className="ml-2 text-green-500">
                                      ✓
                                    </span>
                                  )}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {goal.description}
                                </p>
                              </div>
                            </div>

                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  Progresso: {goal.currentValue} /{" "}
                                  {goal.targetValue} {goal.unit}
                                </span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                  {Math.round(progressPercentage)}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                                <div
                                  className={`h-3 rounded-full transition-all duration-500 ${
                                    goal.completed
                                      ? "bg-green-500"
                                      : "bg-gradient-to-r from-primary to-emerald-500"
                                  }`}
                                  style={{
                                    width: `${Math.min(progressPercentage, 100)}%`,
                                  }}
                                />
                              </div>
                            </div>

                            {!goal.completed && (
                              <div className="flex gap-2 mb-4">
                                <button
                                  onClick={() => handleGoalProgress(goal.id, 1)}
                                  className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>+1 {goal.unit}</span>
                                </button>
                                {goal.targetValue > 5 && (
                                  <button
                                    onClick={() =>
                                      handleGoalProgress(goal.id, 5)
                                    }
                                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                  >
                                    <Plus className="w-4 h-4" />
                                    <span>+5 {goal.unit}</span>
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Recompensas */}
                            <div className="mb-3">
                              <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                <Gift className="w-4 h-4 mr-1" />
                                Benefícios:
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {goal.rewards.map((reward, index) => (
                                  <span
                                    key={index}
                                    className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full"
                                  >
                                    {reward}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Dicas */}
                            <div>
                              <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                <Lightbulb className="w-4 h-4 mr-1" />
                                Dicas:
                              </h5>
                              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                {goal.tips.slice(0, 2).map((tip, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {activeTab === "metrics" && (
            <section className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-emerald-500" />
                  Métricas Corporais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bodyMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <div
                        key={index}
                        className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 group border border-slate-200 dark:border-slate-600/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-400 text-sm">
                              {metric.label}
                            </span>
                          </div>
                          {getTrendIcon(metric.trend)}
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {metric.value}{" "}
                          <span className="text-lg text-slate-500 dark:text-slate-400">
                            {metric.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {activeTab === "settings" && (
            <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-slate-600 dark:text-slate-400" />
                Configurações
              </h3>
              <div className="space-y-4">
                {/* Tema */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 group border border-slate-200 dark:border-slate-600/50">
                  <div className="flex items-center space-x-4">
                    {theme === "dark" ? (
                      <Moon className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors duration-200" />
                    ) : (
                      <Sun className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors duration-200" />
                    )}
                    <div>
                      <div className="text-slate-900 dark:text-white font-medium">
                        Tema
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-sm">
                        Alternar entre tema claro e escuro
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      theme === "dark" ? "bg-primary" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        theme === "dark" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                                    </button>
                </div>

                {/* Configurar Preferências */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 group cursor-pointer border border-slate-200 dark:border-slate-600/50"
                     onClick={() => setShowPreferences(true)}>
                  <div className="flex items-center space-x-4">
                    <User className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors duration-200" />
                    <div>
                      <div className="text-slate-900 dark:text-white font-medium">Personalização</div>
                      <div className="text-slate-600 dark:text-slate-400 text-sm">
                        Configure suas preferências alimentares e de treino
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Modal de Preferências */}
        <PreferencesSetup
          isOpen={showPreferences}
          onClose={() => setShowPreferences(false)}
        />
        </div>
      </div>
    </div>
  );
};

export default Profile;