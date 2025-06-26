<script setup>
import { useActivityStore } from "@/stores/activity.js";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import {
  UserIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";

const toast = useToast();
const store = useActivityStore();
// 把 store 裡的變數都轉為 ref
const { activities, loading, error, joinActivities } = storeToRefs(store);
const router = useRouter();
const activeTab = ref("created"); // tabs: created or joined
const isLoading = ref(false);

console.log("joinActivity:", joinActivities.value);
// console.log("myActivities:", activities);
onMounted(() => {
  store.fetchMyActivities();
  store.fetchMyJoinActivities();
});

// 編輯（導到編輯頁面，傳 id）
const goEdit = (id) => {
  router.push(`/activities/edit/${id}`);
};

// 刪除（直接呼叫 store action）
const handleDelete = async (id) => {
  const confirmed = confirm("確定要刪除嗎？");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    await store.deleteActivity(id); // 刪除 API
    await store.fetchMyActivities(); // 更新列表
    alert("刪除成功！");
  } catch (err) {
    console.error("刪除活動錯誤：", err);
    alert("刪除失敗，請稍後再試！");
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteJoin = async (id) => {
  isLoading.value = true;
  try {
    await store.deleteJoinActivity(id);
    joinActivities.value = joinActivities.value.filter((a) => a.id !== id);
    toast("取消活動參與成功");
  } catch (err) {
    console.error(err);
    alert("取消活動參與失敗，請稍後再試！");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="relative">
    <!-- 遮罩 -->
    <div
      v-if="isLoading"
      class="absolute inset-0 z-50 flex items-center justify-center bg-white/70 rounded-2xl"
    >
      <div class="text-lg text-darkblue animate-pulse">處理中...</div>
    </div>
    <div class="max-w-6xl px-4 py-8 mx-auto space-y-8">
      <div
        class="flex justify-center gap-8 text-lg font-semibold border-b border-gray-200"
      >
        <button
          @click="activeTab = 'created'"
          :class="[
            'pb-2 transition relative',
            activeTab === 'created'
              ? 'text-secondary border-b-4 border-secondary font-bold scale-105'
              : 'text-gray-400 hover:text-darkblue',
          ]"
        >
          我創建的活動
        </button>
        <button
          @click="activeTab = 'joined'"
          :class="[
            'pb-2 transition relative',
            activeTab === 'joined'
              ? 'text-secondary border-b-4 border-secondary font-bold scale-105'
              : 'text-gray-400 hover:text-darkblue',
          ]"
        >
          我參加的活動
        </button>
      </div>

      <div v-if="loading" class="py-8 text-center text-gray-500">載入中...</div>
      <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

      <div v-if="activeTab === 'created'" class="space-y-6">
        <div
          v-if="activities.length === 0"
          class="py-16 text-base text-center text-gray-400"
        >
          你還沒有建立任何活動
        </div>

        <div
          v-for="activity in activities"
          :key="activity.id"
          class="flex flex-col items-start gap-4 p-5 transition duration-200 bg-white shadow-md md:flex-row md:items-stretch md:gap-6 sm:p-6 rounded-2xl hover:shadow-lg"
        >
          <img
            v-if="activity.image_url"
            :src="activity.image_url"
            loading="lazy"
            class="w-full md:w-64 aspect-[4/3] sm:aspect-video object-cover rounded-xl"
          />

          <div class="w-full space-y-2 text-base text-gray-700 md:flex-1">
            <h3 class="flex items-center gap-2 text-xl font-bold text-darkblue">
              {{ activity.title }}
            </h3>
            <p class="flex items-center gap-2">
              <UserIcon class="w-5 h-5 text-secondary shrink-0 -mt-0.5" />
              <span class="font-semibold text-secondary">主辦人：</span>
              {{ activity.created_by_username }}
            </p>
            <p class="flex items-center gap-2">
              <CalendarDaysIcon
                class="w-5 h-5 text-secondary shrink-0 -mt-0.5"
              />
              <span class="font-semibold text-secondary">日期：</span>
              {{
                new Date(activity.date).toLocaleString("zh-TW", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                  timeZone: "Asia/Taipei",
                })
              }}
            </p>
            <p class="flex items-center gap-2">
              <MapPinIcon class="w-5 h-5 text-secondary shrink-0 -mt-0.5" />
              <span class="font-semibold text-secondary">地點：</span>
              {{ activity.location }}
            </p>
            <p class="text-sm">
              <span class="font-semibold text-secondary">描述：</span>
              {{ activity.description }}
            </p>
            <p class="text-xs text-gray-400">
              建立時間：{{ activity.created_at?.slice(0, 10) }}
            </p>
          </div>

          <div
            class="flex flex-col w-full gap-3 mt-4 sm:w-auto sm:items-end sm:mt-0"
          >
            <button
              @click="goEdit(activity.id)"
              class="w-full sm:w-[150px] h-[40px] flex items-center justify-center gap-1 font-bold transition-all duration-300 rounded-full border-2 border-secondary bg-secondary text-white hover:bg-white hover:text-secondary hover:scale-105"
            >
              <PencilSquareIcon class="w-5 h-5" /> 編輯
            </button>
            <button
              @click="handleDelete(activity.id)"
              class="w-full sm:w-[150px] h-[40px] flex items-center justify-center gap-1 font-bold transition-all duration-300 rounded-full border-2 border-secondary bg-secondary text-white hover:bg-white hover:text-secondary hover:scale-105"
            >
              <TrashIcon class="w-5 h-5" /> 刪除
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'joined'" class="space-y-6">
        <div
          v-if="joinActivities.length === 0"
          class="py-16 text-base text-center text-gray-400"
        >
          你還沒有參加任何活動
        </div>

        <div
          v-for="activity in joinActivities"
          :key="activity.id"
          class="flex flex-col items-start gap-4 p-5 transition duration-200 bg-white shadow-md md:flex-row md:items-stretch md:gap-6 sm:p-6 rounded-2xl hover:shadow-lg"
        >
          <img
            v-if="activity.image_url"
            :src="activity.image_url"
            loading="lazy"
            class="w-full md:w-64 aspect-[4/3] sm:aspect-video object-cover rounded-xl"
          />

          <div class="w-full space-y-2 text-base text-gray-700 md:flex-1">
            <h3 class="flex items-center gap-2 text-xl font-bold text-darkblue">
              {{ activity.title }}
            </h3>
            <p class="flex items-center gap-2">
              <CalendarDaysIcon
                class="w-5 h-5 text-secondary shrink-0 -mt-0.5"
              />
              <span class="font-semibold text-secondary">日期：</span>
              {{
                new Date(activity.date).toLocaleString("zh-TW", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                  timeZone: "Asia/Taipei",
                })
              }}
            </p>
            <p class="flex items-center gap-2">
              <MapPinIcon class="w-5 h-5 text-secondary shrink-0 -mt-0.5" />
              <span class="font-semibold text-secondary">地點：</span>
              {{ activity.location }}
            </p>
            <p class="text-sm">
              <span class="font-semibold text-secondary">描述：</span>
              {{ activity.description }}
            </p>
          </div>

          <div
            class="flex flex-col w-full gap-3 mt-4 sm:w-auto sm:items-end sm:mt-0"
          >
            <button
              @click="handleDeleteJoin(activity.id)"
              class="w-full sm:w-[150px] h-[40px] flex items-center justify-center gap-1 font-bold transition-all duration-300 rounded-full border-2 border-secondary bg-secondary text-white hover:bg-white hover:text-secondary hover:scale-105"
            >
              <TrashIcon class="w-5 h-5" /> 取消參加
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
