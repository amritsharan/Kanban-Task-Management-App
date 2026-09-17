/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        burnout: {
          light: '#fef2f2',
          DEFAULT: '#ef4444',
          dark: '#991b1b',
          glow: 'rgba(239, 68, 68, 0.7)'
        }
      },
      animation: {
        'pulse-burnout': 'burnoutPulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'subtle-bounce': 'subtleBounce 2s ease-in-out infinite',
      },
      keyframes: {
        burnoutPulse: {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.8), 0 0 20px 4px rgba(239, 68, 68, 0.4)',
            borderColor: '#ef4444'
          },
          '50%': {
            transform: 'scale(1.08)',
            boxShadow: '0 0 0 10px rgba(239, 68, 68, 0), 0 0 30px 8px rgba(239, 68, 68, 0.7)',
            borderColor: '#dc2626'
          }
        },
        subtleBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' }
        }
      }
    },
  },
  plugins: [],
}
