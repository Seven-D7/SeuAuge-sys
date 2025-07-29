// Design System Constants and Utilities for HealthFlix

export const DESIGN_TOKENS = {
  // Colors
  colors: {
    primary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6', // Primary
      600: '#0d9488', // Primary Dark
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
    secondary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981', // Emerald
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    accent: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  // Spacing
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    glow: '0 0 20px rgb(20 184 166 / 0.5)',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-Index
  zIndex: {
    hide: '-1',
    auto: 'auto',
    base: '0',
    docked: '10',
    dropdown: '1000',
    sticky: '1100',
    banner: '1200',
    overlay: '1300',
    modal: '1400',
    popover: '1500',
    skipLink: '1600',
    toast: '1700',
    tooltip: '1800',
  },

  // Animation
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
} as const;

// Component Variants
export const COMPONENT_VARIANTS = {
  button: {
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    },
    variant: {
      primary: 'bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-600 text-white',
      secondary: 'bg-neutral-600 hover:bg-neutral-500 text-white',
      outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
      ghost: 'text-primary hover:bg-primary/10',
      danger: 'bg-error-500 hover:bg-error-600 text-white',
    },
  },
  card: {
    variant: {
      default: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-md',
      elevated: 'bg-white dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow',
      glass: 'bg-white/10 backdrop-blur-md border border-white/20 rounded-xl',
      gradient: 'bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-xl backdrop-blur-sm',
    },
  },
  input: {
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    },
    variant: {
      default: 'bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent',
      glass: 'bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent',
    },
  },
} as const;

// Glass Morphism Utilities
export const GLASS_STYLES = {
  light: 'bg-white/20 backdrop-blur-md border border-white/30',
  medium: 'bg-white/10 backdrop-blur-md border border-white/20',
  dark: 'bg-black/20 backdrop-blur-md border border-white/10',
  primary: 'bg-primary/20 backdrop-blur-md border border-primary/30',
  success: 'bg-success-400/20 backdrop-blur-md border border-success-400/30',
  warning: 'bg-warning-400/20 backdrop-blur-md border border-warning-400/30',
  error: 'bg-error-400/20 backdrop-blur-md border border-error-400/30',
} as const;

// Gradient Utilities
export const GRADIENTS = {
  primary: 'bg-gradient-to-r from-primary to-secondary',
  primaryVertical: 'bg-gradient-to-b from-primary to-secondary',
  primaryDiagonal: 'bg-gradient-to-br from-primary to-secondary',
  dark: 'bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900',
  rainbow: 'bg-gradient-to-r from-primary via-secondary to-accent-500',
  sunset: 'bg-gradient-to-r from-warning-400 to-error-500',
  ocean: 'bg-gradient-to-r from-accent-400 to-primary',
  forest: 'bg-gradient-to-r from-success-400 to-secondary',
} as const;

// Utility functions
export const designUtils = {
  // Get color value
  getColor: (colorPath: string): string => {
    const keys = colorPath.split('.');
    let value: any = DESIGN_TOKENS.colors;
    
    for (const key of keys) {
      value = value[key];
      if (!value) return colorPath;
    }
    
    return value;
  },

  // Generate responsive classes
  responsive: (classes: Record<string, string>): string => {
    return Object.entries(classes)
      .map(([breakpoint, className]) => 
        breakpoint === 'base' ? className : `${breakpoint}:${className}`
      )
      .join(' ');
  },

  // Create component classes
  createComponentClasses: (
    component: keyof typeof COMPONENT_VARIANTS,
    variant: string,
    size?: string,
    additionalClasses?: string
  ): string => {
    const componentVariants = COMPONENT_VARIANTS[component];
    const classes = [];

    if ('variant' in componentVariants && componentVariants.variant[variant as keyof typeof componentVariants.variant]) {
      classes.push(componentVariants.variant[variant as keyof typeof componentVariants.variant]);
    }

    if (size && 'size' in componentVariants && componentVariants.size[size as keyof typeof componentVariants.size]) {
      classes.push(componentVariants.size[size as keyof typeof componentVariants.size]);
    }

    if (additionalClasses) {
      classes.push(additionalClasses);
    }

    return classes.join(' ');
  },

  // Glass morphism helper
  glass: (variant: keyof typeof GLASS_STYLES = 'medium'): string => {
    return GLASS_STYLES[variant];
  },

  // Gradient helper
  gradient: (variant: keyof typeof GRADIENTS = 'primary'): string => {
    return GRADIENTS[variant];
  },

  // Animation classes
  animation: {
    fadeIn: 'animate-in fade-in duration-300',
    fadeOut: 'animate-out fade-out duration-300',
    slideInUp: 'animate-in slide-in-from-bottom-4 duration-300',
    slideInDown: 'animate-in slide-in-from-top-4 duration-300',
    slideInLeft: 'animate-in slide-in-from-left-4 duration-300',
    slideInRight: 'animate-in slide-in-from-right-4 duration-300',
    scaleIn: 'animate-in zoom-in-95 duration-300',
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
  },

  // Common transition classes
  transition: {
    all: 'transition-all duration-300 ease-in-out',
    colors: 'transition-colors duration-300 ease-in-out',
    transform: 'transition-transform duration-300 ease-in-out',
    opacity: 'transition-opacity duration-300 ease-in-out',
    shadow: 'transition-shadow duration-300 ease-in-out',
  },
} as const;

// Theme configuration
export const THEME_CONFIG = {
  light: {
    background: 'bg-neutral-50',
    surface: 'bg-white',
    text: {
      primary: 'text-neutral-900',
      secondary: 'text-neutral-600',
      muted: 'text-neutral-400',
    },
    border: 'border-neutral-200',
  },
  dark: {
    background: 'bg-neutral-900',
    surface: 'bg-neutral-800',
    text: {
      primary: 'text-white',
      secondary: 'text-neutral-300',
      muted: 'text-neutral-500',
    },
    border: 'border-neutral-700',
  },
} as const;

// Export commonly used classes
export const COMMON_CLASSES = {
  // Layout
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-12 sm:py-16 lg:py-20',
  grid: {
    responsive: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
    cards: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  },

  // Typography
  heading: {
    h1: 'text-3xl sm:text-4xl lg:text-5xl font-bold',
    h2: 'text-2xl sm:text-3xl lg:text-4xl font-bold',
    h3: 'text-xl sm:text-2xl lg:text-3xl font-semibold',
    h4: 'text-lg sm:text-xl lg:text-2xl font-semibold',
  },

  // Interactive elements
  focus: 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  hover: 'hover:scale-105 transition-transform duration-200',
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',

  // Status indicators
  loading: 'animate-pulse bg-neutral-200 dark:bg-neutral-700',
  error: 'text-error-500 bg-error-50 border-error-200',
  success: 'text-success-700 bg-success-50 border-success-200',
  warning: 'text-warning-700 bg-warning-50 border-warning-200',
} as const;

export default {
  DESIGN_TOKENS,
  COMPONENT_VARIANTS,
  GLASS_STYLES,
  GRADIENTS,
  THEME_CONFIG,
  COMMON_CLASSES,
  designUtils,
};
