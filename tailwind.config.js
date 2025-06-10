export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        xxs: "0.65rem",
      },
      fontFamily: {
        sans: [
          "Poppins",
          "Zen Kaku Gothic New",
          "Nunito",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        primary: "#8ecae6",
        secondary: "#219ebc",
        darkblue: "#023047",
        accent: "#ffb703",
        orange: "#fb8500",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s ease-out both",
      },
    },
  },
  plugins: [],
};
