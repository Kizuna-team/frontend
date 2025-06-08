<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: "" },
  class: { type: String, default: "" },
  loadingClass: { type: String, default: "animate-pulse bg-gray-200" },
});

const isVisible = ref(false);
const isLoading = ref(true);
const imgRef = ref(null);
let observer = null;

onMounted(() => {
  try {
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer?.disconnect();
        observer = null;
      }
    });

    if (imgRef.value) {
      observer.observe(imgRef.value);
    }
  } catch (error) {
    console.error("IntersectionObserver 初始化失敗:", error);
    isVisible.value = true; // 降級：直接顯示圖片
  }
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});

const handleImageLoad = () => {
  isLoading.value = false;
};

const handleImageError = (e) => {
  console.error("圖片載入失敗:", e);
  isLoading.value = false;
};
</script>

<template>
  <div ref="imgRef" class="w-full h-full">
    <!-- 載入中的佔位元素 -->
    <div
      v-if="isVisible && isLoading"
      :class="[loadingClass]"
      class="w-full h-full"
    ></div>

    <!-- 圖片 -->
    <img
      v-if="isVisible"
      :src="src"
      :alt="alt"
      :class="[props.class, { hidden: isLoading }]"
      class="object-cover w-full h-full"
      @load="handleImageLoad"
      @error="handleImageError"
    />
  </div>
</template>
