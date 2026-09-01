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
        artisan: {
          terracotta: '#D95D39',
          'terracotta-dark': '#B54424',
          'terracotta-light': '#F6E6DF',
          saffron: '#FF9933',
          'saffron-gold': '#E67E22',
          indigo: '#1B2A4A',
          'indigo-dark': '#0E1726',
          'indigo-light': '#2D4473',
          sand: '#FAF6F0',
          'sand-dark': '#EFE7DA',
          clay: '#8D5B4C',
          forest: '#2C5E43',
          marigold: '#F5B041',
          copper: '#C36B3C',
          slate: '#334155'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        handwriting: ['"Caveat"', 'cursive']
      },
      boxShadow: {
        'craft': '0 10px 30px -10px rgba(217, 93, 57, 0.15), 0 4px 12px -2px rgba(27, 42, 74, 0.08)',
        'craft-hover': '0 20px 40px -15px rgba(217, 93, 57, 0.25), 0 8px 20px -4px rgba(27, 42, 74, 0.12)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
