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
        vault: {
          bg: '#0B0F1A',
          card: '#121829',
          'card-hover': '#1A233A',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-bright': 'rgba(255, 255, 255, 0.18)',
          violet: '#6C63FF',
          cyan: '#00D1FF',
          orange: '#FF7A50',
          green: '#34D399',
          muted: '#94A3B8',
          subtle: '#64748B',
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow-violet': '0 0 25px -5px rgba(108, 99, 255, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(0, 209, 255, 0.4)',
        'glow-orange': '0 0 25px -5px rgba(255, 122, 80, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse at top, rgba(108, 99, 255, 0.15) 0%, rgba(0, 209, 255, 0.05) 50%, rgba(11, 15, 26, 0) 100%)',
        'orb-gradient': 'radial-gradient(circle at 35% 35%, #00D1FF 0%, #6C63FF 45%, #121829 85%)',
        'glass-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'orb-pulse': 'orbPulse 3s ease-in-out infinite',
        'waveform': 'waveform 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(12px)' },
        },
        orbPulse: {
          '0%, 100%': { boxShadow: '0 0 35px 5px rgba(108, 99, 255, 0.5), inset 0 0 20px rgba(0, 209, 255, 0.6)' },
          '50%': { boxShadow: '0 0 60px 15px rgba(0, 209, 255, 0.7), inset 0 0 30px rgba(108, 99, 255, 0.8)' },
        },
        waveform: {
          '0%': { height: '10%' },
          '100%': { height: '100%' },
        }
      }
    },
  },
  plugins: [],
}
