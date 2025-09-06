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
  const [saving, setSaving] = useState(false);
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

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setErrors({});

    // Input validation
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      setErrors(prev => ({ ...prev, name: nameValidation.error || 'Nome inválido' }));
      setSaving(false);
      return;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setErrors(prev => ({ ...prev, email: emailValidation.error || 'Email inválido' }));
      setSaving(false);
      return;
    }
    
    try {
      // --- START: CORRECTED LOGIC ---
      const authUpdates = {
        email: sanitizeInput(formData.email.toLowerCase()),
        data: { 
          name: sanitizeInput(formData.name)
        },
      };

      const profileUpdates = {
        birthdate: formData.birthdate || '',
        phone: sanitizeInput(formData.phone),
        location: sanitizeInput(formData.location),
      };

      // Perform updates in parallel for efficiency
      const promises = [];
      
      // Only add updateUser promise if email or name changed
      if (formData.email !== user?.email || formData.name !== user?.name) {
        promises.push(updateUser(authUpdates));
      }
      
      // Add updateProfile for other data
      promises.push(updateProfile(profileUpdates as any));

      await Promise.all(promises);
      // --- END: CORRECTED LOGIC ---

      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      setErrors({ general: error.message || 'Erro ao salvar o perfil. Tente novamente.' });
      toast.error('Erro ao salvar o perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }, [formData, user, updateUser, updateProfile]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setErrors({});
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
      
      // --- START: CORRECTED LOGIC ---
      await updateUser({ data: { avatar_url: avatarUrl } });
      // --- END: CORRECTED LOGIC ---
      
      toast.success('Avatar atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao fazer upload do avatar:', error);
      toast.error('Erro ao atualizar avatar. Tente novamente.');
    } finally {
      setUploadingAvatar(false);
    }
  }, [user, updateUser, uploadAvatar]);

  // ... (o resto do código do componente permanece o mesmo) ...

  const currentPlan = PLANS.find(p => p.id === user?.plan);
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 p-4 sm:p-6">
            <div className="flex flex-col items-center text-center space-y-4">
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
              <div className="w-full max-w-md mx-auto">
                <div className="mb-4">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 break-words leading-tight">
                    {user.name || 'Usuário'}
                  </h1>
                  <p className="text-white/80 text-sm sm:text-base break-all leading-relaxed">
                    {user.email}
                  </p>
                </div>
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
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1 py-2.5"
                      >
                        {saving ? (
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
        
        {/* O restante do JSX continua aqui, sem alterações... */}

      </div>
    </div>
  );
};

export default Profile;
