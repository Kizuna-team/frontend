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
  background: linear-gradient(-45deg, #000000, #023047, #1b2b34, #0f0f0f);
  background-size: 600% 600%;
  animation: gradient-move 10s ease infinite, mask-reveal 3s ease forwards,
    slide-up-fade-out 0.8s ease forwards;
  animation-delay: 0s, 0s, 2.5s;
  animation-fill-mode: forwards;

  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 50%,
    transparent 100%
  );

  -webkit-mask-size: 200% 100%;
  -webkit-mask-position: 0% 0%;
  -webkit-mask-repeat: no-repeat;
}

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
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  fill: transparent;
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  animation: draw-stroke 1.5s ease forwards, fill-in 0.4s ease forwards;
  animation-delay: 0s, 1.6s;
  animation-fill-mode: forwards;
  transform-origin: center;
}

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

@keyframes mask-reveal {
  0% {
    -webkit-mask-position: 0% 0%;
  }
  100% {
    -webkit-mask-position: 100% 0%;
  }
}

@media (max-width: 768px) {
  svg {
    width: 90% !important;
  }

  .draw-text {
    font-size: 80px;
    stroke-dasharray: 800;
    stroke-dashoffset: 800;
  }
}

@media (max-width: 480px) {
  .draw-text {
    font-size: 60px;
    stroke-dasharray: 600;
    stroke-dashoffset: 600;
  }
}
</style>
