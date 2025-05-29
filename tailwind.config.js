export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:{
        100:'#7395BA', // 主色調
        200:'#C0D7EC'  // 次要色
        }        

      },
    },
  },
  plugins: [],
};
