import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  User,
  Loader2,
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

interface ReportExporterProps {
  userStats: any;
  achievements: any[];
  goals: any[];
  levelSystem: any;
  className?: string;
}

const ReportExporter: React.FC<ReportExporterProps> = ({
  userStats,
  achievements,
  goals,
  levelSystem,
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'weekly' | 'monthly'>('weekly');

  const generatePDFData = async () => {
    // Simular dados para o PDF
    const reportData = {
      user: {
        name: 'João Silva', // Em um app real, viria do contexto do usuário
        level: levelSystem.currentLevel,
        totalXP: levelSystem.totalXP,
        joinDate: new Date().toISOString()
      },
      period: {
        type: exportType,
        startDate: new Date(Date.now() - (exportType === 'weekly' ? 7 : 30) * 24 * 60 * 60 * 1000),
        endDate: new Date()
      },
      stats: {
        totalWorkouts: 12,
        totalMinutes: 360,
        totalDistance: 42.5,
        avgPace: 5.8,
        bestDay: 'Quarta-feira',
        completedGoals: goals.filter(g => g.completed).length,
        totalGoals: goals.length
      },
      achievements: achievements.filter(a => a.isUnlocked).slice(0, 5),
      goals: goals.slice(0, 6),
      insights: [
        'Você manteve uma consistência excelente esta semana',
        'Seu pace médio melhorou 12% comparado ao período anterior',
        'Parabéns por completar 3 metas importantes!',
        'Continue focado para alcançar o próximo nível'
      ]
    };

    return reportData;
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      // Simular processo de exportação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportData = await generatePDFData();
      
      // Em um app real, aqui seria a integra��ão com jsPDF ou html2canvas
      // Por agora, vamos simular o download
      const fileName = `healthflix-relatorio-${exportType}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      
      // Simular download
      const element = document.createElement('a');
      element.href = 'data:application/pdf;base64,JVBERi0xLjQKJWdra...'; // Base64 simulado
      element.download = fileName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast.success(`📊 Relatório ${exportType === 'weekly' ? 'semanal' : 'mensal'} exportado com sucesso!`, {
        duration: 4000,
        icon: '✅'
      });
      
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao exportar relatório. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const reportSections = [
    {
      icon: User,
      title: 'Perfil do Usuário',
      description: 'Informações básicas e nível atual'
    },
    {
      icon: TrendingUp,
      title: 'Estatísticas de Performance',
      description: 'Dados de treinos, tempo e distância'
    },
    {
      icon: Trophy,
      title: 'Conquistas e Metas',
      description: 'Progresso de objetivos e conquistas desbloqueadas'
    },
    {
      icon: Calendar,
      title: 'Histórico de Atividades',
      description: 'Sequências de login e atividades recentes'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Exportar Relatório
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Baixe seus dados de progresso em PDF
            </p>
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Período do Relatório
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { type: 'weekly', label: 'Semanal', description: 'Últimos 7 dias', icon: Calendar },
            { type: 'monthly', label: 'Mensal', description: 'Últimos 30 dias', icon: Calendar }
          ].map((option) => {
            const Icon = option.icon;
            return (
              <motion.button
                key={option.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setExportType(option.type as 'weekly' | 'monthly')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  exportType === option.type
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs opacity-75">{option.description}</div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Report Content Preview */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Conteúdo do Relatório
        </h4>
        <div className="space-y-3">
          {reportSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600/50"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-white text-sm">
                    {section.title}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {section.description}
                  </div>
                </div>
                <Check className="w-5 h-5 text-green-500" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Export Stats Preview */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50">
        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
          Preview dos Dados ({exportType === 'weekly' ? 'Última Semana' : 'Último Mês'})
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div className="text-center">
            <div className="font-bold text-blue-600 dark:text-blue-400">
              {exportType === 'weekly' ? '12' : '48'}
            </div>
            <div className="text-slate-600 dark:text-slate-400">Treinos</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-600 dark:text-green-400">
              {exportType === 'weekly' ? '360' : '1,440'}
            </div>
            <div className="text-slate-600 dark:text-slate-400">Minutos</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-purple-600 dark:text-purple-400">
              {achievements.filter(a => a.isUnlocked).length}
            </div>
            <div className="text-slate-600 dark:text-slate-400">Conquistas</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-orange-600 dark:text-orange-400">
              {goals.filter(g => g.completed).length}/{goals.length}
            </div>
            <div className="text-slate-600 dark:text-slate-400">Metas</div>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExportPDF}
        disabled={isExporting}
        className={`w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
          isExporting ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Gerando Relatório...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>
              Baixar Relatório {exportType === 'weekly' ? 'Semanal' : 'Mensal'} (PDF)
            </span>
          </>
        )}
      </motion.button>

      {/* Footer Info */}
      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
        O relatório inclui gráficos, estatísticas detalhadas e insights personalizados
      </div>
    </motion.div>
  );
};

export default ReportExporter;
