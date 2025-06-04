export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8ecae6",
          100: "#7395BA", // 主色調
          200: "#C0D7EC", // 次要色
        },
        secondary: "#219ebc",
        darkblue: "#023047",
        accent: "#ffb703",
        orange: "#fb8500",
      },
    },
  },
  plugins: [],
};
