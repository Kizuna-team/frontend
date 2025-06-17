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
  }, 4500);
});
</script>

<template>
  <div class="bg-gray-100">
    <LoadingScreen v-if="isLoading" />
    <template v-else>
      <HeroSection />
      <WhyChooseUs />
      <EventCarousel />
      <HowToUseSection />
      <MemberShowcase :members="myMemberList" />
      <Footer />
    </template>
  </div>
</template>
