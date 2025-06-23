<script setup>
import { useActivityStore } from "@/stores/activity.js";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";


const store = useActivityStore();
// 把 store 裡的變數都轉為 ref
const { activities, loading, error, joinActivities } = storeToRefs(store);
const router = useRouter();
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
  if (confirm("確定要刪除嗎？")) {
    await store.deleteActivity(id);
    await store.fetchMyActivities(); // 刪完再刷新
  }
};

const handleDeleteJoin = async (id) => {
  try {
    await store.deleteJoinActivity(id);
    joinActivities.value = joinActivities.value.filter((a) => a.id !== id);
    alert("取消活動參與成功");
  } catch (err) {
    console.error(err);
    alert("取消活動參與失敗，請稍後再試！");
  }
};
</script>

<template>
  <div class="max-w-5xl p-4 mx-auto">
    <h2 class="mb-4 text-2xl font-semibold text-darkblue">我創建的活動</h2>
    <div v-if="loading" class="py-8 text-center text-gray-500">載入中...</div>
    <div v-else-if="error" class="text-gray-500">{{ error }}</div>
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
        class="flex flex-col items-center justify-between p-4 mb-6 bg-white border shadow-md rounded-2xl md:flex-row"
      >
        <img
          v-if="activity.image_url"
          :src="activity.image_url"
          class="object-cover w-full mb-2 md:w-72 rounded-xl md:mb-0 h-52"
        />
        <div class="w-full md:w-[300px]">
          <h3 class="mb-1 text-lg font-bold text-darkblue">
            {{ activity.title }}
          </h3>
          <p class="mb-1 text-sm text-gray-600">
            <span class="font-semibold text-darkblue">主辦人：</span>{{ activity.created_by_username }}
          </p>
          <p class="mb-1 text-sm text-gray-600">
            <span class="font-semibold text-darkblue">日期：</span>
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
          <p class="mb-1 text-sm text-gray-600">
            <span class="font-semibold text-darkblue">地點：</span
            >{{ activity.location }}
          </p>
          <p class="mb-1 text-sm text-gray-600">
            <span class="font-semibold text-darkblue">描述：</span
            >{{ activity.description }}
          </p>
          <p class="text-sm text-gray-600">
            <span class="font-semibold text-darkblue">建立時間：</span
            >{{ activity.created_at?.slice(0, 10) }}
          </p>
        </div>
        <div>
          <button
            @click="goEdit(activity.id)"
            class="min-w-[130px] w-[150px] h-[40px] text-white px-[10px] py-[5px] font-bold cursor-pointer transition-all duration-300 outline-none rounded-[20px] border-2 border-[#219ebc] bg-[#219ebc] flex items-center justify-center gap-1 hover:bg-white hover:text-[#219ebc] mb-4"
          >
            編輯
          </button>
          <button
            @click="handleDelete(activity.id)"
            class="min-w-[130px] w-[150px] h-[40px] text-white px-[10px] py-[5px] font-bold cursor-pointer transition-all duration-300 outline-none rounded-[20px] border-2 border-[#219ebc] bg-[#219ebc] flex items-center justify-center gap-1 hover:bg-white hover:text-[#219ebc]"
          >
            刪除
          </button>
        </div>
      </div>
    </div>
    <h2 class="mb-4 text-2xl font-semibold text-darkblue">我參加的活動</h2>
    <div
      v-if="joinActivities && joinActivities.length === 0"
      class="text-center text-gray-400"
    >
      你還沒有參加任何活動
    </div>
    <div
      v-for="activity in joinActivities"
      :key="activity.id"
      class="flex flex-col items-center justify-between p-4 mb-6 bg-white border shadow-md rounded-2xl md:flex-row"
    >
      <img
        v-if="activity.image_url"
        :src="activity.image_url"
        class="object-cover w-full mb-2 md:w-72 rounded-xl md:mb-0 h-52"
      />
      <div class="w-full md:w-[300px]">
        <h3 class="mb-1 text-lg font-bold text-darkblue">
          {{ activity.title }}
        </h3>
        <p class="mb-1 text-sm text-gray-600">
          <span class="font-semibold text-darkblue">日期：</span>
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
        <p class="mb-1 text-sm text-gray-600">
          <span class="font-semibold text-darkblue">地點：</span
          >{{ activity.location }}
        </p>
        <p class="mb-1 text-sm text-gray-600">
          <span class="font-semibold text-darkblue">描述：</span
          >{{ activity.description }}
        </p>
      </div>

      <button
        @click="handleDeleteJoin(activity.id)"
        class="min-w-[130px] w-[150px] h-[40px] text-white px-[10px] py-[5px] font-bold cursor-pointer transition-all duration-300 outline-none rounded-[20px] border-2 border-[#219ebc] bg-[#219ebc] flex items-center justify-center gap-1 hover:bg-white hover:text-[#219ebc]"
      >
        取消參加
      </button>
    </div>
  </div>
</template>
