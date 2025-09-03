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
  Loader2
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
  const { user, updateUser, loading: authLoading } = useAuth();
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

      // Update extended profile data
      await updateProfile({
        phone: formData.phone ? sanitizeInput(formData.phone) : undefined,
        location: formData.location ? sanitizeInput(formData.location) : undefined,
      });

      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error(error.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  }, [formData, updateUser, updateProfile]);

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
    <div className="block sm:hidden mb-6">
      <select
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value as any)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="overview">Visão Geral</option>
        <option value="achievements">Conquistas</option>
        <option value="goals">Metas</option>
        <option value="progress">Progresso</option>
        <option value="settings">Configurações</option>
      </select>
    </div>
  );

  // Desktop tab navigation
  const TabNavigation = () => (
    <div className="hidden sm:flex space-x-1 bg-slate-800 p-1 rounded-lg mb-6">
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
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-400">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Erro ao carregar perfil</h2>
          <p className="text-slate-400">Usuário não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-slate-700 border-4 border-white/20">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Upload Avatar Button */}
                <label className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center cursor-pointer transition-colors border-2 border-white">
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

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3">
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                      {user.name || 'Usuário'}
                    </h1>
                    <p className="text-white/80 text-sm sm:text-base truncate">
                      {user.email}
                    </p>
                  </div>
                  
                  {/* Edit Button - Responsive */}
                  <div className="flex justify-center sm:justify-end">
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        <span className="sm:hidden">Editar</span>
                        <span className="hidden sm:inline">Editar Perfil</span>
                      </Button>
                    ) : (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          onClick={handleSave}
                          disabled={loading}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          <span className="sm:hidden">Salvar</span>
                          <span className="hidden sm:inline">Salvar</span>
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          size="sm"
                          className="bg-red-600/10 border-red-500/20 text-red-400 hover:bg-red-600/20 flex-1 sm:flex-none"
                        >
                          <X className="w-4 h-4 mr-2" />
                          <span className="sm:hidden">Cancelar</span>
                          <span className="hidden sm:inline">Cancelar</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Stats - Responsive Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center">
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {levelSystem.currentLevel}
                    </div>
                    <div className="text-xs sm:text-sm text-white/70">Nível</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center">
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {unlockedAchievements.length}
                    </div>
                    <div className="text-xs sm:text-sm text-white/70">Conquistas</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center">
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {userStats.currentStreak}
                    </div>
                    <div className="text-xs sm:text-sm text-white/70">Sequência</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center">
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {currentPlan?.name || 'Gratuito'}
                    </div>
                    <div className="text-xs sm:text-sm text-white/70">Plano</div>
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
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

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Nome Completo
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                              errors.name ? 'border-red-500' : 'border-slate-600'
                            }`}
                            placeholder="Digite seu nome completo"
                          />
                          {errors.name && (
                            <p className="text-red-400 text-xs mt-1 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors.name}
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
                            className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                              errors.email ? 'border-red-500' : 'border-slate-600'
                            }`}
                            placeholder="Digite seu email"
                          />
                          {errors.email && (
                            <p className="text-red-400 text-xs mt-1 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors.email}
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
                            className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                              errors.birthdate ? 'border-red-500' : 'border-slate-600'
                            }`}
                          />
                          {errors.birthdate && (
                            <p className="text-red-400 text-xs mt-1 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors.birthdate}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Telefone (Opcional)
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Localização (Opcional)
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Cidade, Estado"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-slate-400">Email</p>
                            <p className="text-white font-medium truncate">{user.email}</p>
                          </div>
                        </div>

                        {profile?.birthdate && (
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-slate-400">Data de Nascimento</p>
                              <p className="text-white font-medium">
                                {new Date(profile.birthdate).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        )}

                        {profile?.phone && (
                          <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-slate-400">Telefone</p>
                              <p className="text-white font-medium">{profile.phone}</p>
                            </div>
                          </div>
                        )}

                        {profile?.location && (
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-slate-400">Localização</p>
                              <p className="text-white font-medium">{profile.location}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Plan Info */}
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                              <Award className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {currentPlan?.name || 'Plano Gratuito'}
                              </p>
                              <p className="text-slate-400 text-sm">
                                {currentPlan?.description || 'Acesso limitado aos recursos básicos'}
                              </p>
                            </div>
                          </div>
                          {!currentPlan && (
                            <Button
                              onClick={() => window.location.href = '/plans'}
                              size="sm"
                              className="bg-primary hover:bg-primary-dark text-white"
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

              {/* Quick Stats Grid - Responsive */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {levelSystem.totalXP.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-400">XP Total</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {unlockedAchievements.length}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-400">Conquistas</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {userStats.currentStreak}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-400">Dias Seguidos</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {goals.filter(g => g.completed).length}/{goals.length}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-400">Metas</div>
                  </CardContent>
                </Card>
              </div>

              {/* Level Progress */}
              <LevelProgressBar size="lg" className="w-full" />

              {/* Recent Activity Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              className="space-y-6"
            >
              {/* Achievements Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
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
                        <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white truncate">{achievement.title}</h4>
                            <p className="text-slate-400 text-sm truncate">{achievement.description}</p>
                          </div>
                          <Badge className={`
                            ${achievement.rarity === 'common' ? 'bg-gray-500/20 text-gray-400' :
                              achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                              achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-yellow-500/20 text-yellow-400'}
                          `}>
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
              className="space-y-6"
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
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              className="space-y-6"
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
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-white font-medium">Notificações</p>
                        <p className="text-slate-400 text-sm">Receber lembretes e atualizações</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-slate-600 rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-white font-medium">Privacidade</p>
                        <p className="text-slate-400 text-sm">Controlar visibilidade do perfil</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-white font-medium">Modo Offline</p>
                        <p className="text-slate-400 text-sm">Baixar conteúdo para uso offline</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-slate-600 rounded-full relative cursor-pointer">
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
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Dados
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Importar Dados
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sincronizar
                    </Button>
                    <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/10">
                      <X className="w-4 h-4 mr-2" />
                      Excluir Conta
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