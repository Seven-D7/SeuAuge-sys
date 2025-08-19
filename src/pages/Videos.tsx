import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, 
  Search, 
  Play, 
  Loader2, 
  Bookmark, 
  TrendingUp, 
  Info,
  Plus,
  Check,
  Star,
  Clock,
  Users,
  Volume2,
  VolumeX,
  Maximize,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
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
import { useAuth } from "../contexts/SupabaseAuthContext";
import { useAchievementsStore } from "../stores/achievementsStore";

const DEMO_FEATURED_VIDEO = {
  id: "featured-demo",
  title: "Treino HIIT Completo para Iniciantes",
  description: "Um treino intervalado de alta intensidade perfeito para quem está começando na jornada fitness.",
  url: "/videos/hiit-iniciantes.mp4",
  thumbnailUrl: "/api/placeholder/800/450",
  category: "Cardio",
  instructor: "Ana Silva",
  duration: 1800,
  difficulty: "Iniciante" as const,
  isFree: false,
  views: 15420,
  likes: 892,
  tags: ["HIIT", "Cardio", "Queima de gordura", "Casa"]
};

const DEMO_VIDEOS = [
  {
    id: "demo-1",
    title: "Yoga Matinal Energizante",
    description: "Comece seu dia com energia através desta sequência de yoga revigorante.",
    thumbnailUrl: "/api/placeholder/400/225",
    category: "Yoga",
    instructor: "Marina Costa",
    duration: 1200,
    difficulty: "Iniciante",
    isFree: true,
    views: 8340,
    likes: 456,
    tags: ["Yoga", "Manhã", "Flexibilidade"]
  },
  {
    id: "demo-2", 
    title: "Treino de Força - Membros Superiores",
    description: "Fortaleça braços, ombros e costas com este treino focado.",
    thumbnailUrl: "/api/placeholder/400/225",
    category: "Força",
    instructor: "Roberto Santos",
    duration: 2400,
    difficulty: "Intermediário",
    isFree: false,
    views: 12150,
    likes: 743,
    tags: ["Força", "Braços", "Ombros", "Academia"]
  }
];

const Videos: React.FC = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoMetadata | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [streamData, setStreamData] = useState<VideoStreamData | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [featuredVideo] = useState(DEMO_FEATURED_VIDEO);

  const categories = ["Todos", "Cardio", "Força", "Yoga", "Flexibilidade", "HIIT"];

  useEffect(() => {
    loadVideos();
  }, [selectedCategory]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      let videoList: VideoMetadata[];
      
      if (selectedCategory === "Todos") {
        // Load all videos from service or return demo data
        videoList = DEMO_VIDEOS as VideoMetadata[];
      } else {
        videoList = await getVideosByCategory(selectedCategory);
        if (videoList.length === 0) {
          // Fallback to demo data for empty categories
          videoList = DEMO_VIDEOS.filter(v => v.category === selectedCategory) as VideoMetadata[];
        }
      }
      
      setVideos(videoList);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
      // Fallback to demo data on error
      setVideos(DEMO_VIDEOS as VideoMetadata[]);
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
      const results = await searchVideos(searchQuery);
      
      if (results.length === 0) {
        // Demo search fallback
        const demoResults = DEMO_VIDEOS.filter(video =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setVideos(demoResults as VideoMetadata[]);
      } else {
        setVideos(results);
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      setVideos([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleVideoSelect = async (video: VideoMetadata) => {
    try {
      setPlayerLoading(true);
      
      try {
        const streamData = await getVideoStreamData(video.id);
        setStreamData(streamData);
      } catch (error) {
        console.warn("Stream data not available, using demo data:", error);
        setStreamData({
          streamUrl: "/videos/demo-stream.mp4",
          quality: "720p",
          duration: video.duration || 1800
        });
      }
      
      setSelectedVideo(video);
      setIsPlayerOpen(true);
    } catch (error) {
      console.error("Erro ao abrir vídeo:", error);
    } finally {
      setPlayerLoading(false);
    }
  };

  const closePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
    setStreamData(null);
  };

  const toggleFavorite = (videoId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(videoId)) {
        newFavorites.delete(videoId);
      } else {
        newFavorites.add(videoId);
      }
      return newFavorites;
    });
  };

  const hasAccess = (video: any) => {
    return video.isFree || user?.isPremium;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Biblioteca de Vídeos
          </motion.h1>
          <motion.p 
            className="text-lg text-slate-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Descubra treinos personalizados e conteúdo exclusivo para sua jornada fitness
          </motion.p>
        </div>

        {/* Featured Video */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white/90 text-sm font-medium">Destaque da Semana</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {featuredVideo.title}
                  </h2>
                  <p className="text-white/80 text-lg mb-6">
                    {featuredVideo.description}
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-white/70">
                      <Clock className="w-4 h-4" />
                      <span>{Math.floor(featuredVideo.duration / 60)} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Users className="w-4 h-4" />
                      <span>{featuredVideo.views.toLocaleString()} views</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleVideoSelect(featuredVideo as VideoMetadata)}
                    disabled={!hasAccess(featuredVideo) || playerLoading}
                    className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {playerLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                    {hasAccess(featuredVideo) ? "Assistir Agora" : "Premium Necessário"}
                  </button>
                </div>
                <div className="relative">
                  <img 
                    src={featuredVideo.thumbnailUrl} 
                    alt={featuredVideo.title}
                    className="w-full rounded-xl shadow-2xl"
                  />
                  <button
                    onClick={() => handleVideoSelect(featuredVideo as VideoMetadata)}
                    disabled={!hasAccess(featuredVideo)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors rounded-xl disabled:cursor-not-allowed"
                  >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 text-gray-900 ml-1" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar vídeos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={searchLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {searchLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Buscar
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Videos Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              className="flex justify-center items-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {videos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onSelect={() => handleVideoSelect(video)}
                  isFavorite={favorites.has(video.id)}
                  onToggleFavorite={() => toggleFavorite(video.id)}
                  hasAccess={hasAccess(video)}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        {!loading && videos.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Nenhum vídeo encontrado</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Tente ajustar sua busca ou selecionar uma categoria diferente.
            </p>
          </motion.div>
        )}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {isPlayerOpen && selectedVideo && streamData && (
          <VideoPlayer
            video={selectedVideo}
            streamData={streamData}
            onClose={closePlayer}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Videos;
