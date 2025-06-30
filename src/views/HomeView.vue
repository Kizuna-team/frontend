<script setup>
import { ref, onMounted } from "vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import HeroSection from "@/components/HeroSection.vue";
import WhyChooseUs from "@/components/WhyChooseUs.vue";
import EventCarousel from "@/components/EventCarousel.vue";
import HowToUseSection from "@/components/HowToUseSection.vue";
import MemberShowcase from "@/components/MemberShowcase.vue";
import Footer from "@/components/Footer.vue";

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 3000);
});
</script>

<template>
  <div class="bg-gray-100">
    <!-- Loading Screen 覆蓋層 -->
    <LoadingScreen v-show="isLoading" class="fixed inset-0 z-50" />
    <!-- 主要內容 - 立即開始渲染和載入資源 -->
    <div
      :class="{ 'opacity-0': isLoading, 'opacity-100': !isLoading }"
      class="transition-opacity duration-500"
    >
      <HeroSection />
      <WhyChooseUs />
      <EventCarousel />
      <HowToUseSection />
      <MemberShowcase :members="myMemberList" />
      <Footer />
    </div>
  </div>
</template>
