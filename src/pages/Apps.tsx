import React from 'react';
import AppCard from '../components/Apps/AppCard';
import { apps } from '../data/apps';

const Apps: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Aplicativos</h1>
        <p className="text-slate-400">Ferramentas para aprimorar seu bem-estar</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
};

export default Apps;
