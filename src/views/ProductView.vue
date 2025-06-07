<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "../api/axios.js";
import { useCartStore } from "../stores/cart.js";

const cartStore = useCartStore();
const { addCart } = cartStore;

const products = ref([]);
const selectedCategory = ref("咖啡");
const categories = ref(["全部", "咖啡", "飲料", "甜點"]);
const searchKeyword = ref("");

const filteredProducts = computed(() => {
  let filtered = products.value;

  //分類篩選
  if (selectedCategory.value !== "全部") {
    filtered = filtered.filter(
      (product) => product.category === selectedCategory.value
    );
  }

  return filtered;
});
onMounted(async () => {
  try {
    const res = await axios.get("/products");
    products.value = res.data;
  } catch (err) {
    console.log("讀取商品失敗", err);
  }
});
</script>

<template>
  <div class="flex gap-4 mb-4">
    <button
      v-for="category in categories"
      :key="category"
      @click="selectedCategory = category"
      :class="{
        'bg-yellow-300': selectedCategory === category,
        'bg-gray-200': selectedCategory !== category,
      }"
      class="px-4 py-2 rounded"
    >
      {{ category }}
    </button>
  </div>
  <input type="text" placeholder="輸入關鍵字搜尋商品" />
  <div>
    <h1 class="mb-4 text-xl font-bold text-center text-[#023047]">商品列表</h1>
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="p-4 mb-2 transition-transform shadow-xl hover:scale-105 hover:shadow-2xl rounded-[10px]"
      >
        <div class="flex flex-col justify-between h-full">
          <!-- 上半部: 圖片 + 描述 -->
          <div class="mb-2">
            <img
              :src="product.image_url"
              alt="Product Image"
              class="object-cover w-full b-2 rounded-[10px]"
            />
          </div>
          <div class="flex flex-col h-full gap-2">
            <p class="font-semibold text-center text-[#023047]">
              {{ product.name }}
            </p>
            <p class="text-center text-[#023047] font-semibold">
              價格：{{ product.price }}
            </p>
            <p class="mx-12 text-center text-gray-500">
              {{ product.description }}
            </p>
          </div>
          <!-- 下半部 : 庫存 -->
          <!-- 這樣寫是因為商品描述長度不同 會導致庫存在不同水平線上 -->
          <div class="flex justify-center mb-4">
            <p class="py-1 mr-4 text-[#023047] font-semibold">
              庫存：{{ product.inventory }}
            </p>
            <div v-if="product.inventory <= 5">
              <p class="py-1 px-4 bg-[#ffb703] text-white rounded-[20px]">
                庫存不足
              </p>
            </div>
          </div>
          <button
            @click="addCart(product)"
            class="css-button-fully-rounded--blue"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="relative size-6 -top-0.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            加入購物車
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.css-button-fully-rounded--blue {
  min-width: 130px;
  width: 150px;
  height: 40px;
  color: #fff;
  padding: 5px 10px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  border-radius: 20px;
  border: 2px solid #219ebc;
  background: #219ebc;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin: auto;
}

.css-button-fully-rounded--blue:hover {
  background: #fff;
  color: #219ebc;
}
</style>
