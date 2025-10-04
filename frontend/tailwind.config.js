/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e9edff',
          200: '#cdd8ff',
          300: '#a9bbff',
          400: '#7f95ff',
          500: '#5c73ff',
          600: '#4657d9',
          700: '#3946ad',
          800: '#2f3a8a',
          900: '#293370',
        },
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.18)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
