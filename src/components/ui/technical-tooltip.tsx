import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ExternalLink } from 'lucide-react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  detailsLink?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const TechnicalTooltip: React.FC<TooltipProps> = ({
  content,
  children,
  detailsLink,
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(false), 150);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-slate-800 dark:border-b-slate-100';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-l-slate-800 dark:border-l-slate-100';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-r-slate-800 dark:border-r-slate-100';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-slate-800 dark:border-t-slate-100';
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className="cursor-help"
        onMouseEnter={!isMobile ? showTooltip : undefined}
        onMouseLeave={!isMobile ? hideTooltip : undefined}
        onClick={isMobile ? () => setIsVisible(!isVisible) : undefined}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${getPositionClasses()}`}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
          >
            <div className="bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-3 rounded-lg shadow-lg border border-slate-700 dark:border-slate-300 max-w-xs w-max">
              <p className="text-sm leading-relaxed">{content}</p>
              {detailsLink && (
                <a
                  href={detailsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-blue-300 dark:text-blue-600 hover:text-blue-200 dark:hover:text-blue-500 transition-colors"
                >
                  <span>Saiba mais</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            {/* Arrow */}
            <div className={`absolute w-0 h-0 border-4 border-transparent ${getArrowClasses()}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface TechnicalTermProps {
  term: string;
  definition: string;
  detailsLink?: string;
  className?: string;
}

export const TechnicalTerm: React.FC<TechnicalTermProps> = ({
  term,
  definition,
  detailsLink,
  className = ''
}) => {
  return (
    <TechnicalTooltip content={definition} detailsLink={detailsLink} className={className}>
      <span className="inline-flex items-center gap-1 border-b border-dotted border-slate-400 dark:border-slate-500 cursor-help hover:border-primary transition-colors">
        {term}
        <HelpCircle className="w-3 h-3 text-slate-400" />
      </span>
    </TechnicalTooltip>
  );
};

export default TechnicalTooltip;
