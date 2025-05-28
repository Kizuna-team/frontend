<script setup>
import PhotoUploader from "@/components/PhotoUploader.vue";
import { ref } from "vue";

const photoUploaderRef = ref(null);

const handleUpload = () => {
  photoUploaderRef.value?.uploadAll();
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#d1e3f5]">
    <div class="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold text-[#1c3b5a]">上傳照片</h1>
        <button
          @click="handleUpload"
          class="px-4 py-1 font-bold text-white bg-orange-400 rounded hover:bg-orange-500"
        >
          完成
        </button>
      </div>

      <PhotoUploader ref="photoUploaderRef" />
    </div>
  </div>
</template>
