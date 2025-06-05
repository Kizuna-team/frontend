<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useUserStore } from "./stores/user";
import router from "./router";
import Header from "./components/Header.vue";
const store = useUserStore();

const handleLogout = () => {
  store.logout();
  alert("已登出");
  router.push("/login");
};
</script>

<template>
  <Header></Header>
  <main class="max-w-[1000px] mx-auto mt-24"></main>
</template>

<style></style>
