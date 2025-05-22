<script setup>
import { useProductStore } from "@/stores/products.js";
import ProductCard from "@/components/ProductCard.vue";
const productStore = useProductStore();
const { products } = productStore;
// 記得要解構
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <ProductCard
    v-for="product in products"
    :key="product.id"
    :product="product"
  />
  <!-- 記得可以直接傳物件 -->
  </div>
</template>

<style scoped></style>
