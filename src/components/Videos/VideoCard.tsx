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
    <div className="group cursor-pointer overflow-hidden rounded-lg bg-slate-800 border border-slate-700 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full">
      {/* Video Thumbnail */}
      <div className="relative aspect-video overflow-hidden w-full">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-primary to-emerald-500 shadow-lg hover:scale-110 transition-transform duration-200">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5 fill-current" />
          </div>
        </div>

        {/* Premium Badge */}
        {!video.isFree && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
              <Crown className="w-3 h-3" />
              PRO
            </div>
          </div>
        )}

        {/* Duration */}
        <div className="absolute bottom-2 right-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-black/80 text-white">
            <Clock className="w-3 h-3" />
            <span>{formatDuration(video.duration, 'short')}</span>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 rounded-full transition-all duration-200 bg-black/60 hover:bg-black/80 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary min-w-[32px] min-h-[32px] flex items-center justify-center ${
            isFavorite ? 'text-red-400' : 'text-white/70 hover:text-white'
          }`}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Video Info */}
      <div className="p-3 overflow-hidden">
        <div className="mb-2">
          <h3 className="font-semibold text-white text-sm leading-tight mb-1 break-words overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {video.title}
          </h3>
          <p className="text-gray-400 text-xs font-medium truncate">
            {video.instructor}
          </p>
        </div>

        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30 truncate max-w-[120px]">
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
          <div className="mt-2 flex flex-wrap gap-1 overflow-hidden">
            {video.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded-md truncate max-w-[80px]"
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
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 min-h-[32px] ${
              hasAccess
                ? 'bg-gradient-to-r from-primary to-emerald-500 text-white hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Play className="w-3 h-3" />
            <span className="truncate">{hasAccess ? 'Assistir' : 'Premium'}</span>
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
