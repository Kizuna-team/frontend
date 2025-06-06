<template>
    <div
      class="fixed inset-0 z-50 flex flex-col items-center justify-center font-sans loading-screen"
    >
      <svg
        viewBox="0 0 800 200"
        class="w-[600px] h-auto"
        fill="none"
        stroke="white"
        stroke-width="2"
      >
        <text
          x="50%"
          y="50%"
          text-anchor="middle"
          dominant-baseline="middle"
          font-size="150"
          font-family="'Baloo 2', cursive"
          class="draw-text"
        >
          KIZUNA
        </text>
      </svg>
    </div>
  </template>
  
  <style scoped>
  /* 背景漸層動畫 */
  @keyframes gradient-move {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  .loading-screen {
    background: linear-gradient(-45deg, #1e1e2f, #273c75, #009688, #1e1e2f);
    background-size: 600% 600%;
    animation: gradient-move 10s ease infinite;
  }
  
  /* 文字動畫 */
  @keyframes draw-stroke {
    to {
      stroke-dashoffset: 0;
    }
  }
  
  @keyframes fill-in {
    from {
      fill: transparent;
    }
    to {
      fill: white;
    }
  }
  
  .draw-text {
    stroke: white;
    fill: transparent;
    stroke-dasharray: 1200;
    stroke-dashoffset: 1200;
    animation: draw-stroke 2.5s ease forwards, fill-in 1s ease forwards;
    animation-delay: 0s, 2.5s;
    animation-fill-mode: forwards;
  }
  
  .rotate-icon {
    animation: rotate 2s linear infinite;
  }
  </style>
  