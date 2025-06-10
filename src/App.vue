<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useUserStore } from "./stores/user";
import router from "./router";
import Header from "./components/Header.vue";
import { computed } from "vue";

const store = useUserStore();
// 拿到當前路由
const route = useRoute();

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
    <!-- Header 不需固定寬度，放在外層 -->
    <Header />

    <!-- 根據路由決定是否要限制寬度 -->
    <main :class="mainClass">
      <RouterView />
    </main>
  </div>
</template>
