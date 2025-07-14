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
  Calendar,
  Target,
  Zap,
  ChevronRight,
  Settings,
  Bell,
  Shield,
  Moon,
  Sun,
  BarChart3,
  Users,
  Timer,
  Flame,
  Trophy,
  Star,
  Clock,
  Video,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { PLANS } from "../data/plans";
import { updateUserProfile, getUserData } from "@/services/user";
import { updateUserPlan } from "../services/plan";
import { useProgressStore } from "../stores/progressStore";
import { getUserMetrics } from "../services/user";

// Store para dados de engajamento
interface EngagementStore {
  currentStreak: number;
  longestStreak: number;
  totalVideosWatched: number;
  totalPurchases: number;
  totalFavorites: number;
  weeklyGoal: number;
  weeklyProgress: number;
  dailyActivity: { date: string; completed: boolean }[];
  lastActivityDate: string;
}

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
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Dados de engajamento (normalmente viriam do backend)
  const [engagement, setEngagement] = useState<EngagementStore>({
    currentStreak: 15,
    longestStreak: 23,
    totalVideosWatched: 47,
    totalPurchases: 12,
    totalFavorites: 23,
    weeklyGoal: 5,
    weeklyProgress: 4,
    dailyActivity: [
      { date: "2024-01-14", completed: true },
      { date: "2024-01-13", completed: true },
      { date: "2024-01-12", completed: true },
      { date: "2024-01-11", completed: false },
      { date: "2024-01-10", completed: true },
      { date: "2024-01-09", completed: true },
      { date: "2024-01-08", completed: true },
    ],
    lastActivityDate: "2024-01-14",
  });

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
    }
    load();
  }, [user, setMetrics]);

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
    { id: "metrics", label: "Progresso", icon: TrendingUp },
    { id: "activity", label: "Atividade", icon: Calendar },
    { id: "goals", label: "Metas", icon: Target },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  // Sistema de metas e progresso diário
  const dailyGoals = [
    {
      title: "Assistir Vídeo",
      description: "Complete pelo menos 1 vídeo hoje",
      progress: 100,
      completed: true,
      icon: Video,
      color: "text-blue-400",
    },
    {
      title: "Beber ��gua",
      description: "Meta de 2L de água",
      progress: 75,
      completed: false,
      icon: Timer,
      color: "text-cyan-400",
    },
    {
      title: "Exercitar-se",
      description: "30 min de atividade física",
      progress: 60,
      completed: false,
      icon: Zap,
      color: "text-yellow-400",
    },
    {
      title: "Meditação",
      description: "10 min de mindfulness",
      progress: 100,
      completed: true,
      icon: Star,
      color: "text-purple-400",
    },
  ];

  const quickStats = [
    {
      label: "Vídeos Assistidos",
      value: engagement.totalVideosWatched.toString(),
      change: "+12%",
      icon: Video,
      color: "text-emerald-400",
    },
    {
      label: "Produtos Comprados",
      value: engagement.totalPurchases.toString(),
      change: "+3",
      icon: ShoppingBag,
      color: "text-blue-400",
    },
    {
      label: "Favoritos",
      value: engagement.totalFavorites.toString(),
      change: "+5",
      icon: Heart,
      color: "text-pink-400",
    },
    {
      label: "Streak Atual",
      value: `${engagement.currentStreak} dias`,
      change: "Novo recorde!",
      icon: Flame,
      color: "text-orange-400",
    },
  ];

  const bodyMetrics = [
    {
      label: "Peso Corporal",
      value: metrics.totalWeight,
      unit: "kg",
      trend: "down",
      icon: BarChart3,
    },
    {
      label: "IMC",
      value: metrics.bmi,
      unit: "",
      trend: "stable",
      icon: Target,
    },
    {
      label: "Gordura Corporal",
      value: metrics.bodyFatPercent,
      unit: "%",
      trend: "down",
      icon: TrendingUp,
    },
    {
      label: "Massa Muscular",
      value: metrics.skeletalMuscleMass,
      unit: "kg",
      trend: "up",
      icon: Trophy,
    },
    {
      label: "Água Corporal",
      value: metrics.totalBodyWater,
      unit: "L",
      trend: "stable",
      icon: Timer,
    },
    {
      label: "TMB",
      value: metrics.bmr,
      unit: "kcal",
      trend: "up",
      icon: Flame,
    },
  ];

  const recentActivities = [
    {
      action: "Assistiu",
      item: "Yoga Matinal Energizante",
      time: "2 horas atrás",
      type: "video",
    },
    {
      action: "Comprou",
      item: "Whey Protein Premium",
      time: "1 dia atrás",
      type: "purchase",
    },
    {
      action: "Adicionou aos favoritos",
      item: "HIIT Cardio Explosivo",
      time: "2 dias atrás",
      type: "favorite",
    },
    {
      action: "Completou",
      item: "Meditação para Alívio do Estresse",
      time: "3 dias atrás",
      type: "complete",
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "video":
        return "📹";
      case "purchase":
        return "🛒";
      case "favorite":
        return "❤️";
      case "complete":
        return "✅";
      default:
        return "📝";
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "from-purple-500 to-pink-500";
    if (streak >= 14) return "from-orange-500 to-red-500";
    if (streak >= 7) return "from-green-500 to-emerald-500";
    return "from-blue-500 to-cyan-500";
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
            <button className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 hover:scale-105 border border-slate-200 dark:border-slate-700">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <button className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 hover:scale-105 border border-slate-200 dark:border-slate-700">
              <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
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
                className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${getStreakColor(engagement.currentStreak)} text-white rounded-full text-sm font-medium shadow-lg`}
              >
                <Flame className="w-4 h-4 mr-2" />
                {engagement.currentStreak} dias
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
                        {formData.name || "Usuário"}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        {user?.email}
                      </p>
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
                          value: metrics.bmi || "23.5",
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

        {/* Tabs de navegação */}
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

              {/* Metas Diárias */}
              <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-primary" />
                  Metas de Hoje
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dailyGoals.map((goal, index) => {
                    const Icon = goal.icon;
                    return (
                      <div
                        key={index}
                        className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 border border-slate-200 dark:border-slate-600/50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Icon className={`w-5 h-5 ${goal.color}`} />
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {goal.title}
                            </h4>
                          </div>
                          {goal.completed && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                          {goal.description}
                        </p>
                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              goal.completed
                                ? "bg-green-500"
                                : "bg-gradient-to-r from-primary to-emerald-500"
                            }`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <div className="text-right text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {goal.progress}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
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
                          {metric.value || "0"}{" "}
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

          {activeTab === "activity" && (
            <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-blue-500" />
                Atividade Recente
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 group cursor-pointer border border-slate-200 dark:border-slate-600/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-200">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <div className="text-slate-900 dark:text-white">
                          <span className="text-slate-600 dark:text-slate-300">
                            {activity.action}
                          </span>
                          <span className="text-primary ml-1 font-medium">
                            {activity.item}
                          </span>
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-sm">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "goals" && (
            <section className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-primary" />
                  Progresso Semanal
                </h3>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 dark:text-slate-400">
                      Meta da Semana: {engagement.weeklyGoal} atividades
                    </span>
                    <span className="text-slate-900 dark:text-white font-semibold">
                      {engagement.weeklyProgress}/{engagement.weeklyGoal}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className="h-3 bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${(engagement.weeklyProgress / engagement.weeklyGoal) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Últimos 7 Dias
                </h4>
                <div className="grid grid-cols-7 gap-2">
                  {engagement.dailyActivity.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        {new Date(day.date).toLocaleDateString("pt-BR", {
                          weekday: "short",
                        })}
                      </div>
                      <div
                        className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                          day.completed
                            ? "bg-green-500 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                        }`}
                      >
                        {day.completed ? "✓" : new Date(day.date).getDate()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <Trophy className="w-6 h-6 mr-3 text-yellow-500" />
                  Conquistas & Streaks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                    <Flame className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {engagement.currentStreak}
                    </div>
                    <div className="text-orange-700 dark:text-orange-300 font-medium">
                      Dias Consecutivos
                    </div>
                    <div className="text-orange-600 dark:text-orange-400 text-sm mt-1">
                      Streak Atual
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <Trophy className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {engagement.longestStreak}
                    </div>
                    <div className="text-purple-700 dark:text-purple-300 font-medium">
                      Dias Consecutivos
                    </div>
                    <div className="text-purple-600 dark:text-purple-400 text-sm mt-1">
                      Recorde Pessoal
                    </div>
                  </div>
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

                {[
                  {
                    title: "Notificações",
                    description: "Gerencie suas preferências de notificação",
                    icon: Bell,
                  },
                  {
                    title: "Privacidade",
                    description: "Controle suas configurações de privacidade",
                    icon: Shield,
                  },
                  {
                    title: "Metas",
                    description: "Defina e acompanhe suas metas pessoais",
                    icon: Target,
                  },
                  {
                    title: "Conta",
                    description: "Configurações da sua conta",
                    icon: User,
                  },
                ].map((setting, index) => {
                  const Icon = setting.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 group cursor-pointer border border-slate-200 dark:border-slate-600/50"
                    >
                      <div className="flex items-center space-x-4">
                        <Icon className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors duration-200" />
                        <div>
                          <div className="text-slate-900 dark:text-white font-medium">
                            {setting.title}
                          </div>
                          <div className="text-slate-600 dark:text-slate-400 text-sm">
                            {setting.description}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
