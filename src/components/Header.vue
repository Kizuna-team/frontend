<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useRoute } from "vue-router";
import router from "@/router";
import LiquidNavLink from "@/components/LiquidGlass.vue";
import { useCartStore } from "@/stores/cart.js";
const cartStore = useCartStore();
const route = useRoute();
const store = useUserStore();
const handleLogout = () => {
  store.logout();
  alert("已登出");
  router.push("/login");
};

const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const debugY = ref(0);
const textColorClass = ref("white");

function handleScroll() {
  const y = window.scrollY;
  debugY.value = y;
  if (y < 900) {
    textColorClass.value = "white";
  } else if (y >= 900 && y < 3700) {
    textColorClass.value = "black";
  } else {
    textColorClass.value = "blue";
  }
}

// 根據路由決定字體顏色
const getNavTextColor = computed(() => {
  // 如果是首頁，保持原本的滾動變色邏輯
  if (route.path === "/") {
    return textColorClass.value; // 使用原本的 textColorClass 變數
  }

  // 其他所有頁面都使用黑色
  return "black";
});

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
  window.addEventListener("scroll", handleScroll);
});

// 組件卸載時移除事件監聽器
onUnmounted(() => {
  window.removeEventListener("click", closeDropdown);
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <header class="fixed top-0 left-0 z-50 w-full h-20 navbar-header">
    <nav class="flex items-center justify-between px-6 py-4">
      <!-- debug -->
      <div
        class="absolute px-2 py-1 text-sm text-white bg-black rounded top-20 left-4"
      >
        Route: {{ $route.path }} | scrollY: {{ debugY }} | Color:
        {{ getNavTextColor }}
      </div>
      <div class="flex items-center w-1/4">
        <LiquidNavLink to="/" :colorMode="getNavTextColor"
          >Kizuna</LiquidNavLink
        >
      </div>

      <div class="flex justify-center flex-1 space-x-4">
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
<<<<<<< HEAD
        <LiquidNavLink to="/activities/edit/:id" :colorMode="getNavTextColor"
          >活動編輯</LiquidNavLink
        >
        <LiquidNavLink to="/activities/my" :colorMode="getNavTextColor"
          >我的活動</LiquidNavLink
=======
        <RouterLink
          to="/activities/my"
          class="p-4 text-lg leading-none transition hover:text-gray-300"
          >我的活動</RouterLink
>>>>>>> 5ffd6c4 (feat(activity): add getActivityById API and enhance activity form UI/UX and image preview)
        >
        <LiquidNavLink to="/edit-profile" :colorMode="getNavTextColor"
          >編輯個人檔案
        </LiquidNavLink>
      </div>

      <template v-if="!store.accessToken">
        <div class="flex items-center justify-end w-1/4 space-x-4">
          <LiquidNavLink to="/login" :colorMode="getNavTextColor"
            >登入</LiquidNavLink
          >
          <LiquidNavLink to="/register" :colorMode="getNavTextColor"
            >註冊</LiquidNavLink
          >
        </div>
      </template>
      <!-- 已登入狀態：顯示訊息、購物車和用戶選單 -->
      <template v-else>
        <div class="flex items-center justify-end w-1/4 space-x-4">
          <!-- 訊息icon -->
          <LiquidNavLink to="/chat" :colorMode="getNavTextColor">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-7"
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
                class="size-7"
              >
                <path
                  d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                />
              </svg>
            </div>
          </LiquidNavLink>

          <!-- 用戶選單 -->
          <div class="relative">
            <div
              class="flex items-center justify-center w-12 h-12 text-sm font-bold shadow-xl bg-[#ffffff] rounded-full text-[#000000] hover:bg-[#c5c5c5] cursor-pointer"
              @click="toggleDropdown"
            >
              {{
                store.username ? store.username.charAt(0).toUpperCase() : "U"
              }}
            </div>
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 w-40 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <div
                class="flex items-center justify-center px-4 py-4 text-gray-500"
              >
                目前登入帳號為 : {{ store.username }}
              </div>
              <!-- 0616 暫時先移到外面  -->
              <!-- <RouterLink
                to="/edit-profile"
                class="flex items-center gap-2 px-4 py-4 text-gray-600 border-b border-gray-300 hover:bg-gray-100"
                @click="isDropdownOpen = false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                <span class="whitespace-nowrap">編輯個人檔案</span>

              </RouterLink> -->
              <a
                href="#"
                class="flex items-center gap-2 px-4 py-4 text-gray-600 border-b border-gray-300 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                升級方案
              </a>

              <a
                href="#"
                class="flex items-center gap-2 px-4 py-4 text-gray-600 border-b border-gray-300 hover:bg-gray-100"
                @click="handleLogout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                  />
                </svg>
                登出
              </a>
            </div>
          </div>
        </div>
      </template>
    </nav>
  </header>
</template>

<style scoped>
.group:hover .glow {
  opacity: 1;
}
</style>
