<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

const [month, dayTime] = props.event?.time?.split?.("/") ?? ["", ""];
const [day, hour] = dayTime?.split?.(" ") ?? ["", ""];
</script>

<template>
  <router-link
    v-if="event && event.time"
    :to="`/activities/${event.id}`"
    class="block group relative h-[420px] rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:shadow-xl transition-all duration-500 hover:scale-[1.02]"
  >
    <img
      :src="event.image || '/default.jpg'"
      alt="event image"
      class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
    />

    <div
      class="absolute inset-0 transition-opacity duration-500 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80"
    />

    <div
      class="absolute bottom-0 left-0 z-10 flex flex-col items-start w-full gap-3 px-5 py-4 text-white transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:flex-row sm:items-center sm:gap-6"
    >
      <div
        class="w-full leading-tight text-center transition-transform duration-500 transform sm:w-32 sm:text-left group-hover:translate-y-0 group-hover:scale-105"
      >
        <div class="text-2xl font-bold sm:text-3xl">{{ month }}</div>
        <div class="text-4xl font-bold sm:text-5xl">{{ day }}</div>
        <div class="text-lg font-bold sm:text-xl text-white/80">{{ hour }}</div>
      </div>

      <div
        class="flex-1 w-full transition-all duration-500 transform group-hover:translate-x-0"
      >
        <h3
          class="mb-1 text-2xl font-bold leading-snug tracking-wide truncate sm:text-3xl drop-shadow"
        >
          {{ event.title }}
        </h3>
        <p
          class="text-base transition-all duration-500 sm:text-xl text-white/80 group-hover:translate-y-0 group-hover:opacity-100"
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
