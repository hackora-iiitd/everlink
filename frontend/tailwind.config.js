/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Everlink palette
        'forest-green': '#135106',   // primary
        teal: '#2A7F7B',             // secondary / accents
        buttermilk: '#E2B407',       // highlight / CTA accent
        'cream-surface': '#DCF6F4',  // soft surface
        'midnight-blue': '#053464',  // headings / depth
        'white-surface': '#FFFFFF',
        ink: '#212529',              // body text
        violet: '#6D28D9',
        'violet-hover': '#5B21B6',
        'violet-active': '#4C1D95',

        // Legacy aliases used by existing pages (Search, Profile)
        'muted-ink': '#2A7F7B',
        'border-rule': '#DCF6F4',
        success: '#135106',
        warning: '#E2B407',
        error: '#212529',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Open Sans', 'sans-serif'],
        serif: ['Open Sans', 'sans-serif'],
        sans: ['Open Sans', 'sans-serif'],
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.55' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 3s ease-out infinite',
      },
    },
  },
  plugins: [],
}
