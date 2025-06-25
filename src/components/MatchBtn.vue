<script setup>
import { ref, onMounted } from "vue";
import { fetchSuperLikeStatus } from "@/api/like.js";

// 傳入對方的 userId，接著對對方 貼上喜歡/不喜歡的標籤 通知給父組件
const { targetUser } = defineProps({
  targetUser: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["like", "dislike", "superLike", "superLikeStatus"]);

const isMember = ref(false);
const totalCount = ref(0);
const isDisabled = ref(true);
const msg = ref("");
const superLikeActive = ref(false);

const superLikeStatus = async () => {
  try {
    const data = await fetchSuperLikeStatus();
    console.log("💡 API 回傳 SuperLike 狀態:", data);

    isMember.value = data.isMember;
    totalCount.value = data.remainingCount;
    // 只要次數 <= 0 就要禁用
    isDisabled.value = totalCount.value <= 0;

    // 解決可無限點的問題
    if (totalCount.value > 0) {
      msg.value = isMember.value
        ? `剩餘 ${totalCount.value} 次 Super Like`
        : `剩餘 ${totalCount.value} 次 Super Like (非會員專屬)`;
    } else {
      msg.value = isMember.value
        ? "今日 Super Like 次數已用完"
        : "尚未開啟高級會員功能 (今日次數已用完)";
    }

    emit("superLikeStatus", {
      isMember: isMember.value,
      totalCount: totalCount.value,
      isDisabled: isDisabled.value,
      msg: msg.value,
    });
  } catch (error) {
    // 錯誤要禁用按鈕
    isDisabled.value = true;
    console.error("取得 Super Like 狀態失敗", error);
  }
};

onMounted(() => {
  superLikeStatus();
});

const likeHandler = () => {
  emit("like", targetUser);
};

const dislikeHandler = () => {
  emit("dislike", targetUser);
};

// Super-Like按鈕動畫
const superLikeHandler = async () => {
  if (isDisabled.value) {
    alert(msg.value);
    return;
  }
  superLikeActive.value = false;
  superLikeActive.value = true;

  setTimeout(() => {
    superLikeActive.value = false;
    emit("superLike", targetUser);
  }, 800);
};
</script>

<template>
  <div class="flex items-center justify-center w-48 gap-16 px-2">
    <button
      type="button"
      class="w-12 h-12 rounded-[50%] shadow-xl bg-[#fcfcfc] hover:bg-white hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out"
      @click="dislikeHandler"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="w-12 h-12 text-[#229EBC]"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    
      <button
        :disabled="isDisabled"
        type="button"
        class="circle-wrap  bg-[#ff5e5e] hover:bg-[#ff5e5e] hover:shadow-lg hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none transition-all duration-200 ease-in-out"
        :class="{ 'animate-pulse shadow-lg shadow-[#229EBC]/30': superLikeActive }"
        @click="superLikeHandler"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-10 h-10 text-[#ffffff] "
        >
          <path
            d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
          />
        </svg>
      </button>
    
    <button
      type="button"
      class="w-12 h-12 rounded-[50%] shadow-xl bg-white hover:bg-gray-50 hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out"
      @click="likeHandler"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="w-12 h-12 text-[#229EBC] "
      >
        <path
          fill-rule="evenodd"
          d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    </div>
</template>

<style scoped>
.circle-wrap {
  /* 記得class另外補上背景色 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 100%;
}

/* superLike的彈跳動畫 */
.puff-out-center {
  -webkit-animation: puff-out-center 1s ease-in alternate forwards;
  animation: puff-out-center 1s ease-in alternate forwards;
}
@-webkit-keyframes puff-out-center {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-filter: blur(1px);
    filter: blur(0px);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(2);
    transform: scale(2);
    -webkit-filter: blur(2px);
    filter: blur(4px);
    opacity: 0;
  }
}
@keyframes puff-out-center {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-filter: blur(1px);
    filter: blur(0px);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(2);
    transform: scale(2);
    -webkit-filter: blur(2px);
    filter: blur(4px);
    opacity: 0;
  }
}
</style>
