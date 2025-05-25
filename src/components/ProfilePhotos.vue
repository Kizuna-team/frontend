<template>
  <h1 class="text-2xl font-bold text-center mb-6 text-[#1c3b5a]">上傳照片</h1>
  <div class="grid grid-cols-3 gap-4">
    <div
      v-for="n in 6"
      :key="n"
      class="border border-dashed rounded-xl aspect-square flex items-center justify-center text-2xl text-gray-400"
    >
      +
    </div>
  </div>
</template>

<!-- 照片邏輯 -->
<script setup></script>
