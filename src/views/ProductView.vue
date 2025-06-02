<!-- <script setup>
import ProductList from "@/components/ProductList.vue";
</script>

<template>
  <ProductList />
</template> -->

<!-- 0602 melody -->
<script setup>
import { ref, onMounted } from "vue";
import axios from "../api/axios.js";
import { useCartStore } from "../stores/cart.js";

const cartStore = useCartStore();

const { addCart } = cartStore; //解構拿來使用

const products = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get("/products");
    products.value = res.data;
  } catch (err) {
    console.error("讀取商品失敗", err);
  }
});
</script>

<template>
  <div class="">
    <h1 class="mb-4 text-xl font-bold">商品列表</h1>
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="p-4 mb-2 shadow-xl rounded-xl"
      >
        <div class="flex flex-col justify-between h-full">
          <!-- 上半部: 圖片 + 描述 -->
          <div class="mb-2">
            <img
              :src="product.image_url"
              alt="Product Image"
              class="object-cover w-full b-2"
            />
          </div>
          <div class="flex flex-col h-full gap-2">
            <p>{{ product.name }}</p>
            <p>價格：{{ product.price }}</p>
            <p>描述：{{ product.description }}</p>
          </div>
          <!-- 下半部 : 庫存 -->
          <!-- 這樣寫是因為商品描述長度不同 會導致庫存在不同水平線上 -->
          <div class="flex">
            <p class="py-2 mr-4">庫存：{{ product.inventory }}</p>
            <template v-if="product.inventory <= 5">
              <p class="p-2 font-bold text-white bg-red-500 skew-x-[-20deg] rounded-lg">庫存不足 要買要快</p>
            </template>
          </div>
          <button @click="addCart(product)" class="py-2 my-3 text-center text-white bg-yellow-300 rounded-lg hover:bg-yellow-400">點我加入購物車</button>
        </div>
      </div>
    </div>
  </div>
</template>
