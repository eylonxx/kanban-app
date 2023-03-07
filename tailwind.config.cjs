/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        right: "10px 0px 24px -8px rgba(0,0,0,0.6)",
        taskCard: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      },
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
      white: "#fff",
      red: "#ea5555",
      redHover: "#ff9898",
      inputBorder: "#404552",
    },
  },
  plugins: [require("daisyui")],
};

module.exports = config;
