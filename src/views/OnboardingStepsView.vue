<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

import {
  UserGroupIcon,
  SparklesIcon,
  GiftIcon,
  CalendarDaysIcon,
  StarIcon,
} from "@heroicons/vue/24/solid";

import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

import { onMounted } from "vue";

onMounted(() => {
  AOS.init({ once: true });
});

const steps = [
  {
    title: "智能配對",
    en: "Smart Match",
    desc: `根據興趣與活動偏好，推薦可能的契合對象\nDiscover people who share your interests and passions`,
    img: "/steps/step1-match.png",
    icon: UserGroupIcon,
  },
  {
    title: "AI 對話推薦",
    en: "AI Conversation Starters",
    desc: `不再尷尬開場！AI 幫你製造趣味互動\nLet our AI spark fun conversations for you`,
    img: "/steps/step2-ai.png",
    icon: SparklesIcon,
  },
  {
    title: "送禮互動",
    en: "Gifting Moments",
    desc: `傳送虛擬禮物，讓情感升溫，自然產生連結\nShare virtual gifts to warm up bonds`,
    img: "/steps/step3-gift.png",
    icon: GiftIcon,
  },
  {
    title: "興趣活動參與",
    en: "Join Activities",
    desc: `線上聊得來，線下一起玩\nConnect through real experiences`,
    img: "/steps/step4-activity.png",
    icon: CalendarDaysIcon,
  },
  {
    title: "訂閱升級體驗",
    en: "Upgrade for More",
    desc: `解鎖更多配對、專屬話題與活動優惠\nUnlock more matches and features`,
    img: "/steps/step5-subscribe.png",
    icon: StarIcon,
  },
];

const currentIndex = ref(0);
const currentStep = ref(steps[0]);

const onSlideChange = (swiper) => {
  currentIndex.value = swiper.realIndex;
  currentStep.value = steps[swiper.realIndex];
};
</script>

<template>
  <section class="py-16 font-sans bg-white md:py-20 text-darkblue">
    <div class="w-full px-4 mb-10 space-y-3 text-center md:hidden">
      <p class="text-base font-semibold text-primary">
        「羈」於好感，所以相「絆」
      </p>
      <h1
        data-aos="fade-up"
        class="text-2xl font-bold leading-tight sm:text-3xl"
      >
        一段從 <span class="text-primary">好感</span> 到
        <span class="text-secondary">連結</span> 的交友旅程
      </h1>
      <p class="text-sm text-gray-600">
        Let Kizuna guide you<br />
        on a journey of meaningful relationships.
      </p>
    </div>

    <div
      class="flex flex-col-reverse items-center max-w-6xl px-4 mx-auto md:flex-row md:items-stretch"
    >
      <div class="w-full space-y-6 text-center md:text-left md:w-2/3">
        <div class="hidden space-y-3 md:block">
          <p class="text-lg font-semibold text-primary">
            「羈」於好感，所以相「絆」
          </p>
          <h1
            class="mb-2 text-3xl font-bold leading-tight sm:text-4xl md:text-4xl"
          >
            一段從 <span class="text-primary">好感</span> 到
            <span class="text-secondary">連結</span> 的交友旅程
          </h1>
          <p
            class="text-sm leading-relaxed text-gray-600 sm:text-base md:text-lg"
          >
            Let Kizuna guide you from interest to real connection —<br
              class="hidden sm:block"
            />
            a journey of meaningful relationships.
          </p>
        </div>

        <div class="pt-6 mt-4 space-y-2 border-t border-gray-200">
          <p class="text-sm font-medium text-gray-400">
            第 {{ currentIndex + 1 }} 步 / Step {{ currentIndex + 1 }}
          </p>
          <h2
            class="flex items-center justify-center gap-2 text-xl font-bold md:justify-start"
          >
            <component :is="currentStep.icon" class="w-5 h-5 text-primary" />
            {{ currentStep.title }}
            <span class="text-base font-normal text-primary">{{
              currentStep.en
            }}</span>
          </h2>
          <p class="text-sm text-gray-600 whitespace-pre-line sm:text-base">
            {{ currentStep.desc }}
          </p>
        </div>

        <div class="pt-4">
          <button
            type="button"
            @click="$router.push('/match')"
            class="inline-block px-6 py-3 text-white transition rounded-full shadow-md bg-primary hover:bg-secondary"
          >
            完成這五步，遇見更契合的他／她
          </button>
        </div>
      </div>

      <div
        data-aos="zoom-in"
        class="w-full h-full md:w-1/3 max-w-[480px] mx-auto flex flex-col items-center"
      >
        <Swiper
          :modules="[Autoplay, Pagination]"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          :pagination="{ clickable: true }"
          loop
          @slideChange="onSlideChange"
          class="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <SwiperSlide v-for="(step, index) in steps" :key="index">
            <img
              :src="step.img"
              class="w-full h-auto object-contain max-h-[320px] sm:max-h-[360px] md:max-h-[400px]"
              :alt="step.title"
            />
          </SwiperSlide>
        </Swiper>

        <p
          data-aos="fade-up"
          data-aos-delay="500"
          class="mt-4 text-sm text-center text-gray-500 md:hidden"
          v-text="`${currentStep.title} · ${currentStep.en}`"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  font-family: "Noto Sans TC", sans-serif;
}
</style>
