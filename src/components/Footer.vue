<script setup>
import { ref } from "vue";

const faqs = [
  {
    question: "如何開始使用 Kizuna？",
    answer: "註冊帳號並完成個人檔案，即可開始探索與互動。",
  },
  {
    question: "是否需要付費？",
    answer: "基本功能免費，進階功能可透過訂閱升級。",
  },
];

const activeFAQ = ref(null);

function toggleFAQ(index) {
  activeFAQ.value = activeFAQ.value === index ? null : index;
}
</script>

<template>
  <footer class="py-10 text-gray-100 bg-black">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex flex-col gap-10 md:flex-row md:justify-between">
        <!-- Logo + 標語 -->
        <div class="text-center md:w-1/3 md:text-left">
          <img
            src="/logo.png"
            alt="Kizuna logo"
            class="h-10 mx-auto mb-4 md:mx-0"
          />
          <h1 class="font-serif text-3xl italic font-bold">Kizuna</h1>
          <p class="mt-2 text-sm text-gray-400">連結每一段有溫度的相遇</p>
        </div>

        <div class="grid grid-cols-2 gap-8 text-sm md:grid-cols-4 md:w-2/3">
          <!-- 認識 Kizuna -->
          <div>
            <h2 class="mb-3 font-bold text-white">關於我們</h2>
            <ul class="space-y-2">
              <li>
                <a href="#whyChooseUs" class="hover:text-[#8ecae6]"
                  >為什麼選擇 Kizuna</a
                >
              </li>
              <li>
                <a href="/onboarding" class="hover:text-[#8ecae6]">使用教學</a>
              </li>
            </ul>
          </div>

          <!-- 活動與訂閱 -->
          <div>
            <h2 class="mb-3 font-bold text-white">探索與互動</h2>
            <ul class="space-y-2">
              <li>
                <a href="/activities" class="hover:text-[#8ecae6]">探索活動</a>
              </li>
              <li>
                <a href="/match" class="hover:text-[#8ecae6]">瀏覽會員</a>
              </li>
              <li>
                <a href="/subscription" class="hover:text-[#8ecae6]"
                  >選擇訂閱方案</a
                >
              </li>
            </ul>
          </div>

          <!-- FAQ 區塊 -->
          <div>
            <h2 class="mb-3 font-bold text-white">常見問答</h2>
            <ul class="space-y-2 text-gray-400">
              <li v-for="(item, index) in faqs" :key="index">
                <button
                  type="button"
                  @click="toggleFAQ(index)"
                  class="w-full font-medium text-left text-white focus:outline-none"
                >
                  {{ item.question }}
                </button>
                <transition name="fade">
                  <p
                    v-if="activeFAQ === index"
                    class="mt-1 text-xs text-gray-300"
                  >
                    {{ item.answer }}
                  </p>
                </transition>
              </li>
            </ul>
          </div>

          <!-- 加入我們 -->
          <div>
            <h2 class="mb-3 font-bold text-white">加入我們</h2>
            <ul class="space-y-2">
              <li>
                <router-link to="/register" class="hover:text-[#8ecae6]">
                  立即註冊
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 版權 -->
      <hr class="my-8 border-gray-600" />
      <p class="text-xs text-center text-gray-500">
        &copy; 2025 Kizuna 保留所有權利
      </p>
    </div>
  </footer>
</template>
