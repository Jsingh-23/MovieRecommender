/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'netflix': ['"Bebas Neue"', 'cursive'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}