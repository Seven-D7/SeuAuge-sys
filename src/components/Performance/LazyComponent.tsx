import React, { useState, useRef, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
  minHeight?: number;
  onLoad?: () => void;
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback,
  rootMargin = '100px',
  threshold = 0.1,
  triggerOnce = true,
  className = '',
  minHeight = 200,
  onLoad,
}) => {
  const [inView, setInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce]);

  useEffect(() => {
    if (inView && !hasLoaded) {
      setHasLoaded(true);
      onLoad?.();
    }
  }, [inView, hasLoaded, onLoad]);

  const DefaultFallback = () => (
    <div 
      className={`flex items-center justify-center bg-gray-50 dark:bg-gray-800 ${className}`}
      style={{ minHeight }}
    >
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Carregando componente...</p>
      </div>
    </div>
  );

  return (
    <div ref={ref} className={className}>
      {inView ? (
        <Suspense fallback={fallback || <DefaultFallback />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </Suspense>
      ) : (
        <div 
          className="bg-gray-50 dark:bg-gray-800 rounded-lg"
          style={{ minHeight }}
        >
          {/* Skeleton placeholder */}
          <div className="animate-pulse p-4 space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyComponent;
