/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slack: {
          sidebar: "#3F0E40",
          hover: "#350d36",
          active: "#1164A3",
          border: "#E2E8F0"
        }
      }
    },
  },
  plugins: [],
}
