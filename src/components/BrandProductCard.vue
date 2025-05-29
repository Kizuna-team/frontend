<script setup>
import { useCartStore } from "@/stores/cart.js";

const brandproductStore = useBrandProductStore();
const cartStore = useCartStore();

const { addCart } = cartStore; //解構拿來使用

defineProps({
  brandproduct: {
    type: Object,
    required: true,
  },
});
// 記得要使用props，還有該拿到的變數資料(js)要進來
</script>

<template>
  
  <div class="rounded-lg shadow-lg p-4 flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
    <div>
      <img :src="brandproduct.img" alt="" class="rounded-lg">
    </div>
    <p class="text-lg font-semibold text-gray-800 mt-2 mb-1">{{ brandproduct.name }}</p>
    <p class="text-gray-600 mb-1">價格: {{ brandproduct.price }}</p>
    <p class="text-gray-600">庫存: {{ brandproduct.inventory }}</p>
    <button @click="addCart(brandproduct)" class="mt-4  bg-primary-200 text-black px-4 py-2 rounded hover:bg-primary-100  hover:text-white transition">加入購物車</button>
  </div>
</template>

<style scoped></style>