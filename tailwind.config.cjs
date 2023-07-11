/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "hsl(0deg 0% 8%)",
        netflixRed: "#e50a14"
      },
      animation: {
        "slide-rtl": "slides-rtl .5s ease-in-out",
      },
      keyframes: {
        "slides-rtl": {
          from: { "margin-right": "-90%" },
          to: { "margin-right": "0%" },
        },
        "lodder":{
          from :{"transform": "rotate(0deg)"},
          to: {"transform": "rotate(360deg)"}
        }
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
