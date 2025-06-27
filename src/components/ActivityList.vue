<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useActivityStore } from "@/stores/activity.js";
import { storeToRefs } from "pinia";
import axios from "../api/axios.js";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const store = useActivityStore();
const { activities } = storeToRefs(store);
const { fetchActivities } = store;
const toast = useToast();
const activityStatuses = ref({}); // { 1: 'FULL', 2: 'OPEN', 3: 'ALREADY_JOINED' }
const router = useRouter();

const goToActivityDetail = (activityId) => {
  router.push(`/activities/${activityId}`);
};

const notifyError = (err, userMessage = "操作失敗") => {
  console.error("錯誤訊息：", err);
  toast.error(userMessage);
};

const logInfo = (message, data) => {
  console.log(message, data);
};

const notifySuccess = (message) => {
  toast.success(message);
};

const fetchActivityStatuses = async () => {
  const userId = localStorage.getItem("userId");
  const activityIds = activities.value.map((a) => a.id);

  if (!userId || activityIds.length === 0) return;

  try {
    const res = await axios.post(`/activities/status`, {
      userId,
      activityIds,
    });

    const statusMap = {};
    for (const item of res.data.statuses) {
      statusMap[item.activityId] = item.status;
    }

    activityStatuses.value = statusMap;
  } catch (err) {
    notifyError(err, "查詢活動狀態失敗");
  }
};

const handleJoin = async (activityId, activity) => {
  event.stopPropagation();
  const previousStatus = activityStatuses.value[activityId];
  activityStatuses.value[activityId] = "ALREADY_JOINED";
  activity.current_participants = Number(activity.current_participants) + 1;

  try {
    const res = await axios.post(`/activities/join/${activityId}`);
    notifySuccess(res.data.message);
  } catch (err) {
    activityStatuses.value[activityId] = previousStatus;
    activity.current_participants = Number(activity.current_participants) - 1;

    if (err.response?.status === 409) {
      toast(err.response.data.message);
    } else {
      notifyError(err, "加入活動失敗");
    }
  }
};

onMounted(async () => {
  await fetchActivities();
  await fetchActivityStatuses();
});

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
  if (total <= 5) {
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

    <div class="flex flex-wrap items-center gap-3 mb-6">
      <div class="relative flex-1 w-full sm:w-auto">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜尋活動標題、描述或地點"
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

      <div class="flex items-center w-full gap-2 sm:w-auto">
        <label for="perPage" class="text-sm text-gray-600 whitespace-nowrap"
          >每頁顯示</label
        >
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

    <div
      v-if="filteredActivities.length === 0"
      class="py-10 text-center text-gray-500"
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
          searchQuery
        }}</span
        >」的活動
      </p>
      <p class="mt-2 text-sm text-gray-400">請試試其他關鍵字</p>
    </div>

    <div
      v-else
      class="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="activity in paginatedActivities"
        :key="activity.id"
        class="flex flex-col overflow-hidden transition-all duration-300 bg-white shadow-md cursor-pointer rounded-2xl hover:shadow-xl hover:scale-105"
        @click="goToActivityDetail(activity.id)"
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
              <span class="font-semibold text-darkblue"
                >報名人數/上限人數：</span
              >{{ activity.current_participants }}/{{
                activity.max_participants
              }}
            </p>
          </div>
          <button
            v-if="activityStatuses[activity.id] === 'OPEN'"
            @click="handleJoin(activity.id, activity, $event)"
            class="w-full py-2 mt-4 text-sm font-semibold text-white transition-all border-2 rounded-full bg-secondary hover:bg-white hover:text-secondary border-secondary"
          >
            加入活動
          </button>
          <button
            v-else-if="activityStatuses[activity.id] === 'ALREADY_JOINED'"
            disabled
            class="w-full py-2 mt-4 text-sm font-semibold text-gray-400 border-2 border-gray-400 rounded-full cursor-not-allowed"
          >
            已加入
          </button>
          <button
            v-else-if="activityStatuses[activity.id] === 'FULL'"
            disabled
            class="w-full py-2 mt-4 text-sm font-semibold text-red-400 border-2 border-red-400 rounded-full cursor-not-allowed"
          >
            已額滿
          </button>
        </div>
      </div>
    </div>

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
    </div>
  </div>
</template>
