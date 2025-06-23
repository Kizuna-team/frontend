<script setup>
import { useActivityStore } from "@/stores/activity.js";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const store = useActivityStore();
// 把 store 裡的變數都轉為 ref
const { activities, loading, error, joinActivities } = storeToRefs(store);
const router = useRouter();
console.log("joinActivity:", joinActivities.value)
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
  if (confirm("確定要刪除嗎？")) {
    await store.deleteActivity(id);
    await store.fetchMyActivities(); // 刪完再刷新
  }
};
</script>

<template>
  <div class="max-w-2xl p-4 mx-auto">
    <h2 class="mb-4 text-2xl font-bold">我的活動</h2>
    <div v-if="loading" class="py-8 text-center text-gray-500">載入中...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <div
        v-if="joinActivities && joinActivities.length === 0"
        class="text-center text-gray-400"
      >
        你還沒有建立任何活動
      </div>
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="flex flex-col items-start gap-4 p-4 mb-6 bg-white border shadow-md rounded-2xl md:flex-row"
      >
        <img
          v-if="activity.image_url"
          :src="activity.image_url"
          class="object-cover w-full h-32 mb-2 md:w-48 rounded-xl md:mb-0"
        />
        <div class="flex-1">
          <h3 class="mb-1 text-lg font-semibold">{{ activity.title }}</h3>
          <p class="mb-1 text-gray-500">
            主辦人：{{ activity.created_by_username }}
          </p>
          <p class="mb-1">
            <span class="font-semibold">日期：</span>
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
          <p class="mb-1">
            <span class="font-semibold">地點：</span>{{ activity.location }}
          </p>
          <p class="mb-1">
            <span class="font-semibold">描述：</span>{{ activity.description }}
          </p>
          <p class="mt-2 text-xs text-gray-400">
            建立時間：{{ activity.created_at?.slice(0, 10) }}
          </p>
          <div class="flex gap-2 mt-3">
            <button
              @click="goEdit(activity.id)"
              class="px-4 py-1 text-white transition bg-blue-500 rounded hover:bg-blue-600"
            >
              編輯
            </button>
            <button
              @click="handleDelete(activity.id)"
              class="px-4 py-1 text-white transition bg-red-500 rounded hover:bg-red-600"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
    <h2 class="mb-4 text-2xl font-bold">我參加的活動</h2>
    <div
      v-if="joinActivities && joinActivities.length === 0"
      class="text-center text-gray-400"
    >
      你還沒有參加任何活動
    </div>
    <div
      v-for="activity in joinActivities"
      :key="activity.id"
      class="flex flex-col items-start gap-4 p-4 mb-6 bg-white border shadow-md rounded-2xl md:flex-row"
    >
      <img
        v-if="activity.image_url"
        :src="activity.image_url"
        class="object-cover w-full h-32 mb-2 md:w-48 rounded-xl md:mb-0"
      />
      <div class="flex-1">
        <h3 class="mb-1 text-lg font-semibold">{{ activity.title }}</h3>
        <!-- <p class="mb-1 text-gray-500">
          主辦人：{{ activity.created_by_username }}
        </p> -->
        <p class="mb-1">
          <span class="font-semibold">日期：</span>
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
        <p class="mb-1">
          <span class="font-semibold">地點：</span>{{ activity.location }}
        </p>
        <p class="mb-1">
          <span class="font-semibold">描述：</span>{{ activity.description }}
        </p>
        <p class="mt-2 text-xs text-gray-400">
          建立時間：{{ activity.created_at?.slice(0, 10) }}
        </p>
      </div>
    </div>
  </div>
</template>
