/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18201d",
        paper: "#f5f6f2",
        moss: "#315c4b",
        mint: "#dce9df",
        line: "#e8eae5",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 35px rgba(32, 48, 39, 0.07)",
      },
    },
  },
  plugins: [],
};
