import React, { useState, useEffect } from "react";
import { Filter, Search, Play, Loader2, Bookmark, TrendingUp } from "lucide-react";
import VideoCard from "../components/Videos/VideoCard";
import VideoPlayer from "../components/Videos/VideoPlayer";
import VideoCarousel from "../components/Videos/VideoCarousel";
import {
  getVideosByCategory,
  searchVideos,
  getVideoStreamData,
  VideoMetadata,
  VideoStreamData,
} from "../services/googleCloud";
import { useAuth } from "../contexts/AuthContext";
import { isDemoMode } from "../firebase";

const Videos: React.FC = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [categorizedVideos, setCategorizedVideos] = useState<Record<string, VideoMetadata[]>>({});
  const [categories] = useState([
    "Todos",
    "Treino",
    "Nutrição",
    "Mindfulness",
    "Yoga",
  ]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<VideoStreamData | null>(null);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [showCarousels, setShowCarousels] = useState(true);

  useEffect(() => {
    loadVideos();
    loadWatchlist();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      
      // Load videos by category for carousels
      const categoryPromises = categories.slice(1).map(async (category) => {
        const categoryVideos = await getVideosByCategory(category, 1, 12);
        return { category, videos: categoryVideos };
      });

      const categoryResults = await Promise.all(categoryPromises);
      const categorizedData: Record<string, VideoMetadata[]> = {};
      
      categoryResults.forEach(({ category, videos }) => {
        categorizedData[category] = videos;
      });

      setCategorizedVideos(categorizedData);
      
      // Set all videos for the main grid
      const allVideos = categoryResults.flatMap(({ videos }) => videos);
      setVideos(allVideos);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadWatchlist = () => {
    // Load watchlist from localStorage or API
    const saved = localStorage.getItem('video_watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setShowCarousels(true);
      loadVideos();
      return;
    }

    try {
      setSearchLoading(true);
      setShowCarousels(false);
      
      const results = await searchVideos(searchQuery, {
        category: selectedCategory !== "Todos" ? selectedCategory : undefined,
      });
      setVideos(results);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleVideoSelect = async (videoId: string) => {
    try {
      setPlayerLoading(true);
      const streamData = await getVideoStreamData(videoId);
      if (streamData) {
        setSelectedVideo(streamData);
      }
    } catch (error) {
      console.error("Erro ao carregar vídeo:", error);
    } finally {
      setPlayerLoading(false);
    }
  };

  const handleAddToWatchlist = (videoId: string) => {
    setWatchlist(prev => {
      const newWatchlist = prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId];
      
      localStorage.setItem('video_watchlist', JSON.stringify(newWatchlist));
      return newWatchlist;
    });
  };

  const hasAccess = (video: VideoMetadata) => {
    return video.isFree || user?.isPremium || isDemoMode;
  };

  const filteredVideos = videos.filter((video) => {
    const categoryMatch =
      selectedCategory === "Todos" || video.category === selectedCategory;
    const searchMatch =
      !searchQuery ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Convert videos to carousel format
  const convertToCarouselFormat = (videos: VideoMetadata[]) => {
    return videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      duration: `${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, '0')}`,
      category: video.category,
      instructor: video.instructor,
      isFree: video.isFree,
      tags: video.tags,
    }));
  };

  if (selectedVideo) {
    return (
      <div className="min-h-screen bg-slate-900">
        {/* Video Player */}
        <div className="relative">
          <VideoPlayer
            streamData={selectedVideo}
            autoPlay={true}
            className="w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] xl:h-[70vh]"
            onComplete={() => console.log("Vídeo concluído")}
            onProgress={(progress) => console.log("Progresso:", progress)}
          />

          {/* Back Button */}
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black/60 hover:bg-black/80 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 backdrop-blur-sm text-xs sm:text-sm md:text-base"
          >
            <span className="hidden sm:inline">← Voltar aos vídeos</span>
            <span className="sm:hidden">← Voltar</span>
          </button>
        </div>

        {/* Video Info */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
                {selectedVideo.metadata.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-slate-400 mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base">
                <span>{selectedVideo.metadata.instructor}</span>
                <span>•</span>
                <span>{selectedVideo.metadata.category}</span>
                <span>•</span>
                <span>
                  {Math.floor(selectedVideo.metadata.duration / 60)} min
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                {selectedVideo.metadata.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4 md:mt-6">
                {selectedVideo.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-800 text-slate-300 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Sidebar - Related Videos */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                  Vídeos relacionados
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {videos
                    .filter((v) => v.id !== selectedVideo.videoId && v.category === selectedVideo.metadata.category)
                    .slice(0, 5)
                    .map((video) => (
                      <div
                        key={video.id}
                        onClick={() => handleVideoSelect(video.id)}
                        className="flex items-start space-x-2 sm:space-x-3 cursor-pointer hover:bg-slate-700 p-2 rounded-lg transition-colors group"
                      >
                        <div className="relative flex-shrink-0">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-16 h-9 sm:w-20 sm:h-11 lg:w-24 lg:h-14 object-cover rounded"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded flex items-center justify-center">
                            <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-xs sm:text-sm font-medium line-clamp-2 mb-1">
                            {video.title}
                          </h4>
                          <p className="text-slate-400 text-xs">
                            {video.instructor}
                          </p>
                          <p className="text-slate-500 text-xs mt-1">
                            {Math.floor(video.duration / 60)} min
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8 pb-3 sm:pb-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
              Biblioteca de Vídeos
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-400">
              {isDemoMode && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-900/20 text-blue-300 rounded-full text-xs sm:text-sm mr-2 sm:mr-3 mb-1 sm:mb-0">
                  🔧 Modo Demo - Vídeos simulados
                </span>
              )}
              <span className="block sm:inline">Acesso completo aos treinos e aulas especializadas</span>
            </p>
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 md:gap-4">
            <div className="relative flex-1 sm:max-w-md md:max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar vídeos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 md:py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="bg-primary hover:bg-primary-dark text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base min-w-[80px] sm:min-w-[100px] flex items-center justify-center"
            >
              {searchLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">Buscar</span>
                  <span className="sm:hidden">🔍</span>
                </>
              )}
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="text-slate-400 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <div className="flex gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    if (category === "Todos") {
                      setShowCarousels(true);
                      setSearchQuery("");
                    }
                  }}
                  className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-primary text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-slate-400">Carregando vídeos...</p>
          </div>
        </div>
      ) : (
        <>
          {showCarousels && !searchQuery ? (
            <div className="pb-8">
              {/* My Watchlist */}
              {watchlist.length > 0 && (
                <VideoCarousel
                  title="Minha Lista"
                  videos={convertToCarouselFormat(
                    videos.filter(video => watchlist.includes(video.id))
                  )}
                  onVideoSelect={handleVideoSelect}
                  onAddToWatchlist={handleAddToWatchlist}
                  watchlist={watchlist}
                  autoPlay={false}
                />
              )}

              {/* Trending Now */}
              <VideoCarousel
                title="Em Alta"
                videos={convertToCarouselFormat(videos.slice(0, 12))}
                onVideoSelect={handleVideoSelect}
                onAddToWatchlist={handleAddToWatchlist}
                watchlist={watchlist}
                autoPlay={true}
              />

              {/* Category Carousels */}
              {Object.entries(categorizedVideos).map(([category, categoryVideos]) => (
                <VideoCarousel
                  key={category}
                  title={category}
                  videos={convertToCarouselFormat(categoryVideos)}
                  onVideoSelect={handleVideoSelect}
                  onAddToWatchlist={handleAddToWatchlist}
                  watchlist={watchlist}
                  autoPlay={false}
                />
              ))}
            </div>
          ) : (
            <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-6 sm:pb-8">
              {/* Results Header */}
              <div className="mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2">
                  {searchQuery
                    ? `Resultados para "${searchQuery}"`
                    : selectedCategory === "Todos"
                      ? "Todos os vídeos"
                      : `Categoria: ${selectedCategory}`
                  }
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm">
                  {filteredVideos.length} vídeo{filteredVideos.length !== 1 ? 's' : ''} encontrado{filteredVideos.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Video Grid */}
              {filteredVideos.length === 0 ? (
                <div className="text-center py-20">
                  <Play className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Nenhum vídeo encontrado
                  </h3>
                  <p className="text-slate-400 mb-6">
                    {searchQuery
                      ? "Tente ajustar sua busca ou filtros"
                      : "Vídeos serão adicionados em breve"}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("Todos");
                      setShowCarousels(true);
                    }}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Ver todos os vídeos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                  {filteredVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={{
                        id: video.id,
                        title: video.title,
                        duration: `${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, "0")}`,
                        category: video.category,
                        isFree: video.isFree,
                        videoUrl: video.videoUrl,
                        thumbnail: video.thumbnail,
                        description: video.description,
                        instructor: video.instructor,
                        tags: video.tags,
                      }}
                      onClick={() => handleVideoSelect(video.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Player Loading Modal */}
      {playerLoading && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 sm:p-8 text-center max-w-sm mx-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-white text-sm sm:text-base">Carregando vídeo...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
