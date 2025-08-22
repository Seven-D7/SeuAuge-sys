import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { authOperations } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

interface EmailVerificationPromptProps {
  email: string;
  onClose?: () => void;
  onResendSuccess?: () => void;
}

const EmailVerificationPrompt: React.FC<EmailVerificationPromptProps> = ({ 
  email, 
  onClose, 
  onResendSuccess 
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [lastResendTime, setLastResendTime] = useState<Date | null>(null);
  const [cooldownActive, setCooldownActive] = useState(false);
  const { t } = useLanguage();

  const COOLDOWN_MINUTES = 2;
  const MAX_RESENDS = 3;

  const handleResendEmail = async () => {
    // Check cooldown
    if (lastResendTime) {
      const timeSinceLastResend = Date.now() - lastResendTime.getTime();
      const cooldownMs = COOLDOWN_MINUTES * 60 * 1000;
      
      if (timeSinceLastResend < cooldownMs) {
        const remainingTime = Math.ceil((cooldownMs - timeSinceLastResend) / 1000 / 60);
        toast.error(`Aguarde ${remainingTime} minuto(s) antes de reenviar`);
        return;
      }
    }

    // Check max resends
    if (resendCount >= MAX_RESENDS) {
      toast.error('Limite de reenvios atingido. Entre em contato com o suporte se necessário');
      return;
    }

    setIsResending(true);

    try {
      const { error } = await authOperations.resendConfirmation(email);
      
      if (error) {
        throw error;
      }

      setResendCount(prev => prev + 1);
      setLastResendTime(new Date());
      setCooldownActive(true);

      toast.success('Email de verificação reenviado com sucesso!', { duration: 5000 });
      
      if (onResendSuccess) {
        onResendSuccess();
      }

      // Clear cooldown after timeout
      setTimeout(() => {
        setCooldownActive(false);
      }, COOLDOWN_MINUTES * 60 * 1000);

    } catch (error: any) {
      console.error('Resend email error:', error);
      
      if (error.message?.includes('Email rate limit')) {
        toast.error('Muitas tentativas. Aguarde alguns minutos antes de tentar novamente');
      } else if (error.message?.includes('User not found')) {
        toast.error('Email não encontrado. Verifique se o endereço está correto');
      } else {
        toast.error('Erro ao reenviar email. Tente novamente mais tarde');
      }
    } finally {
      setIsResending(false);
    }
  };

  const getRemainingTime = () => {
    if (!lastResendTime) return 0;
    const timeSinceLastResend = Date.now() - lastResendTime.getTime();
    const cooldownMs = COOLDOWN_MINUTES * 60 * 1000;
    return Math.max(0, Math.ceil((cooldownMs - timeSinceLastResend) / 1000 / 60));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto w-16 h-16 bg-blue-100 border border-blue-200 rounded-full flex items-center justify-center mb-6"
          >
            <Mail className="w-8 h-8 text-blue-600" />
          </motion.div>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Verifique seu email
          </h2>

          <div className="space-y-4 text-left mb-6">
            <p className="text-slate-600">
              Enviamos um link de verificação para:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-slate-900 font-medium break-all">{email}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2 text-sm text-blue-800">
                  <p className="font-medium">O que fazer:</p>
                  <ul className="space-y-1 list-disc list-inside ml-2">
                    <li>Verifique sua caixa de entrada</li>
                    <li>Confira a pasta de spam/lixo eletrônico</li>
                    <li>Clique no link no email para ativar sua conta</li>
                  </ul>
                </div>
              </div>
            </div>

            {resendCount > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-emerald-800">
                  <CheckCircle className="w-4 h-4" />
                  <span>Email reenviado {resendCount}x</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={isResending || cooldownActive || resendCount >= MAX_RESENDS}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Reenviando...
                </>
              ) : cooldownActive ? (
                <>
                  <Clock className="w-4 h-4" />
                  Aguarde {getRemainingTime()}min
                </>
              ) : resendCount >= MAX_RESENDS ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Limite atingido
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Reenviar email {resendCount > 0 && `(${resendCount}/${MAX_RESENDS})`}
                </>
              )}
            </button>

            {resendCount >= MAX_RESENDS && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Limite de reenvios atingido</p>
                    <p className="mt-1">
                      Se você não receber o email em alguns minutos, entre em contato com nosso suporte.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {onClose && (
              <button
                onClick={onClose}
                className="w-full text-slate-600 hover:text-slate-800 font-medium py-2 text-sm transition-colors"
              >
                Fechar
              </button>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Problemas? Verifique se o endereço de email está correto e tente novamente.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmailVerificationPrompt;
