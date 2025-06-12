<script setup>
import { ref, computed, watch } from "vue"
const emit = defineEmits(["update:subtotal"])

const price = 300
const quantity = ref(1)
const subtotal = computed(() => price * quantity.value)

const increaseQty = () => quantity.value++
const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--
}

watch(subtotal, (newVal) => emit("update:subtotal", newVal), { immediate: true })
</script>

<template>
  <div class="flex items-center p-4 mb-8 transition duration-200 border rounded-md shadow-sm hover:shadow-md hover:scale-[1.01]">
    <img
      class="w-20 h-20 rounded-md border border-[#c0d7ec] object-cover"
      src="https://placehold.co/80"
      alt="沙拉圖"
    />
    <div class="flex-1 ml-4">
      <p class="font-medium">饗泰多 輕食沙拉</p>
      <p class="text-gray-500">$ {{ price }}</p>
    </div>
    <div class="flex items-center">
      <button @click="decreaseQty" class="px-2 bg-[#DADADA] hover:bg-[#c0c0c0] rounded">-</button>
      <span class="px-2">{{ quantity }}</span>
      <button @click="increaseQty" class="px-2 bg-[#DADADA] hover:bg-[#c0c0c0] rounded">+</button>
    </div>
    <div class="ml-4 font-bold">$ {{ subtotal }}</div>
  </div>
</template>
