<script setup>
const cards = [
  {
    title: "有趣的活動",
    desc: "找不到想參加的活動？沒關係，自己發起也行！和同好一起展開精彩聚會。",
    image: "/images/activity.svg",
  },
  {
    title: "即時聊天",
    desc: "配對成功後立刻開啟專屬聊天室，輕鬆交流、不再錯過緣分。",
    image: "/images/chat.svg",
  },
  {
    title: "智能配對",
    desc: "依你的興趣與行為推薦合適對象，主動邀請你互動、建立連結。",
    image: "/images/match.svg",
  },
];
</script>

<template>
  <section
    class="flex flex-col items-center justify-between w-full min-h-screen gap-12 px-6 bg-white md:flex-row py-36 text-darkblue"
  >
    <!-- 左側文字區 -->
    <div class="w-full px-6 space-y-8 text-left md:w-1/2 md:px-28">
      <h2 class="text-4xl font-bold tracking-tight md:text-6xl">
        為什麼選擇我們？
        <br />
        <span
          class="block pt-2 pb-2 mt-4 text-4xl font-semibold text-primary md:text-5xl"
        >
          在這裡，找到真正契合的人
        </span>
      </h2>
      <p class="text-lg italic text-gray-500">
        Why choose us? More than just matches — we create meaningful connections
        that start from shared experiences.
      </p>
      <p class="text-base text-gray-600">
        不知道從哪開始也沒關係，我們讓你輕鬆踏出第一步。加入有趣的活動、展開即時對話、認識對的人，讓每一次相遇都更有意義。
      </p>
    </div>

    <!-- 右側卡片區 -->
    <div
      class="relative flex flex-col items-start w-full max-w-lg py-20 space-y-10 md:w-1/2 md:-ml-2"
    >
      <!-- 卡片們 -->
      <div
        v-for="(card, index) in cards"
        :key="card.title"
        class="relative z-10 flex flex-col items-center w-[90%] -ml-11 max-w-md p-6 text-center transition-all duration-500 border shadow-md bg-white/80 border-darkblue/20 rounded-xl hover:bg-primary/10 hover:shadow-xl hover:scale-105 hover:-translate-y-2 md:items-start md:text-left fade-in-up"
        :style="{ animationDelay: `${index * 0.3}s` }"
      >
        <h3 class="text-xl font-bold text-darkblue">{{ card.title }}</h3>
        <p class="mt-2 text-sm text-gray-800">{{ card.desc }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.floating {
  animation: float 3s ease-in-out infinite;
}
</style>
