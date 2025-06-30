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
  currentPage.value = 1;
  search();
});
watch(searchKeyword, () => {
  currentPage.value = 1;
  search();
});

const currentPage = ref(1);
const itemsPerPage = ref(9);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return displayedProducts.value.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(() =>
  Math.ceil(displayedProducts.value.length / itemsPerPage.value)
);

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 4) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 3) pages.push("...");
  pages.push(total);
  return pages;
});

function goToPage(page) {
  if (page === "...") return;
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

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
    console.error("讀取商品失敗", err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div
    v-if="showCartModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
  >
    <div class="flex flex-col items-center p-6 bg-white shadow-lg rounded-2xl">
      <Vue3Lottie :animationData="addCartAnimation" :height="80" :width="80" />
      <p class="mt-2 text-lg font-bold text-secondary">已加入購物車 !</p>
    </div>
  </div>

  <div v-show="isLoading" class="loading-overlay">
    <img :src="spinner" alt="Loading" class="w-16 h-16" />
  </div>

  <section class="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
    <h2 class="mb-6 text-2xl font-bold text-center sm:text-3xl text-darkblue">
      熱門精選禮物
    </h2>
    <div class="mb-8 overflow-hidden">
      <div
        class="flex gap-4 w-max animate-slide"
        :style="{ animationDuration: animationDuration + 's' }"
      >
        <template v-for="repeat in 2" :key="repeat">
          <div
            v-for="(p, idx) in topSellingProducts"
            :key="repeat + '-' + idx"
            class="flex-shrink-0 w-48 p-2 sm:w-52"
          >
            <div
              class="flex flex-col h-full p-4 transition bg-white border rounded-lg hover:shadow-lg"
            >
              <img
                :src="p.image_url"
                class="object-cover w-full h-40 mb-3 rounded sm:h-44"
              />
              <h3
                class="mb-1 text-lg font-bold text-center truncate text-darkblue"
              >
                {{ p.name }}
              </h3>
              <p class="mb-2 text-sm text-center text-gray-500">
                銷售量：{{ p.sales }}
              </p>
              <p class="mb-4 text-sm font-semibold text-center text-secondary">
                價格：{{ p.price }} 元
              </p>
              <button @click="handleAddCart(p)" class="w-full btn btn-primary">
                加入購物車
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="flex flex-wrap justify-center w-full gap-2 mb-6">
      <button
        v-for="category in categories"
        :key="category"
        @click="selectedCategory = category"
        class="px-4 py-2 font-semibold transition rounded-full"
        :class="
          selectedCategory === category
            ? 'text-darkblue border-b-2 border-secondary'
            : 'text-gray-400'
        "
      >
        {{ category }}
      </button>
    </div>
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <!-- 搜尋框 -->
      <div class="relative flex-1 w-full sm:w-auto">
        <input
          v-model="searchKeyword"
          @keyup.enter="search"
          type="text"
          placeholder="搜尋商品名稱或描述"
          class="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <div
          class="absolute inset-y-0 flex items-center pointer-events-none left-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <!-- 每頁顯示 -->
      <div class="flex items-center w-full gap-2 sm:w-auto">
        <label for="perPage" class="text-sm text-gray-600 whitespace-nowrap"
          >每頁顯示</label
        >
        <select
          id="perPage"
          v-model="itemsPerPage"
          class="px-2 py-1 text-sm border border-gray-300 rounded-md"
        >
          <option :value="6">6</option>
          <option :value="9">9</option>
          <option :value="12">12</option>
        </select>
      </div>
    </div>

    <!-- 無結果 -->
    <div
      v-if="paginatedProducts.length === 0"
      class="py-16 text-center text-gray-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-12 h-12 mx-auto mb-4 text-secondary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <p class="text-lg font-medium">
        找不到符合「<span class="font-semibold text-secondary">{{
          searchKeyword
        }}</span
        >」的商品
      </p>
      <p class="mt-2 text-sm text-gray-400">請試試其他關鍵字</p>
    </div>

    <div>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="flex flex-col p-4 transition bg-white rounded-lg shadow hover:shadow-lg"
        >
          <img
            :src="product.image_url"
            class="object-cover w-full h-48 mb-4 rounded"
          />
          <h4 class="mb-2 text-lg font-semibold truncate text-darkblue">
            {{ product.name }}
          </h4>
          <p class="mb-2 font-semibold text-secondary">
            價格：{{ product.price }} 元
          </p>
          <p class="mb-4 text-sm text-gray-500 line-clamp-3">
            {{ product.description }}
          </p>
          <p class="mt-auto mb-2 text-sm text-darkblue">
            庫存：{{ product.inventory }}
          </p>
          <button
            @click="handleAddCart(product)"
            :disabled="product.inventory === 0"
            class="w-full btn btn-primary"
          >
            {{ product.inventory === 0 ? "已售完" : "加入購物車" }}
          </button>
        </div>
      </div>

      <div
        v-if="totalPages > 1"
        class="flex flex-wrap justify-center gap-2 mt-8"
      >
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-2 py-1 border rounded-full"
          :class="
            currentPage === 1
              ? 'bg-gray-200 text-gray-400'
              : 'bg-white hover:bg-gray-100'
          "
        >
          上一頁
        </button>
        <button
          v-for="p in visiblePages"
          :key="p"
          @click="goToPage(p)"
          class="px-2 py-1 border rounded-full"
          :class="
            p === currentPage
              ? 'bg-secondary text-white border-secondary'
              : 'bg-white hover:bg-gray-100'
          "
        >
          {{ p }}
        </button>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-2 py-1 border rounded-full"
          :class="
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-400'
              : 'bg-white hover:bg-gray-100'
          "
        >
          下一頁
        </button>
      </div>
    </div>
  </section>
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
