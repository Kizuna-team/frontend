<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "../api/axios.js";
import { useCartStore } from "../stores/cart.js";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import spinner from "../assets/spinner.svg";

const cartStore = useCartStore();
const { addCart } = cartStore;

const products = ref([]);
const displayedProducts = ref([]);
const selectedCategory = ref();
const categories = ref(["全部", "咖啡", "飲料", "甜點"]);
const searchKeyword = ref("");
const isLoading = ref(true);

watch(selectedCategory, () => {
  search();
});

const topSellingProducts = computed(() => {
  return [...products.value].sort((a, b) => b.sales - a.sales).slice(0, 10);
});

const search = () => {
  let filtered = products.value;

  //分類篩選
  if (selectedCategory.value !== "全部") {
    filtered = filtered.filter(
      (product) => product.category === selectedCategory.value
    );
  }

  //搜尋關鍵字
  if (searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.trim().toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
    );
  }

  return (displayedProducts.value = filtered);
};

onMounted(async () => {
  try {
    isLoading.value = true;
    const res = await axios.get("/products");
    products.value = res.data;
    displayedProducts.value = res.data;
  } catch (err) {
    console.log("讀取商品失敗", err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div v-show="isLoading" class="loading-overlay">
    <img :src="spinner" alt="Loading" class="w-20 h-20" />
  </div>
  <div class="flex items-center justify-center gap-2 mb-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="#023047"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
      />
    </svg>
    <h2 class="text-2xl font-bold text-center text-[#023047]">暢銷禮物</h2>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="#023047"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
      />
    </svg>
  </div>
  <Swiper
    :modules="[Navigation]"
    :slides-per-view="4"
    :space-between="20"
    navigation
    class="mb-6 mySwiper"
  >
    <SwiperSlide v-for="product in topSellingProducts" :key="product.id">
      <div class="p-4 transition rounded-lg shadow-md hover:shadow-xl">
        <img
          :src="product.image_url"
          class="object-cover w-full h-48 mb-2 rounded-lg"
        />
        <p class="mb-2 font-semibold text-center text-[#023047]">
          {{ product.name }}
        </p>
        <p class="text-center text-[#219ebc] font-bold mb-2">
          價格：{{ product.price }}
        </p>
        <p
          class="mb-2 text-center w-40 py-1 bg-[#219ebc] text-white rounded-[20px] mx-auto"
        >
          銷售量：{{ product.sales }}
        </p>
      </div>
    </SwiperSlide>
  </Swiper>
  <div class="flex justify-center gap-4 mb-4">
    <button
      v-for="category in categories"
      :key="category"
      @mouseover="selectedCategory = category"
      :class="{
        'relative after:block after:h-[2px] after:bg-[#219ebc] after:w-[100%] after:absolute after:bottom-0 after:left-0 text-gray-600':
          selectedCategory === category,
        'text-gray-400': selectedCategory !== category,
      }"
      class="px-4 py-2 font-semibold rounded"
    >
      {{ category }}
    </button>
  </div>
  <div class="flex items-center justify-center gap-2 my-10">
    <input
      type="text"
      placeholder="輸入關鍵字搜尋商品"
      v-model="searchKeyword"
      @keyup.enter="search"
      class="border border-gray-400 rounded-[20px] p-2 max-w-[600px] w-full outline-[#219ebc]"
    />
    <button @click="search">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#219ebc"
        class="size-8"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    </button>
  </div>
  <div>
    <h1 class="mb-4 text-2xl font-bold text-center text-[#023047]">
      {{ selectedCategory }}
    </h1>
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="product in displayedProducts"
        :key="product.id"
        class="p-4 mb-2 transition-transform shadow-xl hover:scale-105 hover:shadow-2xl rounded-[10px]"
      >
        <div class="flex flex-col justify-between h-full">
          <!-- 上半部: 圖片 + 描述 -->
          <div class="mb-2">
            <img
              :src="product.image_url"
              alt="Product Image"
              class="object-cover w-full h-[290px] b-2 rounded-[10px]"
            />
          </div>
          <div class="flex flex-col h-full gap-2">
            <p class="font-semibold text-center text-[#023047]">
              {{ product.name }}
            </p>
            <p class="text-center text-[#219ebc] font-semibold">
              價格：{{ product.price }}
            </p>
            <p class="mx-12 text-center text-gray-500">
              {{ product.description }}
            </p>
          </div>
          <!-- 下半部 : 庫存 -->
          <!-- 這樣寫是因為商品描述長度不同 會導致庫存在不同水平線上 -->
          <div class="flex justify-center gap-4 mb-4">
            <p class="py-1 text-[#023047] font-semibold">
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

.swiper-button-next,
.swiper-button-prev {
  @apply w-8 h-8 bg-white text-gray-500 rounded-full flex items-center justify-center;
}

.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 1rem;
}

.loading-overlay {
  @apply fixed top-0 left-0 w-screen h-screen bg-black/30 flex items-center justify-center z-10;
}
</style>
