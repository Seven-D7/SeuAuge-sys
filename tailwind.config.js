/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d9488',
          dark: '#0f766e',
        },
        'emagrecimento-start': '#ef4444',
        'emagrecimento-end': '#ec4899',
        'ganho-start': '#22c55e',
        'ganho-end': '#059669',
        'recomposicao-start': '#a855f7',
        'recomposicao-end': '#7c3aed',
        'performance-start': '#f97316',
        'performance-end': '#dc2626',
      },
    },
  },
  plugins: [],
};
