<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useUserStore } from "@/stores/user";
import router from "@/router";
const store = useUserStore();

const handleLogout = () => {
  store.logout();
  alert("已登出");
  router.push("/login");
};

// 控制下拉框的顯示與隱藏
const isDropdownOpen = ref(false);

// 切換下拉框顯示狀態
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// 點擊其他地方關閉下拉框
const closeDropdown = (event) => {
  if (!event.target.closest(".relative")) {
    isDropdownOpen.value = false;
  }
};

// 在組件掛載時添加全局點擊事件監聽器
onMounted(() => {
  window.addEventListener("click", closeDropdown);
});

// 組件卸載時移除事件監聽器
onUnmounted(() => {
  window.removeEventListener("click", closeDropdown);
});
</script>

<template>
  <header
    class="fixed top-0 left-0 w-full h-20 z-50 text-[#515151] bg-white/50 backdrop-blur-sm shadow"
    style="
      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1),
        inset -1px -1px 1px rgba(255, 255, 255, 0.35);
    "
  >
    <nav class="flex items-center justify-between px-6 py-4">
      <!-- 左側 -->
      <div class="flex items-center">
        <RouterLink to="/" class="text-2xl italic font-light leading-none">
          Kizuna
        </RouterLink>
      </div>

      <!-- 中間 -->
      <div class="flex justify-center flex-1 space-x-4">
        <RouterLink
          to="/match"
          class="p-4 text-lg leading-none transition hover:text-gray-300"
        >
          配對池
        </RouterLink>

        <RouterLink
          to="/product"
          class="p-4 text-lg leading-none transition hover:text-gray-300"
        >
          商品列表
        </RouterLink>

        <RouterLink
          to="/chat"
          class="p-4 text-lg leading-none transition hover:text-gray-300"
          >聊天室</RouterLink
        >

        <RouterLink
          to="/cart"
          class="p-4 text-lg leading-none transition hover:text-gray-300"
        >
        
          購物車
        </RouterLink>

        <RouterLink
          to="/activities"
          class="p-4 text-lg leading-none transition hover:text-gray-300"
          >活動</RouterLink
        >
        <RouterLink
          to="/activities/new"
          class="p-4 text-lg leading-none transition hover:text-gray-300"
          >活動表單</RouterLink
        >
        <RouterLink
          to="/activities/edit/:id"
          class="p-4 text-lg leading-none transition hover:text-gray-300"
          >活動編輯</RouterLink
        >
      </div>

      <!-- 右側 -->

      <!-- 沒有token 請先登入或註冊新帳號 -->
      <template v-if="!store.accessToken">
        <RouterLink
          to="/login"
          class="p-4 text-lg leading-none transition hover:text-gray-300"
          >登入</RouterLink
        >
        <RouterLink
          to="/register"
          class="p-4 text-lg leading-none transition hover:text-gray-300"
          >註冊</RouterLink
        >
      </template>

      <!-- 已登入顯示：帳號名稱 + 頭像選單 -->
      <div class="flex items-center space-x-4" v-if="store.accessToken">
        <div class="relative">
          <div
            class="flex items-center justify-center w-12 h-12 text-sm font-bold bg-[#ddedff] rounded-full text-[#7395BA] hover:bg-slate-300"
            @click="toggleDropdown"
          ></div>
          <div
            v-if="isDropdownOpen"
            class="absolute right-0 w-40 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <div
              class="flex items-center justify-center px-4 py-4 text-gray-500"
            >
              目前登入帳號為 :
              {{ store.username }}
            </div>
            <RouterLink
              to="/edit-profile"
              class="block px-4 py-4 text-gray-600 border-b border-gray-300 hover:bg-gray-100"
              @click="isDropdownOpen = false"
            >
              <font-awesome-icon :icon="['fas', 'user-pen']" />
              編輯個人檔案
            </RouterLink>
            <a
              href="#"
              class="block px-4 py-4 text-gray-600 border-b border-gray-300 hover:bg-gray-100"
              ><font-awesome-icon :icon="['fas', 'star']" /> 升級方案</a
            >
            <a
              href="#"
              class="block px-4 py-4 text-gray-600 border-b border-gray-300 hover:bg-gray-100"
              @click="handleLogout"
              ><font-awesome-icon :icon="['fas', 'right-to-bracket']" /> 登出</a
            >
          </div>
        </div>
      </div>
    </nav>
  </header>

  <main class="max-w-[1000px] mx-auto mt-32">
    <RouterView />
  </main>
</template>

<style>
div {
  /* position: ; */
}
</style>
