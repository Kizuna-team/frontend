<script setup>
import { computed } from "vue";
import { Vue3Lottie } from "vue3-lottie";
import successAnimation from "@/assets/payment-success.json";
import failAnimation from  "@/assets/payment-fail.json";
import { useRouter,useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const isError = computed(() => route.query.error === "1");//error=1 失敗
const errorMessage = computed(() => route.query.message || "付款失敗，請稍後再試");


function goToProductList() {
  router.push("/product");
}
</script>
<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
  >
    <div class="bg-white rounded-xl p-8 min-w-[500px] shadow-lg text-center">
      <Vue3Lottie
        :animationData="isError ? failAnimation : successAnimation"
        :height="240"
        :width="240"
        class="mx-auto mb-2"
      />
      <h2 class="mb-2 text-2xl font-bold text-darkblue">{{ isError ? "付款失敗" : "付款成功" }}</h2>
      <p class="mb-6 text-gray-500">{{ isError ? errorMessage : "感謝您的購買，請耐心等候收禮通知" }}</p>
      <button class="w-32 h-10 text-white font-bold rounded-full border-2 border-[#219ebc] bg-[#219ebc] hover:bg-white hover:text-[#219ebc] transition-all duration-300" @click="goToProductList">確認</button>
    </div>
  </div>
</template>
