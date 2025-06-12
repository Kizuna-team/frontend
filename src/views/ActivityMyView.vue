<script setup>
import { useActivityStore } from "@/stores/activity.js";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const store = useActivityStore();
// 把 store 裡的變數都轉為 ref
const { activities, loading, error } = storeToRefs(store);
const router = useRouter();
console.log("myActivities:", activities);
onMounted(() => {
  store.fetchMyActivities();
});

// 編輯（導到編輯頁面，傳 id）
const goEdit = (id) => {
  router.push(`/activities/edit/${id}`);
};

// 刪除（直接呼叫 store action）
const handleDelete = async (id) => {
  if (confirm("確定要刪除嗎？")) {
    await store.deleteActivity(id);
    await store.fetchMyActivities(); // 刪完再刷新
  }
};
</script>

<template>
  <div>
    <h2 class="mb-4 text-2xl">我的活動</h2>
    <div v-if="loading">載入中...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <div v-if="activities.length === 0">你還沒有建立任何活動</div>
      <div
     v-for="activity in activities"
        :key="activity.id"
        class="p-4 mb-4 border rounded"
      >
        <h3>{{ activity.title }}</h3>
        <p>日期：{{ activity.date }}</p>
        <p>地點：{{ activity.location }}</p>
        <p>描述：{{ activity.description }}</p>
        <img v-if="activity.image_url" :src="activity.image_url" class="object-cover w-48 h-32" />
        <p class="text-gray-500">建立時間：{{ activity.created_at }}</p>
        <!-- 編輯、刪除按鈕 -->
        <button @click="goEdit(activity.id)" class="mr-2">編輯</button>
        <button @click="handleDelete(activity.id)" class="text-red-500">刪除</button>
      </div>
    </div>
  </div>
</template>

