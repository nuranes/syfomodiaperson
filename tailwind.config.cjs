/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    screens: {
      md: "768px",
      "-md": { max: "767px" },
      lg: "1024px",
      "-lg": { max: "1023px" },
      xl: "1280px",
      "-xl": { max: "1279px" },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
