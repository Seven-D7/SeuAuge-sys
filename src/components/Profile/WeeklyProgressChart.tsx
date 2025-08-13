import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Timer, 
  MapPin, 
  Zap,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { format, startOfWeek, addDays, subWeeks, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DayData {
  date: Date;
  minutes: number;
  distance: number;
  avgPace: number; // em minutos por km
  workouts: number;
}

interface WeeklyProgressChartProps {
  className?: string;
}

const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ className = '' }) => {
  // Dados simulados - em um app real, viriam do store/API
  const weekData: DayData[] = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Segunda-feira
    
    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);
      const dayIndex = date.getDay();
      
      // Simular dados baseados no dia da semana
      const isWeekend = dayIndex === 0 || dayIndex === 6;
      const baseMinutes = isWeekend ? 45 : 30;
      const randomFactor = 0.7 + Math.random() * 0.6;
      
      return {
        date,
        minutes: Math.floor(baseMinutes * randomFactor),
        distance: Math.round((3 + Math.random() * 4) * 10) / 10,
        avgPace: Math.round((5 + Math.random() * 2) * 10) / 10,
        workouts: Math.floor(1 + Math.random() * 2)
      };
    });
  }, []);

  // Dados da semana anterior para comparação
  const previousWeekData: DayData[] = useMemo(() => {
    const today = new Date();
    const prevWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
    
    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(prevWeekStart, index);
      const dayIndex = date.getDay();
      const isWeekend = dayIndex === 0 || dayIndex === 6;
      const baseMinutes = isWeekend ? 40 : 25;
      const randomFactor = 0.8 + Math.random() * 0.4;
      
      return {
        date,
        minutes: Math.floor(baseMinutes * randomFactor),
        distance: Math.round((2.5 + Math.random() * 3.5) * 10) / 10,
        avgPace: Math.round((5.5 + Math.random() * 1.5) * 10) / 10,
        workouts: Math.floor(0 + Math.random() * 2)
      };
    });
  }, []);

  // Calcular totais e comparações
  const currentWeekTotals = useMemo(() => {
    return weekData.reduce(
      (acc, day) => ({
        minutes: acc.minutes + day.minutes,
        distance: acc.distance + day.distance,
        workouts: acc.workouts + day.workouts,
        avgPace: acc.avgPace + day.avgPace
      }),
      { minutes: 0, distance: 0, workouts: 0, avgPace: 0 }
    );
  }, [weekData]);

  const previousWeekTotals = useMemo(() => {
    return previousWeekData.reduce(
      (acc, day) => ({
        minutes: acc.minutes + day.minutes,
        distance: acc.distance + day.distance,
        workouts: acc.workouts + day.workouts,
        avgPace: acc.avgPace + day.avgPace
      }),
      { minutes: 0, distance: 0, workouts: 0, avgPace: 0 }
    );
  }, [previousWeekData]);

  const maxMinutes = Math.max(...weekData.map(d => d.minutes), 1);

  const getTrendIcon = (current: number, previous: number) => {
    const diff = current - previous;
    if (Math.abs(diff) < 0.1) return <Minus className="w-4 h-4 text-slate-400" />;
    return diff > 0 
      ? <ArrowUp className="w-4 h-4 text-green-500" />
      : <ArrowDown className="w-4 h-4 text-red-500" />;
  };

  const getTrendColor = (current: number, previous: number) => {
    const diff = current - previous;
    if (Math.abs(diff) < 0.1) return 'text-slate-600 dark:text-slate-400';
    return diff > 0 
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';
  };

  const formatPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Progresso Semanal
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {format(weekData[0].date, "d 'de' MMMM", { locale: ptBR })} - {format(weekData[6].date, "d 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>Esta semana</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Tempo Total',
            current: currentWeekTotals.minutes,
            previous: previousWeekTotals.minutes,
            unit: 'min',
            icon: Timer,
            gradient: 'from-blue-500 to-blue-600'
          },
          {
            label: 'Distância',
            current: currentWeekTotals.distance,
            previous: previousWeekTotals.distance,
            unit: 'km',
            icon: MapPin,
            gradient: 'from-green-500 to-green-600'
          },
          {
            label: 'Pace Médio',
            current: currentWeekTotals.avgPace / 7,
            previous: previousWeekTotals.avgPace / 7,
            unit: 'min/km',
            icon: Zap,
            gradient: 'from-yellow-500 to-orange-500',
            inverted: true // Para pace, menor é melhor
          },
          {
            label: 'Treinos',
            current: currentWeekTotals.workouts,
            previous: previousWeekTotals.workouts,
            unit: '',
            icon: TrendingUp,
            gradient: 'from-purple-500 to-purple-600'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          const isImprovement = stat.inverted 
            ? stat.current < stat.previous 
            : stat.current > stat.previous;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4 border border-slate-200 dark:border-slate-600/50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                {getTrendIcon(stat.current, stat.previous)}
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {stat.current.toFixed(stat.unit === 'min/km' ? 1 : 0)}{stat.unit}
              </div>
              <div className={`text-xs ${getTrendColor(stat.current, stat.previous)}`}>
                {formatPercentageChange(stat.current, stat.previous)} vs semana anterior
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Daily Chart */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
          <Timer className="w-4 h-4 mr-2" />
          Minutos por Dia
        </h4>
        
        <div className="grid grid-cols-7 gap-2">
          {weekData.map((day, index) => {
            const heightPercentage = (day.minutes / maxMinutes) * 100;
            const dayName = format(day.date, 'EEE', { locale: ptBR });
            const isCurrentDay = isToday(day.date);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="relative w-full h-24 bg-slate-100 dark:bg-slate-700/50 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercentage}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.6 }}
                    className={`absolute bottom-0 w-full rounded-lg transition-all duration-300 ${
                      isCurrentDay
                        ? 'bg-gradient-to-t from-primary to-emerald-500'
                        : day.minutes > 0
                        ? 'bg-gradient-to-t from-slate-400 to-slate-500'
                        : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                  {day.minutes > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {day.minutes}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <div className={`text-xs font-medium ${
                    isCurrentDay 
                      ? 'text-primary' 
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {dayName.charAt(0).toUpperCase() + dayName.slice(1)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">
                    {format(day.date, 'd')}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Weekly Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-lg border border-primary/20">
        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-primary" />
          Insights da Semana
        </h4>
        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <div>
            • Melhor dia: {format(weekData.reduce((max, day) => day.minutes > max.minutes ? day : max).date, 'EEEE', { locale: ptBR })} ({weekData.reduce((max, day) => day.minutes > max.minutes ? day : max).minutes} min)
          </div>
          <div>
            • Média diária: {Math.round(currentWeekTotals.minutes / 7)} minutos
          </div>
          <div>
            • Meta semanal: {currentWeekTotals.minutes >= 180 ? '✅ Atingida' : `❌ ${180 - currentWeekTotals.minutes} min restantes`}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklyProgressChart;
