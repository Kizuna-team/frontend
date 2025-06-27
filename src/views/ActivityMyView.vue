<script setup>
import { useActivityStore } from "@/stores/activity.js";
import { storeToRefs } from "pinia";
import { onMounted, ref, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import {
  UserIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import CuteCat from '@/components/Cat.vue';

const toast = useToast();
const store = useActivityStore();
const { activities, loading, error, joinActivities } = storeToRefs(store);
const router = useRouter();
const activeTab = ref("created");
const isLoading = ref(false);
const expandedParticipants = ref({});
const hoverActivityId = ref(null);

const handleHover = (id) => {
  hoverActivityId.value = id;
};

const handleLeave = () => {
  hoverActivityId.value = null;
};

onMounted(() => {
  store.fetchMyActivities();
  store.fetchMyJoinActivities();
});

const goEdit = (id) => {
  router.push(`/activities/edit/${id}`);
};

const handleDelete = async (id) => {
  const confirmed = confirm("確定要刪除嗎？");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    await store.deleteActivity(id);
    await store.fetchMyActivities();
    alert("刪除成功！");
  } catch (err) {
    console.error("刪除活動錯誤：", err);
    alert("刪除失敗，請稍後再試！");
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteJoin = async (id) => {
  isLoading.value = true;
  try {
    await store.deleteJoinActivity(id);
    joinActivities.value = joinActivities.value.filter((a) => a.id !== id);
    toast("取消活動參與成功");
  } catch (err) {
    console.error(err);
    toast("取消活動參與失敗，請稍後再試！");
  } finally {
    isLoading.value = false;
  }
};

watch(hoverActivityId, (newId) => {
  if (newId !== null) {
    nextTick(async () => {
      const container = document.getElementById(`cat-lottie-${newId}`);
      if (container) {
        lottie.loadAnimation({
          container,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: await import('@/assets/cat.json'),
        });
      }
    });
  }
});
</script>

<template>
  <div class="relative">
    <div
      v-if="isLoading"
      class="absolute inset-0 z-50 flex items-center justify-center bg-white/70 rounded-2xl"
    >
      <img src="@/assets/spinner.svg" alt="載入中..." class="w-16 h-16" />
    </div>
    <div
      v-else-if="error"
      class="absolute inset-0 z-50 flex items-center justify-center bg-white/70 rounded-2xl"
    >
      <span class="text-lg text-center text-red-500">{{ error }}</span>
    </div>
    <div class="max-w-6xl px-4 py-8 mx-auto space-y-8">
      <div class="flex justify-center gap-8 text-lg font-semibold border-b border-gray-200">
        <button @click="activeTab = 'created'" :class="[
          'pb-2 transition relative',
          activeTab === 'created'
            ? 'text-secondary border-b-4 border-secondary font-bold scale-105'
            : 'text-gray-400 hover:text-darkblue',
        ]">
          我創建的活動
        </button>
        <button @click="activeTab = 'joined'" :class="[
          'pb-2 transition relative',
          activeTab === 'joined'
            ? 'text-secondary border-b-4 border-secondary font-bold scale-105'
            : 'text-gray-400 hover:text-darkblue',
        ]">
          我參加的活動
        </button>
      </div>

      <div v-if="activeTab === 'created'" class="space-y-6">
        <div v-if="activities.length === 0" class="py-16 text-base text-center text-gray-400">
          你還沒有建立任何活動
        </div>

        <div v-for="activity in activities" :key="activity.id"
          class="flex flex-col items-start gap-4 p-5 transition duration-200 bg-white shadow-md md:flex-row md:items-stretch md:gap-6 sm:p-6 rounded-2xl hover:shadow-lg">
          <img v-if="activity.image_url" :src="activity.image_url" loading="lazy"
            class="w-full md:w-64 aspect-[4/3] sm:aspect-video object-cover rounded-xl" />

          <div class="w-full space-y-2 text-base text-gray-700 md:flex-1">
            <h3 class="flex items-center gap-2 text-xl font-bold text-darkblue">
              {{ activity.title }}
            </h3>
            <p class="flex items-center gap-2">
              <CalendarDaysIcon class="w-5 h-5 text-secondary shrink-0 -mt-0.5" />
              <span class="font-semibold text-secondary">日期：</span>
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
            <p class="flex items-center gap-2">
              <MapPinIcon class="w-5 h-5 text-secondary shrink-0 -mt-0.5" />
              <span class="font-semibold text-secondary whitespace-nowrap">地點：</span>
              {{ activity.location }}
            </p>
            <p class="text-sm">
              <span class="font-semibold text-secondary">活動資訊：</span>
              {{ activity.description }}
            </p>
            <p class="relative flex items-center gap-2 text-sm transition-all duration-200 cursor-pointer select-none hover:font-bold"
              @click="expandedParticipants[activity.id] = !expandedParticipants[activity.id]"
              @mouseenter="handleHover(activity.id)" @mouseleave="handleLeave">
              <span class="font-semibold text-secondary">報名人數/上限人數：</span>
              {{ activity.current_participants }}/{{ activity.max_participants }}

            <div v-if="hoverActivityId === activity.id" class="scale-50 absolute right-[50px] top-1/4 -translate-y-1/2 md:right-[-50px] md:scale-100 ">
              <CuteCat />
            </div>
            </p>
            <ul v-if="expandedParticipants[activity.id] && activity.participants?.length"
              class="flex flex-wrap gap-2 mt-2 text-sm text-gray-700">
              <li v-for="(name, index) in activity.participants" :key="index"
                class="px-3 py-1 transition-all duration-200 bg-gray-100 rounded-full hover:bg-blue-100">
                {{ name }}
              </li>
            </ul>
            <p class="text-xs text-gray-400">
              建立時間：{{ activity.created_at?.slice(0, 10) }}
            </p>
          </div>

          <div class="flex flex-col w-full gap-3 mt-4 md:w-[150px] shrink-0">
            <button @click="goEdit(activity.id)"
              class="w-full h-[40px] flex items-center justify-center gap-1 font-bold transition-all duration-300 rounded-full border-2 border-secondary bg-secondary text-white hover:bg-white hover:text-secondary hover:scale-105">
              <PencilSquareIcon class="w-5 h-5" /> 編輯
            </button>
            <button @click="handleDelete(activity.id)"
              class="w-full h-[40px] flex items-center justify-center gap-1 font-bold transition-all duration-300 rounded-full border-2 border-secondary bg-secondary text-white hover:bg-white hover:text-secondary hover:scale-105">
              <TrashIcon class="w-5 h-5" /> 刪除
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'joined'" class="space-y-6">
        <div v-if="joinActivities.length === 0" class="py-16 text-base text-center text-gray-400">
          你還沒有參加任何活動
        </div>

        <div v-for="activity in joinActivities" :key="activity.id"
          class="flex flex-col items-start gap-4 p-5 transition duration-200 bg-white shadow-md md:flex-row md:items-stretch md:gap-6 sm:p-6 rounded-2xl hover:shadow-lg">
          <img v-if="activity.image_url" :src="activity.image_url" loading="lazy"
            class="w-full md:w-64 aspect-[4/3] sm:aspect-video object-cover rounded-xl" />

          <div class="w-full space-y-2 text-base text-gray-700 md:flex-1">
            <h3 class="flex items-center gap-2 text-xl font-bold text-darkblue">
              {{ activity.title }}
            </h3>
            <p class="flex items-center gap-2">
              <CalendarDaysIcon class="w-5 h-5 text-secondary shrink-0 -mt-0.5" />
              <span class="font-semibold text-secondary whitespace-nowrap">日期：</span>
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
            <p class="flex items-center gap-2">
              <MapPinIcon class="w-5 h-5 text-secondary shrink-0 -mt-0.5" />
              <span class="font-semibold text-secondary whitespace-nowrap">地點：</span>
              {{ activity.location }}
            </p>
            <p class="text-sm">
              <span class="font-semibold text-secondary">活動資訊：</span>
              {{ activity.description }}
            </p>
          </div>

          <div class="flex flex-col w-full gap-3 mt-4 md:w-[150px] shrink-0">
            <button @click="handleDeleteJoin(activity.id)"
              class="w-full h-[40px] flex items-center justify-center gap-1 font-bold transition-all duration-300 rounded-full border-2 border-secondary bg-secondary text-white hover:bg-white hover:text-secondary hover:scale-105">
              <TrashIcon class="w-5 h-5" /> 取消參加
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
