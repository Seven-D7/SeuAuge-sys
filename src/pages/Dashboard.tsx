import React from 'react';
import { Play, ShoppingBag, TrendingUp, Clock } from 'lucide-react';
import VideoCard from '../components/Videos/VideoCard';
import ProductCard from '../components/Products/ProductCard';
import { mockVideos, mockProducts } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  const featuredVideos = mockVideos.slice(0, 4);
  const featuredProducts = mockProducts.slice(0, 4);
  const continueWatching = mockVideos.slice(2, 4);

  const stats = [
    { icon: Play, label: 'Vídeos Assistidos', value: '47', color: 'bg-teal-600' },
    { icon: ShoppingBag, label: 'Produtos Comprados', value: '12', color: 'bg-emerald-600' },
    { icon: TrendingUp, label: 'Pontuação Bem-estar', value: '85%', color: 'bg-cyan-600' },
    { icon: Clock, label: 'Horas Esta Semana', value: '8,5', color: 'bg-indigo-600' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="relative z-10 px-8 py-12 lg:px-12 lg:py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Jornada Completa de Bem-estar
            </h1>
            <p className="text-lg text-teal-100 mb-6">
              Transforme sua saúde com nosso programa abrangente de 12 semanas com treinos especializados, orientação nutricional e práticas de mindfulness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-teal-600 px-6 py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors flex items-center justify-center">
                <Play className="w-5 h-5 mr-2" />
                Assistir Agora
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-teal-600 transition-colors">
                Adicionar à Lista
              </button>
            </div>
          </div>
        </div>
        
        {/* Hero image */}
        <div 
          className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&w=800)'
          }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-800 rounded-lg p-6">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Featured Health Videos */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Vídeos de Saúde em Destaque</h2>
          <button className="text-teal-400 hover:text-teal-300 font-medium">Ver Todos</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      {/* Health Products Store */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Loja de Produtos de Saúde</h2>
          <button className="text-teal-400 hover:text-teal-300 font-medium">Ver Todos</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Continue Watching */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Continuar Assistindo</h2>
          <button className="text-teal-400 hover:text-teal-300 font-medium">Ver Todos</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {continueWatching.map((video) => (
            <div key={video.id} className="relative">
              <VideoCard video={video} />
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
                <div 
                  className="h-full bg-teal-500" 
                  style={{ width: `${Math.random() * 70 + 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;