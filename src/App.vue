<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useUserStore } from "./stores/user";
import router from "./router";
import Header from "./components/Header.vue";
import { computed, ref, onMounted } from "vue";

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
  <main>
    <RouterView />
  </main>
</template>
