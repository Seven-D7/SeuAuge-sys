import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Target, CheckCircle, Skip } from 'lucide-react';

export interface TourStep {
  id: string;
  target: string; // CSS selector for the target element
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  offset?: { x: number; y: number };
  action?: 'click' | 'hover' | 'none';
  allowSkip?: boolean;
  highlightPadding?: number;
  beforeShow?: () => void;
  afterShow?: () => void;
  beforeNext?: () => Promise<boolean> | boolean;
  component?: React.ComponentType<{ onNext: () => void; onSkip: () => void }>;
}

interface GuidedTourProps {
  steps: TourStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  showProgress?: boolean;
  allowBackNavigation?: boolean;
  overlay?: boolean;
  theme?: 'light' | 'dark' | 'primary';
}

const GuidedTour: React.FC<GuidedTourProps> = ({
  steps,
  isActive,
  onComplete,
  onSkip,
  showProgress = true,
  allowBackNavigation = true,
  overlay = true,
  theme = 'primary'
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStep = steps[currentStepIndex];

  // Update target element and position when step changes
  useEffect(() => {
    if (!isActive || !currentStep) return;

    const updateTarget = () => {
      const element = document.querySelector(currentStep.target) as HTMLElement;
      if (element) {
        setTargetElement(element);
        updateTooltipPosition(element);
        
        // Execute beforeShow callback
        currentStep.beforeShow?.();
        
        // Scroll element into view with smooth animation
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
        
        setIsVisible(true);
        
        // Execute afterShow callback
        setTimeout(() => {
          currentStep.afterShow?.();
        }, 500);
      } else {
        // If element not found, wait and try again
        setTimeout(updateTarget, 100);
      }
    };

    updateTarget();
  }, [currentStepIndex, currentStep, isActive]);

  const updateTooltipPosition = (element: HTMLElement) => {
    if (!tooltipRef.current) return;

    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const padding = currentStep.highlightPadding || 8;
    const offset = currentStep.offset || { x: 0, y: 0 };

    let x = 0;
    let y = 0;

    switch (currentStep.position) {
      case 'top':
        x = rect.left + rect.width / 2 - tooltipRect.width / 2;
        y = rect.top - tooltipRect.height - padding;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2 - tooltipRect.width / 2;
        y = rect.bottom + padding;
        break;
      case 'left':
        x = rect.left - tooltipRect.width - padding;
        y = rect.top + rect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = rect.right + padding;
        y = rect.top + rect.height / 2 - tooltipRect.height / 2;
        break;
      case 'center':
        x = window.innerWidth / 2 - tooltipRect.width / 2;
        y = window.innerHeight / 2 - tooltipRect.height / 2;
        break;
    }

    // Apply offset and ensure tooltip stays within viewport
    x = Math.max(16, Math.min(window.innerWidth - tooltipRect.width - 16, x + offset.x));
    y = Math.max(16, Math.min(window.innerHeight - tooltipRect.height - 16, y + offset.y));

    setTooltipPosition({ x, y });
  };

  const handleNext = async () => {
    if (currentStep.beforeNext) {
      const canProceed = await currentStep.beforeNext();
      if (!canProceed) return;
    }

    if (currentStepIndex < steps.length - 1) {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 200);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentStepIndex(prev => prev - 1);
      }, 200);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  const handleSkipTour = () => {
    setIsVisible(false);
    setTimeout(() => {
      onSkip();
    }, 200);
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          text: 'text-white',
          border: 'border-gray-700',
          button: 'bg-gray-700 hover:bg-gray-600 text-white',
          primaryButton: 'bg-white text-gray-900 hover:bg-gray-100'
        };
      case 'light':
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          border: 'border-gray-200',
          button: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
          primaryButton: 'bg-gray-900 text-white hover:bg-gray-700'
        };
      default:
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          border: 'border-primary/20',
          button: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
          primaryButton: 'bg-primary text-white hover:bg-primary-dark'
        };
    }
  };

  const themeClasses = getThemeClasses();

  if (!isActive || !currentStep) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Overlay */}
          {overlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              style={{ zIndex: 9998 }}
            >
              {/* Highlight cutout for target element */}
              {targetElement && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="absolute border-4 border-primary rounded-lg shadow-lg shadow-primary/30"
                  style={{
                    left: targetElement.getBoundingClientRect().left - (currentStep.highlightPadding || 8),
                    top: targetElement.getBoundingClientRect().top - (currentStep.highlightPadding || 8),
                    width: targetElement.getBoundingClientRect().width + 2 * (currentStep.highlightPadding || 8),
                    height: targetElement.getBoundingClientRect().height + 2 * (currentStep.highlightPadding || 8),
                    zIndex: 9999
                  }}
                />
              )}
            </motion.div>
          )}

          {/* Tooltip */}
          <AnimatePresence>
            {isVisible && (
              <motion.div
                ref={tooltipRef}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`fixed ${themeClasses.bg} ${themeClasses.text} ${themeClasses.border} border-2 rounded-xl shadow-2xl p-6 max-w-md z-50`}
                style={{
                  left: tooltipPosition.x,
                  top: tooltipPosition.y,
                  zIndex: 10000
                }}
              >
                {/* Close button */}
                <button
                  onClick={handleSkipTour}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Progress indicator */}
                {showProgress && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <span>Passo {currentStepIndex + 1} de {steps.length}</span>
                      <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-primary h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">{currentStep.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {currentStep.content}
                  </p>
                </div>

                {/* Custom component */}
                {currentStep.component && (
                  <div className="mb-6">
                    <currentStep.component onNext={handleNext} onSkip={handleSkipTour} />
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {allowBackNavigation && currentStepIndex > 0 && (
                      <button
                        onClick={handlePrevious}
                        className={`px-4 py-2 ${themeClasses.button} rounded-lg font-medium transition-colors flex items-center gap-1`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Anterior
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {currentStep.allowSkip !== false && (
                      <button
                        onClick={handleSkipTour}
                        className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium transition-colors flex items-center gap-1"
                      >
                        <Skip className="w-4 h-4" />
                        Pular
                      </button>
                    )}
                    
                    <button
                      onClick={handleNext}
                      className={`px-6 py-2 ${themeClasses.primaryButton} rounded-lg font-medium transition-colors flex items-center gap-1`}
                    >
                      {currentStepIndex === steps.length - 1 ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Concluir
                        </>
                      ) : (
                        <>
                          Próximo
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Arrow pointing to target (optional) */}
                {currentStep.position !== 'center' && (
                  <div
                    className={`absolute w-0 h-0 ${
                      currentStep.position === 'top' ? 'border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white bottom-[-8px] left-1/2 transform -translate-x-1/2' :
                      currentStep.position === 'bottom' ? 'border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white top-[-8px] left-1/2 transform -translate-x-1/2' :
                      currentStep.position === 'left' ? 'border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white right-[-8px] top-1/2 transform -translate-y-1/2' :
                      'border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white left-[-8px] top-1/2 transform -translate-y-1/2'
                    }`}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default GuidedTour;
