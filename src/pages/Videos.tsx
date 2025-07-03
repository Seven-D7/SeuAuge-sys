import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import VideoCard from '../components/Videos/VideoCard';
import { mockVideos } from '../data/mockData';

const Videos: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');

  const continueWatching = mockVideos.slice(0, 3);

  const categories = ['Todos', 'Yoga', 'Fitness', 'Nutrição', 'Meditação', 'Pilates', 'Bem-estar'];
  const types = ['Todos', 'Gratuito', 'Premium'];

  const filteredVideos = mockVideos.filter(video => {
    const categoryMatch = selectedCategory === 'Todos' || video.category === selectedCategory;
    const typeMatch = selectedType === 'Todos' || 
      (selectedType === 'Gratuito' && video.isFree) || 
      (selectedType === 'Premium' && !video.isFree);
    
    return categoryMatch && typeMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Explorar Vídeos</h1>
          <p className="text-slate-400">Descubra nossa coleção de conteúdo de saúde e bem-estar</p>
        </div>
        <div className="text-sm text-slate-400">
          {filteredVideos.length} vídeos encontrados
        </div>
      </div>

      {continueWatching.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Continuar Assistindo</h2>
            <button className="text-teal-400 hover:text-teal-300 font-medium">Ver Todos</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {continueWatching.map((video) => (
              <div key={video.id} className="relative">
                <VideoCard video={video} />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
                  <div className="h-full bg-teal-500" style={{ width: `${Math.random() * 70 + 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-slate-400 mr-2" />
          <span className="font-medium text-white">Filtros</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Type filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Acesso</label>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedType === type
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* Empty state */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">Nenhum vídeo encontrado com os filtros selecionados</div>
          <button
            onClick={() => {
              setSelectedCategory('Todos');
              setSelectedType('Todos');
            }}
            className="text-teal-400 hover:text-teal-300 font-medium"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default Videos;