import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { AppInfo } from '../../data/apps';
import { Link } from 'react-router-dom';

interface AppCardProps {
  app: AppInfo;
}

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  return (
    <div className="group bg-slate-800 rounded-lg overflow-hidden hover:transform hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
      <img src={app.image} alt={app.name} className="w-full h-36 sm:h-40 md:h-48 object-cover" />
      <div className="p-3 sm:p-4 flex flex-col space-y-2 sm:space-y-3 h-auto">
        <h3 className="font-semibold text-white line-clamp-2 text-sm sm:text-base leading-tight">{app.name}</h3>
        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed flex-1">{app.description}</p>
        <Link
          to={app.route}
          className="mt-auto inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-colors text-sm"
        >
          <span className="hidden sm:inline">Acessar</span>
          <span className="sm:hidden">Abrir</span>
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default AppCard;
