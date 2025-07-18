import React, { useState, useEffect } from "react";
import { Filter, Loader2 } from "lucide-react";
import VideoCard from "../components/Videos/VideoCard";
import { getVideos, getVideoCategories } from "../services/video";
import { mockVideos } from "../data/mockData";
import type { Video } from "../services/video";

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<string[]>(["Todos"]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedType, setSelectedType] = useState("Todos");

  useEffect(() => {
    loadVideosAndCategories();
  }, []);

  const loadVideosAndCategories = async () => {
    try {
      setLoading(true);

      // Carregar vídeos
      const videosData = await getVideos();
      if (videosData.length > 0) {
        setVideos(videosData);
      } else {
        // Fallback para dados mock se não há vídeos no Firebase
        setVideos(mockVideos);
      }

      // Carregar categorias
      const categoriesData = await getVideoCategories();
      const categoryNames = ["Todos", ...categoriesData.map((cat) => cat.name)];

      // Se não há categorias no Firebase, usar as do mockData
      if (categoriesData.length === 0) {
        const mockCategories = [
          "Todos",
          ...Array.from(new Set(mockVideos.map((v) => v.category))),
        ];
        setCategories(mockCategories);
      } else {
        setCategories(categoryNames);
      }
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
      // Fallback para dados mock em caso de erro
      setVideos(mockVideos);
      setCategories([
        "Todos",
        "Yoga",
        "Fitness",
        "Nutrição",
        "Meditação",
        "Pilates",
        "Bem-estar",
      ]);
    } finally {
      setLoading(false);
    }
  };

  const continueWatching = videos.slice(0, 3);
  const types = ["Todos", "Gratuito", "Premium"];

  const filteredVideos = videos.filter((video) => {
    const categoryMatch =
      selectedCategory === "Todos" || video.category === selectedCategory;
    const typeMatch =
      selectedType === "Todos" ||
      (selectedType === "Gratuito" && !video.premium) ||
      (selectedType === "Premium" && video.premium);

    return categoryMatch && typeMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Carregando vídeos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Explorar Vídeos
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Descubra nossa coleção de conteúdo de saúde e bem-estar
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
          <span>{filteredVideos.length} vídeos encontrados</span>
        </div>
      </div>

      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Continue Assistindo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {continueWatching.map((video) => (
              <div key={video.id} className="relative">
                <VideoCard video={video} />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700 dark:bg-slate-600">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.random() * 70 + 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="font-medium text-slate-900 dark:text-white">
            Filtros:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex flex-wrap gap-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {selectedCategory === "Todos"
              ? "Todos os Vídeos"
              : selectedCategory}
          </h2>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {filteredVideos.length} vídeo
            {filteredVideos.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 dark:text-slate-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Nenhum vídeo encontrado
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Tente ajustar os filtros ou navegue por outras categorias.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("Todos");
                setSelectedType("Todos");
              }}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </section>

      {/* Info sobre Storage */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
            🔧 Modo Desenvolvimento - Integração Firebase Storage
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Os vídeos são carregados automaticamente do Firebase Storage. Para
            adicionar novos vídeos, faça upload para a pasta{" "}
            <code>videos/content/</code> e adicione os metadados no Firestore na
            coleção <code>videos</code>.
          </p>
        </div>
      )}
    </div>
  );
};

export default Videos;
