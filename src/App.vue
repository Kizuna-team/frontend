<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useUserStore } from "./stores/user";
import router from "./router";
const store = useUserStore();

const handleLogout = () => {
  store.logout();
  alert("已登出");
  router.push("/login");
};

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 3000);
});
</script>

<template>
  <header class="text-white shadow-md bg-primary-100">
    <nav class="flex justify-start">
      <RouterLink to="/" class="p-6 text-lg transition hover:text-gray-300"
        >首頁</RouterLink
      >
      <RouterLink
        to="/product"
        class="p-6 text-lg transition hover:text-gray-300"
        >商品列表</RouterLink
      >
      <RouterLink to="/cart" class="p-6 text-lg transition hover:text-gray-300"
        >購物車</RouterLink
      >
      <!-- 有token 代表已經登入 所以只剩登出按鈕 -->
      <template v-if="store.accessToken">
        <button
          @click="handleLogout"
          class="p-6 text-lg transition hover:text-gray-300"
        >
          登出
        </button>
        <div class="p-6 text-lg transition hover:text-gray-300">
          目前登入帳號為 :
          <!-- ml-2表示 margin-left加上0.5rem的間距 -->
          <span class="ml-2">{{ store.username }}</span>
        </div>
        <!-- 要登入才能看到個人檔案頁面 -->
        <RouterLink
          to="/edit-profile"
          class="p-6 text-lg transition hover:text-gray-300"
          >編輯個人檔案區</RouterLink
        >
      </template>

      <!-- 沒有token 請先登入或註冊新帳號 -->
      <template v-else>
        <RouterLink
          to="/login"
          class="p-6 text-lg transition hover:text-gray-300"
          >登入</RouterLink
        >
        <RouterLink
          to="/register"
          class="p-6 text-lg transition hover:text-gray-300"
          >註冊</RouterLink
        >
      </template>
      <RouterLink to="/chat" class="p-6 text-lg transition hover:text-gray-300"
        >聊天室</RouterLink
      >
      <RouterLink to="/match" class="p-6 text-lg transition hover:text-gray-300"
        >配對池</RouterLink
      >
      <RouterLink
        to="/activities"
        class="p-6 text-lg transition hover:text-gray-300"
        >活動</RouterLink
      >
      <RouterLink
        to="/activities/new"
        class="p-6 text-lg transition hover:text-gray-300"
        >活動表單</RouterLink
      >
      <RouterLink
        to="/activities/edit/:id"
        class="p-6 text-lg transition hover:text-gray-300"
        >活動編輯</RouterLink
      >
    </nav>
  </header>

  <div
    v-if="isLoading"
    class="fixed inset-0 z-50 flex items-center justify-center font-sans bg-black"
  >
    <svg
      viewBox="0 0 800 200"
      class="w-[600px] h-auto"
      fill="none"
      stroke="white"
      stroke-width="2"
    >
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="150"
        font-family="'Baloo 2', cursive"
        fill="none"
        stroke="white"
        stroke-width="2"
        stroke-dasharray="1500"
        stroke-dashoffset="1500"
        class="animate-draw"
      >
        KIZUNA
      </text>
    </svg>
  </div>

  <main v-else>
    <RouterView />
  </main>
</template>

<style scoped>
/* @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"); */

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fill-in {
  from {
    fill: transparent;
  }
  to {
    fill: white;
  }
}

.animate-draw {
  animation: draw 2.5s ease-in-out forwards;
}

.fill-in-delay {
  animation: fill-in 1s ease-in-out forwards;
  animation-delay: 2.5s;
}
</style>
