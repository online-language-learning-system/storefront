/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bevietnam: ["'Be Vietnam Pro'", "sans-serif"],
        tahoma: ["Tahoma", "Arial", "sans-serif"],
      },
    },
    fontFamily: {
      sans: ["Tahoma", "Arial", "sans-serif"],
      serif: ["Tahoma", "Arial", "sans-serif"],
    },
  },
  plugins: [],
});