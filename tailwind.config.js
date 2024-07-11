/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#494949",
        "secondary": "#252525",
      },
      borderRadius: {
        "card": "8px 0px 142px 8px",
      },
    },
  },
  plugins: [],
}