import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { AppInfo } from '../../data/apps';
import { Link } from 'react-router-dom';

interface AppCardProps {
  app: AppInfo;
}

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  return (
    <div className="group bg-slate-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
      <img src={app.image} alt={app.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col space-y-3">
        <h3 className="font-semibold text-white line-clamp-2">{app.name}</h3>
        <p className="text-sm text-slate-400 line-clamp-2">{app.description}</p>
        <Link
          to={app.route}
          className="mt-auto inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Acessar
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default AppCard;
