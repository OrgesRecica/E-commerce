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
          DEFAULT: '#0A0A0F',
          800: '#12121A',
          700: '#1A1A24',
          600: '#24242F',
          500: '#2E2E3B',
        },
        bone: {
          DEFAULT: '#F5F5F0',
          200: '#E8E8E0',
          300: '#C9C9C0',
        },
        muted: '#8A8A99',
        lime: {
          DEFAULT: '#D4FF4B',
          600: '#B8E838',
          700: '#9BC924',
        },
        violet: {
          DEFAULT: '#7C5CFF',
          600: '#6544FF',
        },
        coral: '#FF6B5B',
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.04em', fontWeight: '700' }],
        'display-lg': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-md': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '600' }],
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(40px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        blob: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(30px,-40px) scale(1.1)' },
          '66%': { transform: 'translate(-20px,20px) scale(0.95)' },
        },
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
        blob: 'blob 18s ease-in-out infinite',
      },
      boxShadow: {
        glow: '0 0 60px -15px rgba(212,255,75,0.5)',
        'glow-violet': '0 0 80px -20px rgba(124,92,255,0.6)',
      },
    },
  },
  plugins: [],
};
