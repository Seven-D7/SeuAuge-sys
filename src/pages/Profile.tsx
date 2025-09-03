import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Edit3,
  Save,
  X,
  Camera,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Award,
  TrendingUp,
  Target,
  Clock,
  Star,
  Trophy,
  Flame,
  BarChart3,
  Settings,
  Shield,
  Bell,
  Smartphone,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { useAchievementsStore } from '../stores/achievementsStore';
import { useLevelStore } from '../stores/levelStore';
import { useGoalsStore } from '../stores/goalsStore';
import { useProgressStore } from '../stores/progressStore';
import { useUserProfileStore } from '../stores/userProfileStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { PLANS } from '../data/plans';
import LevelProgressBar from '../components/Common/LevelProgressBar';
import XPHistory from '../components/Common/XPHistory';
import WeeklyProgressChart from '../components/Profile/WeeklyProgressChart';
import DailyChallenges from '../components/Profile/DailyChallenges';
import ReportExporter from '../components/Profile/ReportExporter';
import { validateEmail, validateName, sanitizeInput } from '../lib/validation';
import { uploadAvatar } from '../services/user';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, updateUser, loading: authLoading, error: authError, clearError } = useAuth();
  const { achievements, userStats, getActiveChallenges } = useAchievementsStore();
  const { levelSystem } = useLevelStore();
  const { goals } = useGoalsStore();
  const { profile, updateProfile, loading: profileLoading } = useUserProfileStore();

  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'goals' | 'progress' | 'settings'>('overview');
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthdate: '',
    phone: '',
    location: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        birthdate: profile?.birthdate || '',
        phone: profile?.phone || '',
        location: profile?.location || ''
      });
    }
  }, [user, profile]);

  // Clear auth errors when component mounts
  useEffect(() => {
    if (authError) {
      clearError();
    }
  }, [authError, clearError]);

  // Memoized callbacks for better performance
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleSave = useCallback(async () => {
    setLoading(true);
    setErrors({});

    try {
      // Validate inputs
      const nameValidation = validateName(formData.name);
      if (!nameValidation.isValid) {
        setErrors(prev => ({ ...prev, name: nameValidation.error || 'Nome inválido' }));
        return;
      }

      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        setErrors(prev => ({ ...prev, email: emailValidation.error || 'Email inválido' }));
        return;
      }

      // Validate birthdate
      if (formData.birthdate) {
        const birthDate = new Date(formData.birthdate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13 || age > 120 || isNaN(birthDate.getTime())) {
          setErrors(prev => ({ ...prev, birthdate: 'Data de nascimento inválida' }));
          return;
        }
      }

      // Update user profile
      await updateUser({
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email.toLowerCase()),
        birthdate: formData.birthdate || undefined,
      });

      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      setErrors({ general: error.message || 'Erro ao atualizar perfil' });
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  }, [formData, updateUser]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setErrors({});
    // Reset form data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        birthdate: profile?.birthdate || '',
        phone: profile?.phone || '',
        location: profile?.location || ''
      });
    }
  }, [user, profile]);

  const handleAvatarUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Apenas imagens são permitidas');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 5MB');
      return;
    }

    setUploadingAvatar(true);

    try {
      const avatarUrl = await uploadAvatar(file, user.id);
      await updateUser({ avatar_url: avatarUrl });
      toast.success('Avatar atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao fazer upload do avatar:', error);
      toast.error('Erro ao atualizar avatar');
    } finally {
      setUploadingAvatar(false);
    }
  }, [user, updateUser]);

  // Get user plan info
  const currentPlan = PLANS.find(p => p.id === user?.plan);
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const activeChallenges = getActiveChallenges();

  // Calculate completion percentage
  const profileCompletion = React.useMemo(() => {
    if (!user) return 0;
    let completed = 0;
    const total = 6;

    if (user.name) completed++;
    if (user.email) completed++;
    if (user.avatar) completed++;
    if (profile?.birthdate) completed++;
    if (profile?.phone) completed++;
    if (profile?.location) completed++;

    return Math.round((completed / total) * 100);
  }, [user, profile]);

  // Mobile-friendly tab selector
  const TabSelector = () => (
    <div className="block md:hidden mb-4">
      <div className="relative">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as any)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm appearance-none"
        >
          <option value="overview">📊 Visão Geral</option>
          <option value="achievements">🏆 Conquistas</option>
          <option value="goals">🎯 Metas</option>
          <option value="progress">📈 Progresso</option>
          <option value="settings">⚙️ Configurações</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );

  // Desktop tab navigation
  const TabNavigation = () => (
    <div className="hidden md:flex space-x-1 bg-slate-800 p-1 rounded-lg mb-6 overflow-x-auto">
      {[
        { id: 'overview', label: 'Visão Geral', icon: User },
        { id: 'achievements', label: 'Conquistas', icon: Trophy },
        { id: 'goals', label: 'Metas', icon: Target },
        { id: 'progress', label: 'Progresso', icon: TrendingUp },
        { id: 'settings', label: 'Configurações', icon: Settings }
      ].map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-400">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Erro ao carregar perfil</h2>
          <p className="text-slate-400 mb-4">Usuário não encontrado</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-3 sm:p-4 md:p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Section - Melhorado para mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 p-4 sm:p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Avatar Section */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-slate-700 border-4 border-white/20 mx-auto">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Upload Avatar Button */}
                <label className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center cursor-pointer transition-colors border-2 border-white shadow-lg">
                  {uploadingAvatar ? (
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-spin" />
                  ) : (
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>

              {/* User Info - Centralizado e responsivo */}
              <div className="w-full max-w-md mx-auto">
                <div className="mb-4">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 break-words leading-tight">
                    {user.name || 'Usuário'}
                  </h1>
                  <p className="text-white/80 text-sm sm:text-base break-all leading-relaxed">
                    {user.email}
                  </p>
                </div>
                
                {/* Edit Buttons - Melhorados para mobile */}
                <div className="mb-4">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto px-6 py-2.5"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </Button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1 py-2.5"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Salvar
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="bg-red-600/10 border-red-500/20 text-red-400 hover:bg-red-600/20 flex-1 py-2.5"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>

                {/* User Stats - Grid responsivo */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {levelSystem.currentLevel}
                    </div>
                    <div className="text-xs text-white/70">Nível</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {unlockedAchievements.length}
                    </div>
                    <div className="text-xs text-white/70">Conquistas</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {userStats.currentStreak}
                    </div>
                    <div className="text-xs text-white/70">Sequência</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-sm sm:text-base font-bold text-white break-words">
                      {currentPlan?.name || 'Gratuito'}
                    </div>
                    <div className="text-xs text-white/70">Plano</div>
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80 text-sm">Perfil Completo</span>
                    <span className="text-white font-medium text-sm">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${profileCompletion}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-white rounded-full h-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <TabSelector />
        <TabNavigation />

        {/* Error Display */}
        {(authError || errors.general) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-red-600 dark:text-red-400 text-sm break-words">
                  {authError || errors.general}
                </p>
              </div>
              <button
                onClick={() => {
                  clearError();
                  setErrors(prev => ({ ...prev, general: '' }));
                }}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Personal Information Card */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Nome Completo
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                              errors.name ? 'border-red-500' : 'border-slate-600'
                            }`}
                            placeholder="Digite seu nome completo"
                          />
                          {errors.name && (
                            <p className="text-red-400 text-xs mt-1 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="break-words">{errors.name}</span>
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                              errors.email ? 'border-red-500' : 'border-slate-600'
                            }`}
                            placeholder="Digite seu email"
                          />
                          {errors.email && (
                            <p className="text-red-400 text-xs mt-1 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="break-words">{errors.email}</span>
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Data de Nascimento
                          </label>
                          <input
                            type="date"
                            value={formData.birthdate}
                            onChange={(e) => handleInputChange('birthdate', e.target.value)}
                            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                              errors.birthdate ? 'border-red-500' : 'border-slate-600'
                            }`}
                          />
                          {errors.birthdate && (
                            <p className="text-red-400 text-xs mt-1 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="break-words">{errors.birthdate}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                          <Mail className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-slate-400 mb-1">Email</p>
                            <p className="text-white font-medium break-all text-sm leading-relaxed">{user.email}</p>
                          </div>
                        </div>

                        {profile?.birthdate && (
                          <div className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                            <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-slate-400 mb-1">Data de Nascimento</p>
                              <p className="text-white font-medium text-sm">
                                {new Date(profile.birthdate).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Plan Info */}
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Award className="w-5 h-5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-white font-medium text-sm break-words">
                                {currentPlan?.name || 'Plano Gratuito'}
                              </p>
                              <p className="text-slate-400 text-xs break-words leading-relaxed">
                                {currentPlan?.description || 'Acesso limitado aos recursos básicos'}
                              </p>
                            </div>
                          </div>
                          {!currentPlan && (
                            <Button
                              onClick={() => window.location.href = '/plans'}
                              size="sm"
                              className="bg-primary hover:bg-primary-dark text-white w-full sm:w-auto flex-shrink-0"
                            >
                              Upgrade
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats Grid - Responsivo */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {levelSystem.totalXP.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">XP Total</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {unlockedAchievements.length}
                    </div>
                    <div className="text-xs text-slate-400">Conquistas</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {userStats.currentStreak}
                    </div>
                    <div className="text-xs text-slate-400">Dias Seguidos</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {goals.filter(g => g.completed).length}/{goals.length}
                    </div>
                    <div className="text-xs text-slate-400">Metas</div>
                  </CardContent>
                </Card>
              </div>

              {/* Level Progress */}
              <LevelProgressBar size="lg" className="w-full" />

              {/* Recent Activity Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <WeeklyProgressChart />
                <XPHistory limit={5} />
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Achievements Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'Total', value: achievements.length, color: 'bg-slate-600' },
                  { label: 'Desbloqueadas', value: unlockedAchievements.length, color: 'bg-green-600' },
                  { label: 'Comuns', value: unlockedAchievements.filter(a => a.rarity === 'common').length, color: 'bg-gray-600' },
                  { label: 'Raras+', value: unlockedAchievements.filter(a => ['rare', 'epic', 'legendary'].includes(a.rarity)).length, color: 'bg-purple-600' }
                ].map((stat, index) => (
                  <Card key={index} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4 text-center">
                      <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-slate-400 break-words">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Achievements */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Conquistas Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  {unlockedAchievements.length > 0 ? (
                    <div className="space-y-3">
                      {unlockedAchievements.slice(0, 5).map((achievement) => (
                        <div key={achievement.id} className="flex items-start space-x-3 p-3 bg-slate-700/50 rounded-lg">
                          <div className="text-2xl flex-shrink-0">{achievement.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white text-sm break-words leading-tight">{achievement.title}</h4>
                            <p className="text-slate-400 text-xs break-words leading-relaxed mt-1">{achievement.description}</p>
                          </div>
                          <Badge className={`flex-shrink-0 text-xs ${
                            achievement.rarity === 'common' ? 'bg-gray-500/20 text-gray-400' :
                            achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                            achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">Nenhuma conquista desbloqueada ainda</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4 sm:space-y-6"
            >
              <DailyChallenges
                challenges={activeChallenges}
                onCompleteChallenge={(id) => console.log('Complete challenge:', id)}
                onProgressUpdate={(id, increment) => console.log('Update progress:', id, increment)}
                currentStreak={userStats.currentStreak}
              />
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <WeeklyProgressChart />
                <ReportExporter
                  userStats={userStats}
                  achievements={achievements}
                  goals={goals}
                  levelSystem={levelSystem}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4 sm:space-y-6"
            >
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Configurações da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Bell className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-sm">Notificações</p>
                        <p className="text-slate-400 text-xs break-words leading-relaxed">Receber lembretes e atualizações</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-slate-600 rounded-full relative cursor-pointer flex-shrink-0">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Shield className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-sm">Privacidade</p>
                        <p className="text-slate-400 text-xs break-words leading-relaxed">Controlar visibilidade do perfil</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer flex-shrink-0">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Smartphone className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-sm">Modo Offline</p>
                        <p className="text-slate-400 text-xs break-words leading-relaxed">Baixar conteúdo para uso offline</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-slate-600 rounded-full relative cursor-pointer flex-shrink-0">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Management */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Gerenciar Dados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 w-full">
                      <Download className="w-4 h-4 mr-2" />
                      <span className="truncate">Exportar Dados</span>
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      <span className="truncate">Importar Dados</span>
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      <span className="truncate">Sincronizar</span>
                    </Button>
                    <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/10 w-full">
                      <X className="w-4 h-4 mr-2" />
                      <span className="truncate">Excluir Conta</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;