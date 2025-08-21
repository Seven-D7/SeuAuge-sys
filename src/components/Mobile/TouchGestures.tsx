import React, { useRef, useCallback, useEffect } from 'react';
import { motion, PanInfo, useMotionValue, useTransform, useAnimation } from 'framer-motion';

interface TouchGesturesProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchZoom?: (scale: number) => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  swipeThreshold?: number;
  disabled?: boolean;
  className?: string;
}

const TouchGestures: React.FC<TouchGesturesProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinchZoom,
  onDoubleTap,
  onLongPress,
  swipeThreshold = 50,
  disabled = false,
  className = '',
}) => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();
  
  // Transform values for visual feedback
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const scale = useTransform(x, [-100, 0, 100], [0.95, 1, 0.95]);
  
  // Touch state management
  const touchState = useRef({
    startTime: 0,
    lastTap: 0,
    tapCount: 0,
    longPressTimer: null as NodeJS.Timeout | null,
    initialDistance: 0,
    currentDistance: 0,
  });

  // Handle pan start
  const handlePanStart = useCallback(() => {
    if (disabled) return;
    
    touchState.current.startTime = Date.now();
    
    // Start long press timer
    if (onLongPress) {
      touchState.current.longPressTimer = setTimeout(() => {
        onLongPress();
        // Haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }, 500);
    }
  }, [disabled, onLongPress]);

  // Handle pan motion
  const handlePan = useCallback((event: any, info: PanInfo) => {
    if (disabled) return;
    
    // Clear long press timer on movement
    if (touchState.current.longPressTimer) {
      clearTimeout(touchState.current.longPressTimer);
      touchState.current.longPressTimer = null;
    }
    
    // Update motion values for visual feedback
    x.set(info.offset.x);
    y.set(info.offset.y);
  }, [disabled, x, y]);

  // Handle pan end
  const handlePanEnd = useCallback((event: any, info: PanInfo) => {
    if (disabled) return;
    
    // Clear long press timer
    if (touchState.current.longPressTimer) {
      clearTimeout(touchState.current.longPressTimer);
      touchState.current.longPressTimer = null;
    }
    
    const { offset, velocity } = info;
    const distance = Math.sqrt(offset.x ** 2 + offset.y ** 2);
    const swipeVelocity = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    
    // Check for swipe gestures
    if (distance > swipeThreshold || swipeVelocity > 500) {
      const angle = Math.atan2(offset.y, offset.x) * (180 / Math.PI);
      
      // Determine swipe direction
      if (Math.abs(angle) < 45) {
        // Right swipe
        onSwipeRight?.();
        // Haptic feedback
        if ('vibrate' in navigator) navigator.vibrate(25);
      } else if (Math.abs(angle) > 135) {
        // Left swipe
        onSwipeLeft?.();
        if ('vibrate' in navigator) navigator.vibrate(25);
      } else if (angle > 45 && angle < 135) {
        // Down swipe
        onSwipeDown?.();
        if ('vibrate' in navigator) navigator.vibrate(25);
      } else if (angle < -45 && angle > -135) {
        // Up swipe
        onSwipeUp?.();
        if ('vibrate' in navigator) navigator.vibrate(25);
      }
    } else {
      // Check for tap gestures
      const now = Date.now();
      const timeSinceStart = now - touchState.current.startTime;
      
      if (timeSinceStart < 300 && distance < 10) {
        // This is a tap
        const timeSinceLastTap = now - touchState.current.lastTap;
        
        if (timeSinceLastTap < 300) {
          // Double tap
          touchState.current.tapCount++;
          if (touchState.current.tapCount === 2 && onDoubleTap) {
            onDoubleTap();
            touchState.current.tapCount = 0;
            if ('vibrate' in navigator) navigator.vibrate([25, 25, 25]);
          }
        } else {
          touchState.current.tapCount = 1;
        }
        
        touchState.current.lastTap = now;
      }
    }
    
    // Reset position with smooth animation
    controls.start({
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    });
  }, [disabled, swipeThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onDoubleTap, controls]);

  // Handle pinch zoom
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (disabled || event.touches.length !== 2) return;
    
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
    
    touchState.current.initialDistance = distance;
    touchState.current.currentDistance = distance;
  }, [disabled]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (disabled || event.touches.length !== 2 || !onPinchZoom) return;
    
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
    
    if (touchState.current.initialDistance > 0) {
      const scale = distance / touchState.current.initialDistance;
      touchState.current.currentDistance = distance;
      onPinchZoom(scale);
    }
  }, [disabled, onPinchZoom]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (disabled) return;
    
    touchState.current.initialDistance = 0;
    touchState.current.currentDistance = 0;
  }, [disabled]);

  // Add touch event listeners
  useEffect(() => {
    const element = constraintsRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div ref={constraintsRef} className={`touch-gesture-container ${className}`}>
      <motion.div
        drag={!disabled}
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        animate={controls}
        style={{
          x,
          y,
          rotateY,
          scale,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

// Pull to refresh component
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  disabled?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 80,
  disabled = false,
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [pullDistance, setPullDistance] = React.useState(0);
  const y = useMotionValue(0);
  const controls = useAnimation();
  
  // Transform for refresh indicator
  const refreshOpacity = useTransform(y, [0, threshold], [0, 1]);
  const refreshRotate = useTransform(y, [0, threshold], [0, 180]);
  
  const handlePanStart = useCallback(() => {
    if (disabled || isRefreshing) return;
    
    // Only allow pull to refresh from top of scroll
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 0) return;
  }, [disabled, isRefreshing]);

  const handlePan = useCallback((event: any, info: PanInfo) => {
    if (disabled || isRefreshing) return;
    
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 0) return;
    
    // Only allow downward pull
    if (info.offset.y > 0) {
      const distance = Math.min(info.offset.y, threshold * 1.5);
      setPullDistance(distance);
      y.set(distance);
    }
  }, [disabled, isRefreshing, threshold, y]);

  const handlePanEnd = useCallback(async (event: any, info: PanInfo) => {
    if (disabled || isRefreshing) return;
    
    const distance = info.offset.y;
    
    if (distance > threshold) {
      // Trigger refresh
      setIsRefreshing(true);
      setPullDistance(threshold);
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        controls.start({
          y: 0,
          transition: { type: "spring", stiffness: 300, damping: 30 }
        });
      }
    } else {
      // Reset position
      setPullDistance(0);
      controls.start({
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      });
    }
  }, [disabled, isRefreshing, threshold, onRefresh, controls]);

  return (
    <div className="relative">
      {/* Refresh indicator */}
      <motion.div
        style={{
          opacity: refreshOpacity,
          y: pullDistance - 50,
        }}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg"
      >
        <motion.div
          style={{ rotate: refreshRotate }}
          className={`w-6 h-6 border-2 border-primary border-t-transparent rounded-full ${
            isRefreshing ? 'animate-spin' : ''
          }`}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        animate={controls}
        style={{ y }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Swipeable card component
interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className = '',
}) => {
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  const leftActionOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);
  const rightActionOpacity = useTransform(x, [0, 50, 100], [0, 0.5, 1]);
  
  const handlePanEnd = useCallback((event: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold && onSwipeRight) {
      // Swipe right action
      controls.start({ x: 300, opacity: 0 }).then(() => {
        onSwipeRight();
      });
    } else if (info.offset.x < -threshold && onSwipeLeft) {
      // Swipe left action
      controls.start({ x: -300, opacity: 0 }).then(() => {
        onSwipeLeft();
      });
    } else {
      // Reset position
      controls.start({ x: 0 });
    }
  }, [controls, onSwipeLeft, onSwipeRight]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background actions */}
      {leftAction && (
        <motion.div
          style={{ opacity: leftActionOpacity }}
          className="absolute right-0 top-0 h-full flex items-center pr-4"
        >
          {leftAction}
        </motion.div>
      )}
      
      {rightAction && (
        <motion.div
          style={{ opacity: rightActionOpacity }}
          className="absolute left-0 top-0 h-full flex items-center pl-4"
        >
          {rightAction}
        </motion.div>
      )}

      {/* Card content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.2}
        onPanEnd={handlePanEnd}
        animate={controls}
        style={{ x }}
        className="bg-white dark:bg-gray-800 relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default TouchGestures;
