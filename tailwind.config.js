/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Subtle brand accent used across the app.
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd2ff',
          300: '#8eb4ff',
          400: '#598bff',
          500: '#3366ff',
          600: '#2048f5',
          700: '#1a37e1',
          800: '#1c30b6',
          900: '#1d2f8f',
        },
      },
    },
  },
  plugins: [],
};
