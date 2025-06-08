<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useUserStore } from "./stores/user";
import router from "./router";
import Header from "./components/Header.vue";
import { ref, onMounted } from "vue";
import LoadingScreen from "./components/LoadingScreen.vue"; // 新增匯入

const store = useUserStore();

const handleLogout = () => {
  store.logout();
  alert("已登出");
  router.push("/login");
};

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 7000);
});
</script>

<template>
  <Header></Header>
  <main class="max-w-[1000px] mx-auto mt-24"></main>
</template>
