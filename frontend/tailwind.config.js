/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Nunito', 'sans-serif'] },
      colors: {
        brand: { 400: '#f87171', 500: '#ef5555', 600: '#e04545', 700: '#c73d3d' },
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.25rem' },
    },
  },
  plugins: [],
};
