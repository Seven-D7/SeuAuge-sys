import React from "react";
import { Star, Zap, Crown, Trophy } from "lucide-react";
import { useLevelStore } from "../../stores/levelStore";

interface LevelProgressBarProps {
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  className?: string;
}

const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  size = "md",
  showDetails = true,
  className = "",
}) => {
  const { levelSystem, getLevelInfo, getProgressPercentage } = useLevelStore();
  const { currentLevel, currentXP, xpToNextLevel, maxLevel } = levelSystem;

  const progressPercentage = getProgressPercentage();
  const levelInfo = getLevelInfo(currentLevel);
  const isMaxLevel = currentLevel >= maxLevel;

  const getLevelIcon = (level: number) => {
    if (level >= 40) return Crown;
    if (level >= 25) return Trophy;
    if (level >= 10) return Zap;
    return Star;
  };

  const LevelIcon = getLevelIcon(currentLevel);

  const sizeClasses = {
    sm: {
      container: "p-3",
      bar: "h-2",
      text: "text-xs",
      icon: "w-4 h-4",
      level: "text-sm",
    },
    md: {
      container: "p-4",
      bar: "h-3",
      text: "text-sm",
      icon: "w-5 h-5",
      level: "text-base",
    },
    lg: {
      container: "p-6",
      bar: "h-4",
      text: "text-base",
      icon: "w-6 h-6",
      level: "text-lg",
    },
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 ${classes.container} ${className}`}
    >
      {/* Header com nível e título */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${levelInfo.color}`}>
            <LevelIcon className={`${classes.icon} text-white`} />
          </div>
          <div>
            <div
              className={`font-bold text-slate-900 dark:text-white ${classes.level}`}
            >
              Nível {currentLevel}
              {isMaxLevel && <span className="ml-1 text-yellow-500">👑</span>}
            </div>
            <div
              className={`text-slate-600 dark:text-slate-400 ${classes.text}`}
            >
              {levelInfo.title}
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="text-right">
            <div
              className={`font-semibold text-slate-900 dark:text-white ${classes.text}`}
            >
              {isMaxLevel ? "Nível Máximo!" : `${xpToNextLevel} XP`}
            </div>
            <div
              className={`text-slate-500 dark:text-slate-400 ${classes.text}`}
            >
              {isMaxLevel ? "Parabéns!" : "para próximo nível"}
            </div>
          </div>
        )}
      </div>

      {/* Barra de progresso */}
      <div className="space-y-2">
        <div
          className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${classes.bar}`}
        >
          <div
            className={`${classes.bar} bg-gradient-to-r ${levelInfo.color} transition-all duration-700 ease-out relative overflow-hidden`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          >
            {/* Efeito de brilho animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>

        {showDetails && (
          <div className="flex justify-between items-center">
            <span
              className={`text-slate-600 dark:text-slate-400 ${classes.text}`}
            >
              {currentXP} XP
            </span>
            <span
              className={`font-medium text-slate-900 dark:text-white ${classes.text}`}
            >
              {progressPercentage}%
            </span>
            <span
              className={`text-slate-600 dark:text-slate-400 ${classes.text}`}
            >
              {isMaxLevel ? "MAX" : `${currentXP + xpToNextLevel} XP`}
            </span>
          </div>
        )}
      </div>

      {/* Milestone indicators */}
      {size === "lg" && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {[5, 10, 20, 30, 40].map((milestone) => (
            <div
              key={milestone}
              className={`text-center p-2 rounded-lg border-2 transition-all duration-200 ${
                currentLevel >= milestone
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                  : "border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500"
              }`}
            >
              <div className={`font-bold ${classes.text}`}>Nv.{milestone}</div>
              {currentLevel >= milestone && (
                <div className="text-emerald-500 text-xs">✓</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LevelProgressBar;
