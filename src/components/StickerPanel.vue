<template>
  <div
    v-if="show"
    ref="stickerPanelRef"
    class="absolute bottom-full left-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 sticker-panel"
  >
    <div class="flex flex-col">
      <div class="text-sm font-medium text-gray-700 mb-2">選擇貼圖</div>
      <div class="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto w-80">
        <button
          v-for="sticker in stickers"
          :key="sticker.id"
          @click="selectSticker(sticker)"
          class="p-2 hover:bg-[#f6ba42] rounded-lg transition-colors flex flex-col items-center group"
          :title="sticker.name"
        >
          <!-- 顯示貼圖圖片，如果載入失敗則顯示emoji -->
          <img
            :src="sticker.url"
            :alt="sticker.name"
            class="w-10 h-10 object-contain mb-1 sticker-image"
            @error="handleImageError"
          />
          <span class="text-3xl hidden sticker-emoji">{{ sticker.emoji }}</span>
         
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  stickers: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['select-sticker', 'close'])

// Template refs
const stickerPanelRef = ref(null)

// 選擇貼圖
const selectSticker = (sticker) => {
  emit('select-sticker', sticker)
}

// 處理圖片載入錯誤
const handleImageError = (event) => {
  const img = event.target
  const emojiSpan = img.nextElementSibling
  
  // 隱藏圖片，顯示emoji
  img.style.display = 'none'
  if (emojiSpan) {
    emojiSpan.style.display = 'block'
  }
}

// 暴露 panel ref 給父組件使用
defineExpose({
  stickerPanelRef
})
</script>

<style scoped>
/* 貼圖面板動畫 */
.sticker-panel {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 自定義滾動條樣式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 貼圖按鈕 hover 效果 */
.group:hover .sticker-image {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>