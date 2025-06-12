<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const inLightBackground = ref(false)
const glassRef = ref(null)

function startDrag(event) {
  isDragging.value = true
  startX.value = event.clientX
  startY.value = event.clientY
}

function stopDrag() {
  isDragging.value = false
}

function onDrag(event) {
  if (!isDragging.value) return

  const dx = event.clientX - startX.value
  const dy = event.clientY - startY.value

  event.currentTarget.style.transform = `translate(${dx}px, ${dy}px)`
}

function handleScroll() {
  const y = window.scrollY
  // 滑動變色
  inLightBackground.value = y >= 900 && y < 4000
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="fixed top-4 left-3 z-50">
    <div
      ref="glassRef"
      class="relative rounded-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl overflow-hidden group transition-all duration-300 hover:scale-105 cursor-pointer"
      @mousedown="startDrag"
      @mouseup="stopDrag"
      @mousemove="onDrag"
    >
      <!-- 背景光暈 -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.3),transparent_70%)] opacity-40 blur-2xl pointer-events-none"></div>
      <!-- 文字內容，根據背景切換顏色與 hover 效果 -->
      <div
        class="p-4 text-xl transition-colors duration-300 group-hover:bg-gradient-to-r from-[rgba(96,165,250,0.3)] to-[rgba(236,72,153,0.3)]
 hover:transition-all duration-300"
        :class="inLightBackground ? 'text-gray-800 drop-shadow-[0_0_4px_rgba(0,0,0,0.3)]' : 'text-white drop-shadow-[0_1px_3px_rgba(255,255,255,0.5)]'"
      >
        Liquid Glass UI
      </div>
    </div>
  </header>
</template>

<style scoped>
.group:hover .glow {
  opacity: 1;
}
</style>
