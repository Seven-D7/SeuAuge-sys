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
import { isSupabaseDemoMode } from "../lib/supabase";

// Enhanced mock data for demo
const DEMO_FEATURED_VIDEO = {
  id: "featured-demo",
  title: "HIIT Avançado: Transforme Seu Corpo em 20 Minutos",
  description: "Um treino intenso de alta intensidade que vai acelerar seu metabolismo e queimar gordura por até 24 horas após o exercício. Perfeito para quem tem pouco tempo mas quer resultados máximos.",
  thumbnail: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1920",
  backgroundImage: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1920",
  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  instructor: "Carlos Mendes",
  category: "Treino",
  duration: 1200,
  rating: 4.9,
  watchCount: 15420,
  isFree: false,
  tags: ["HIIT", "Cardio", "Força", "Avançado"],
  uploadDate: new Date().toISOString(),
  resolution: "1080p",
  size: 512000000,
  createdAt: new Date(),
  updatedAt: new Date()
};

const Videos: React.FC = () => {
  const { user } = useAuth();
  const { updateProgress } = useAchievementsStore();
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [categorizedVideos, setCategorizedVideos] = useState<Record<string, VideoMetadata[]>>({});
  const [featuredVideo, setFeaturedVideo] = useState(DEMO_FEATURED_VIDEO);
  const [categories] = useState([
    "Todos",
    "Treino",
    "Nutrição",
    "Mindfulness",
    "Yoga",
    "Cardio",
    "Força",
    "Flexibilidade"
  ]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<VideoStreamData | null>(null);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [showCarousels, setShowCarousels] = useState(true);
  const [heroMuted, setHeroMuted] = useState(true);
  const [showHeroDetails, setShowHeroDetails] = useState(false);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);

  useEffect(() => {
    loadVideos();
    loadWatchlist();
    loadContinueWatching();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      
      if (isSupabaseDemoMode) {
        // Enhanced demo data
        const demoVideos: VideoMetadata[] = [
          {
            id: "demo-1",
            title: "Yoga Matinal - Despertar do Corpo",
            description: "Sequência suave de yoga para começar o dia com energia e flexibilidade",
            thumbnail: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            instructor: "Ana Silva",
            category: "Yoga",
            duration: 900,
            isFree: true,
            tags: ["Manhã", "Flexibilidade", "Iniciante"],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "demo-2", 
            title: "Treino Funcional Completo",
            description: "Exercícios funcionais para fortalecer todo o corpo usando apenas o peso corporal",
            thumbnail: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            instructor: "Pedro Santos",
            category: "Treino",
            duration: 1800,
            isFree: false,
            tags: ["Funcional", "Força", "Intermediário"],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "demo-3",
            title: "Nutrição: Smoothies Pós-Treino",
            description: "Aprenda a preparar smoothies nutritivos para potencializar sua recuperação",
            thumbnail: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=600",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            instructor: "Dra. Maria Costa",
            category: "Nutrição",
            duration: 600,
            isFree: true,
            tags: ["Receitas", "Recuperação", "Proteína"],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "demo-4",
            title: "Meditação para Atletas",
            description: "Técnicas de mindfulness específicas para melhorar o foco e performance",
            thumbnail: "https://images.pexels.com/photos/3820424/pexels-photo-3820424.jpeg?auto=compress&cs=tinysrgb&w=600",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            instructor: "Lucas Zen",
            category: "Mindfulness",
            duration: 1200,
            isFree: false,
            tags: ["Meditação", "Foco", "Performance"],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "demo-5",
            title: "Cardio Dance Energizante",
            description: "Dança aeróbica divertida que combina cardio com ritmos latinos",
            thumbnail: "https://images.pexels.com/photos/3775540/pexels-photo-3775540.jpeg?auto=compress&cs=tinysrgb&w=600",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            instructor: "Sofia Rodriguez",
            category: "Cardio",
            duration: 2400,
            isFree: true,
            tags: ["Dança", "Cardio", "Diversão"],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "demo-6",
            title: "Alongamento Profundo",
            description: "Sessão completa de alongamento para relaxar e aumentar a flexibilidade",
            thumbnail: "https://images.pexels.com/photos/3822647/pexels-photo-3822647.jpeg?auto=compress&cs=tinysrgb&w=600",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            instructor: "Camila Flex",
            category: "Flexibilidade",
            duration: 1500,
            isFree: true,
            tags: ["Alongamento", "Relaxamento", "Flexibilidade"],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];

        // Organize by categories
        const categorizedData: Record<string, VideoMetadata[]> = {};
        categories.slice(1).forEach(category => {
          categorizedData[category] = demoVideos.filter(v => v.category === category);
        });

        setCategorizedVideos(categorizedData);
        setVideos(demoVideos);
      } else {
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
      }
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadWatchlist = () => {
    const saved = localStorage.getItem('video_watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  };

  const loadContinueWatching = () => {
    const saved = localStorage.getItem('continue_watching');
    if (saved) {
      setContinueWatching(JSON.parse(saved));
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
      
      if (isSupabaseDemoMode) {
        // Demo search
        const filtered = videos.filter(video =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setVideos(filtered);
      } else {
        const results = await searchVideos(searchQuery, {
          category: selectedCategory !== "Todos" ? selectedCategory : undefined,
        });
        setVideos(results);
      }
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleVideoSelect = async (videoId: string) => {
    try {
      setPlayerLoading(true);
      if (isSupabaseDemoMode) {
        // Demo video player
        const video = videos.find(v => v.id === videoId) || featuredVideo;

        // Convert video to match VideoMetadata interface
        const metadata = {
          id: video.id,
          title: video.title,
          description: video.description,
          duration: video.duration,
          thumbnail: video.thumbnail,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          category: video.category,
          instructor: video.instructor,
          isFree: video.isFree || false,
          tags: video.tags || [],
          uploadDate: new Date().toISOString(),
          resolution: "1080p",
          size: 512000000
        };

        // URLs de vídeo com fallbacks
        const videoUrls = [
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          "https://sample-videos.com/zip/10/mp4/mp4/BigBuckBunny_320x180_1mb.mp4"
        ];

        const demoStreamData: VideoStreamData = {
          videoId: video.id,
          qualities: [
            {
              resolution: "1080p",
              url: videoUrls[0],
              bitrate: 5000,
            },
            {
              resolution: "720p",
              url: videoUrls[1],
              bitrate: 3000,
            },
            {
              resolution: "480p",
              url: videoUrls[2],
              bitrate: 1500,
            },
          ],
          thumbnails: [
            video.thumbnail || "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600",
            video.thumbnail || "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600",
            video.thumbnail || "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600"
          ],
          metadata: metadata
        };
        setSelectedVideo(demoStreamData);

        // Update progress
        updateProgress('video_watched', 1);
      } else {
        const streamData = await getVideoStreamData(videoId);
        if (streamData) {
          setSelectedVideo(streamData);
          updateProgress('video_watched', 1);
        }
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

  const hasAccess = (video: any) => {
    return video.isFree || user?.isPremium || isSupabaseDemoMode;
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

  // Hero Video Component - Responsive
  const HeroSection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] xl:h-[80vh] overflow-hidden rounded-lg lg:rounded-xl"
    >
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <img
          src={featuredVideo.backgroundImage}
          alt={featuredVideo.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      {/* Content - Responsive */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-xl lg:max-w-2xl xl:max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-white text-sm sm:text-base ml-2">{featuredVideo.rating}</span>
                </div>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-slate-300 text-sm sm:text-base">
                  {featuredVideo.watchCount.toLocaleString()} views
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                {featuredVideo.title}
              </h1>
              
              <p className="text-sm sm:text-base lg:text-lg text-slate-200 mb-4 sm:mb-6 leading-relaxed max-w-lg lg:max-w-2xl">
                {featuredVideo.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
                <span className="bg-slate-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm text-white">
                  {featuredVideo.category}
                </span>
                <span className="text-slate-300 text-xs sm:text-sm">•</span>
                <span className="text-slate-300 text-xs sm:text-sm">
                  {Math.floor(featuredVideo.duration / 60)} min
                </span>
                <span className="text-slate-300 text-xs sm:text-sm">•</span>
                <span className="text-slate-300 text-xs sm:text-sm">{featuredVideo.instructor}</span>
                {!featuredVideo.isFree && (
                  <>
                    <span className="text-slate-300 text-xs sm:text-sm">•</span>
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium">
                      PREMIUM
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVideoSelect(featuredVideo.id)}
                  className="bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  <span>Assistir Agora</span>
                </motion.button>

                <div className="flex gap-2 w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowHeroDetails(true)}
                    className="bg-slate-700/80 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-slate-600/80 transition-colors flex items-center space-x-2 text-sm sm:text-base backdrop-blur-sm flex-1 sm:flex-none justify-center"
                  >
                    <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Mais Info</span>
                    <span className="sm:hidden">Info</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToWatchlist(featuredVideo.id)}
                    className="bg-slate-700/80 text-white p-2.5 sm:p-3 rounded-lg hover:bg-slate-600/80 transition-colors backdrop-blur-sm"
                  >
                    {watchlist.includes(featuredVideo.id) ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setHeroMuted(!heroMuted)}
                    className="bg-slate-700/80 text-white p-2.5 sm:p-3 rounded-lg hover:bg-slate-600/80 transition-colors backdrop-blur-sm"
                  >
                    {heroMuted ? (
                      <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - Hidden on mobile */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-white hidden sm:block"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2" />
        </div>
      </motion.div>
    </motion.div>
  );

  if (selectedVideo) {
    return (
      <div className="min-h-screen bg-slate-900 w-full overflow-x-hidden">
        {/* Video Player - Responsive */}
        <div className="relative">
          <VideoPlayer
            streamData={selectedVideo}
            autoPlay={true}
            className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh]"
            onComplete={() => {}}
            onProgress={() => {}}
          />

          {/* Back Button - Responsive */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedVideo(null)}
            className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 bg-black/70 hover:bg-black/90 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-200 backdrop-blur-sm text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl flex items-center gap-1 sm:gap-2"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Voltar aos vídeos</span>
            <span className="sm:hidden">Voltar</span>
          </motion.button>
        </div>

        {/* Video Info - Responsive Layout */}
        <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 xl:gap-8">
            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="xl:col-span-2"
            >
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                {selectedVideo.metadata.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-slate-400 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base">
                <span className="font-medium">{selectedVideo.metadata.instructor}</span>
                <span className="hidden sm:inline">•</span>
                <span className="bg-slate-700 px-2 py-1 rounded text-xs">{selectedVideo.metadata.category}</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  {Math.floor(selectedVideo.metadata.duration / 60)} min
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
                {selectedVideo.metadata.description}
              </p>

              {/* Tags - Responsive */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                {selectedVideo.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <button
                  onClick={() => handleAddToWatchlist(selectedVideo.videoId)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 sm:py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {watchlist.includes(selectedVideo.videoId) ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Na Lista</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Adicionar à Lista</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Sidebar - Related Videos - Better Mobile Layout */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="xl:col-span-1 mt-6 xl:mt-0"
            >
              <div className="bg-slate-800 rounded-lg p-4 sm:p-6 sticky top-4">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded"></div>
                  Vídeos relacionados
                </h3>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-track-slate-700 scrollbar-thumb-slate-600">
                  {videos
                    .filter((v) => v.id !== selectedVideo.videoId && v.category === selectedVideo.metadata.category)
                    .slice(0, 8)
                    .map((video) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleVideoSelect(video.id)}
                        className="flex items-start space-x-3 cursor-pointer hover:bg-slate-700 p-3 rounded-lg transition-all duration-200 group"
                      >
                        <div className="relative flex-shrink-0">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-16 h-10 sm:w-20 sm:h-12 md:w-24 md:h-14 object-cover rounded-md"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-md flex items-center justify-center">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-black ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-xs sm:text-sm font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                            {video.title}
                          </h4>
                          <p className="text-slate-400 text-xs mb-1">
                            {video.instructor}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{Math.floor(video.duration / 60)} min</span>
                            <span>•</span>
                            <span className="bg-slate-700 px-1.5 py-0.5 rounded text-xs">
                              {video.category}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 w-full overflow-x-hidden">


      {/* Hero Section */}
      {showCarousels && !searchQuery && <HeroSection />}

      {/* Navigation & Search - Mobile Optimized */}
      <div className="relative z-10 bg-slate-900">
        <div className="px-2 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6 pb-4">
          <div className="flex flex-col gap-4">
            {/* Header */}
            {!showCarousels || searchQuery ? (
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                  Biblioteca de Vídeos
                </h1>
                <p className="text-sm md:text-base text-slate-400">
                  {isSupabaseDemoMode && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-900/20 text-blue-300 rounded-full text-xs sm:text-sm mr-3 mb-1 sm:mb-0">
                      📺 Versão Demo
                    </span>
                  )}
                  <span className="block sm:inline">Acesso completo aos treinos e aulas especializadas</span>
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Continuar Assistindo
                </h2>
              </div>
            )}

            {/* Search - Mobile First */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar vídeos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 sm:py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={searchLoading}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 sm:py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base min-w-[100px] flex items-center justify-center"
              >
                {searchLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Buscar"
                )}
              </button>
            </div>

            {/* Filters - Horizontal Scroll on Mobile */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Filter className="text-slate-400 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <div className="flex gap-2">
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
                    className={`px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
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
              {/* Continue Watching */}
              {continueWatching.length > 0 && (
                <VideoCarousel
                  title="Continuar Assistindo"
                  videos={convertToCarouselFormat(continueWatching)}
                  onVideoSelect={handleVideoSelect}
                  onAddToWatchlist={handleAddToWatchlist}
                  watchlist={watchlist}
                  autoPlay={false}
                />
              )}

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
                autoPlay={false}
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
            <div className="px-2 sm:px-4 md:px-6 lg:px-8 pb-8">
              {/* Results Header */}
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2">
                  {searchQuery
                    ? `Resultados para "${searchQuery}"`
                    : selectedCategory === "Todos"
                      ? "Todos os vídeos"
                      : `Categoria: ${selectedCategory}`
                  }
                </h2>
                <p className="text-slate-400 text-sm">
                  {filteredVideos.length} vídeo{filteredVideos.length !== 1 ? 's' : ''} encontrado{filteredVideos.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Video Grid - Responsive */}
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6"
                >
                  {filteredVideos.map((video, index) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <VideoCard
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
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </>
      )}

      {/* Player Loading Modal */}
      <AnimatePresence>
        {playerLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
          >
            <div className="bg-slate-800 rounded-lg p-6 sm:p-8 text-center max-w-sm mx-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-white text-sm sm:text-base">Carregando vídeo...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Details Modal */}
      <AnimatePresence>
        {showHeroDetails && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-800 rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg sm:text-2xl font-bold text-white pr-4">{featuredVideo.title}</h2>
                <button
                  onClick={() => setShowHeroDetails(false)}
                  className="text-slate-400 hover:text-white p-1 flex-shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              
              <img
                src={featuredVideo.thumbnail}
                alt={featuredVideo.title}
                className="w-full h-32 sm:h-48 object-cover rounded-lg mb-4"
              />
              
              <div className="space-y-4 text-slate-300">
                <div>
                  <h3 className="text-white font-semibold mb-2">Descrição</h3>
                  <p className="text-sm sm:text-base">{featuredVideo.description}</p>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-2">Instrutor</h3>
                  <p className="text-sm sm:text-base">{featuredVideo.instructor}</p>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {featuredVideo.tags.map(tag => (
                      <span key={tag} className="bg-slate-700 px-2 py-1 rounded text-xs sm:text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowHeroDetails(false);
                    handleVideoSelect(featuredVideo.id);
                  }}
                  className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Assistir</span>
                </button>
                <button
                  onClick={() => {
                    handleAddToWatchlist(featuredVideo.id);
                    setShowHeroDetails(false);
                  }}
                  className="bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
                >
                  {watchlist.includes(featuredVideo.id) ? 'Remover da Lista' : 'Adicionar à Lista'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Videos;
