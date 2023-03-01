/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        width: "width",
      },
    },
    colors: {
      mainPurple: "#635FC7",
      mainPurpleHover: "#A8A4FF",
      black: "#000112",
      veryDarkGrey: "#20212C",
      darkGrey: "#2b2c37",
      darkLines: "#3e3f4e",
      mediumGrey: "#828fa3",
      lightLines: "#e4ebfa",
      lightGrey: "#f4f7fd",
      white:'#fff',
      red: "#ea5555",
      redHover: "#ff9898",
    },
  },
  plugins: [require("daisyui")],
};

module.exports = config;
