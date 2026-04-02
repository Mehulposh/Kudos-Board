// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        cream: { 
          50: '#FFFEF9', 
          100: '#FFF9ED', 
          200: '#FFF1D0', 
          300: '#FFE5A8' 
        },
        ink: { 
          900: '#18120E', 
          800: '#2A1F18', 
          700: '#3D2E25', 
          600: '#5A4438', 
          400: '#8A7065', 
          200: '#C9B9B2', 
          100: '#E8DDD9' 
        },
        gold: { 
          300: '#FBDE8A', 
          400: '#F5C842', 
          500: '#E6B020', 
          600: '#C9950E' 
        },
        coral: { 
          400: '#FF8C7A', 
          500: '#FF6B55', 
          600: '#E5523C' 
        },
        sage: { 
          400: '#96C2A0', 
          500: '#74AB80', 
          600: '#579466' 
        },
        blush: { 
          400: '#F2A7B8', 
          500: '#E8879C', 
          600: '#D46880' 
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'float': 'float 4s ease-in-out infinite',
        'confetti-fall': 'confettiFall 1.4s linear forwards',
      },
      keyframes: {
        fadeIn: { 
          '0%': { opacity: '0' }, 
          '100%': { opacity: '1' } 
        },
        slideUp: { 
          '0%': { opacity: '0', transform: 'translateY(24px)' }, 
          '100%': { opacity: '1', transform: 'translateY(0)' } 
        },
        scaleIn: { 
          '0%': { opacity: '0', transform: 'scale(0.85)' }, 
          '100%': { opacity: '1', transform: 'scale(1)' } 
        },
        float: { 
          '0%,100%': { transform: 'translateY(0px)' }, 
          '50%': { transform: 'translateY(-10px)' } 
        },
        confettiFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: 1 },
          '100%': { transform: 'translateY(105vh) rotate(600deg)', opacity: 0 }
        }
      },
      boxShadow: {
        'kudo': '0 8px 28px rgba(24,18,14,0.08)',
        'kudo-hover': '0 12px 36px rgba(24,18,14,0.1)',
      }
    },
  },
  plugins: [],
}