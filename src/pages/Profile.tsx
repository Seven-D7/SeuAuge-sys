import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronRight,
  Gift,
  Lightbulb,
  Crown,
  Calendar,
  Clock,
  Users,
  Share,
  Download,
  Upload,
  Lock,
  Badge
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useAchievementsStore } from "../stores/achievementsStore";
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
  const { 
    achievements, 
    userStats, 
    unlockedTitles, 
    currentTitle, 
    setCurrentTitle 
  } = useAchievementsStore();
  const planName = PLANS.find((p) => p.id === user?.plan)?.name ?? "Iniciante";
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
  const [showTitleSelector, setShowTitleSelector] = useState(false);
  const [showAchievementDetails, setShowAchievementDetails] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const recentAchievements = unlockedAchievements.slice(-5).reverse();

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
      if (selected.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB.");
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
    if (formData.birthdate) {
      const birth = new Date(formData.birthdate);
      const age = new Date().getFullYear() - birth.getFullYear();
      if (age > 100 || age < 16) {
        toast.error("Idade deve estar entre 16 e 100 anos.");
        return;
      }
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
      toast.success("Assinatura cancelada com sucesso");
    } catch (err) {
      console.error("Erro ao cancelar assinatura", err);
      toast.error("Erro ao cancelar assinatura");
    }
  };

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: Activity },
    { id: "achievements", label: "Conquistas", icon: Trophy },
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
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      label: "XP Total",
      value: levelSystem.totalXP.toLocaleString(),
      change: "+25 hoje",
      icon: Zap,
      color: "text-purple-500",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      label: "Sequência Atual",
      value: `${currentStreak} dias`,
      change: `Recorde: ${longestStreak} dias`,
      icon: Flame,
      color: "text-orange-400",
      gradient: "from-orange-500 to-red-500"
    },
    {
      label: "Conquistas",
      value: unlockedAchievements.length.toString(),
      change: `${achievements.length} total`,
      icon: Trophy,
      color: "text-emerald-500",
      gradient: "from-emerald-500 to-teal-500"
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

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
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
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancelSubscription}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar Assinatura</span>
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar Perfil</span>
                </motion.button>
              </>
            ) : (
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg ${saving ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Salvando..." : "Salvar"}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                  <span>Cancelar</span>
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <div className="h-32 bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-4 right-4">
              <div className="inline-flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-sm text-slate-900 rounded-lg text-sm font-medium border border-white/20">
                <Award className="w-4 h-4 mr-2" />
                {planName}
              </div>
            </div>
            {/* Level Badge */}
            <div className="absolute top-4 left-4">
              <div className="inline-flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-sm text-slate-900 rounded-lg text-sm font-medium border border-white/20">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Nível {levelSystem.currentLevel}
              </div>
            </div>
            {/* Streak Badge */}
            <div className="absolute bottom-4 left-4">
              <div className="inline-flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-sm text-slate-900 rounded-lg text-sm font-medium border border-white/20">
                <Flame className="w-4 h-4 mr-2 text-orange-500" />
                {currentStreak} dias
              </div>
            </div>
          </div>

          <div className="-mt-16 p-6">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Avatar */}
              <div className="relative group">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center ring-4 ring-white dark:ring-slate-800 shadow-lg transition-all duration-300"
                >
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
                    <User className="w-20 h-20 text-white" />
                  )}
                </motion.div>
                {isEditing && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                    </motion.button>
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

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                {!isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        {formData.name || user?.name || "Usuário"}
                        {currentTitle && (
                          <span 
                            className="ml-3 text-lg text-primary cursor-pointer hover:text-emerald-400 transition-colors"
                            onClick={() => setShowTitleSelector(true)}
                          >
                            "{currentTitle}"
                          </span>
                        )}
                      </h2>
                      <div className="flex items-center justify-center lg:justify-start gap-4 text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {totalPoints.toLocaleString()} pontos
                        </span>
                        <span className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-purple-500" />
                          {unlockedAchievements.length} conquistas
                        </span>
                        <button
                          onClick={() => setShowTitleSelector(true)}
                          className="flex items-center gap-1 text-primary hover:text-emerald-400 transition-colors text-sm"
                        >
                          <Crown className="w-4 h-4" />
                          Alterar título
                        </button>
                      </div>
                    </div>

                    {/* Quick metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                      {[
                        {
                          label: "Peso",
                          value: `${metrics.totalWeight || 70}kg`,
                          color: "text-blue-600 dark:text-blue-400",
                        },
                        {
                          label: "IMC",
                          value: (metrics.bmi || 23.5).toFixed(1),
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
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-all duration-200 border border-slate-200 dark:border-slate-600/50 cursor-pointer"
                        >
                          <div className={`text-lg sm:text-xl font-bold ${metric.color}`}>
                            {metric.value}
                          </div>
                          <div className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                            {metric.label}
                          </div>
                        </motion.div>
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const age = new Date().getFullYear() - new Date(e.target.value).getFullYear();
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
        </motion.section>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto"
        >
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              {/* Quick Stats */}
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-full">
                          {stat.change}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-sm">
                        {stat.label}
                      </div>
                    </motion.div>
                  );
                })}
              </section>

              {/* Recent Achievements Preview */}
              {recentAchievements.length > 0 && (
                <section className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                      <Trophy className="w-6 h-6 mr-3 text-yellow-500" />
                      Conquistas Recentes
                    </h3>
                    <button
                      onClick={() => setActiveTab('achievements')}
                      className="text-primary hover:text-emerald-400 text-sm font-medium flex items-center"
                    >
                      Ver todas <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentAchievements.slice(0, 3).map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg border bg-gradient-to-br ${getRarityColor(achievement.rarity)}`}
                      >
                        <div className="text-center text-white">
                          <div className="text-3xl mb-2">{achievement.icon}</div>
                          <h4 className="font-semibold mb-1">{achievement.title}</h4>
                          <p className="text-xs opacity-90">{achievement.description}</p>
                          <div className="mt-2 text-xs opacity-75">
                            +{achievement.reward.xp} XP
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Daily Challenges */}
              <section className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <Zap className="w-6 h-6 mr-3 text-yellow-500" />
                  Desafios Diários
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dailyChallenges.map((challenge, index) => (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
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
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
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
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Level Progress */}
              <LevelProgressBar size="lg" />

              {/* XP History */}
              <XPHistory limit={5} />
            </motion.div>
          )}

          {activeTab === "achievements" && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                    <Trophy className="w-6 h-6 mr-3 text-yellow-500" />
                    Minhas Conquistas
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                    <span>{unlockedAchievements.length}/{achievements.length} desbloqueadas</span>
                    <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Achievement Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setShowAchievementDetails(true)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                        achievement.isUnlocked 
                          ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} border-transparent` 
                          : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600/50 opacity-60'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">
                          {achievement.isUnlocked ? achievement.icon : <Lock className="w-8 h-8 mx-auto text-slate-400" />}
                        </div>
                        <h4 className={`font-semibold mb-1 ${achievement.isUnlocked ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-xs mb-2 ${achievement.isUnlocked ? 'text-white/80' : 'text-slate-500 dark:text-slate-500'}`}>
                          {achievement.description}
                        </p>
                        {!achievement.isUnlocked && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {achievement.currentProgress}/{achievement.requirement}
                          </div>
                        )}
                        <div className={`text-xs mt-2 ${achievement.isUnlocked ? 'text-white/70' : 'text-yellow-600 dark:text-yellow-400'}`}>
                          +{achievement.reward.xp} XP
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "goals" && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-primary" />
                  Metas Inteligentes
                </h3>
                <div className="space-y-6">
                  {goals.map((goal, index) => {
                    const progressPercentage = (goal.currentValue / goal.targetValue) * 100;
                    return (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
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
                                    <span className="ml-2 text-green-500">✓</span>
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
                                  Progresso: {goal.currentValue} / {goal.targetValue} {goal.unit}
                                </span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                  {Math.round(progressPercentage)}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                  className={`h-3 rounded-full transition-all duration-500 ${
                                    goal.completed
                                      ? "bg-green-500"
                                      : "bg-gradient-to-r from-primary to-emerald-500"
                                  }`}
                                />
                              </div>
                            </div>

                            {!goal.completed && (
                              <div className="flex gap-2 mb-4">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleGoalProgress(goal.id, 1)}
                                  className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>+1 {goal.unit}</span>
                                </motion.button>
                                {goal.targetValue > 5 && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleGoalProgress(goal.id, 5)}
                                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                  >
                                    <Plus className="w-4 h-4" />
                                    <span>+5 {goal.unit}</span>
                                  </motion.button>
                                )}
                              </div>
                            )}

                            {/* Rewards */}
                            <div className="mb-3">
                              <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                <Gift className="w-4 h-4 mr-1" />
                                Benefícios:
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {goal.rewards.map((reward, rewardIndex) => (
                                  <span
                                    key={rewardIndex}
                                    className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full"
                                  >
                                    {reward}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Tips */}
                            <div>
                              <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                <Lightbulb className="w-4 h-4 mr-1" />
                                Dicas:
                              </h5>
                              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                {goal.tips.slice(0, 2).map((tip, tipIndex) => (
                                  <li key={tipIndex} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "metrics" && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-emerald-500" />
                  Métricas Corporais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bodyMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 group border border-slate-200 dark:border-slate-600/50 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors" />
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
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-slate-600 dark:text-slate-400" />
                Configurações
              </h3>
              <div className="space-y-4">
                {/* Theme Toggle */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 group border border-slate-200 dark:border-slate-600/50"
                >
                  <div className="flex items-center space-x-4">
                    {theme === "dark" ? (
                      <Moon className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors duration-200" />
                    ) : (
                      <Sun className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors duration-200" />
                    )}
                    <div>
                      <div className="text-slate-900 dark:text-white font-medium">
                        Tema {theme === "dark" ? "Escuro" : "Claro"}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-sm">
                        Alternar entre tema claro e escuro
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      theme === "dark" ? "bg-primary" : "bg-slate-300"
                    }`}
                  >
                    <motion.span
                      layout
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        theme === "dark" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </motion.button>
                </motion.div>

                {/* Preferences */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 group cursor-pointer border border-slate-200 dark:border-slate-600/50"
                  onClick={() => setShowPreferences(true)}
                >
                  <div className="flex items-center space-x-4">
                    <User className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors duration-200" />
                    <div>
                      <div className="text-slate-900 dark:text-white font-medium">
                        Personalização
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-sm">
                        Configure suas preferências alimentares e de treino
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200" />
                </motion.div>

                {/* Data Export */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 group cursor-pointer border border-slate-200 dark:border-slate-600/50"
                >
                  <div className="flex items-center space-x-4">
                    <Download className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors duration-200" />
                    <div>
                      <div className="text-slate-900 dark:text-white font-medium">
                        Exportar Dados
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-sm">
                        Baixe seus dados de progresso e conquistas
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title Selector Modal */}
        <AnimatePresence>
          {showTitleSelector && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
              onClick={() => setShowTitleSelector(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                    <Crown className="w-6 h-6 mr-2 text-yellow-500" />
                    Escolher Título
                  </h3>
                  <button
                    onClick={() => setShowTitleSelector(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <button
                    onClick={() => {
                      setCurrentTitle('');
                      setShowTitleSelector(false);
                    }}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                      !currentTitle 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                    }`}
                  >
                    <div className="font-medium">Sem título</div>
                    <div className="text-sm text-slate-500">Não exibir título</div>
                  </button>
                  
                  {unlockedTitles.map((title, index) => (
                    <motion.button
                      key={title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setCurrentTitle(title);
                        setShowTitleSelector(false);
                      }}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                        currentTitle === title 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                      }`}
                    >
                      <div className="font-medium">"{title}"</div>
                      <div className="text-sm text-slate-500">Desbloqueado por conquista</div>
                    </motion.button>
                  ))}
                  
                  {unlockedTitles.length === 0 && (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Nenhum título desbloqueado ainda</p>
                      <p className="text-sm">Complete conquistas para desbloquear títulos</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preferences Modal */}
        <PreferencesSetup
          isOpen={showPreferences}
          onClose={() => setShowPreferences(false)}
        />
      </div>
    </div>
  );
};

export default Profile;
