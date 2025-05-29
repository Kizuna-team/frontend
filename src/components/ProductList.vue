<script setup>
import { useProductStore, useBrandStore } from "../stores/products.js";
import ProductCard from "@/components/ProductCard.vue";

const productStore = useProductStore();
const { products } = productStore;

const brandStore = useBrandStore();
const { filteredBrands, changeCurrentCategory } = brandStore;

const handleClick = (cat) => {
  changeCurrentCategory(cat);
};
// 記得要解構
</script>

<template>
  <div class="mx-auto bg-primary-200 rounded-lg max-w-full shadow-lg">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-10">
      <a
        class="flex justify-center hover:bg-primary-100 hover:text-stone-50 text-stone-950 p-[10px] mt-[20px] rounded-lg"
        href="#"
        @click.prevent="handleClick('restaurant')"
        >連鎖餐廳</a
      >
      <a
        class="flex justify-center hover:bg-primary-100 hover:text-stone-50 text-stone-950 p-[10px] mt-[20px] rounded-lg"
        href="#"
        @click.prevent="handleClick('cafe')"
        >咖啡/甜點</a
      >
      <a
        class="flex justify-center hover:bg-primary-100 hover:text-stone-50 text-stone-950 p-[10px] mt-[20px] rounded-lg"
        href="#"
        @click.prevent="handleClick('fastfood')"
        >速食快餐</a
      >
      <a
        class="flex justify-center hover:bg-primary-100 hover:text-stone-50 text-stone-950 p-[10px] mt-[20px] rounded-lg"
        href="#"
        @click.prevent="handleClick('aroma')"
        >療癒香氛</a
      >
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 px-10 py-10"
    >
      <router-link
        class="bg-white h-[80px] rounded-lg hover:shadow-lg flex items-center gap-6"
        v-for="brand in brandStore.filteredBrands"
        :key="brand.id"
        :to="`/brand/${brand.id}`"
      >
        <img
          class="rounded-lg max-h-full max-w-full object-contain"
          :src="brand.imgUrl"
          :alt="brand.name"
        />
        {{ brand.name }}
      </router-link>
    </div>
  </div>

  <h2 class="flex justify-center p-10 text-4xl">探索更多禮物</h2>

  <a href="#" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
    <!-- 記得可以直接傳物件 -->
  </a>
</template>

<style scoped></style>
