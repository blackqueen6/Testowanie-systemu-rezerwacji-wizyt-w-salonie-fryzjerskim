/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './index.html',
    './components/**/*.{html,js}',
    './pages/**/*.{html,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'libre': ['"Libre Baskerville"', 'serif'],
      },
      screens: {
        'custom-lg': '1025px',
      },
    },
  },
  plugins: [],
}
