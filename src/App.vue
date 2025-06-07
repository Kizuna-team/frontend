<script setup>
import { RouterLink, RouterView ,useRoute  } from "vue-router";
import { useUserStore } from "./stores/user";
import router from "./router";
import Header from "./components/Header.vue";
import { computed, ref, onMounted } from "vue";
import LoadingScreen from "./components/LoadingScreen.vue"; // 新增匯入


import { useToast } from "vue-toastification";

const toast = useToast();

const store = useUserStore();
// 拿到當前路由
const route = useRoute()

const mainClass = computed(() => {
  return route.path === '/' ? 'w-full' : 'max-w-[1000px] mx-auto mt-32'
})

const handleLogout = () => {
  store.logout();
  toast("已登出");
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


  <div>
    <!-- Header 不需固定寬度，放在外層 -->
    <Header />

    <!-- Loading 畫面 -->
    <LoadingScreen v-if="isLoading" />

    <!-- 根據路由決定是否要限制寬度 -->
    <main :class="mainClass" v-else>
      <RouterView />
    </main>


  </div>
  
</template>
