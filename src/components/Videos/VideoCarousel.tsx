import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Info, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  backdrop?: string;
  duration: string;
  category: string;
  instructor: string;
  isFree: boolean;
  tags: string[];
}

interface VideoCarouselProps {
  title: string;
  videos: Video[];
  onVideoSelect: (videoId: string) => void;
  onAddToWatchlist?: (videoId: string) => void;
  watchlist?: string[];
  autoPlay?: boolean;
  showInfo?: boolean;
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({
  title,
  videos,
  onVideoSelect,
  onAddToWatchlist,
  watchlist = [],
  autoPlay = false,
  showInfo = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCards, setVisibleCards] = useState(6);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Update visible cards based on screen size
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      if (width < 480) setVisibleCards(1);
      else if (width < 640) setVisibleCards(2);
      else if (width < 768) setVisibleCards(2);
      else if (width < 1024) setVisibleCards(3);
      else if (width < 1280) setVisibleCards(4);
      else if (width < 1536) setVisibleCards(5);
      else setVisibleCards(6);
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isHovered && videos.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % Math.max(1, videos.length - visibleCards + 1));
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, isHovered, videos.length, visibleCards]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    const maxIndex = Math.max(0, videos.length - visibleCards);
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const isInWatchlist = (videoId: string) => watchlist.includes(videoId);

  const handleWatchlistToggle = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWatchlist?.(videoId);
  };

  if (videos.length === 0) return null;

  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < videos.length - visibleCards;

  return (
    <div className="relative group mb-6 sm:mb-8">
      {/* Section Title */}
      <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4 px-2 sm:px-3 md:px-4 lg:px-8 xl:px-12">
        {title}
      </h2>

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Navigation Buttons */}
        <AnimatePresence>
          {isHovered && canGoLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={goToPrevious}
              className="absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/80 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
            </motion.button>
          )}
          
          {isHovered && canGoRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={goToNext}
              className="absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/80 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Video Cards */}
        <div className="px-2 sm:px-3 md:px-4 lg:px-8 xl:px-12">
          <motion.div
            className="flex gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 xl:gap-4"
            animate={{
              x: `-${currentIndex * (100 / visibleCards)}%`,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            {videos.map((video, index) => (
              <motion.div
                key={`${title}-${video.id}-${index}`}
                className="relative flex-shrink-0 group/card cursor-pointer"
                style={{ width: `${100 / visibleCards}%` }}
                whileHover={{ scale: window.innerWidth >= 640 ? 1.05 : 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => onVideoSelect(video.id)}
              >
                {/* Video Card */}
                <div className="relative bg-slate-800 rounded-lg overflow-hidden aspect-video">
                  {/* Thumbnail */}
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

                  {/* Premium Badge */}
                  {!video.isFree && (
                    <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 md:top-2 md:right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-1 py-0.5 sm:px-1.5 sm:py-0.5 md:px-2 md:py-1 rounded-full">
                      PRO
                    </div>
                  )}

                  {/* Duration */}
                  <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 md:bottom-2 md:right-2 bg-black/80 text-white text-xs px-1 py-0.5 sm:px-1.5 sm:py-0.5 md:px-2 md:py-1 rounded backdrop-blur-sm">
                    {video.duration}
                  </div>

                  {/* Hover Controls */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onVideoSelect(video.id);
                        }}
                        className="bg-white hover:bg-gray-200 text-black p-1.5 sm:p-2 rounded-full transition-colors"
                      >
                        <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                      </button>
                      
                      {onAddToWatchlist && (
                        <button
                          onClick={(e) => handleWatchlistToggle(video.id, e)}
                          className="bg-black/60 hover:bg-black/80 text-white p-1.5 sm:p-2 rounded-full transition-colors backdrop-blur-sm"
                        >
                          {isInWatchlist(video.id) ? (
                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </button>
                      )}
                      
                      {showInfo && (
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="bg-black/60 hover:bg-black/80 text-white p-1.5 sm:p-2 rounded-full transition-colors backdrop-blur-sm"
                        >
                          <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Video Info */}
                <div className="mt-1 sm:mt-1.5 md:mt-2 px-0 sm:px-0.5 md:px-1">
                  <h3 className="text-white text-xs font-medium truncate mb-0.5 sm:mb-1 leading-tight">
                    {video.title}
                  </h3>
                  <div className="flex flex-col text-xs text-gray-400 gap-0.5 sm:gap-1">
                    <span className="bg-slate-700 px-1 sm:px-1.5 py-0.5 rounded text-xs w-fit">
                      {video.category}
                    </span>
                    <span className="truncate text-xs">{video.instructor}</span>
                  </div>
                </div>

                {/* Extended Info on Hover (Desktop Only) */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                      className="hidden lg:block absolute top-full left-0 right-0 bg-slate-800 rounded-b-lg p-3 shadow-xl z-10 border-t border-slate-700"
                    >
                      <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {video.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={`${video.id}-tag-${tagIndex}`}
                            className="bg-slate-700 text-gray-300 px-1.5 py-0.5 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Progress Indicators */}
        {videos.length > visibleCards && (
          <div className="flex justify-center mt-4 gap-1">
            {Array.from({ length: Math.ceil(videos.length / visibleCards) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * visibleCards)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / visibleCards) === index
                    ? 'bg-white'
                    : 'bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCarousel;
