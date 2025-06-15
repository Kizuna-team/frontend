<script setup>
import { ref, computed, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";
import LiquidNavLink from "@/components/LiquidGlass.vue";
const route = useRoute();
const router = useRouter();
const store = useUserStore();

const isMobileMenuOpen = ref(false);
const isDropdownOpen = ref(false);

// 判斷 header 是否滾動狀態
const isScrolled = ref(false);
window.addEventListener("scroll", () => {
  isScrolled.value = window.scrollY > 10;
});

// 白底頁面清單（可擴充）
const lightBgPages = [
  "/match",
  "/activities",
  "/activities/new",
  "/activities/edit/:id",
  "/product",
  "/login",
  "/register",
];
const isLightBgPage = computed(() =>
  lightBgPages.some((path) => route.path.startsWith(path.replace(":id", "")))
);

// 根據頁面/滾動狀態決定 header 文字色
const getNavTextColor = computed(() => {
  return isScrolled.value || isLightBgPage.value ? "black" : "white";
});

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleLogout = () => {
  store.logout();
  alert("已登出");
  router.push("/login");
};

// 切頁時關閉選單
watch(route, () => {
  isMobileMenuOpen.value = false;
  isDropdownOpen.value = false;
});
</script>

<template>
  <header
    class="fixed top-0 left-0 z-50 w-full transition-colors duration-300 border-b-2"
    :class="[
      isScrolled || isLightBgPage
        ? 'bg-white text-black border-[#219ebc]'
        : 'bg-transparent text-white border-transparent',
    ]"
  >
    <nav class="flex items-center justify-between px-4 py-3 md:px-8">
      <!-- Logo -->
      <LiquidNavLink
        to="/"
        :colorMode="getNavTextColor"
        class="text-xl font-bold"
      >
        Kizuna
      </LiquidNavLink>

      <!-- 漢堡按鈕 -->
      <button class="md:hidden" @click="toggleMobileMenu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
          :class="getNavTextColor === 'white' ? 'text-white' : 'text-black'"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <!-- 桌機導覽 -->
      <div class="items-center justify-center flex-1 hidden space-x-4 md:flex">
        <LiquidNavLink to="/match" :colorMode="getNavTextColor"
          >配對池</LiquidNavLink
        >
        <LiquidNavLink to="/product" :colorMode="getNavTextColor"
          >商品列表</LiquidNavLink
        >
        <LiquidNavLink to="/activities" :colorMode="getNavTextColor"
          >活動</LiquidNavLink
        >
        <LiquidNavLink to="/activities/new" :colorMode="getNavTextColor"
          >活動表單</LiquidNavLink
        >
        <LiquidNavLink to="/activities/edit/:id" :colorMode="getNavTextColor"
          >活動編輯</LiquidNavLink
        >
        <LiquidNavLink to="/edit-profile" :colorMode="getNavTextColor"
          >編輯個人檔案
        </LiquidNavLink>
      </div>

      <!-- 使用者選單 -->
      <div class="items-center justify-end hidden w-1/4 space-x-4 md:flex">
        <template v-if="!store.accessToken">
          <LiquidNavLink to="/login" :colorMode="getNavTextColor"
            >登入</LiquidNavLink
          >
          <LiquidNavLink to="/register" :colorMode="getNavTextColor"
            >註冊</LiquidNavLink
          >
        </template>
        <template v-else>
          <div class="relative">
            <div
              class="flex items-center justify-center w-10 h-10 font-bold text-black bg-white rounded-full cursor-pointer"
              @click="toggleDropdown"
            >
              {{ store.username?.charAt(0).toUpperCase() || "U" }}
            </div>
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 w-40 mt-2 bg-white border rounded shadow-lg"
            >
              <div class="px-4 py-2 text-gray-600">
                Hi, {{ store.username }}
              </div>
              <router-link
                to="/edit-profile"
                class="block px-4 py-2 hover:bg-gray-100"
                >編輯個人檔案</router-link
              >
              <button
                @click="handleLogout"
                class="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                登出
              </button>
            </div>
          </div>
        </template>
      </div>
    </nav>

    <!-- 手機版選單 -->
    <div
      v-if="isMobileMenuOpen"
      class="flex flex-col items-start px-4 pb-4 space-y-2 bg-white md:hidden"
    >
      <LiquidNavLink to="/match" :colorMode="'black'" class="w-full"
        >配對池</LiquidNavLink
      >
      <LiquidNavLink to="/product" :colorMode="'black'" class="w-full"
        >商品列表</LiquidNavLink
      >
      <LiquidNavLink to="/activities" :colorMode="'black'" class="w-full"
        >活動</LiquidNavLink
      >
      <LiquidNavLink to="/activities/new" :colorMode="'black'" class="w-full"
        >活動表單</LiquidNavLink
      >
      <LiquidNavLink
        to="/activities/edit/:id"
        :colorMode="'black'"
        class="w-full"
        >活動編輯</LiquidNavLink
      >

      <template v-if="!store.accessToken">
        <LiquidNavLink to="/login" :colorMode="'black'" class="w-full"
          >登入</LiquidNavLink
        >
        <LiquidNavLink to="/register" :colorMode="'black'" class="w-full"
          >註冊</LiquidNavLink
        >
      </template>
      <template v-else>
        <router-link to="/edit-profile" class="block w-full text-black"
          >編輯個人檔案</router-link
        >
        <button @click="handleLogout" class="block w-full text-left text-black">
          登出
        </button>
      </template>
    </div>
  </header>
</template>
