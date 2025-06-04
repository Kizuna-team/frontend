<template>
  <div 
  v-for="activity in activities" :key="activity.id">
    <h2>活動名稱 : {{ activity.title }}</h2>
    <p>地點 :{{ activity.location }}</p>
    <p>活動資訊 :{{ activity.description }}</p>
    <p>建立者：{{ activity.createdBy }}</p>
    <p>{{ activity.createdAt }}</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useActivityStore } from "@/stores/activity.js";
import { storeToRefs } from "pinia";

const store = useActivityStore();
const { activities, loading, error } = storeToRefs(store);
const { fetchActivities } = store;

onMounted(() => {
  fetchActivities();
});
</script>

<style scoped></style>
