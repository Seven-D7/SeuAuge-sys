import React, { useState } from 'react';
import AppCard from '../components/Apps/AppCard';
import { apps, appsByCategory } from '../data/apps';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Dumbbell, Heart, Zap, Users, Clock, Star, Filter } from 'lucide-react';

const Apps: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Todos');

  const categories = ['Todos', ...Object.keys(appsByCategory)];
  const difficulties = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];

  const filteredApps = apps.filter(app => {
    const categoryMatch = selectedCategory === 'Todos' || app.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'Todos' || app.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Perda de Peso': <Heart className="w-4 h-4" />,
      'Hipertrofia': <Dumbbell className="w-4 h-4" />,
      'Transformação': <Star className="w-4 h-4" />,
      'Esporte': <Zap className="w-4 h-4" />,
      'Corrida': <Activity className="w-4 h-4" />,
      'Mobilidade': <Heart className="w-4 h-4" />,
      'Longevidade': <Users className="w-4 h-4" />,
      'Saúde': <Heart className="w-4 h-4" />,
      'Funcional': <Dumbbell className="w-4 h-4" />,
    };
    return icons[category] || <Star className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Aplicativos Fitness
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Ferramentas inteligentes para aprimorar seu bem-estar com algoritmos científicos personalizados
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {apps.length}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Apps Funcionais
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {Object.keys(appsByCategory).length}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              Categorias
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {apps.filter(app => app.difficulty === 'Iniciante').length}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">
              Para Iniciantes
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
              100%
            </div>
            <div className="text-sm text-orange-600 dark:text-orange-400">
              Personalizados
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Filtros</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Categoria
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {category !== 'Todos' && getCategoryIcon(category)}
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Dificuldade
              </label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedDifficulty === difficulty
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          {filteredApps.length} {filteredApps.length === 1 ? 'aplicativo encontrado' : 'aplicativos encontrados'}
        </h2>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {selectedCategory !== 'Todos' && (
            <span>Categoria: {selectedCategory}</span>
          )}
          {selectedCategory !== 'Todos' && selectedDifficulty !== 'Todos' && ' • '}
          {selectedDifficulty !== 'Todos' && (
            <span>Dificuldade: {selectedDifficulty}</span>
          )}
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>

      {filteredApps.length === 0 && (
        <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Nenhum aplicativo encontrado
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Tente ajustar os filtros para encontrar aplicativos que atendam às suas necessidades.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Todos');
                setSelectedDifficulty('Todos');
              }}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Limpar Filtros
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Apps;
