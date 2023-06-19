/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  content: [],
  theme: {
    extend: {
      dropShadow: {
        "3xl": "0 0 2em #33333349",
      },
    },
  },
  plugins: [],
};
