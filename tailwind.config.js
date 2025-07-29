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
        'emagrecimento-start': '#3b82f6',
        'emagrecimento-end': '#1d4ed8',
        'ganho-start': '#22c55e',
        'ganho-end': '#059669',
        'recomposicao-start': '#0891b2',
        'recomposicao-end': '#0e7490',
        'performance-start': '#10b981',
        'performance-end': '#047857',
      },
    },
  },
  plugins: [],
};
