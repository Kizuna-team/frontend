<script setup>
import { useRouter } from "vue-router";
import { useSendFriendMsg } from "@/api/useMatches.js";
import { Vue3Lottie } from "vue3-lottie";
import { ref, onMounted } from "vue";
import heartAnimationData from "@/assets/heart.json";

const router = useRouter();
const { sendFriendMsg } = useSendFriendMsg();
const heartLottieRef = ref(null);
const heartAnimation = ref(null);

onMounted(() => {
  try {
    heartAnimation.value = heartAnimationData;
    console.log("✅ 愛心動畫載入成功");
  } catch (error) {
    console.error("❌ 動畫載入失敗:", error);
  }
});

const props = defineProps({
  myProfile: Object,
  targetProfile: Object,
});

const emit = defineEmits(["cancel", "go-chat"]);

// 關閉彈窗函數
const onCancelClick = () => {
  emit("cancel");
};

// 聊天室跳轉函數 - 包含API呼叫
const goToChatRoom = async () => {
  try {
    await sendFriendMsg(props.targetProfile.userId); // 建立好友
    router.push("/chat"); // 跳到聊天室頁面
  } catch (err) {
    console.error("建立好友關係失敗", err);
    alert("無法進入聊天室，請稍後再試");
  }
};
</script>

<template>
  <Teleport to="body">
  <!-- 全螢幕遮罩背景 - 點擊可關閉彈窗 -->
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <!-- 主要彈窗容器 - 黃色漸層背景，圓角設計 -->
    <div
      class="bg-gradient-to-br from-[#ffc0e4] to-yellow-100 rounded-3xl p-8 w-full max-w-sm mx-4 relative shadow-2xl"
      @click.stop
    >
      <!-- 頭像區域 - 我的頭像 + 愛心 + 對方頭像 -->
      <div class="flex justify-center items-start mb-6 space-x-4">
        <!-- 我的頭像 + 名稱 (左邊) -->
        <div class="flex flex-col items-center">
          <div class="relative">
            <div
              class="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100"
            >
              <img
                v-if="props.myProfile?.avatarUrl || props.myProfile?.photos?.[0]"
                :src="props.myProfile?.avatarUrl || props.myProfile?.photos?.[0]"
                :alt="props.myProfile?.name || 'My Avatar'"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400 text-2xl"
              >
                👤
              </div>
            </div>
          </div>
          <!-- 我的名稱 -->
          <p class="text-sm text-gray-700 mt-2 text-center font-medium">
            {{ props.myProfile?.name || '我' }}
          </p>
        </div>

        <!-- 中間的愛心區域 -->
        <div class="relative w-[70px] h-[70px] mt-2">
          <Vue3Lottie
            ref="heartLottieRef"
            :animation-data="heartAnimation"
            :loop="true"
            :autoplay="true"
            class="w-full h-full"
          />
        </div>

        <!-- 對方頭像 + 名稱 (右邊) -->
        <div class="flex flex-col items-center">
          <div class="relative">
            <div
              class="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100"
            >
              <img
                v-if="
                  props.targetProfile?.avatarUrl ||
                  props.targetProfile?.photos?.[0]
                "
                :src="
                  props.targetProfile?.avatarUrl ||
                  props.targetProfile?.photos?.[0]
                "
                :alt="props.targetProfile?.name || 'Target Avatar'"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400 text-2xl"
              >
                👤
              </div>
            </div>
          </div>
          <!-- 對方名稱 -->
          <p class="text-sm text-gray-700 mt-2 text-center font-medium">
            {{ props.targetProfile?.name || '對方' }}
          </p>
        </div>
      </div>

      <!-- 標題區域 - 配對成功文字 -->
      <div class="text-center mb-6">
        

        <!-- 主標題 -->
        <h2 class="text-2xl font-bold text-gray-800 mb-2">配對成功</h2>

        <!-- 副標題 -->
        <p class="text-gray-600 text-sm">你們互相喜歡，開始聊天吧</p>
      </div>

      <!-- 按鈕區域 -->
      <div class="space-y-3">
        <!-- 主要按鈕 - 立即聊天 -->
        <button
          @click="goToChatRoom"
          class="w-full bg-gradient-to-r from-[#ff7190] to-[#FED548] hover:from-[#ff7190] hover:to-[#FED548] text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
          title="進入聊天室"
        >
          <!-- 按鈕圖標 -->
          <span
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path
                fill-rule="evenodd"
                d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <!-- 按鈕文字 -->
          <span>立即聊天</span>
        </button>

        <!-- 次要按鈕 - 稍後再說 -->
        <button
          @click="onCancelClick"
          class="w-full text-gray-500 hover:text-gray-700 py-2 transition-colors duration-200"
        >
          稍後再說
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<style scoped>
/* 彈窗進入動畫 */
.fixed {
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 彈窗內容進入動畫 */
.bg-gradient-to-br {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 愛心脈衝動畫 */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
}

/* 愛心彈跳動畫 */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

.animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}
</style>