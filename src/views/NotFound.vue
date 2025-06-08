<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen text-center px-4"
  >
    <img
      src="@/assets/404.jpg"
      alt="404 illustration"
      class="w-[750px] h-auto"
    />
    <p class="text-xl mt-4 text-gray-700">Oops！你走錯路囉！</p>
    <p class="text-gray-500 mt-2">
      找不到你要的頁面，可能是路徑錯誤或頁面已被移除。
    </p>
    <RouterLink
      to="/"
      class="mt-6 px-6 py-2 text-[#363f49] hover:text-[#d2e2f2] transition"
    >
      回到首頁
    </RouterLink>
  </div>
</template>
