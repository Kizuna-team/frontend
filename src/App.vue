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
  <div>
    <!-- Header：根據路由條件顯示 -->
    <Header v-if="showHeader" />
    
    <main :class="mainClass">
      <RouterView />
    </main>
  </div>
</template>
