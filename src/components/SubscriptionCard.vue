<script setup>
const props = defineProps({
  title: String,
  price: String,
  icon: {
    type: [Object, Function],
    required: true,
  },
  description: String,
  features: Array,
  isHighlighted: Boolean,
  isRecommended: Boolean,
});
</script>

<template>
  <div
    class="group relative w-full max-w-sm overflow-hidden rounded-xl p-[1px] transition-all duration-300 ease-in-out cursor-pointer"
    :class="[
      isHighlighted
        ? 'bg-gradient-to-r from-primary via-secondary to-accent hover:scale-105'
        : 'bg-gray-300',
    ]"
  >
    <!-- 動畫光效 -->
    <div
      class="absolute transition-opacity duration-500 opacity-0 pointer-events-none -top-40 -bottom-40 left-10 right-10 bg-gradient-to-r from-transparent via-white/90 to-transparent group-hover:opacity-100 group-hover:animate-spin-slow"
    ></div>

    <!-- 卡片內部內容 -->
    <div
      class="relative z-10 flex flex-col items-center h-full px-6 py-8 text-center shadow-md rounded-xl bg-white/90 backdrop-blur-md"
    >
      <!-- 頂部 icon -->
      <div class="mb-4 text-5xl text-secondary">
        <component :is="icon" class="w-12 h-12" />
      </div>

      <!-- 標題與說明文字 -->
      <h2 class="mb-1 text-2xl font-bold text-darkblue">{{ title }}</h2>
      <p class="mb-4 text-base text-darkblue/70">{{ description }}</p>

      <!-- 價格 -->
      <p class="mb-6 text-3xl font-extrabold text-orange">{{ price }}</p>

      <!-- 功能清單 -->
      <ul class="w-full space-y-2 text-left text-darkblue/90">
        <li
          v-for="(feature, index) in features"
          :key="index"
          class="flex items-start gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="flex-shrink-0 w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <span>{{ feature }}</span>
        </li>
      </ul>

      <!-- 「立即訂閱」按鈕 -->
      <div class="w-full mt-8" v-if="isRecommended">
        <button
          class="w-full py-3 font-semibold text-white transition duration-300 rounded-full shadow-md bg-gradient-to-r from-primary/80 via-accent/70 to-orange/80 hover:brightness-110 hover:animate-pulse"
        >
          立即訂閱
        </button>
      </div>
    </div>
  </div>
</template>
