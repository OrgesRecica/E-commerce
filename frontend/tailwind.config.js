/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#f4f8ff',
          800: '#ffffff',
          700: '#eaf2ff',
          600: '#d7e6fb',
          500: '#abc1df',
        },
        bone: {
          DEFAULT: '#071f45',
          200: '#12305c',
          300: '#4e617d',
        },
        muted: '#6e7f96',
        orange: {
          DEFAULT: '#ff7a1a',
          600: '#e86200',
          700: '#bd4f00',
        },
        lime: {
          DEFAULT: '#ff7a1a',
          600: '#e86200',
          700: '#bd4f00',
        },
        violet: {
          DEFAULT: '#1f62b7',
          600: '#164c91',
        },
        navy: {
          DEFAULT: '#082b5f',
          800: '#061f49',
          900: '#031630',
        },
        sage: { DEFAULT: '#256ec6', 600: '#164f98' },
        coral: '#c94f2c',
      },
      fontSize: {
        'display-2xl': ['3rem', { lineHeight: '1', letterSpacing: '0', fontWeight: '600' }],
        'display-xl': ['2.6rem', { lineHeight: '1.04', letterSpacing: '0', fontWeight: '600' }],
        'display-lg': ['2.2rem', { lineHeight: '1.08', letterSpacing: '0', fontWeight: '600' }],
        'display-md': ['1.85rem', { lineHeight: '1.12', letterSpacing: '0', fontWeight: '600' }],
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(40px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'slide-up': { '0%': { transform: 'translateY(110%)' }, '100%': { transform: 'translateY(0)' } },
        breathe: { '0%, 100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.04)' } },
        'rotate-slow': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        'caret-blink': { '0%, 50%': { opacity: 1 }, '50.01%, 100%': { opacity: 0 } },
        'gradient-pan': { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        'tick-up': { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        'underline-in': { '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
        'mask-wipe': { '0%': { clipPath: 'inset(0 100% 0 0)' }, '100%': { clipPath: 'inset(0 0 0 0)' } },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'marquee-fast': 'marquee 22s linear infinite',
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.7s ease-out both',
        'slide-up': 'slide-up 0.9s cubic-bezier(0.22,1,0.36,1) both',
        breathe: 'breathe 6s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 22s linear infinite',
        caret: 'caret-blink 1s steps(1) infinite',
        'gradient-pan': 'gradient-pan 14s ease-in-out infinite',
        'mask-wipe': 'mask-wipe 1.1s cubic-bezier(0.77,0,0.18,1) both',
      },
      boxShadow: {
        glow: '0 20px 52px -26px rgba(255,122,26,0.58)',
        'glow-navy': '0 20px 52px -26px rgba(8,43,95,0.45)',
        soft: '0 30px 90px -48px rgba(7,31,69,0.36)',
        card: '0 18px 52px -34px rgba(7,31,69,0.28)',
        rim: 'inset 0 0 0 1px rgba(7,31,69,0.08)',
      },
    },
  },
  plugins: [],
};
