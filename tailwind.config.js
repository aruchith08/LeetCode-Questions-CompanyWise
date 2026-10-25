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
          bg: '#111215',
          surface: '#17191E',
          elevated: '#1E2027',
          hover: '#252832',
          border: '#282B35',
        },
        accent: {
          DEFAULT: '#0F1B3D',
          hover: '#1A2D5E',
          subtle: 'rgba(15, 27, 61, 0.08)',
          amber: '#F5A524',
        },
        surface: {
          DEFAULT: '#17191E',
          subtle: '#1E2027',
          muted: '#252832',
          border: '#282B35',
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
