<script setup>
import { ref, defineProps, defineEmits } from "vue";

// Props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["toggle"]);

// Template refs
const stickerButtonRef = ref(null);

// 切換面板
const togglePanel = () => {
  if (!props.disabled) {
    emit("toggle");
  }
};

// 暴露 button ref 給父組件使用
defineExpose({
  stickerButtonRef,
});
</script>

<template>
  <button
    ref="stickerButtonRef"
    @click="togglePanel"
    :disabled="disabled"
    :class="[
      'p-2 rounded-lg transition-colors flex-shrink-0',
      disabled
        ? 'text-gray-400 cursor-not-allowed'
        : 'text-gray-600 hover:bg-gray-100 hover:text-[#f6ba42]',
      active ? 'bg-gray-100 text-[#f6ba42]' : '',
    ]"
    :title="disabled ? '請先登入' : '選擇貼圖'"
  >
    <svg
      class="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      :class="{ 'animate-pulse': active }"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </button>
</template>

<style scoped>
/* 按鈕點擊動畫 */
.p-2:active {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}

/* 禁用狀態樣式 */
.cursor-not-allowed:hover {
  background-color: transparent !important;
  color: rgb(156 163 175) !important;
}
</style>
