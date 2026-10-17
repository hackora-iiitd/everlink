/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        buttermilk: '#FFF2BA',
        'midnight-blue': '#0F3C65',
        'cream-surface': '#FFF9E3',
        ink: '#15283B',
        'muted-ink': '#5D6A75',
        'border-rule': '#D8D1B6',
        'white-surface': '#FFFEF8',
        success: '#456B52',
        warning: '#946D2D',
        error: '#9A4747',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
