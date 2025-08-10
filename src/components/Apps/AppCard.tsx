import React from 'react';
import { ArrowRight, Clock, Trophy, Star } from 'lucide-react';
import type { AppInfo } from '../../data/apps';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/badge';

interface AppCardProps {
  app: AppInfo;
}

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Intermediário':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Avançado':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 border border-slate-200 dark:border-slate-700">
      <div className="relative">
        <img src={app.image} alt={app.name} className="w-full h-48 object-cover" />
        <div className="absolute top-4 left-4">
          <Badge className={getDifficultyColor(app.difficulty)}>
            {app.difficulty}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="bg-white/90 dark:bg-slate-800/90">
            {app.category}
          </Badge>
        </div>
      </div>

      <div className="p-6 flex flex-col h-64">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
            {app.name}
          </h3>
        </div>

        <div className="flex items-center gap-4 mb-3 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{app.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span>{app.features.length} recursos</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed flex-1 mb-4">
          {app.description}
        </p>

        {/* Features Preview */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {app.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded"
              >
                {feature}
              </span>
            ))}
            {app.features.length > 2 && (
              <span className="text-xs text-slate-500 dark:text-slate-400 px-2 py-1">
                +{app.features.length - 2} mais
              </span>
            )}
          </div>
        </div>

        <Link
          to={app.route}
          className="mt-auto inline-flex items-center justify-center bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-4 py-3 rounded-lg font-medium transition-all group-hover:shadow-lg text-sm"
        >
          <span>Iniciar Programa</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default AppCard;
