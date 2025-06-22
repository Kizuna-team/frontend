<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "../api/axios.js";
import { useCartStore } from "../stores/cart.js";
import spinner from "../assets/spinner.svg";
import { Vue3Lottie } from "vue3-lottie";
import addCartAnimation from "@/assets/add-cart.json";

const cartStore = useCartStore();

const products = ref([]);
const displayedProducts = ref([]);
const selectedCategory = ref("全部");
const categories = ref(["全部", "咖啡", "飲料", "甜點"]);
const searchKeyword = ref("");
const isLoading = ref(true);

watch(selectedCategory, () => {
  search();
});

const animationDuration = computed(() => {
  const speedPerItem = 6;
  return topSellingProducts.value.length * speedPerItem;
});

const topSellingProducts = computed(() => {
  return [...products.value].sort((a, b) => b.sales - a.sales).slice(0, 10);
});

const showCartModal = ref(false);
const openCartModal = () => {
  showCartModal.value = true;

  setTimeout(() => {
    showCartModal.value = false;
  }, 1000);
};

const handleAddCart = (product) => {
  if (product.inventory === 0) return;
  cartStore.addCart(product);
  openCartModal();
};

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
  <div
    v-if="showCartModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
  >
    <div
      class="bg-white rounded-xl p-8 min-w-[320px] min-h-[180px] shadow-lg text-center flex flex-col items-center justify-center"
    >
      <div class="flex items-center justify-center w-24 h-24 mb-4">
        <Vue3Lottie
          :animationData="addCartAnimation"
          :height="80"
          :width="80"
        />
      </div>
      <p class="text-lg font-bold text-secondary">已加入購物車 !</p>
    </div>
  </div>

  <div v-show="isLoading" class="loading-overlay">
    <img :src="spinner" alt="Loading" class="w-20 h-20" />
  </div>

  <div class="flex items-center justify-center gap-2 px-4 mb-6">
    <!-- <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="#023047"
      class="w-6 h-6 text-darkblue"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
      />
    </svg> -->
    <h2 class="text-2xl font-bold sm:text-3xl text-darkblue">暢銷禮物</h2>
    <!-- <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="#023047"
      class="w-6 h-6 text-darkblue"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
      />
    </svg> -->
  </div>

  <div class="overflow-hidden">
    <div
      class="flex gap-4 w-max animate-slide"
      :style="{ animationDuration: animationDuration + 's' }"
    >
      <template v-for="repeat in 2" :key="repeat">
        <div
          v-for="(product, index) in topSellingProducts"
          :key="`${repeat}-${index}`"
          class="flex-shrink-0 w-48 p-2 sm:w-52"
        >
          <div
            class="flex flex-col justify-between h-full p-4 transition bg-white border rounded-lg hover:shadow-lg"
          >
            <img
              :src="product.image_url"
              class="object-cover w-full h-40 mb-3 rounded-lg sm:h-44"
            />
            <h3
              class="mb-1 text-lg font-bold text-center truncate text-darkblue"
            >
              {{ product.name }}
            </h3>
            <p class="mb-2 text-sm text-center text-gray-500">
              銷售量：{{ product.sales }}
            </p>
            <p class="mb-3 text-sm font-semibold text-center text-secondary">
              價格：{{ product.price }} 元
            </p>

            <button
              @click="handleAddCart(product)"
              class="w-full btn btn-primary"
            >
              <!-- <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="relative -top-0.5 w-5 h-5 mr-1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg> -->
              加入購物車
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>

  <div class="flex flex-wrap justify-center gap-4 px-4 my-6">
    <button
      v-for="category in categories"
      :key="category"
      @click="selectedCategory = category"
      :class="[
        'px-4 py-2 rounded-full font-semibold transition',
        selectedCategory === category
          ? 'text-darkblue border-secondary border-b-2'
          : 'text-gray-400',
      ]"
    >
      {{ category }}
    </button>
  </div>

  <div class="flex justify-center px-4 mb-8">
    <div class="relative w-full max-w-md">
      <input
        type="text"
        v-model="searchKeyword"
        @keyup.enter="search"
        placeholder="輸入關鍵字搜尋商品"
        class="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
      />
      <button
        @click="search"
        class="absolute -translate-y-1/2 left-3 top-1/2 text-secondary focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </button>
    </div>
  </div>

  <div class="px-4 pb-12">
    <h1 class="mb-4 text-2xl font-bold text-center text-darkblue">
      {{ selectedCategory }}
    </h1>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="product in displayedProducts"
        :key="product.id"
        class="flex flex-col p-4 transition bg-white rounded-lg shadow hover:shadow-lg"
      >
        <div class="flex flex-col justify-between h-full">
          <!-- 上半部: 圖片 + 描述 -->
          <div class="mb-2">
            <img
              :src="product.image_url"
              alt="Product Image"
              class="object-cover w-full h-48 mb-4 rounded"
            />
          </div>
          <div class="flex flex-col h-full gap-2">
            <h3 class="mb-2 text-lg font-semibold truncate text-darkblue">
              {{ product.name }}
            </h3>
            <p class="mb-1 font-semibold text-secondary">
              價格：{{ product.price }} 元
            </p>
            <p class="mb-4 text-sm text-gray-500 line-clamp-3">
              {{ product.description }}
            </p>
          </div>
          <!-- 下半部 : 庫存 -->
          <!-- 這樣寫是因為商品描述長度不同 會導致庫存在不同水平線上 -->
          <div class="mt-auto">
            <p class="mb-2 text-sm text-darkblue">
              庫存：{{ product.inventory }}
            </p>
            <div v-if="product.inventory > 0 && product.inventory <= 5">
              <p class="py-1 px-4 bg-[#ffb703] text-white rounded-[20px]">
                庫存不足
              </p>
            </div>
          </div>
          <button
            @click="handleAddCart(product)"
            :disabled="product.inventory === 0"
            :class="
              product.inventory === 0
                ? 'w-full btn ƒ-disabled'
                : 'w-full btn btn-primary'
            "
          >
            <!-- <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 
                1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 
                0 0 1-1.12-1.243l1.264-12A1.125 1.125 
                0 0 1 5.513 7.5h12.974c.576 0 1.059.435 
                1.119 1.007ZM8.625 10.5a.375.375 0 1 
                1-.75 0 .375.375 0 0 1 .75 0Zm7.5 
                0a.375.375 0 1 1-.75 0 .375.375 
                0 0 1 .75 0Z"
              />
            </svg> -->
            {{ product.inventory === 0 ? "已售完" : "加入購物車" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* 全域按鈕樣式 */
.btn {
  @apply flex items-center justify-center w-full py-2 text-sm font-semibold rounded-full transition;
}
.btn-primary {
  @apply bg-secondary text-white border-2 border-secondary hover:bg-white hover:text-secondary;
}
.btn:disabled,
.btn[disabled] {
  @apply bg-gray-300 text-gray-500 cursor-not-allowed border-transparent;
}

/* 旋轉輪播動效 */
@keyframes slide {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
.animate-slide {
  animation: slide linear infinite;
}

/* Loading Overlay */
.loading-overlay {
  @apply fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50;
}
</style>
