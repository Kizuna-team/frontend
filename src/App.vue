<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useUserStore } from "./stores/user";
import router from "./router";
import Header from "./components/Header.vue";
import { computed } from "vue";

const store = useUserStore();
// 拿到當前路由
const route = useRoute();

// 根據 meta 控制 404 頁面 Header 是否顯示
const showHeader = computed(() => {
  return !route.meta.hideHeader;
});

const mainClass = computed(() => {
  return route.path === "/" ? "w-full" : "max-w-[1000px] mx-auto mt-32";
});

const handleLogout = () => {
  store.logout();
  alert("已登出");
  router.push("/login");
};


</script>

<template>
  <div :class="{ 'home-page': $route.path === '/' }">
    <!-- Header：根據路由條件顯示 -->
    <Header v-if="showHeader" />
    <main :class="mainClass">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* 首頁的Loading效果 */
.home-page .navbar-header {
  opacity: 0;
  transform: translateY(-20px);
  animation: navbar-appear 0.8s ease forwards;
  animation-delay: 5.2s;
}

@keyframes navbar-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>