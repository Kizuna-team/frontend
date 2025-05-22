<script setup>
import { useProductStore } from "@/stores/products.js";
import { useCartStore } from "@/stores/cart.js";

const productStore = useProductStore();
const cartStore = useCartStore();

const { addCart } = cartStore; //解構拿來使用

defineProps({
  product: {
    type: Object,
    required: true,
  },
});
// 記得要使用props，還有該拿到的變數資料(js)要進來
</script>

<template>
  <div class="rounded-lg shadow-lg p-4 flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
    <div>
      <img :src="product.img" alt="" class="rounded-lg">
    </div>
    <p class="text-lg font-semibold text-gray-800 mt-2 mb-1">{{ product.name }}</p>
    <p class="text-gray-600 mb-1">價格: {{ product.price }}</p>
    <p class="text-gray-600">庫存: {{ product.inventory }}</p>
    <button @click="addCart(product)" class="mt-4 bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition">加入購物車</button>
  </div>
</template>

<style scoped></style>
