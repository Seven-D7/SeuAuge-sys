import React from "react";
import { Star, Target, Zap, Gift, Clock } from "lucide-react";
import { useLevelStore, XPGainLog } from "../../stores/levelStore";

interface XPHistoryProps {
  limit?: number;
  className?: string;
}

const XPHistory: React.FC<XPHistoryProps> = ({
  limit = 10,
  className = "",
}) => {
  const { xpHistory } = useLevelStore();

  const displayHistory = limit ? xpHistory.slice(0, limit) : xpHistory;

  const getXPIcon = (type: XPGainLog["type"]) => {
    switch (type) {
      case "goal":
        return Target;
      case "challenge":
        return Star;
      case "boost":
        return Zap;
      default:
        return Gift;
    }
  };

  const getXPColor = (type: XPGainLog["type"]) => {
    switch (type) {
      case "goal":
        return "text-green-500";
      case "challenge":
        return "text-blue-500";
      case "boost":
        return "text-yellow-500";
      default:
        return "text-purple-500";
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return "Agora";
  };

  if (displayHistory.length === 0) {
    return (
      <div
        className={`bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 ${className}`}
      >
        <div className="text-center">
          <Clock className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Nenhuma atividade ainda
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Complete metas e desafios para ganhar XP!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 ${className}`}
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <Star className="w-5 h-5 mr-2 text-yellow-500" />
        Histórico de XP
      </h3>

      <div className="space-y-3">
        {displayHistory.map((log) => {
          const Icon = getXPIcon(log.type);
          const colorClass = getXPColor(log.type);

          return (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg bg-slate-200 dark:bg-slate-600 ${colorClass}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {log.reason}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {getTimeAgo(log.timestamp)}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`font-bold text-lg ${colorClass}`}>
                  +{log.amount}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                  XP
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {xpHistory.length > limit && (
        <div className="mt-4 text-center">
          <button className="text-primary hover:text-primary-dark font-medium text-sm transition-colors">
            Ver todos ({xpHistory.length} atividades)
          </button>
        </div>
      )}
    </div>
  );
};

export default XPHistory;
