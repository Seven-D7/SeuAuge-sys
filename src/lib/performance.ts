// Performance optimization utilities

// Debounce function for search inputs and API calls
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

// Throttle function for scroll events and resize handlers
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// Memoization utility for expensive calculations
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  maxCacheSize: number = 100
): T => {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    
    // Limit cache size to prevent memory leaks
    if (cache.size >= maxCacheSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, result);
    return result;
  }) as T;
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Virtual scrolling utility for large lists
export class VirtualScrollManager {
  private itemHeight: number;
  private containerHeight: number;
  private scrollTop: number = 0;
  private totalItems: number;
  private buffer: number;

  constructor(
    itemHeight: number,
    containerHeight: number,
    totalItems: number,
    buffer: number = 3
  ) {
    this.itemHeight = itemHeight;
    this.containerHeight = containerHeight;
    this.totalItems = totalItems;
    this.buffer = buffer;
  }

  getVisibleRange(): { start: number; end: number; offset: number } {
    const visibleItemsCount = Math.ceil(this.containerHeight / this.itemHeight);
    const start = Math.max(
      0,
      Math.floor(this.scrollTop / this.itemHeight) - this.buffer
    );
    const end = Math.min(
      this.totalItems,
      start + visibleItemsCount + this.buffer * 2
    );
    const offset = start * this.itemHeight;

    return { start, end, offset };
  }

  updateScrollTop(scrollTop: number): void {
    this.scrollTop = scrollTop;
  }

  getTotalHeight(): number {
    return this.totalItems * this.itemHeight;
  }
}

// Image optimization utilities
export const optimizeImageUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): string => {
  // For external image services like Cloudinary, Imgix, etc.
  if (url.includes('cloudinary.com')) {
    const params = [];
    if (options.width) params.push(`w_${options.width}`);
    if (options.height) params.push(`h_${options.height}`);
    if (options.quality) params.push(`q_${options.quality}`);
    if (options.format) params.push(`f_${options.format}`);
    
    const transformation = params.join(',');
    return url.replace('/upload/', `/upload/${transformation}/`);
  }
  
  // Return original URL if no optimization service is detected
  return url;
};

// Preload critical resources
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = async (urls: string[]): Promise<void> => {
  try {
    await Promise.all(urls.map(preloadImage));
  } catch (error) {
    console.warn('Failed to preload some images:', error);
  }
};

// Critical CSS inlining utility
export const inlineCriticalCSS = (css: string): void => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.insertBefore(style, document.head.firstChild);
};

// Resource hints for better loading performance
export const addResourceHint = (
  href: string,
  rel: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch',
  as?: string
): void => {
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  
  if (as && rel === 'preload') {
    link.as = as;
  }
  
  document.head.appendChild(link);
};

// Lazy loading hook for components
export const useLazyLoading = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  options: IntersectionObserverInit = {}
) => {
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = createIntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(element);
        }
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, callback]);
};

// Bundle splitting utilities
export const loadChunk = async (chunkName: string): Promise<any> => {
  try {
    switch (chunkName) {
      case 'charts':
        return await import('recharts');
      case 'pdf':
        return await import('jspdf');
      case 'html2canvas':
        return await import('html2canvas');
      default:
        throw new Error(`Unknown chunk: ${chunkName}`);
    }
  } catch (error) {
    console.error(`Failed to load chunk ${chunkName}:`, error);
    throw error;
  }
};

// Performance monitoring
export const performanceMonitor = {
  // Mark performance points
  mark: (name: string): void => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
    }
  },

  // Measure between marks
  measure: (name: string, startMark: string, endMark?: string): number => {
    if (typeof performance !== 'undefined' && performance.measure) {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      return measure.duration;
    }
    return 0;
  },

  // Get navigation timing
  getNavigationTiming: (): PerformanceNavigationTiming | null => {
    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navTiming;
    }
    return null;
  },

  // Get page load metrics
  getPageLoadMetrics: () => {
    const navTiming = performanceMonitor.getNavigationTiming();
    if (!navTiming) return null;

    return {
      domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.navigationStart,
      fullLoad: navTiming.loadEventEnd - navTiming.navigationStart,
      firstPaint: 0, // Would need paint timing API
      firstContentfulPaint: 0, // Would need paint timing API
      largestContentfulPaint: 0, // Would need LCP observer
    };
  },
};

// Memory usage monitoring
export const memoryMonitor = {
  getMemoryUsage: (): any => {
    if ('memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  },

  logMemoryUsage: (): void => {
    const memory = memoryMonitor.getMemoryUsage();
    if (memory) {
      console.log('Memory Usage:', {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`,
      });
    }
  },
};

// Service Worker registration
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
    } catch (error) {
      console.log('SW registration failed: ', error);
    }
  }
};

// Request idle callback for non-critical tasks
export const runWhenIdle = (callback: () => void, timeout: number = 5000): void => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(callback, 0);
  }
};

// Batch DOM updates
export const batchDOMUpdates = (updates: (() => void)[]): void => {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
};

// Network information API
export const getNetworkInfo = (): any => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
  }
  return null;
};

// Adaptive loading based on network conditions
export const shouldLoadHighQuality = (): boolean => {
  const networkInfo = getNetworkInfo();
  if (!networkInfo) return true; // Default to high quality if no info

  // Don't load high quality on slow connections or save data mode
  if (networkInfo.saveData || networkInfo.effectiveType === 'slow-2g' || networkInfo.effectiveType === '2g') {
    return false;
  }

  return true;
};

export default {
  debounce,
  throttle,
  memoize,
  createIntersectionObserver,
  VirtualScrollManager,
  optimizeImageUrl,
  preloadImage,
  preloadImages,
  performanceMonitor,
  memoryMonitor,
  registerServiceWorker,
  runWhenIdle,
  batchDOMUpdates,
  getNetworkInfo,
  shouldLoadHighQuality,
};
