<template>
  <section class="relative w-full h-screen overflow-hidden">
    <!-- 背景影片 -->
    <video
      id="hero-video"
      class="absolute inset-0 z-0 object-cover w-full h-full"
      autoplay
      muted
      loop
      playsinline
      src="/hero.mp4"
      type="video/mp4"
    ></video>

    <!-- 漸層遮罩 -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-[1] opacity-0 animate-fade-in delay-300"
    ></div>

    <!-- 文字區塊 -->
    <div
      class="absolute inset-0 z-[2] flex flex-col justify-center h-full px-6 text-left text-white md:pl-[10%] md:items-start md:max-w-[50%] items-center text-center md:text-left"
    >
      <h1
        class="mb-6 text-4xl md:text-7xl font-extrabold leading-tight md:leading-[1.2] tracking-wide opacity-0 animate-slide-up"
      >
        每段相遇，
        <br />
        <span class="block mt-2 animate-slide-up-delay">都藏著一條羈絆</span>
      </h1>
      <p
        class="mb-8 text-xl leading-relaxed opacity-0 md:text-2xl drop-shadow-sm animate-fade-in-delay"
      >
        <span class="font-bold text-primary">Real connections,</span>
        <span class="font-bold text-accent"> heartfelt beginnings.</span>
      </p>
      <button
        class="relative px-16 py-4 overflow-hidden text-xl font-semibold text-black transition duration-300 bg-white rounded-full opacity-0 group hover:scale-105 animate-bounce-in"
      >
        <!-- 中文＋英文 -->
        <span class="relative z-10 transition-colors duration-300">
          開始旅程<br />
          <small class="text-sm font-normal">Get Started</small>
        </span>

        <!-- 底色滑動層 -->
        <span
          class="absolute inset-0 bg-[#fb8500] translate-y-full transition-transform duration-500 ease-in-out rounded-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
        ></span>
      </button>
    </div>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 1.5s ease-in-out forwards;
}

.animate-fade-in-delay {
  animation: fade-in 1.5s ease-in-out 0.8s forwards;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 1.2s ease-out forwards;
}

.animate-slide-up-delay {
  animation: slide-up 1.2s ease-out 0.4s forwards;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounce-in 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1.2s forwards;
}

button:hover > span:first-child {
  color: white;
}
</style>
