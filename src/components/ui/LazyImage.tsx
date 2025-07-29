import React, { useState, useRef, useEffect } from 'react';
import { optimizeImageUrl, createIntersectionObserver, shouldLoadHighQuality } from '../../lib/performance';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder,
  width,
  height,
  quality = 80,
  format = 'webp',
  loading = 'lazy',
  onLoad,
  onError,
  style,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(loading === 'eager');

  // Generate optimized image URL based on network conditions
  const getOptimizedSrc = (originalSrc: string) => {
    const highQuality = shouldLoadHighQuality();
    const optimizationOptions = {
      width: width,
      height: height,
      quality: highQuality ? quality : Math.max(30, quality - 30),
      format: format,
    };
    
    return optimizeImageUrl(originalSrc, optimizationOptions);
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'eager' || !imgRef.current) return;

    const observer = createIntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(imgRef.current!);
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before element comes into view
        threshold: 0.1,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [loading]);

  // Load image when in view
  useEffect(() => {
    if (!isInView || !src) return;

    const optimizedSrc = getOptimizedSrc(src);
    setCurrentSrc(optimizedSrc);
  }, [isInView, src, width, height, quality, format]);

  // Handle image load
  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleImageError = () => {
    setIsError(true);
    onError?.();
  };

  // Generate placeholder styles
  const placeholderStyle: React.CSSProperties = {
    backgroundColor: '#374151',
    backgroundImage: placeholder 
      ? `url(${placeholder})`
      : 'linear-gradient(45deg, #374151 25%, transparent 25%), linear-gradient(-45deg, #374151 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #374151 75%), linear-gradient(-45deg, transparent 75%, #374151 75%)',
    backgroundSize: placeholder ? 'cover' : '20px 20px',
    backgroundPosition: placeholder ? 'center' : '0 0, 0 10px, 10px -10px, -10px 0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9CA3AF',
    fontSize: '0.875rem',
    ...style,
  };

  // Show placeholder while loading or on error
  if (!isInView || !currentSrc || (!isLoaded && !isError)) {
    return (
      <div
        ref={imgRef}
        className={`${className} transition-opacity duration-300`}
        style={placeholderStyle}
        role="img"
        aria-label={alt}
      >
        {currentSrc && (
          <img
            src={currentSrc}
            alt={alt}
            className="opacity-0 absolute inset-0 w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="eager" // Since we're handling lazy loading ourselves
          />
        )}
        {!placeholder && !currentSrc && (
          <svg
            className="w-8 h-8 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    );
  }

  // Show error placeholder
  if (isError) {
    return (
      <div
        ref={imgRef}
        className={`${className} bg-red-100 text-red-500 flex items-center justify-center`}
        style={style}
        role="img"
        aria-label={`Failed to load: ${alt}`}
      >
        <svg
          className="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }

  // Show loaded image
  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      className={`${className} transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={style}
      onLoad={handleImageLoad}
      onError={handleImageError}
      loading="eager" // Since we're handling lazy loading ourselves
    />
  );
};

export default LazyImage;
