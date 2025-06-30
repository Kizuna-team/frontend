<script setup>
defineProps({
  to: String,
  colorMode: {
    type: String,
    default: "white",
  },
});
</script>

<template>
  <RouterLink
    :to="to"
    class="group relative overflow-hidden rounded-full px-6 py-2 text-lg transition-all duration-300 backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl hover:scale-105 hover:brightness-110"
      :class="{
      'text-white drop-shadow-[0_1px_3px_rgba(255,255,255,0.5)]': colorMode === 'white',
      'text-gray-800 drop-shadow-[0_0_4px_rgba(0,0,0,0.3)]': colorMode === 'black',
      'text-[#2F4858] drop-shadow-[0_0_6px_rgba(0,128,255,0.4)]': colorMode === 'blue',
    }"
  >
    <span class="relative z-10"><slot /></span>
    <span
      class="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[rgba(96,165,250,0.3)] to-[rgba(236,72,153,0.3)] blur-md"
    ></span>
  </RouterLink>
</template>

