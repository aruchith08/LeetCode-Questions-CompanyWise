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
          'navy-dark': '#0B132B',
          'navy-surface': '#111C3D',
          'navy-hover': '#16244E',
          'navy-border': '#1E2E5C',
          amber: '#F5A524',
          'amber-hover': '#E0921B',
          'amber-subtle': 'rgba(245, 165, 36, 0.12)',
        },
        accent: {
          DEFAULT: '#0F1B3D',
          hover: '#1A2D5E',
          subtle: 'rgba(15, 27, 61, 0.08)',
          amber: '#F5A524',
        },
        surface: {
          DEFAULT: '#111C3D',
          subtle: '#142044',
          muted: '#1A2954',
          border: '#1E2E5C',
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
