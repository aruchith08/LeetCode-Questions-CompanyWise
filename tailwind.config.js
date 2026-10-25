/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          navy: '#0F1B3D',
          amber: '#F5A524',
          'amber-hover': '#E0921B',
          'amber-subtle': 'rgba(245, 165, 36, 0.12)',
        },
        dark: {
          bg: '#262624',
          surface: '#30302E',
          soft: '#1F1E1D',
          text: '#FAF9F5',
          muted: '#A8A69C',
          border: '#43433F',
          accent: '#D97757',
          easy: '#8FBF78',
          medium: '#E0B14F',
          hard: '#EE8F78',
        },
        accent: {
          DEFAULT: '#0F1B3D',
          hover: '#1A2D5E',
          subtle: 'rgba(15, 27, 61, 0.08)',
          amber: '#F5A524',
          terracotta: '#D97757',
        },
        surface: {
          DEFAULT: '#30302E',
          soft: '#1F1E1D',
          border: '#43433F',
        },
      },
      borderRadius: {
        'card': '8px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
