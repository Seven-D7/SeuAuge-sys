import React from 'react';
import { Play, Clock, Heart, Lock, Crown } from 'lucide-react';
import { Video } from '../../stores/favoritesStore';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useAuth } from '../../contexts/AuthContext';
import { designUtils, COMMON_CLASSES } from '../../lib/design-system';
import LazyImage from '../ui/LazyImage';

interface VideoCardProps {
  video: Video;
  onClick?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const { user } = useAuth();
  const { isVideoFavorite, addVideoToFavorites, removeVideoFromFavorites } = useFavoritesStore();
  const isFavorite = isVideoFavorite(video.id);
  const hasAccess = video.isFree || user?.isPremium;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeVideoFromFavorites(video.id);
    } else {
      addVideoToFavorites(video);
    }
  };

  return (
    <div className={`
      group cursor-pointer overflow-hidden rounded-xl
      ${designUtils.glass('dark')}
      hover:scale-105 transition-all duration-300 
      hover:shadow-xl hover:shadow-primary/10
      ${COMMON_CLASSES.focus}
    `}>
      {/* Video Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <LazyImage
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          width={400}
          height={225}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className={`
            w-14 h-14 rounded-full flex items-center justify-center
            ${designUtils.gradient('primary')}
            shadow-lg hover:scale-110 transition-transform duration-200
          `}>
            <Play className="w-6 h-6 text-white ml-0.5 fill-current" />
          </div>
        </div>

        {/* Premium Badge */}
        {!video.isFree && (
          <div className="absolute top-3 left-3">
            <div className={`
              flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
              ${designUtils.glass('warning')}
              text-yellow-200
            `}>
              <Crown className="w-3 h-3" />
              PRO
            </div>
          </div>
        )}

        {/* Duration */}
        <div className="absolute bottom-3 right-3">
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
            ${designUtils.glass('dark')}
            text-white
          `}>
            <Clock className="w-3 h-3" />
            {video.duration}
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className={`
            absolute top-3 right-3 p-2 rounded-full transition-all duration-200
            ${designUtils.glass('dark')}
            hover:scale-110 ${COMMON_CLASSES.focus}
            ${isFavorite ? 'text-red-400' : 'text-white/70 hover:text-white'}
          `}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className={`
            font-semibold text-white line-clamp-2 mb-1
            ${COMMON_CLASSES.heading.h4}
            text-sm sm:text-base
          `}>
            {video.title}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm font-medium">
            {video.instructor}
          </p>
        </div>

        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <span className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            bg-primary/20 text-primary-300 border border-primary/30
          `}>
            {video.category}
          </span>

          {/* Access Indicator */}
          {!hasAccess && (
            <div className="flex items-center text-gray-500">
              <Lock className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {video.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Bar */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={onClick}
            disabled={!hasAccess}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
              transition-all duration-200
              ${hasAccess 
                ? `${designUtils.gradient('primary')} text-white hover:scale-105 shadow-md hover:shadow-lg`
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }
              ${COMMON_CLASSES.focus}
            `}
          >
            <Play className="w-3 h-3" />
            {hasAccess ? 'Assistir' : 'Premium'}
          </button>

          {video.description && (
            <div className="text-xs text-gray-400 truncate ml-2 flex-1">
              {video.description}
            </div>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-xl shadow-lg shadow-primary/20"></div>
      </div>
    </div>
  );
};

export default VideoCard;
