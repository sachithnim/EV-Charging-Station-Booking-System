/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf4", // very light mint green
          100: "#dcfce7", // pale green
          200: "#bbf7d0", // soft leafy green
          300: "#86efac", // light grass green
          400: "#4ade80", // bright green (fresh, energetic)
          500: "#22c55e", // main brand green (balanced and modern)
          600: "#16a34a", // slightly darker for hover states
          700: "#15803d", // rich green for active states
          800: "#166534", // deep green for contrast
          900: "#14532d", // darkest tone, good for text on light bg
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
