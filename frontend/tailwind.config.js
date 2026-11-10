/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        paper: "#f7f7f7",
        moss: "#171717",
        mint: "#fff3bd",
        line: "#eeeeee",
        sunny: "#ffc900",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      borderRadius: {
        xl: "1.125rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 12px 36px rgba(20, 20, 20, 0.08)",
      },
    },
  },
  plugins: [],
};
