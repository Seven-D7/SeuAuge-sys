import React, { useState, useEffect } from "react";
import { Filter, Search, Play, Loader2 } from "lucide-react";
import VideoCard from "../components/Videos/VideoCard";
import VideoPlayer from "../components/Videos/VideoPlayer";
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
  const [selectedVideo, setSelectedVideo] = useState<VideoStreamData | null>(
    null,
  );
  const [playerLoading, setPlayerLoading] = useState(false);

  useEffect(() => {
    loadVideos();
  }, [selectedCategory]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      let videosData: VideoMetadata[];

      if (selectedCategory === "Todos") {
        // Carregar vídeos de todas as categorias
        const allVideos = await Promise.all(
          categories
            .slice(1)
            .map((category) => getVideosByCategory(category, 1, 5)),
        );
        videosData = allVideos.flat();
      } else {
        videosData = await getVideosByCategory(selectedCategory);
      }

      setVideos(videosData);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadVideos();
      return;
    }

    try {
      setSearchLoading(true);
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

  if (selectedVideo) {
    return (
      <div className="min-h-screen bg-slate-900">
        {/* Video Player */}
        <div className="relative">
          <VideoPlayer
            streamData={selectedVideo}
            autoPlay={true}
            className="w-full h-[60vh]"
            onComplete={() => console.log("Vídeo concluído")}
            onProgress={(progress) => console.log("Progresso:", progress)}
          />

          {/* Back Button */}
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 left-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            ← Voltar aos vídeos
          </button>
        </div>

        {/* Video Info */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-white mb-4">
                {selectedVideo.metadata.title}
              </h1>
              <div className="flex items-center space-x-4 text-slate-400 mb-6">
                <span>{selectedVideo.metadata.instructor}</span>
                <span>•</span>
                <span>{selectedVideo.metadata.category}</span>
                <span>•</span>
                <span>
                  {Math.floor(selectedVideo.metadata.duration / 60)} min
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedVideo.metadata.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {selectedVideo.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Próximos vídeos
                </h3>
                <div className="space-y-4">
                  {videos
                    .filter((v) => v.id !== selectedVideo.videoId)
                    .slice(0, 5)
                    .map((video) => (
                      <div
                        key={video.id}
                        onClick={() => handleVideoSelect(video.id)}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-slate-700 p-2 rounded-lg transition-colors"
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-16 h-9 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-medium truncate">
                            {video.title}
                          </h4>
                          <p className="text-slate-400 text-xs">
                            {video.instructor}
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Biblioteca de Vídeos
          </h1>
          <p className="text-slate-400">
            {isDemoMode && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-900/20 text-blue-300 rounded-full text-sm mr-3">
                🔧 Modo Demo - Vídeos simulados
              </span>
            )}
            Acesso completo aos treinos e aulas especializadas
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar vídeos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {searchLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Buscar"
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-2">
        <Filter className="text-slate-400 w-5 h-5 flex-shrink-0" />
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === category
                ? "bg-primary text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <Play className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhum vídeo encontrado
              </h3>
              <p className="text-slate-400">
                {searchQuery
                  ? "Tente ajustar sua busca ou filtros"
                  : "Vídeos serão adicionados em breve"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        </>
      )}

      {/* Player Loading Modal */}
      {playerLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-white">Carregando vídeo...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
