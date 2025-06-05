<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

// 安全拆解時間字串
const [month, dayTime] = props.event?.time?.split?.("/") ?? ["", ""];
const [day, hour] = dayTime?.split?.(" ") ?? ["", ""];
</script>

<template>
  <router-link
    v-if="event && event.time"
    :to="`/events/${event.id}`"
    class="block group relative h-[420px] rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:shadow-xl transition-all duration-500 hover:scale-[1.02]"
  >
    <!-- 活動圖片 -->
    <img
      :src="event.image || '/default.jpg'"
      alt="event image"
      class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
    />

    <!-- 黑色遮罩 -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 opacity-60 group-hover:opacity-80"
    />

    <!-- 活動資訊浮出 -->
    <div
      class="absolute bottom-0 left-0 w-full px-5 py-4 text-white z-10 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6"
    >
      <!-- 左邊：日期 -->
      <div
        class="w-full leading-tight text-center sm:w-32 sm:text-left transform transition-transform duration-500 group-hover:translate-y-0 group-hover:scale-105"
      >
        <div class="text-2xl font-bold sm:text-3xl">{{ month }}</div>
        <div class="text-4xl font-bold sm:text-5xl">{{ day }}</div>
        <div class="text-lg font-bold sm:text-xl text-white/80">{{ hour }}</div>
      </div>

      <!-- 右邊：活動資訊 -->
      <div
        class="flex-1 w-full transform transition-all duration-500 group-hover:translate-x-0"
      >
        <h3
          class="mb-1 text-2xl font-bold leading-snug tracking-wide truncate sm:text-3xl drop-shadow"
        >
          {{ event.title }}
        </h3>
        <p
          class="text-base sm:text-xl text-white/80 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
        >
          {{ event.venue }}
        </p>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-up {
  animation: slideUp 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}
</style>
