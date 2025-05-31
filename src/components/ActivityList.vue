<template>
      <div
        v-for="activity in activities"
        :key="activity.id"
      >
        <h2>{{ activity.title }}</h2>
        <p>{{ activity.location }}</p>
        <p>{{ activity.description }}</p>
        <p>建立者：{{ activity.createdBy }}</p>
      </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useActivityStore } from '@/stores/activity.js'
import { storeToRefs } from 'pinia'

const store = useActivityStore()
const { activities, loading, error } = storeToRefs(store)
const { fetchActivities } = store

onMounted(() => {
  fetchActivities()
})

</script>

<style scoped>
</style>
