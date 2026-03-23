import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0effe',
          100: '#e4e2fd',
          200: '#ccc8fb',
          300: '#ada6f7',
          400: '#8b80f1',
          500: '#6f5ee8',
          600: '#534AB7',
          700: '#4a3fa0',
          800: '#3d3582',
          900: '#342e6b',
        },
        safety: {
          50: '#f0fdf4',
          500: '#22C55E',
          600: '#16a34a',
        },
        coral: '#FF6B6B',
        orange: '#FF8E53',
        gold: '#FFC837',
        purple: '#764ba2',
        teal: '#11998e',
        mint: '#38ef7d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        float: 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glow-coral': '0 0 40px rgba(255, 107, 107, 0.3)',
        'glow-purple': '0 0 40px rgba(118, 75, 162, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
