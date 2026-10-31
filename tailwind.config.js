/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ---------- Tokens de Cores — Professor do Futuro ----------
      colors: {
        brand: {
          deep: '#0b3d2e',
          deepRgb: '11, 61, 46',
          gold: '#c9971c',
          goldRgb: '201, 151, 28',
          teal: '#0f9d72',
          tealRgb: '15, 157, 114',
          ink: '#0f2a1e',
          inkRgb: '15, 42, 30',
          mute: '#5c6850',
          paper: '#f6f8ee',
          paperSoft: '#eef3e4',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.72)',
          medium: 'rgba(255, 255, 255, 0.55)',
          dark: 'rgba(255, 255, 255, 0.40)',
          border: 'rgba(255, 255, 255, 0.35)',
          borderWeak: 'rgba(255, 255, 255, 0.18)',
          shadow: '0 24px 60px -12px rgba(0, 0, 0, 0.14)',
          shadowSm: '0 10px 30px -6px rgba(0, 0, 0, 0.08)',
        },
      },
      // ---------- Tipografia ----------
      fontFamily: {
        body: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        head: ['"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Cascadia Code"', 'Consolas', 'monospace'],
      },
      // ---------- Border Radius ----------
      borderRadius: {
        lg: '28px',
        md: '20px',
        sm: '12px',
        pill: '9999px',
      },
      // ---------- Sombras ----------
      boxShadow: {
        glass: '0 24px 60px -12px rgba(0, 0, 0, 0.14)',
        'glass-sm': '0 10px 30px -6px rgba(0, 0, 0, 0.08)',
        'glass-lg': '0 30px 70px -15px rgba(0, 0, 0, 0.18)',
      },
      // ---------- Animações ----------
      animation: {
        float: 'float 6s ease-in-out infinite',
        'bg-pan': 'bgPan 28s ease-in-out infinite alternate',
        shimmer: 'shimmer 0.8s ease-in-out',
        'pulse-ring': 'pulseRing 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        bgPan: {
          '0%': { transform: 'translate3d(-1.5%, -1%, 0) rotate(-1deg)' },
          '100%': { transform: 'translate3d(1.5%, 1%, 0) rotate(1deg)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(15, 157, 114, 0.4)' },
          '70%': { boxShadow: '0 0 0 14px rgba(15, 157, 114, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(15, 157, 114, 0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '12px',
        md: '16px',
        lg: '20px',
        xl: '24px',
        '2xl': '32px',
      },
    },
  },
  plugins: [],
}
