<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useUserStore } from "./stores/user";
import router from "./router";
import Header from "./components/Header.vue";
import { computed } from "vue";
import { useToast } from "vue-toastification";
const toast = useToast();

const store = useUserStore();
const route = useRoute();

const showHeader = computed(() => {
  return !route.meta.hideHeader;
});

const mainClass = computed(() => {
  const fullWidthPaths = ["/", "/subscription"];
  
  if (fullWidthPaths.includes(route.path)) {
    return "w-full";
  }
  
  if (route.path === "/chat") {
    return "max-w-[1000px] mx-auto mt-4"; 
  }
  
  return "max-w-[1000px] mx-auto mt-32";
});

const handleLogout = () => {
  store.logout();
  toast("已登出");
  router.push("/login");
};
</script>

<template>
  <div :class="{ 'home-page': $route.path === '/' }">
    <Header v-if="showHeader" />
    <main :class="mainClass">
      <RouterView />
    </main>
  </div>
</template>

<style>
.home-page .navbar-header {
  opacity: 0;
  transform: translateY(-20px);
  animation: navbar-appear 0.8s ease forwards;
  animation-delay: 3s;
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
