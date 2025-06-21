<script setup>
import { onMounted } from "vue";
import { useActivityStore } from "@/stores/activity.js";
import { storeToRefs } from "pinia";
import { useRouter } from 'vue-router'


const router = useRouter()
const store = useActivityStore();
const { activities } = storeToRefs(store);
const { fetchActivities } = store;

onMounted(() => {
  fetchActivities();
});

function viewDetail(id) {
  router.push(`/activities/${id}`)
}

</script>

<template>
  <div class="grid grid-cols-1 gap-3 p-4 mx-auto sm:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="activity in activities"
      :key="activity.id"
      class="transition-transform shadow-xl hover:scale-105 hover:shadow-2xl rounded-[10px]"
    >
      <img
        v-if="activity.image_url"
        :src="activity.image_url"
        alt="活動圖片"
        class="object-cover w-full mb-1 h-60 rounded-xl"
      />
      <div class="px-8 py-1">
        <h2 class="mt-2 text-lg font-bold text-darkblue">
          {{ activity.title }}
        </h2>
        <div>
          <p class="mb-1 text-gray-500">
            <span class="font-semibold">主辦人：</span
            >{{ activity.created_by_username }}
          </p>
          <p class="mb-1 text-gray-500">
            <span class="font-semibold">地點：</span>{{ activity.location }}
          </p>
          <p class="mb-1 text-gray-500">
            <span class="font-semibold">活動資訊：</span
            >{{ activity.description }}
          </p>
          <p class="mt-1 mb-2 text-gray-500">
            <span class="font-semibold">建立時間：</span
            >{{ activity.created_at?.slice(0, 10) }}
          </p>
          <button @click="viewDetail(activity.id)">查看詳細</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
