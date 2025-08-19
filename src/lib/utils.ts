export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ').trim();
}

// Security utility functions
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// Duration formatting utility
export function formatDuration(duration: string | number, format: 'full' | 'short' = 'full'): string {
  if (typeof duration === 'string') {
    return duration;
  }

  // Convert seconds to mm:ss format
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  if (format === 'short') {
    return `${minutes}m`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
