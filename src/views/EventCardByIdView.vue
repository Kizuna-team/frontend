<script setup>
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import { useActivityStore } from "@/stores/activity";
import { storeToRefs } from "pinia";

const route = useRoute();
const store = useActivityStore();
const { fetchActivityById } = store;
const { selectedActivity, loading } = storeToRefs(store);

onMounted(() => {
  fetchActivityById(route.params.id);
});
</script>

<template>
  <div class="max-w-2xl p-4 mx-auto">
    <div v-if="loading">載入中...</div>
    <div v-else-if="selectedActivity">
      <img :src="selectedActivity.image_url" class="w-full mb-4 rounded-xl" />
      <h1 class="mb-2 text-3xl font-bold">{{ selectedActivity.title }}</h1>
      <p class="mb-1 text-gray-500">主辦人：{{ selectedActivity.created_by_username }}</p>
      <p class="mb-1">時間：{{ new Date(selectedActivity.date).toLocaleString("zh-TW", { hour12: false }) }}</p>
      <p class="mb-1">地點：{{ selectedActivity.location }}</p>
      <p class="mt-3">{{ selectedActivity.description }}</p>
    </div>
  </div>
</template>
