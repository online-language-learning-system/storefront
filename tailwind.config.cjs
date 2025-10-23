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
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        'fade-in-out': 'fadeInOut 2s ease-in-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInOut: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { opacity: '0', transform: 'scale(0.8)' },
        },
      },
    },
    fontFamily: {
      sans: ["Tahoma", "Arial", "sans-serif"],
      serif: ["Tahoma", "Arial", "sans-serif"],
    },
  },
  plugins: [],
});