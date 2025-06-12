<script setup>
import { useActivityStore } from "@/stores/activity.js";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const store = useActivityStore();
const { myActivity, loading, error } = storeToRefs(store);
const router = useRouter();
// const myActivities = ref([store.myActivity]);
console.log("myActivities:", myActivity);
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
      <!-- <div v-if="myActivities.length === 0">你還沒有建立任何活動</div> -->
      <div
     v-for="act in myActivities"
        :key="act.id"
        class="p-4 mb-4 border rounded"
      >
        <h3>{{ act.title }}</h3>
        <p>日期：{{ act.date }}</p>
        <p>地點：{{ act.location }}</p>
        <p>描述：{{ act.description }}</p>
        <img v-if="act.image_url" :src="act.image_url" class="object-cover w-48 h-32" />
        <p class="text-gray-500">建立時間：{{ act.created_at }}</p>
        <!-- 編輯、刪除按鈕 -->
        <button @click="goEdit(act.id)" class="mr-2">編輯</button>
        <button @click="handleDelete(act.id)" class="text-red-500">刪除</button>
      </div>
    </div>
  </div>
</template>

