import React from 'react';
import { Play, Clock, Heart, Lock, Crown } from 'lucide-react';
import { Video } from '../../stores/favoritesStore';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { designUtils, COMMON_CLASSES } from '../../lib/design-system';
import { formatDuration } from '../../lib/utils';
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
      group cursor-pointer overflow-hidden rounded-lg
      ${designUtils.glass('dark')}
      hover:scale-[1.02] transition-all duration-300
      hover:shadow-xl hover:shadow-primary/10
      ${COMMON_CLASSES.focus}
      w-full max-w-full
    `}>
      {/* Video Thumbnail */}
      <div className="relative aspect-video overflow-hidden w-full">
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
            w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center
            ${designUtils.gradient('primary')}
            shadow-lg hover:scale-110 transition-transform duration-200
          `}>
            <Play className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white ml-0.5 fill-current" />
          </div>
        </div>

        {/* Premium Badge */}
        {!video.isFree && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <div className={`
              flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold
              ${designUtils.glass('warning')}
              text-yellow-200
            `}>
              <Crown className="w-3 h-3" />
              PRO
            </div>
          </div>
        )}

        {/* Duration */}
        <div className="absolute bottom-2 right-2">
          <div className={`
            flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium
            ${designUtils.glass('dark')}
            text-white
          `}>
            <Clock className="w-3 h-3" />
            <span>{formatDuration(video.duration, 'short')}</span>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className={`
            absolute top-2 right-2 p-1.5 sm:p-2 rounded-full transition-all duration-200
            ${designUtils.glass('dark')}
            hover:scale-110 ${COMMON_CLASSES.focus}
            ${isFavorite ? 'text-red-400' : 'text-white/70 hover:text-white'}
          `}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Video Info */}
      <div className="p-3">
        <div className="mb-2">
          <h3 className={`
            font-semibold text-white line-clamp-2 mb-1
            ${COMMON_CLASSES.heading.h4}
            text-sm leading-tight
          `}>
            {video.title}
          </h3>
          <p className="text-gray-400 text-xs font-medium">
            {video.instructor}
          </p>
        </div>

        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <span className={`
            inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
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
          <div className="mt-2 flex flex-wrap gap-1">
            {video.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Bar */}
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={onClick}
            disabled={!hasAccess}
            className={`
              flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
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

        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-lg shadow-lg shadow-primary/20"></div>
      </div>
    </div>
  );
};

export default VideoCard;
