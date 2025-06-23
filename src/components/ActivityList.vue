<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useActivityStore } from "@/stores/activity.js";
import { storeToRefs } from "pinia";
import axios from "../api/axios.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const store = useActivityStore();
const { activities } = storeToRefs(store);
const { fetchActivities } = store;

const token = localStorage.getItem("token");

const handleJoin = async (activityId) => {
  try {
    // 文瑜 你少加/ 所以報 ERR_NAME_NOT_RESOLVED
    const res = await axios.post(`${baseUrl}/activities/join/${activityId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  
    alert(res.data.message);
  } catch (err) {
    if (err.response?.status === 409) {
      alert(err.response.data.message);
    } else {
      console.error("加入活動失敗:", err);
    }
  }
};

onMounted(() => fetchActivities());

function formatDateTime(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
}

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(6);

const filteredActivities = computed(() => {
  const keyword = searchQuery.value.toLowerCase();
  return activities.value.filter((a) =>
    [a.title, a.description, a.location].some((field) =>
      field?.toLowerCase().includes(keyword)
    )
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredActivities.value.length / itemsPerPage.value)
);

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredActivities.value.slice(start, start + itemsPerPage.value);
});

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  let pages = [];
  if (total <= 7) {
    pages = Array.from({ length: total }, (_, i) => i + 1);
  } else {
    pages.push(1);
    if (current > 4) pages.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 3) pages.push("...");
    pages.push(total);
  }
  return pages;
});

function goToPage(page) {
  if (page === "...") return;
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

watch(itemsPerPage, () => (currentPage.value = 1));

watch(searchQuery, () => (currentPage.value = 1));
</script>

<template>
  <div class="max-w-6xl px-4 py-6 mx-auto">
    <h1 class="mb-4 text-2xl font-bold text-darkblue">熱門活動列表</h1>

    <!-- 搜尋與每頁顯示 -->
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜尋活動標題、描述或地點"
        class="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
      />
      <div class="flex items-center w-full gap-2 sm:w-auto">
        <label for="perPage" class="text-sm text-gray-600">每頁顯示</label>
        <select
          id="perPage"
          v-model="itemsPerPage"
          class="px-2 py-1 text-sm border border-gray-300 rounded-md"
        >
          <option :value="3">3</option>
          <option :value="6">6</option>
          <option :value="9">9</option>
          <option :value="12">12</option>
        </select>
      </div>
    </div>

    <!-- 無結果 -->
    <div
      v-if="filteredActivities.length === 0"
      class="py-10 text-center text-gray-500"
    >
      <p class="mt-4 text-lg">
        找不到符合「<span class="font-semibold text-secondary">{{
          searchQuery
        }}</span
        >」的活動
      </p>
    </div>

    <!-- 活動卡片 -->
    <div
      v-else
      class="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="activity in paginatedActivities"
        :key="activity.id"
        class="flex flex-col overflow-hidden transition-all duration-300 bg-white shadow-md cursor-pointer rounded-2xl hover:shadow-xl hover:scale-105"
      >
        <img
          v-if="activity.image_url"
          :src="activity.image_url"
          alt="活動圖片"
          class="object-cover w-full h-40 sm:h-52 md:h-48 lg:h-52"
        />
        <div class="flex flex-col justify-between flex-grow px-6 py-4">
          <div>
            <h2 class="mb-2 text-lg font-bold sm:text-xl text-darkblue">
              {{ activity.title }}
            </h2>
            <p class="mb-1 text-sm text-gray-600">
              <span class="font-semibold text-darkblue">主辦人：</span
              >{{ activity.created_by_username }}
            </p>
            <p class="mb-1 text-sm text-gray-600">
              <span class="font-semibold text-darkblue">日期：</span>
              {{ formatDateTime(activity.date) }}
            </p>
            <p class="mb-1 text-sm text-gray-600">
              <span class="font-semibold text-darkblue">地點：</span
              >{{ activity.location }}
            </p>
            <p class="mb-1 text-sm text-gray-600 line-clamp-2">
              <span class="font-semibold text-darkblue">活動資訊：</span
              >{{ activity.description }}
            </p>
            <p class="mt-2 text-sm text-gray-500">
              <span class="font-semibold">建立時間：</span
              >{{ activity.created_at?.slice(0, 10) }}
            </p>
          </div>
          <button
            @click="handleJoin(activity.id)"
            class="w-full py-2 mt-4 text-sm font-semibold text-white transition-all border-2 rounded-full bg-secondary hover:bg-white hover:text-secondary border-secondary"
          >
            加入活動
          </button>
        </div>
      </div>
    </div>

    <!-- 分頁按鈕 -->
    <div v-if="totalPages > 1" class="flex flex-wrap justify-center gap-1 mt-6">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-2 py-1 text-sm font-semibold border rounded-full"
        :class="
          currentPage === 1
            ? 'bg-gray-200 text-gray-400'
            : 'bg-white hover:bg-gray-100'
        "
      >
        上一頁
      </button>
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        class="px-2 py-1 text-sm font-semibold border rounded-full"
        :class="
          page === currentPage
            ? 'bg-secondary text-white border-secondary'
            : 'bg-white hover:bg-gray-100'
        "
      >
        {{ page }}
      </button>
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-2 py-1 text-sm font-semibold border rounded-full"
        :class="
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-400'
            : 'bg-white hover:bg-gray-100'
        "
      >
        下一頁
      </button>
      <p class="w-full text-sm text-center text-gray-500">
        第 {{ currentPage }} 頁，共 {{ totalPages }} 頁
      </p>
    </div>
  </div>
</template>
