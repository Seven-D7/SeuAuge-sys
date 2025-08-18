import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppInfo } from '../../data/apps';
import { usePlanAccess } from '../../hooks/usePlanAccess';
import PlanBadge from '../Common/PlanBadge';
import ContentAccessIndicator from '../Common/ContentAccessIndicator';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Clock, 
  Target, 
  Play, 
  Lock, 
  Eye, 
  Star,
  Crown,
  ArrowRight
} from 'lucide-react';

interface AppCardWithPlanProps {
  app: AppInfo;
  showPreview?: boolean;
}

const AppCardWithPlan: React.FC<AppCardWithPlanProps> = ({ 
  app, 
  showPreview = true 
}) => {
  const navigate = useNavigate();
  const { canAccessContent, userPlan } = usePlanAccess();
  const hasAccess = canAccessContent(app.planTier);

  const handleClick = () => {
    if (hasAccess) {
      navigate(app.route);
    } else if (showPreview) {
      // Mostrar preview modal ou página
      navigate(`${app.route}?preview=true`);
    } else {
      navigate('/payment');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante':
        return 'text-green-600 bg-green-100';
      case 'Intermediário':
        return 'text-yellow-600 bg-yellow-100';
      case 'Avançado':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card className="group overflow-hidden border border-gray-200 hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-white">
      {/* Header Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={app.image}
          alt={app.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        {/* Plan Badge */}
        <div className="absolute top-3 left-3">
          <PlanBadge planTier={app.planTier} size="sm" />
        </div>

        {/* Duration Badge */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-black/60 text-white text-xs rounded-md backdrop-blur-sm">
            <Clock className="w-3 h-3" />
            {app.duration}
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-md ${getDifficultyColor(app.difficulty)}`}>
            {app.difficulty}
          </span>
        </div>

        {/* Access Status */}
        <div className="absolute bottom-3 right-3">
          {hasAccess ? (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded-md">
              <Star className="w-3 h-3" />
              Acesso
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-600 text-white text-xs rounded-md">
              <Lock className="w-3 h-3" />
              Premium
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-4">
        {/* Title and Category */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
            {app.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary font-medium">
              {app.category}
            </span>
            <Target className="w-3 h-3 text-gray-400" />
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {app.description}
        </p>

        {/* Features Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800">
            {hasAccess ? 'Recursos inclusos:' : 'Recursos premium:'}
          </h4>
          <ul className="space-y-1">
            {(hasAccess ? app.features : app.previewFeatures || app.features.slice(0, 2))
              .slice(0, 3)
              .map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                {feature}
              </li>
            ))}
            {!hasAccess && app.features.length > 2 && (
              <li className="text-xs text-gray-500 italic">
                +{app.features.length - 2} recursos premium...
              </li>
            )}
          </ul>
        </div>

        {/* Access Control */}
        {!hasAccess && (
          <ContentAccessIndicator
            contentPlan={app.planTier}
            userPlan={userPlan}
            showUpgradeMessage={false}
            className="text-sm"
          />
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {hasAccess ? (
            <Button
              onClick={handleClick}
              className="flex-1 bg-primary hover:bg-primary-dark text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Acessar App
            </Button>
          ) : (
            <>
              {showPreview && app.previewFeatures && (
                <Button
                  onClick={handleClick}
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary/5"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              )}
              <Button
                onClick={() => navigate('/payment')}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </div>

        {/* Plan Tags */}
        {app.planTags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {app.planTags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppCardWithPlan;
