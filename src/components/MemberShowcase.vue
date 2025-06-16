<script setup>
import MemberCard from "./MemberCard.vue";

const animationDuration = 40;

const members = [
  { photo: "/people.jpg", firstName: "Jhon", lastName: "Osteen" },
  { photo: "/people.jpg", firstName: "Anna", lastName: "Lee" },
  { photo: "/people.jpg", firstName: "Tom", lastName: "Chang" },
  { photo: "/people.jpg", firstName: "May", lastName: "Chen" },
  { photo: "/people.jpg", firstName: "David", lastName: "Wang" },
  { photo: "/people.jpg", firstName: "Lisa", lastName: "Lin" },
  { photo: "/people.jpg", firstName: "Mike", lastName: "Huang" },
  { photo: "/people.jpg", firstName: "Sandy", lastName: "Liu" },
];
</script>

<template>
  <section class="py-24 overflow-hidden bg-primary/20">
    <div class="max-w-6xl px-6 mx-auto text-center">
      <h1 class="text-4xl font-bold leading-tight text-gray-900 md:text-4xl">
        在
        <span class="font-semibold text-secondary">Kizuna</span
        >，展開你的連結之旅
      </h1>
      <p class="mt-3 text-base italic text-gray-500 md:text-xl">
        找到聊得來的夥伴，讓每次配對都更有意義
      </p>

      <!-- 自動無限滑動區塊 -->
      <div class="w-full mt-12 overflow-hidden">
        <div
          class="flex gap-6 w-max animate-slide"
          :style="{ animationDuration: animationDuration + 's' }"
        >
          <!-- 兩輪卡片實現無縫輪播 -->
          <template v-for="repeat in 2" :key="repeat">
            <div
              v-for="(member, index) in members"
              :key="`${repeat}-${index}`"
              class="flex-shrink-0 w-52"
            >
              <MemberCard
                :photo="member.photo"
                :firstName="member.firstName"
                :lastName="member.lastName"
              />
            </div>
          </template>
        </div>
      </div>
      <div class="mt-20">
        <router-link to="/register">
          <button
            type="button"
            class="py-[18px] text-2xl font-bold text-white transition-all duration-300 origin-center rounded-full shadow-xl w-80 bg-gradient-to-r from-secondary to-pink-500 hover:scale-110 hover:brightness-110 hover:animate-pulse"
          >
            立即開始配對<br />
            <span class="text-xl font-normal">Let’s Match!</span>
          </button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 設定無限滑動動畫 */
@keyframes slide {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-slide {
  animation: slide linear infinite;
}
</style>
