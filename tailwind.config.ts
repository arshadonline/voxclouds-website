import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:    '#03070f',
          navy:    '#070e1c',
          card:    '#0d1b2e',
          border:  '#1a2e4a',
          cyan:    '#00d4ff',
          'cyan-light': '#67e8f9',
          blue:    '#2563eb',
          'blue-light': '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse at top, #0d2a4a 0%, #03070f 70%)',
        'cyan-glow': 'radial-gradient(ellipse at center, rgba(0,212,255,0.15) 0%, transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'draw': 'draw 3s ease-in-out infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        draw: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      boxShadow: {
        'cyan': '0 0 30px rgba(0, 212, 255, 0.3)',
        'cyan-sm': '0 0 15px rgba(0, 212, 255, 0.2)',
        'card': '0 4px 32px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}

export default config
