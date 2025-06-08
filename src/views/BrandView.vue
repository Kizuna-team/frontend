<script setup>
import { useBrandStore } from "@/stores/brand.js";
import ProductCard from "@/components/ProductCard.vue";
import { useProductStore } from "@/stores/products.js";

const brandStore = useBrandStore();
// const cartStore = useCartStore();

const productStore = useProductStore();
const { products } = productStore;
</script>

<template>
  <h2 class="text-2xl">響泰多</h2>

  <div class="grid grid-cols-1 gap-6 py-10 sm:grid-cols-1 lg:grid-cols-1">
    <div class="bg-sky-100 h-[250px] w-full rounded-lg items-center gap-6">
      <img
        class="block object-cover w-full h-full rounded-lg"
        src="https://www.siammore.com.tw/storage/website/news/siammore20240510162216_List.jpeg"
        alt="響泰多"
      />
    </div>
  </div>

  <h2 class="py-5 text-2xl">人氣推薦</h2>

  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
    <!-- 記得可以直接傳物件 -->
  </div>
  <h2 class="py-5 text-2xl">全部商品</h2>

  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
    <!-- 記得可以直接傳物件 -->
  </div>
</template>
