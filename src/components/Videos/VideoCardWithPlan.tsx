import React from 'react';
import { Play, Clock, Lock, Star, Crown, Heart } from 'lucide-react';
import { VideoWithPlan } from '../../types/content';
import { usePlanAccess } from '../../hooks/usePlanAccess';
import { useFavoritesStore } from '../../stores/favoritesStore';
import PlanBadge from '../Common/PlanBadge';
import ContentAccessIndicator from '../Common/ContentAccessIndicator';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface VideoCardWithPlanProps {
  video: VideoWithPlan;
  onClick?: () => void;
  onUpgrade?: () => void;
}

const VideoCardWithPlan: React.FC<VideoCardWithPlanProps> = ({ 
  video, 
  onClick,
  onUpgrade 
}) => {
  const { canAccessContent, userPlan } = usePlanAccess();
  const { isVideoFavorite, addVideoToFavorites, removeVideoFromFavorites } = useFavoritesStore();
  
  const hasAccess = canAccessContent(video.planTier);
  const isFavorite = isVideoFavorite(video.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeVideoFromFavorites(video.id);
    } else {
      // Convert VideoWithPlan to Video format expected by favorites store
      addVideoToFavorites({
        id: video.id,
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail,
        duration: video.duration,
        category: video.category,
        instructor: video.instructor,
        isFree: video.isFree,
        difficulty: video.difficulty,
        videoUrl: video.videoUrl,
        tags: video.tags
      });
    }
  };

  const handleClick = () => {
    if (hasAccess && onClick) {
      onClick();
    } else if (onUpgrade) {
      onUpgrade();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'Intermediário':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'Avançado':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <Card className="group overflow-hidden border border-gray-200 hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-white cursor-pointer">
      {/* Video Thumbnail */}
      <div className="relative aspect-video overflow-hidden" onClick={handleClick}>
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
            <Play className="w-8 h-8 text-white ml-1 fill-current" />
          </div>
        </div>

        {/* Plan Badge */}
        <div className="absolute top-3 left-3">
          <PlanBadge planTier={video.planTier} size="sm" />
        </div>

        {/* Duration */}
        <div className="absolute bottom-3 right-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-black/70 text-white text-xs rounded-md backdrop-blur-sm">
            <Clock className="w-3 h-3" />
            {video.duration}
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 backdrop-blur-sm"
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-400 fill-current' : 'text-white'}`} />
        </button>

        {/* Access Indicator */}
        {!hasAccess && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-2 px-3 py-2 bg-black/80 text-white rounded-lg backdrop-blur-sm">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Premium</span>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4 space-y-3">
        {/* Title and Instructor */}
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 text-sm">
            {video.title}
          </h3>
          <p className="text-gray-600 text-xs">
            {video.instructor}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs">
          <span className={`px-2 py-1 rounded-md border ${getDifficultyColor(video.difficulty)}`}>
            {video.difficulty}
          </span>
          <span className="px-2 py-1 bg-primary/10 text-primary rounded-md font-medium">
            {video.category}
          </span>
        </div>

        {/* Stats */}
        {(video.views || video.rating) && (
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {video.views && (
              <span>{video.views.toLocaleString()} visualizações</span>
            )}
            {video.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                {video.rating.toFixed(1)}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {video.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Access Control */}
        {!hasAccess && (
          <div className="space-y-2">
            <ContentAccessIndicator
              contentPlan={video.planTier}
              userPlan={userPlan}
              showUpgradeMessage={false}
              className="text-xs"
            />
            
            <Button
              onClick={() => onUpgrade?.()}
              size="sm"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
            >
              <Crown className="w-3 h-3 mr-1" />
              Fazer Upgrade
            </Button>
          </div>
        )}

        {/* Plan Tags */}
        {video.planTags.length > 0 && hasAccess && (
          <div className="flex flex-wrap gap-1">
            {video.planTags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoCardWithPlan;
