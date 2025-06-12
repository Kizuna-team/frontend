<script setup>
import { onMounted } from "vue";
import { useActivityStore } from "@/stores/activity.js";
import { storeToRefs } from "pinia";

const store = useActivityStore();
const { activities, loading, error } = storeToRefs(store);
const { fetchActivities } = store;

onMounted(() => {
  fetchActivities();
  setTimeout(() => {
    console.log("activities:", activities.value); // Pinia 要 .value
  }, 1000); // 等 1 秒確保 fetch 完成
});
</script>

<template>
  <div class="max-w-2xl p-4 mx-auto">
    <div
      v-for="activity in activities"
      :key="activity.id"
      class="flex flex-col items-start gap-4 p-4 mb-6 bg-white border shadow-md rounded-2xl md:flex-row"
    >
      <img
        v-if="activity.image_url"
        :src="activity.image_url"
        alt="活動圖片"
        class="object-cover w-full h-40 mb-2 md:w-64 rounded-xl md:mb-0"
      />
      <div class="flex-1">
        <h2 class="mb-1 text-xl font-bold">活動名稱：{{ activity.title }}</h2>
        <p class="mb-2 text-gray-500">
          主辦人：{{ activity.created_by_username }}
        </p>
        <p class="mb-1">
          <span class="font-semibold">地點：</span>{{ activity.location }}
        </p>
        <p class="mb-1">
          <span class="font-semibold">活動資訊：</span
          >{{ activity.description }}
        </p>
        <p class="mt-2 text-xs text-gray-400">
          建立時間：{{ activity.created_at?.slice(0, 10) }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
