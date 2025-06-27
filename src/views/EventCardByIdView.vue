<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { useActivityStore } from "@/stores/activity";
import { storeToRefs } from "pinia";
import axios from "../api/axios.js";
import { useToast } from 'vue-toastification'
// Heroicons import
import { 
  ArrowLeftIcon, 
  UserIcon, 
  ClockIcon, 
  MapPinIcon, 
  UsersIcon, 
  CalendarIcon,
  ShareIcon,
  ClipboardDocumentIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'

const route = useRoute();
const store = useActivityStore();
const { fetchActivityById } = store;
const { selectedActivity, loading } = storeToRefs(store);
const toast = useToast()

// 分享功能
const showShareMenu = ref(false);
// 活動狀態
const activityStatus = ref(''); // 'OPEN', 'ALREADY_JOINED', 'FULL'

// 獲取活動狀態
const fetchActivityStatus = async () => {
  const userId = localStorage.getItem("userId");
  const activityId = route.params.id;

  if (!userId || !activityId) return;

  try {
    const res = await axios.post(`/activities/status`, {
      userId,
      activityIds: [Number(activityId)], // 只查詢當前活動
    });

    if (res.data.statuses && res.data.statuses.length > 0) {
      activityStatus.value = res.data.statuses[0].status;
    }
  } catch (err) {
    console.error("查詢活動狀態失敗", err);
  }
};

// 報名活動
const handleJoin = async () => {
  const activityId = Number(route.params.id);
  const previousStatus = activityStatus.value;
  
  // 樂觀更新
  activityStatus.value = "ALREADY_JOINED";
  if (selectedActivity.value) {
    selectedActivity.value.current_participants = Number(selectedActivity.value.current_participants) + 1;
  }

  try {
    const res = await axios.post(`/activities/join/${activityId}`);
    toast.success(res.data.message);
  } catch (err) {
    // 失敗時恢復
    activityStatus.value = previousStatus;
    if (selectedActivity.value) {
      selectedActivity.value.current_participants = Number(selectedActivity.value.current_participants) - 1;
    }
    
    if (err.response?.status === 409) {
      toast.error(err.response.data.message);
    } else {
      toast.error("加入活動失敗");
    }
  }
};

// 分享功能
const handleShare = () => {
  showShareMenu.value = !showShareMenu.value;
};

// 複製連結
const copyLink = async () => {
  try {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    toast.success('連結已複製到剪貼簿！');
    showShareMenu.value = false;
  } catch (err) {
    // 如果瀏覽器不支援 clipboard API，用舊方法
    const textArea = document.createElement('textarea');
    textArea.value = window.location.href;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    toast.success('連結已複製到剪貼簿！');
    showShareMenu.value = false;
  }
};

// 分享到 LINE
const shareToLine = () => {
  const url = window.location.href;
  const text = `${selectedActivity.value.title} - ${selectedActivity.value.description}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  window.open(lineUrl, '_blank');
  showShareMenu.value = false;
};

// 分享到 Facebook
const shareToFacebook = () => {
  const url = window.location.href;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank');
  showShareMenu.value = false;
};

// 點擊外部關閉分享選單
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showShareMenu.value = false;
  }
};

onMounted(async () => {
  await fetchActivityById(route.params.id);
  await fetchActivityStatus();
  document.addEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 載入中狀態 -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
    </div>

    <!-- 活動詳情內容 -->
    <div v-else-if="selectedActivity" class="max-w-4xl mx-auto">
      <!-- 返回按鈕 -->
      <div class="p-4">
        <button 
          @click="$router.push('/activities')"
          class="flex items-center text-gray-600 transition-colors hover:text-gray-800"
        >
          <ArrowLeftIcon class="w-5 h-5 mr-2" />
          返回活動列表
        </button>
      </div>

      <!-- 主要內容卡片 -->
      <div class="mx-4 mb-8 overflow-hidden bg-white shadow-sm rounded-2xl">
        <!-- 活動圖片 -->
        <div class="relative">
          <img 
            v-if="selectedActivity.image_url" 
            :src="selectedActivity.image_url" 
            :alt="selectedActivity.title"
            class="object-cover w-full h-64 md:h-80"
          />
          <div v-else class="flex items-center justify-center w-full h-64 md:h-80 bg-gradient-to-br from-blue-400 to-purple-500">
            <PhotoIcon class="w-16 h-16 text-white opacity-50" />
          </div>
        </div>

        <!-- 活動資訊 -->
        <div class="p-6 md:p-8">
          <!-- 標題與主辦人 -->
          <div class="mb-6">
            <h1 class="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
              {{ selectedActivity.title }}
            </h1>
            <div class="flex items-center text-gray-600">
              <UserIcon class="w-5 h-5 mr-2" />
              主辦人：{{ selectedActivity.created_by_username }}
            </div>
          </div>

          <!-- 活動詳細資訊 -->
          <div class="grid gap-4 mb-6">
            <!-- 時間 -->
            <div class="flex items-start">
              <ClockIcon class="w-5 h-5 mr-3 mt-0.5 text-blue-500" />
              <div>
                <div class="font-medium text-gray-900">活動時間</div>
                <div class="text-gray-600">
                  {{ selectedActivity.date }}
                </div>
              </div>
            </div>

            <!-- 地點 -->
            <div class="flex items-start">
              <MapPinIcon class="w-5 h-5 mr-3 mt-0.5 text-red-500" />
              <div>
                <div class="font-medium text-gray-900">活動地點</div>
                <div class="text-gray-600">{{ selectedActivity.location }}</div>
              </div>
            </div>

            <!-- 參加人數 -->
            <div class="flex items-start">
              <UsersIcon class="w-5 h-5 mr-3 mt-0.5 text-green-500" />
              <div>
                <div class="font-medium text-gray-900">參加人數</div>
                <div class="flex items-center">
                  <span class="text-gray-600">
                    {{ selectedActivity.current_participants }} / {{ selectedActivity.max_participants }}
                  </span>
                  <span 
                    v-if="Number(selectedActivity.current_participants) >= selectedActivity.max_participants"
                    class="px-2 py-1 ml-2 text-xs text-red-600 bg-red-100 rounded-full"
                  >
                    已額滿
                  </span>
                  <span 
                    v-else
                    class="px-2 py-1 ml-2 text-xs text-green-600 bg-green-100 rounded-full"
                  >
                    開放報名
                  </span>
                </div>
              </div>
            </div>

            <!-- 創建時間 -->
            <div class="flex items-start">
              <CalendarIcon class="w-5 h-5 mr-3 mt-0.5 text-purple-500" />
              <div>
                <div class="font-medium text-gray-900">創建時間</div>
                <div class="text-gray-600">{{ selectedActivity.created_at }}</div>
              </div>
            </div>
          </div>

          <!-- 活動描述 -->
          <div class="mb-8">
            <h3 class="mb-3 text-lg font-semibold text-gray-900">活動描述</h3>
            <div class="leading-relaxed text-gray-600 whitespace-pre-wrap">
              {{ selectedActivity.description }}
            </div>
          </div>

          <!-- 操作按鈕 -->
          <div class="flex flex-col gap-3 sm:flex-row">
            <!-- 報名按鈕 - 根據狀態顯示不同樣式 -->
            <button 
              v-if="activityStatus === 'OPEN'"
              @click="handleJoin"
              class="flex-1 px-6 py-3 font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              加入活動
            </button>
            
            <button 
              v-else-if="activityStatus === 'ALREADY_JOINED'"
              disabled
              class="flex-1 px-6 py-3 font-medium text-gray-400 border-2 border-gray-400 cursor-not-allowed rounded-xl"
            >
              已加入
            </button>
            
            <button 
              v-else-if="activityStatus === 'FULL'"
              disabled
              class="flex-1 px-6 py-3 font-medium text-red-400 border-2 border-red-400 cursor-not-allowed rounded-xl"
            >
              已額滿
            </button>
            
            <!-- 分享按鈕 -->
            <button 
              @click="handleShare"
              class="relative px-6 py-3 font-medium text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 rounded-xl"
            >
              <ShareIcon class="w-5 h-5 mx-auto" />
              
              <!-- 分享選單 -->
              <div 
                v-if="showShareMenu"
                class="absolute right-0 z-10 p-2 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg bottom-full min-w-48"
              >
                <button 
                  @click="copyLink"
                  class="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <ClipboardDocumentIcon class="w-4 h-4 mr-2" />
                  複製連結
                </button>
                
                <button 
                  @click="shareToLine"
                  class="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <div class="flex items-center justify-center w-4 h-4 mr-2 bg-green-500 rounded-sm">
                    <span class="text-xs font-bold text-white">L</span>
                  </div>
                  分享到 LINE
                </button>
                
                <button 
                  @click="shareToFacebook"
                  class="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <div class="flex items-center justify-center w-4 h-4 mr-2 bg-blue-600 rounded-sm">
                    <span class="text-xs font-bold text-white">f</span>
                  </div>
                  分享到 Facebook
                </button>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 活動不存在 -->
    <div v-else class="flex flex-col items-center justify-center min-h-screen text-gray-500">
      <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.441-1.01-5.903-2.62l.15.291a7.962 7.962 0 0002.13 1.83C9.17 14.24 10.542 14.5 12 14.5c1.458 0 2.83-.26 3.62-.92a7.962 7.962 0 002.13-1.83l.15-.291C16.441 14.01 14.34 15 12 15s-4.441-1.01-5.903-2.62zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-xl">活動不存在或已被刪除</p>
      <button @click="$router.push('/activities')" class="mt-4 text-blue-600 hover:text-blue-800">
        返回活動列表
      </button>
    </div>
  </div>
</template>