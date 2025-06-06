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
        fill="transparent"
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

/* loading 畫面主樣式 */
.loading-screen {
  background: linear-gradient(-45deg, #023047, #219ebc, #8ecae6, #ffb703);
  background-size: 600% 600%;
  animation: gradient-move 10s ease infinite, slide-up-fade-out 1s ease forwards;
  animation-delay: 0s, 6s; /* 第一個是背景，第二個是離場 */
  animation-fill-mode: forwards;

  /* 加遮罩漸變效果 */
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 50%,
    transparent 100%
  );

  /* 遮罩漸層效果 */
  -webkit-mask-size: 200% 100%;
  -webkit-mask-position: 0% 0%;
  -webkit-mask-repeat: no-repeat;
  animation: gradient-move 10s ease infinite, mask-reveal 4s ease forwards,
    slide-up-fade-out 1s ease forwards;
  animation-delay: 0s, 0s, 6s;
}

/* 文字動畫 */
@keyframes draw-stroke {
  to {
    stroke-dashoffset: 0;
  }
}

/* 填色動畫 */
@keyframes fill-in {
  from {
    fill: transparent;
  }
  to {
    fill: white;
  }
}

/* 文字動畫設定 */
.draw-text {
  stroke: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  fill: transparent;
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  animation: draw-stroke 4s ease forwards, scale-up 1s ease forwards,
    fill-in 1s ease forwards;
  animation-delay: 0s, 4s, 5s;
  animation-fill-mode: forwards;
  transform-origin: center;
}

/* 畫面淡出 + 上滑動畫 */
@keyframes slide-up-fade-out {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-100%);
  }
}

/* 遮罩動畫 */
@keyframes mask-reveal {
  0% {
    -webkit-mask-position: 0% 0%;
  }
  100% {
    -webkit-mask-position: 100% 0%;
  }
}

/* 文字放大動畫 */
@keyframes scale-up {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.15); /* 放大15% */
  }
}
</style>
