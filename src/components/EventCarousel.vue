<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import EventCard from "./EventCard.vue";

const events = [
  {
    id: 1,
    title: "桌遊之夜",
    time: "06/15 19:00",
    area: "台北市信義區信義路五段7號",
    venue: "台北101",
  },
  {
    id: 2,
    title: "一起去爬山",
    time: "06/16 08:00",
    area: "台北市中正區忠孝東路一段1號",
    venue: "台北車站",
  },
  {
    id: 3,
    title: "週末下午茶",
    time: "06/22 14:30",
    area: "台北市中山區民生東路三段8號",
    venue: "小巨蛋旁咖啡廳",
  },
  {
    id: 4,
    title: "城市散步",
    time: "06/23 16:00",
    area: "台北市大安區羅斯福路三段245號",
    venue: "台大側門前草地",
  },
  {
    id: 5,
    title: "音樂分享會",
    time: "07/01 18:00",
    area: "新北市板橋區文化路一段188號",
    venue: "板橋車站大廳",
  },
  {
    id: 6,
    title: "戶外野餐日",
    time: "07/06 10:30",
    area: "新北市新店區北新路三段88號",
    venue: "大坪林捷運站出口",
  },
];
</script>

<template>
  <!-- 整體包裹區塊 -->
  <section class="px-4 py-8 text-center text-gray-800 md:py-10">
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
