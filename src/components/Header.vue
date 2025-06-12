<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useUserStore } from "@/stores/user";
import router from "@/router";
import LiquidNavLink from "@/components/LiquidGlass.vue";

const store = useUserStore();
const handleLogout = () => {
  store.logout();
  alert("已登出");
  router.push("/login");
};

const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const debugY = ref(0)
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

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="fixed top-0 left-0 w-full h-20 z-50">
    <nav class="flex items-center justify-between px-6 py-4">
      <!-- debug -->
      <div class="absolute top-20 left-4 text-sm text-white bg-black px-2 py-1 rounded">
        scrollY in {{ debugY }}: {{ textColorClass }}
      </div>
      <div class="flex items-center">
        <LiquidNavLink to="/" :colorMode="textColorClass">Kizuna</LiquidNavLink>
      </div>

      <div class="flex justify-center flex-1 space-x-4">
        <LiquidNavLink to="/match" :colorMode="textColorClass">配對池</LiquidNavLink>
        <LiquidNavLink to="/product" :colorMode="textColorClass">商品列表</LiquidNavLink>
        <LiquidNavLink to="/activities" :colorMode="textColorClass">活動</LiquidNavLink>
        <LiquidNavLink to="/activities/new" :colorMode="textColorClass">活動表單</LiquidNavLink>
        <LiquidNavLink to="/activities/edit/:id" :colorMode="textColorClass">活動編輯</LiquidNavLink>
      </div>

      <template v-if="!store.accessToken">
        <LiquidNavLink to="/login" :colorMode="textColorClass">登入</LiquidNavLink>
        <LiquidNavLink to="/register" :colorMode="textColorClass">註冊</LiquidNavLink>
        <LiquidNavLink to="/chat">💬</LiquidNavLink>
        <LiquidNavLink to="/cart">🛒</LiquidNavLink>
      </template>

      <div class="flex items-center space-x-4">
        <div class="relative">
          <div
            class="flex items-center justify-center w-12 h-12 text-sm font-bold bg-[#ddedff] rounded-full text-[#7395BA] hover:bg-slate-300"
            @click="toggleDropdown"></div>
          <div v-if="isDropdownOpen"
            class="absolute right-0 w-40 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg">
            <div class="flex items-center justify-center px-4 py-4 text-gray-500">
              目前登入帳號為 : {{ store.username }}
            </div>
            <LiquidNavLink to="/edit-profile" @click="isDropdownOpen = false">編輯個人檔案</LiquidNavLink>
            <a href="#"
              class="flex items-center gap-2 px-4 py-4 text-gray-600 border-b border-gray-300 hover:bg-gray-100">升級方案</a>
            <a href="#"
              class="flex items-center gap-2 px-4 py-4 text-gray-600 border-b border-gray-300 hover:bg-gray-100"
              @click="handleLogout">登出</a>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>


<style scoped>
.group:hover .glow {
  opacity: 1;
}
</style>
