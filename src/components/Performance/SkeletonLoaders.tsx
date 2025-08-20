import React from 'react';
import { motion } from 'framer-motion';

// Base skeleton component
const SkeletonBase: React.FC<{
  className?: string;
  animate?: boolean;
  children?: React.ReactNode;
}> = ({ className = '', animate = true, children }) => {
  const baseClasses = "bg-gray-200 dark:bg-gray-700 rounded";
  const animationClasses = animate ? "animate-pulse" : "";
  
  return (
    <div className={`${baseClasses} ${animationClasses} ${className}`}>
      {children}
    </div>
  );
};

// Video card skeleton
export const VideoCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
    <SkeletonBase className="w-full h-48" />
    <div className="p-4 space-y-3">
      <SkeletonBase className="h-5 w-3/4" />
      <SkeletonBase className="h-4 w-1/2" />
      <div className="flex items-center space-x-2">
        <SkeletonBase className="w-8 h-8 rounded-full" />
        <SkeletonBase className="h-4 w-24" />
      </div>
    </div>
  </div>
);

// Profile card skeleton
export const ProfileCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonBase className="w-16 h-16 rounded-full" />
      <div className="space-y-2 flex-1">
        <SkeletonBase className="h-5 w-32" />
        <SkeletonBase className="h-4 w-24" />
      </div>
    </div>
    <div className="space-y-3">
      <SkeletonBase className="h-4 w-full" />
      <SkeletonBase className="h-4 w-5/6" />
      <SkeletonBase className="h-4 w-3/4" />
    </div>
  </div>
);

// Stats card skeleton
export const StatsCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <SkeletonBase className="h-6 w-24" />
      <SkeletonBase className="w-8 h-8 rounded" />
    </div>
    <SkeletonBase className="h-8 w-16 mb-2" />
    <SkeletonBase className="h-4 w-20" />
  </div>
);

// Achievement card skeleton
export const AchievementCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4">
    <div className="text-center space-y-3">
      <SkeletonBase className="w-16 h-16 rounded-full mx-auto" />
      <SkeletonBase className="h-5 w-24 mx-auto" />
      <SkeletonBase className="h-4 w-32 mx-auto" />
      <SkeletonBase className="h-3 w-20 mx-auto" />
    </div>
  </div>
);

// Chart skeleton
export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 300 }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
    <div className="mb-4">
      <SkeletonBase className="h-6 w-32 mb-2" />
      <SkeletonBase className="h-4 w-48" />
    </div>
    <div className="flex items-end justify-between space-x-2" style={{ height }}>
      {[...Array(7)].map((_, i) => (
        <SkeletonBase
          key={i}
          className="w-full"
          style={{
            height: `${Math.random() * 80 + 20}%`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  </div>
);

// List item skeleton
export const ListItemSkeleton: React.FC = () => (
  <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
    <SkeletonBase className="w-12 h-12 rounded-full" />
    <div className="flex-1 space-y-2">
      <SkeletonBase className="h-5 w-3/4" />
      <SkeletonBase className="h-4 w-1/2" />
    </div>
    <SkeletonBase className="w-20 h-8 rounded" />
  </div>
);

// Table skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
    {/* Header */}
    <div className="border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex space-x-4">
        {[...Array(columns)].map((_, i) => (
          <SkeletonBase key={i} className="h-5 flex-1" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="flex space-x-4">
            {[...Array(columns)].map((_, colIndex) => (
              <SkeletonBase
                key={colIndex}
                className="h-4 flex-1"
                style={{ animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Page skeleton
export const PageSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <SkeletonBase className="h-8 w-64 mb-4" />
        <SkeletonBase className="h-5 w-96" />
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Chart section */}
      <ChartSkeleton height={400} />
    </div>
  </div>
);

// Loading screen with brand
export const BrandedLoadingScreen: React.FC<{ message?: string }> = ({
  message = "Carregando SeuAuge...",
}) => (
  <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
    <div className="text-center">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-16 h-16 mx-auto mb-4"
      >
        <div className="w-full h-full bg-gradient-to-br from-primary to-emerald-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">SA</span>
        </div>
      </motion.div>
      
      <motion.h2
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2"
      >
        {message}
      </motion.h2>
      
      <div className="flex justify-center">
        <div className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            animate={{ x: [-100, 100] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-8 h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
          />
        </div>
      </div>
    </div>
  </div>
);

// Skeleton wrapper with fade in
export const SkeletonWrapper: React.FC<{
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}> = ({ loading, skeleton, children }) => {
  if (loading) {
    return <>{skeleton}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default SkeletonBase;
