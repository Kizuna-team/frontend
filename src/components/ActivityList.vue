<script setup>
import { onMounted } from "vue";
import { useActivityStore } from "@/stores/activity.js";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useActivityStore();
const { activities } = storeToRefs(store);
const { fetchActivities } = store;

onMounted(() => {
  fetchActivities();
});

function viewDetail(id) {
  router.push(`/activities/${id}`);
}
</script>

<template>
  <div
    class="grid grid-cols-1 gap-6 p-4 sm:p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  >
    <div
      v-for="activity in activities"
      :key="activity.id"
      @click="viewDetail(activity.id)"
      class="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden flex flex-col"
    >
      <img
        v-if="activity.image_url"
        :src="activity.image_url"
        alt="活動圖片"
        class="object-cover w-full h-52 sm:h-56 md:h-48 lg:h-52"
      />
      <div class="flex flex-col justify-between flex-grow px-6 py-4">
        <div>
          <h2 class="mb-2 text-lg font-bold sm:text-xl text-darkblue">
            {{ activity.title }}
          </h2>
          <p class="mb-1 text-sm text-gray-600">
            <span class="font-semibold text-darkblue">主辦人：</span
            >{{ activity.created_by_username }}
          </p>
          <p class="mb-1 text-sm text-gray-600">
            <span class="font-semibold text-darkblue">地點：</span
            >{{ activity.location }}
          </p>
          <p class="mb-1 text-sm text-gray-600 line-clamp-2">
            <span class="font-semibold text-darkblue">活動資訊：</span
            >{{ activity.description }}
          </p>
          <p class="mt-2 text-sm text-gray-500">
            <span class="font-semibold">建立時間：</span
            >{{ activity.created_at?.slice(0, 10) }}
          </p>
        </div>
        <button
          @click="viewDetail(activity.id)"
          class="w-full py-2 mt-4 text-sm font-semibold text-white transition-all border-2 rounded-full bg-secondary hover:bg-white hover:text-secondary border-secondary"
        >
          查看詳細
        </button>
      </div>
    </div>
  </div>
</template>
