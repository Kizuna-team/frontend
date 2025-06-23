<script setup>
import { ref, computed, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { useRoute } from "vue-router";
import LiquidNavLink from "@/components/LiquidGlass.vue";
import { useCartStore } from "@/stores/cart.js";
import { useToast } from "vue-toastification";
import ScrollToTop from "@/components/ScrollToTop.vue";

const route = useRoute();
const store = useUserStore();
const cartStore = useCartStore();
const toast = useToast();
const isMobileMenuOpen = ref(false);
const isDropdownOpen = ref(false);

//定義每個區域的滾動位置
const sectionPositions = {
  about: 800, // 關於我們
  tutorial: 2700, // 使用教學區
  "activities-preview": 1700, // 探索活動
  "match-preview": 3500, // 立即配對
};

// 處理導覽點擊事件
const handleNavClick = async (event, sectionId) => {
  event.preventDefault();
  if (route.path === "/") {
    // 如果在首頁，滾動到對應位置
    const targetPosition = sectionPositions[sectionId];
    if (targetPosition) {
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  } else {
    // 如果不在首頁，先跳轉到首頁
    await router.push("/");

    // 等待頁面載入完成，然後滾動
    setTimeout(() => {
      const targetPosition = sectionPositions[sectionId];
      if (targetPosition) {
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    }, 300);
  }

  // 關閉手機選單
  isMobileMenuOpen.value = false;
};

// 需要隱藏中間導覽按鈕的頁面
const hideNavButtonsPages = ["/login", "/register"];

// 判斷是否需要隱藏中間導覽按鈕
const shouldHideNavButtons = computed(() =>
  hideNavButtonsPages.includes(route.path)
);

// 判斷 header 是否滾動狀態
const isScrolled = ref(false);
window.addEventListener("scroll", () => {
  isScrolled.value = window.scrollY > 790;
});

// 白底頁面清單（可擴充）
const lightBgPages = [
  "/match",
  "/activities",
  "/activities/new",
  "/activities/edit",
  "/activities/my",
  "/product",
  "/login",
  "/register",
  "/edit-profile",
  "/cart",
  "/chat",
  "/subscription",
  "/subscribe-plan",
  "/my-orders",
];

const isLightBgPage = computed(() =>
  lightBgPages.some((path) => {
    if (path.includes(":id")) {
      return route.path.startsWith(path.replace("/:id", ""));
    }
    return route.path.startsWith(path);
  })
);

// 統一的文字顏色邏輯
const getNavTextColor = computed(() => {
  // 如果是白底頁面或者已經滾動，就使用黑色文字
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
  toast("已登出");
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
    class="fixed top-0 left-0 z-50 w-full transition-all duration-300 navbar-header"
  >
    <nav
      class="flex items-center justify-between px-6 py-4 custom-desktop-px-8"
    >
      <!-- Logo -->
      <LiquidNavLink
        to="/"
        :colorMode="getNavTextColor"
        class="text-xl font-bold"
      >
        Kizuna
      </LiquidNavLink>

      <!-- 漢堡按鈕 - 1250px 以下顯示 -->
      <button class="custom-mobile-show" @click="toggleMobileMenu">
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

      <!-- 桌機導覽 - 1250px 以上顯示 在登入註冊頁面時隱藏中間按鈕 -->
      <div
        v-if="!shouldHideNavButtons"
        class="items-center justify-center flex-1 space-x-6 custom-desktop-show"
      >
        <template v-if="!store.accessToken">
          <!-- 保留 LiquidNavLink 樣式，但加入點擊事件處理 -->
          <LiquidNavLink
            to=""
            :colorMode="getNavTextColor"
            @click="(e) => handleNavClick(e, 'about')"
          >
            關於我們
          </LiquidNavLink>

          <LiquidNavLink
            to=""
            :colorMode="getNavTextColor"
            @click="(e) => handleNavClick(e, 'activities-preview')"
          >
            探索活動
          </LiquidNavLink>

          <LiquidNavLink
            to=""
            :colorMode="getNavTextColor"
            @click="(e) => handleNavClick(e, 'tutorial')"
          >
            使用教學
          </LiquidNavLink>

          <LiquidNavLink
            to=""
            :colorMode="getNavTextColor"
            @click="(e) => handleNavClick(e, 'match-preview')"
          >
            立即配對
          </LiquidNavLink>
        </template>
        <template v-else>
          <LiquidNavLink to="/match" :colorMode="getNavTextColor"
            >立即配對</LiquidNavLink
          >
          <LiquidNavLink to="/product" :colorMode="getNavTextColor"
            >商品列表</LiquidNavLink
          >
          <LiquidNavLink to="/activities/new" :colorMode="getNavTextColor"
            >活動表單</LiquidNavLink
          >
          <LiquidNavLink to="/activities/my" :colorMode="getNavTextColor"
            >我的活動</LiquidNavLink
          >
          <LiquidNavLink to="/activities" :colorMode="getNavTextColor"
            >探索活動</LiquidNavLink
          >
        </template>
      </div>

      <!-- 如果隱藏中間按鈕，用空的 div 保持佈局 -->
      <div v-else class="flex-1 custom-desktop-show"></div>

      <!-- 使用者選單 - 1250px 以上顯示 -->
      <div class="items-center justify-end space-x-4 custom-desktop-show">
        <template v-if="!store.accessToken">
          <LiquidNavLink to="/login" :colorMode="getNavTextColor"
            >登入</LiquidNavLink
          >
          <LiquidNavLink to="/register" :colorMode="getNavTextColor"
            >註冊</LiquidNavLink
          >
        </template>
        <template v-else>
          <!-- 訊息icon -->
          <LiquidNavLink to="/chat" :colorMode="getNavTextColor">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-7 h-7"
            >
              <path
                fill-rule="evenodd"
                d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                clip-rule="evenodd"
              />
            </svg>
          </LiquidNavLink>

          <!-- 購物車icon -->
          <LiquidNavLink to="/cart" :colorMode="getNavTextColor">
            <div class="relative">
              <span
                v-if="cartStore.totalQuantity > 0"
                class="absolute flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-semibold text-white rounded-full -top-2 -right-3 bg-[#E44C9B]"
              >
                {{
                  cartStore.totalQuantity > 99 ? "99+" : cartStore.totalQuantity
                }}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-7 h-7"
              >
                <path
                  d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                />
              </svg>
            </div>
          </LiquidNavLink>

          <div class="relative">
            <div
              class="flex items-center justify-center w-10 h-10 font-bold rounded-full cursor-pointer"
              :class="
                getNavTextColor === 'white'
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-white'
              "
              @click="toggleDropdown"
            >
              {{ store.username?.charAt(0).toUpperCase() || "U" }}
            </div>
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 w-56 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <div class="px-4 py-4 text-gray-600 border-b">
                <div class="text-sm font-medium text-gray-800 mb-1">
                  Hello👋
                </div>
                <div class="text-sm text-gray-600 break-all">
                  {{ store.username }}
                </div>
              </div>
              <router-link
                to="/edit-profile"
                class="flex items-center gap-3 px-4 py-3 text-gray-700 border-b border-gray-200 hover:bg-gray-50"
                @click="isDropdownOpen = false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                <span class="whitespace-nowrap">編輯個人檔案</span>
              </router-link>
              <a
                href="/subscription"
                class="flex items-center gap-3 px-4 py-3 text-gray-700 border-b border-gray-200 hover:bg-gray-50"
                @click="isDropdownOpen = false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                <span class="whitespace-nowrap">升級方案</span>
              </a>
              <a
                href="/my-orders"
                class="flex items-center gap-3 px-4 py-3 text-gray-700 border-b border-gray-200 hover:bg-gray-50"
                @click="isDropdownOpen = false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="size-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 5v1H4.667a1.75 1.75 0 0 0-1.743 1.598l-.826 9.5A1.75 1.75 0 0 0 3.84 19H16.16a1.75 1.75 0 0 0 1.743-1.902l-.826-9.5A1.75 1.75 0 0 0 15.333 6H14V5a4 4 0 0 0-8 0Zm4-2.5A2.5 2.5 0 0 0 7.5 5v1h5V5A2.5 2.5 0 0 0 10 2.5ZM7.5 10a2.5 2.5 0 0 0 5 0V8.75a.75.75 0 0 1 1.5 0V10a4 4 0 0 1-8 0V8.75a.75.75 0 0 1 1.5 0V10Z"
                    clip-rule="evenodd"
                  />
                </svg>

                <span class="whitespace-nowrap">我的購買紀錄</span>
              </a>
              <button
                @click="handleLogout"
                class="flex items-center w-full gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                  />
                </svg>
                <span class="whitespace-nowrap">登出</span>
              </button>
            </div>
          </div>
        </template>
      </div>
    </nav>

    <!-- 手機版選單 - 1250px 以下顯示，靠右對齊 -->
    <div
      class="custom-mobile-show transition-all duration-300 ease-in-out ml-auto mr-[2.5%] w-[35%] rounded-b-2xl"
      :class="[
        isMobileMenuOpen
          ? 'max-h-screen opacity-100'
          : 'max-h-0 opacity-0 overflow-hidden',
      ]"
    >
      <div class="space-y-2">
        <!-- ✅ 未登入時：顯示首頁區域導覽按鈕 -->
        <template v-if="!store.accessToken">
          <!-- 關於我們 -->
          <LiquidNavLink
          to="#"
          :colorMode="getNavTextColor"
            @click="(e) => handleNavClick(e, 'about')"
            class="block w-full !px-3 py-2 !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-right transition-all duration-200 rounded-xl"
            :class="[
              isScrolled || isLightBgPage
                ? 'bg-white/80 hover:bg-white hover:shadow-sm text-black'
                : 'bg-white/10 hover:bg-white/20 text-white',
            ]"
          >
            關於我們
          </LiquidNavLink>

          <!-- 探索活動 -->
          <LiquidNavLink
          to="#"
          :colorMode="getNavTextColor"
            @click="(e) => handleNavClick(e, 'activities-preview')"
            class="block w-full !px-3 py-2 !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-right transition-all duration-200 rounded-xl"
            :class="[
              isScrolled || isLightBgPage
                ? 'bg-white/80 hover:bg-white hover:shadow-sm text-black'
                : 'bg-white/10 hover:bg-white/20 text-white',
            ]"
          >
            探索活動
          </LiquidNavLink>

          <!-- 使用教學 -->
          <LiquidNavLink
            to="#"
            :colorMode="getNavTextColor"
            @click="(e) => handleNavClick(e, 'tutorial')"
            class="block w-full !px-3 py-2 !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-right transition-all duration-200 rounded-xl"
            :class="[
              isScrolled || isLightBgPage
                ? 'bg-white/80 hover:bg-white hover:shadow-sm text-black'
                : 'bg-white/10 hover:bg-white/20 text-white',
            ]"
          >
            使用教學
          </LiquidNavLink>

          <!-- 立即配對 -->
          <LiquidNavLink
            to="#"
            :colorMode="getNavTextColor"
            @click="(e) => handleNavClick(e, 'match-preview')"
            class="block w-full !px-3 py-2 !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-right transition-all duration-200 rounded-xl"
            :class="[
              isScrolled || isLightBgPage
                ? 'bg-white/80 hover:bg-white hover:shadow-sm text-black'
                : 'bg-white/10 hover:bg-white/20 text-white',
            ]"
          >
            立即配對
          </LiquidNavLink>

          <!-- 登入/註冊按鈕 -->
          <LiquidNavLink
            to="/login"
            :colorMode="isScrolled || isLightBgPage ? 'black' : 'white'"
            class="block !px-3 py-2 !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-right transition-all duration-200 rounded-xl"
            :class="[
              isScrolled || isLightBgPage
                ? 'bg-white/80 hover:bg-white hover:shadow-sm'
                : 'bg-white/10 hover:bg-white/20',
            ]"
          >
            登入
          </LiquidNavLink>

          <LiquidNavLink
            to="/register"
            :colorMode="isScrolled || isLightBgPage ? 'black' : 'white'"
            class="block !px-3 py-2 !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-right transition-all duration-200 rounded-xl"
            :class="[
              isScrolled || isLightBgPage
                ? 'bg-white/80 hover:bg-white hover:shadow-sm'
                : 'bg-white/10 hover:bg-white/20',
            ]"
          >
            註冊
          </LiquidNavLink>
        </template>

        <!-- ✅ 已登入時：顯示功能頁面連結 -->
        <template v-else>
          <LiquidNavLink
            to="/match"
            :colorMode="isScrolled || isLightBgPage ? 'black' : 'white'"
            class="block !px-3 py-2 !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-right transition-all duration-200 rounded-xl"
            :class="[
              isScrolled || isLightBgPage
                ? 'bg-white/80 hover:bg-white hover:shadow-sm'
                : 'bg-white/10 hover:bg-white/20',
            ]"
          >
            配對池
          </LiquidNavLink>

          <LiquidNavLink
            to="/product"
            :colorMode="isScrolled || isLightBgPage ? 'black' : 'white'"
            class="block !px-3 py-2 !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-right transition-all duration-200 rounded-xl"
            :class="[
              isScrolled || isLightBgPage
                ? 'bg-white/80 hover:bg-white hover:shadow-sm'
                : 'bg-white/10 hover:bg-white/20',
            ]"
          >
            商品列表
          </LiquidNavLink>

          <LiquidNavLink
            to="/activities"
            :colorMode="isScrolled || isLightBgPage ? 'black' : 'white'"
            class="block !px-3 py-2 !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-right transition-all duration-200 rounded-xl"
            :class="[
              isScrolled || isLightBgPage
                ? 'bg-white/80 hover:bg-white hover:shadow-sm'
                : 'bg-white/10 hover:bg-white/20',
            ]"
          >
            活動
          </LiquidNavLink>

          <LiquidNavLink
            to="/activities/new"
            :colorMode="isScrolled || isLightBgPage ? 'black' : 'white'"
            class="block !px-3 py-2 !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-right transition-all duration-200 rounded-xl"
            :class="[
              isScrolled || isLightBgPage
                ? 'bg-white/80 hover:bg-white hover:shadow-sm'
                : 'bg-white/10 hover:bg-white/20',
            ]"
          >
            活動表單
          </LiquidNavLink>

          <LiquidNavLink
            to="/activities/my"
            :colorMode="isScrolled || isLightBgPage ? 'black' : 'white'"
            class="block !px-3 py-2 !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-right transition-all duration-200 rounded-xl"
            :class="[
              isScrolled || isLightBgPage
                ? 'bg-white/80 hover:bg-white hover:shadow-sm'
                : 'bg-white/10 hover:bg-white/20',
            ]"
          >
            我的活動
          </LiquidNavLink>

          <LiquidNavLink
            to="/chat"
            :colorMode="isScrolled || isLightBgPage ? 'black' : 'white'"
            class="block !px-3 py-2 !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-right transition-all duration-200 rounded-xl"
            :class="[
              isScrolled || isLightBgPage
                ? 'bg-white/80 hover:bg-white hover:shadow-sm'
                : 'bg-white/10 hover:bg-white/20',
            ]"
          >
            訊息
          </LiquidNavLink>

          <LiquidNavLink
            to="/cart"
            :colorMode="isScrolled || isLightBgPage ? 'black' : 'white'"
            class="block !px-3 py-2 !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-right transition-all duration-200 rounded-xl"
            :class="[
              isScrolled || isLightBgPage
                ? 'bg-white/80 hover:bg-white hover:shadow-sm'
                : 'bg-white/10 hover:bg-white/20',
            ]"
          >
            購物車
          </LiquidNavLink>

          <LiquidNavLink
            to="/subscription"
            :colorMode="isScrolled || isLightBgPage ? 'black' : 'white'"
            class="block !px-3 py-2 !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-right transition-all duration-200 rounded-xl"
            :class="[
              isScrolled || isLightBgPage
                ? 'bg-white/80 hover:bg-white hover:shadow-sm'
                : 'bg-white/10 hover:bg-white/20',
            ]"
          >
            升級方案
          </LiquidNavLink>

          <LiquidNavLink
            to="/my-orders"
            :colorMode="isScrolled || isLightBgPage ? 'black' : 'white'"
            class="block !px-3 py-2 !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-right transition-all duration-200 rounded-xl"
            :class="[
              isScrolled || isLightBgPage
                ? 'bg-white/80 hover:bg-white hover:shadow-sm'
                : 'bg-white/10 hover:bg-white/20',
            ]"
          >
            我的購買紀錄
          </LiquidNavLink>

          <LiquidNavLink
            to="/edit-profile"
            :colorMode="isScrolled || isLightBgPage ? 'black' : 'white'"
            class="block !px-3 py-2 !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-right transition-all duration-200 rounded-xl"
            :class="[
              isScrolled || isLightBgPage
                ? 'bg-white/80 hover:bg-white hover:shadow-sm'
                : 'bg-white/10 hover:bg-white/20',
            ]"
          >
            編輯個人檔案
          </LiquidNavLink>

          <button
            @click="handleLogout"
            class="relative block w-full !px-3 py-2 overflow-hidden !text-[16px] overflow-hidden text-ellipsis whitespace-nowrap text-lg font-medium text-right transition-all duration-200 duration-300 border shadow-xl group rounded-xl backdrop-blur-xl bg-white/10 border-white/20 hover:scale-105 hover:brightness-110"
            :class="[
              isScrolled || isLightBgPage
                ? 'text-gray-800 drop-shadow-[0_0_4px_rgba(0,0,0,0.3)] bg-white/80 hover:bg-white hover:shadow-sm'
                : 'text-white drop-shadow-[0_1px_3px_rgba(255,255,255,0.5)] bg-white/1 hover:bg-white/20',
            ]"
          >
            <span class="relative z-10">登出</span>
            <span
              class="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[rgba(96,165,250,0.3)] to-[rgba(236,72,153,0.3)] blur-md"
            ></span>
          </button>
        </template>
      </div>
    </div>
  </header>
  <ScrollToTop />
</template>

<style scoped>
/* 自定義 1250px 斷點 */
@media (max-width: 1250px) {
  /* 手機版元素顯示 */
  .custom-mobile-show {
    display: block;
  }

  /* 桌機版元素隱藏 */
  .custom-desktop-show {
    display: none !important;
  }
}

@media (min-width: 1251px) {
  /* 手機版元素隱藏 */
  .custom-mobile-show {
    display: none !important;
  }

  /* 桌機版元素顯示 */
  .custom-desktop-show {
    display: flex !important;
  }

  /* 桌機版更大的水平邊距 */
  .custom-desktop-px-8 {
    padding-left: 3rem;
    padding-right: 3rem;
  }
}

/* 預設狀態 - 確保初始載入正確 */
.custom-mobile-show {
  display: block;
}

.custom-desktop-show {
  display: none;
}
</style>
