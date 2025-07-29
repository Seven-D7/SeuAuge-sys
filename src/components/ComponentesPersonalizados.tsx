import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Heart, 
  Trophy, 
  Star,
  Flame,
  Award,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

// Componente de Gráfico Circular Personalizado
export const CircularProgress: React.FC<{
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}> = ({ value, size = 120, strokeWidth = 8, color = "#8b5cf6", label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{value}%</span>
        {label && <span className="text-xs text-gray-300 mt-1">{label}</span>}
      </div>
    </div>
  );
};

// Componente de Métrica Animada
export const AnimatedMetric: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
  delay?: number;
}> = ({ icon, title, value, subtitle, color, delay = 0 }) => {
  return (
    <Card 
      className={`backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl hover:scale-105 transition-all duration-500`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="p-3 rounded-xl backdrop-blur-sm"
            style={{ backgroundColor: `${color}30` }}
          >
            <div style={{ color: `${color}` }}>
              {icon}
            </div>
          </div>
          <span className="text-lg font-medium" style={{ color: `${color}` }}>
            {title}
          </span>
        </div>
        <p className="text-4xl font-bold text-white mb-2 animate-pulse">
          {value}
        </p>
        {subtitle && (
          <p className="text-sm" style={{ color: `${color}` }}>
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

// Componente de Badge Personalizada
export const CustomBadge: React.FC<{
  emoji: string;
  title: string;
  description?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}> = ({ emoji, title, description, rarity }) => {
  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-blue-500 to-cyan-600',
    legendary: 'from-yellow-500 to-orange-500'
  };

  const rarityGlow = {
    common: 'shadow-gray-500/20',
    rare: 'shadow-blue-500/30',
    epic: 'shadow-blue-500/30',
    legendary: 'shadow-yellow-500/40'
  };

  return (
    <div className={`group relative p-4 bg-gradient-to-br ${rarityColors[rarity]} rounded-2xl backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300 ${rarityGlow[rarity]} shadow-2xl`}>
      <div className="text-center">
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
          {emoji}
        </div>
        <div className="text-white font-bold text-sm mb-1">{title}</div>
        {description && (
          <div className="text-white/80 text-xs">{description}</div>
        )}
      </div>
      
      {/* Efeito de brilho */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
    </div>
  );
};

// Componente de Progresso com Níveis
export const LevelProgress: React.FC<{
  currentLevel: string;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
}> = ({ currentLevel, currentXP, nextLevelXP, totalXP }) => {
  const progressPercentage = (currentXP / nextLevelXP) * 100;

  return (
    <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
            <Trophy className="h-5 w-5" />
          </div>
          Sistema de Níveis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 text-lg">
            {currentLevel}
          </Badge>
          <div className="text-right">
            <div className="text-white font-bold">{totalXP} XP Total</div>
            <div className="text-gray-300 text-sm">{currentXP}/{nextLevelXP} para próximo nível</div>
          </div>
        </div>
        
        <div className="relative">
          <Progress value={progressPercentage} className="h-4 bg-white/20" />
          <div 
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {Array.from({length: 5}, (_, i) => (
            <div 
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i < Math.floor(progressPercentage / 20) 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                  : 'bg-white/20'
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            ></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Componente de Gráfico de Radar Personalizado
export const RadarChart: React.FC<{
  data: { label: string; value: number; max: number }[];
  size?: number;
}> = ({ data, size = 200 }) => {
  const center = size / 2;
  const radius = size / 2 - 20;
  const angleStep = (2 * Math.PI) / data.length;

  const points = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const value = (item.value / item.max) * radius;
    const x = center + Math.cos(angle) * value;
    const y = center + Math.sin(angle) * value;
    return { x, y, angle, value: item.value, label: item.label };
  });

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z';

  return (
    <div className="relative">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid circles */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, index) => (
          <circle
            key={index}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}
        
        {/* Grid lines */}
        {data.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Data area */}
        <path
          d={pathData}
          fill="rgba(139, 92, 246, 0.3)"
          stroke="#8b5cf6"
          strokeWidth="2"
          className="animate-pulse"
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#8b5cf6"
            className="animate-pulse"
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
        
        {/* Labels */}
        {data.map((item, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const labelRadius = radius + 15;
          const x = center + Math.cos(angle) * labelRadius;
          const y = center + Math.sin(angle) * labelRadius;
          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-white font-medium"
            >
              {item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// Componente de Timeline Personalizada
export const CustomTimeline: React.FC<{
  phases: { title: string; description: string; status: 'completed' | 'current' | 'upcoming' }[];
}> = ({ phases }) => {
  return (
    <div className="space-y-6">
      {phases.map((phase, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
              phase.status === 'completed' 
                ? 'bg-emerald-500 border-emerald-500' 
                : phase.status === 'current'
                ? 'bg-blue-500 border-blue-500 animate-pulse'
                : 'bg-transparent border-gray-400'
            }`}></div>
            {index < phases.length - 1 && (
              <div className={`w-0.5 h-12 mt-2 transition-all duration-500 ${
                phase.status === 'completed' ? 'bg-emerald-500' : 'bg-gray-400'
              }`}></div>
            )}
          </div>
          
          <div className={`flex-1 pb-6 transition-all duration-500 ${
            phase.status === 'current' ? 'transform scale-105' : ''
          }`}>
            <h3 className={`font-semibold mb-1 ${
              phase.status === 'completed' 
                ? 'text-emerald-300' 
                : phase.status === 'current'
                ? 'text-blue-300'
                : 'text-gray-400'
            }`}>
              {phase.title}
            </h3>
            <p className={`text-sm ${
              phase.status === 'completed' 
                ? 'text-emerald-200' 
                : phase.status === 'current'
                ? 'text-blue-200'
                : 'text-gray-500'
            }`}>
              {phase.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente de Estatísticas Comparativas
export const ComparisonStats: React.FC<{
  userStats: { label: string; value: number; unit: string }[];
  averageStats: { label: string; value: number; unit: string }[];
}> = ({ userStats, averageStats }) => {
  return (
    <div className="space-y-4">
      {userStats.map((stat, index) => {
        const avgStat = averageStats[index];
        const percentage = (stat.value / avgStat.value) * 100;
        const isAboveAverage = percentage > 100;
        
        return (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{stat.label}</span>
              <span className={`font-bold ${isAboveAverage ? 'text-emerald-400' : 'text-orange-400'}`}>
                {stat.value}{stat.unit} vs {avgStat.value}{avgStat.unit} (média)
              </span>
            </div>
            
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${
                  isAboveAverage 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
              
              {/* Linha da média */}
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/50 transform -translate-x-0.5"></div>
            </div>
            
            <div className="text-xs text-center">
              <span className={`font-medium ${isAboveAverage ? 'text-emerald-400' : 'text-orange-400'}`}>
                {percentage.toFixed(0)}% da média
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default {
  CircularProgress,
  AnimatedMetric,
  CustomBadge,
  LevelProgress,
  RadarChart,
  CustomTimeline,
  ComparisonStats
};
