/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#080f1e',
          900: '#0f172a',
          800: '#1e293b',
          700: '#253348',
        },
        gold: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        levelup: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulse_glow: {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(245,158,11,0.3)' },
          '50%': { boxShadow: '0 0 20px 6px rgba(245,158,11,0.7)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        levelup: 'levelup 0.5s ease-out forwards',
        pulse_glow: 'pulse_glow 2s ease-in-out infinite',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}

