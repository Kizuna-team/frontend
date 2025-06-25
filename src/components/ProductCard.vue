<script setup>
import { useCartStore } from "../stores/cart.js";

const cartStore = useCartStore();

const { addCart } = cartStore; 

defineProps({
  product: {
    type: Object,
    required: true,
  },
});


</script>

<template>
  
  <div class="flex flex-col items-center p-4 transition-shadow duration-300 rounded-lg shadow-lg hover:shadow-xl">
    <div>
      <img :src="product.img" alt="" class="rounded-lg">
    </div>
    <p class="mt-2 mb-1 text-lg font-semibold text-gray-800">{{ product.name }}</p>
    <p class="mb-1 text-gray-600">$ {{ product.price }}</p>
    <p class="text-gray-600">庫存: {{ product.inventory }}</p>
    <button @click="addCart(product)" class="px-4 py-2 mt-4 text-black transition rounded bg-primary-200 hover:bg-primary-100 hover:text-white">加入購物車</button>
  </div>
</template>

<style scoped></style>
