import React from 'react';
import { Play, Clock, Heart, Lock } from 'lucide-react';
import { Video } from '../../stores/favoritesStore';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useAuth } from '../../contexts/AuthContext';

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
    <div 
      className="group cursor-pointer bg-slate-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-40 sm:h-48 object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </div>
        </div>

        {/* Premium badge */}
        {!video.isFree && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <div className="bg-yellow-500 text-black px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Premium</span>
              <span className="sm:hidden">P</span>
            </div>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <span className="bg-primary text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium">
            {video.category}
          </span>
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black bg-opacity-70 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {video.duration}
        </div>

        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 p-1.5 sm:p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all duration-200"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`}
          />
        </button>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-2 text-sm sm:text-base">{video.title}</h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-2">{video.instructor}</p>
        <p className="text-xs text-slate-500 line-clamp-2">{video.description}</p>
      </div>
    </div>
  );
};

export default VideoCard;
