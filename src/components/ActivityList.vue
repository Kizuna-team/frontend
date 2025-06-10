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
  <div 
  v-for="activity in activities" :key="activity.id">
    <h2>活動名稱 : {{ activity.title }}</h2>
     <img
      v-if="activity.image_url"
      :src="activity.image_url"
      alt="活動圖片"
      class="object-cover w-64 h-40 mb-4 rounded"
    />
    <p>地點 :{{ activity.location }}</p>
    <p>活動資訊 :{{ activity.description }}</p>
    <p>建立者：{{ activity.created_by_id }}</p>
    <p>{{ activity.createdAt }}</p>
  </div>
</template>



<style scoped></style>
