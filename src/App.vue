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
</script>

<template>
  <header class="text-white bg-blue-900 shadow-md">
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
        <div
          class="p-6 text-lg transition hover:text-gray-300"
        >
          目前登入帳號為 : 
          <!-- ml-2表示 margin-left加上0.5rem的間距 -->
          <span class="ml-2">{{ store.username }}</span>
        </div>
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
    </nav>
  </header>
  <main class="max-w-[1000px] mx-auto mt-24">
    <RouterView />
  </main>
</template>

<style></style>
