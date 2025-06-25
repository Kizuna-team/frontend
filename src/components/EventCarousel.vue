<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import { ref, onMounted } from "vue";
import EventCard from "./EventCard.vue";
import { fetchActivities } from "../api/activities.js";
import { useUserStore } from "@/stores/user.js";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const events = ref([]);
const userStore = useUserStore();
const router = useRouter();
const toast = useToast();

onMounted(async () => {
  try {
    const data = await fetchActivities();
    events.value = data.map((act) => {
      const date = new Date(act.date);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      const time = `${month}/${day} ${hour}:${minute}`;

      return {
        id: act.id,
        title: act.title,
        time,
        venue: act.location,
        image: act.image_url,
      };
    });
  } catch (err) {
    console.error("Failed to load events", err);
  }
});

const handleJoinClick = () => {
  if (!userStore.accessToken) {
    localStorage.setItem("returnTo", "/activities");
    toast.info("請先登入才能參加活動");
    router.push("/login");
    return;
  }
  router.push("/activities");
};
</script>

<template>
  <!-- 整體包裹區塊 -->
  <section class="px-4 text-center">
    <!-- 標題區 -->
    <div
      class="flex flex-col items-center justify-center flex-1 px-4 pt-16 md:pt-18"
    >
      <h2 class="mb-2 text-3xl font-extrabold md:text-5xl">
        Weekend adventure,<br />
        <span class="italic text-secondary">meet new friends!</span>
      </h2>
      <h3 class="mt-3 text-xl font-semibold text-gray-700 md:text-2xl">
        週末出動，一起精彩相遇！
      </h3>
      <p class="mt-2 text-base text-gray-600 md:text-lg">
        精選活動等你參加，快來認識新朋友吧！
      </p>
      <p class="mt-1 text-sm italic text-gray-500 md:text-base">
        Discover exciting events tailored for you
      </p>
    </div>

    <!-- 輪播區 -->
    <div
      class="relative flex items-center justify-center w-full px-4 py-10 flex-2 md:px-20"
    >
      <Swiper
        v-if="events.length >= 4"
        :modules="[Navigation, Autoplay]"
        :slides-per-view="1.5"
        :space-between="30"
        :loop="true"
        :centeredSlides="true"
        :autoplay="{ delay: 4000 }"
        :navigation="{
          nextEl: '.custom-swiper-button-next',
          prevEl: '.custom-swiper-button-prev',
        }"
        class="w-full max-w-6xl"
      >
        <SwiperSlide v-for="event in events" :key="event.id">
          <EventCard :event="event" />
        </SwiperSlide>

        <!-- 左箭頭 -->
        <div
          class="absolute z-10 flex items-center justify-center w-12 h-12 transition -translate-y-1/2 rounded-full cursor-pointer custom-swiper-button-prev top-1/2 left-4 bg-secondary hover:bg-accent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline
              points="15 18 9 12 15 6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <!-- 右箭頭 -->
        <div
          class="absolute z-10 flex items-center justify-center w-12 h-12 transition -translate-y-1/2 rounded-full cursor-pointer custom-swiper-button-next top-1/2 right-4 bg-secondary hover:bg-accent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline
              points="9 18 15 12 9 6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </Swiper>
    </div>
  </section>

  <!-- 按鈕區 -->
  <section class="flex items-center justify-center w-full py-10">
      <button
        @click="handleJoinClick"
        type="button"
        class="relative w-80 py-5 text-2xl font-bold text-white rounded-full bg-[#023047] overflow-hidden group"
      >
        <span class="relative z-10 block text-white">
          立即報名<br />
          <span class="block text-xl font-normal text-white/80">Join now</span>
        </span>

        <!-- 底色滑動層 -->
        <span
          class="absolute inset-0 bg-[#fb8500] translate-y-full transition-transform duration-500 ease-in-out rounded-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
        ></span>
      </button>
  </section>
</template>
