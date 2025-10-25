/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B4C9A',
        secondary: '#9D7BB5',
        accent: '#E8DFF5',
      },
    },
  },
  plugins: [],
}
