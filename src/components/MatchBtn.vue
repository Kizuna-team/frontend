<script setup>
import { notify } from "@/utils/notify";
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
const likeActive = ref(false);
const dislikeActive = ref(false);
const superLikeActive = ref(false);

const isMember = ref(false);
const totalCount = ref(0);
const isDisabled = ref(true);
const msg = ref("");

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
        ? `會員｜剩餘 ${totalCount.value} 次 Super Like`
        : `非會員｜剩餘 ${totalCount.value} 次 Super Like`;
    } else {
      msg.value = isMember.value
        ? "會員今日 Super Like 次數已用完"
        : "免費次數已用完！立即前往升級高級會員";
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
    notify.warn("無法取得 Super Like 狀態");
  }
};

onMounted(() => {
  superLikeStatus();
});

const likeHandler = () => {
  likeActive.value = false;
  emit("like", targetUser);
};

const dislikeHandler = () => {
  dislikeActive.value = false;
  emit("dislike", targetUser);
};

// Super-Like按鈕動畫
const superLikeHandler = async () => {
  if (isDisabled.value) {
    notify.warn(msg.value);
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
  <div
    class="flex flex-wrap items-center justify-center gap-6 px-2 py-4 sm:gap-16"
  >
    <!-- Dislike -->
    <button
      type="button"
      class="text-orange-700 circle-btn bg-gradient-to-br from-orange-100 to-orange-300 hover:scale-110"
      @click="dislikeHandler"
      aria-label="Dislike"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </button>

    <!-- Super Like -->
    <div :class="{ 'puff-out-center': superLikeActive }">
      <button
        :aria-disabled="isDisabled"
        type="button"
        :class="[
          'floating inner-glow text-darkblue transition-all duration-300 ease-out circle-btn bg-gradient-to-br from-[#ffb703]/70 via-white/50 to-[#fb8500]/70 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-accent/50',
          isDisabled
            ? 'cursor-not-allowed brightness-75 saturate-50 opacity-50 blur-[1px]'
            : 'hover:scale-110 hover:rotate-6 hover:shadow-lg hover:brightness-110',
        ]"
        @click="superLikeHandler"
        aria-label="Super Like"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z"
          />
        </svg>
      </button>
    </div>

    <!-- Like -->
    <button
      type="button"
      class="text-pink-500 circle-btn bg-gradient-to-br from-[#8ecae6]/70 via-white/50 to-pink-200/70 hover:scale-110 disabled:opacity-40"
      @click="likeHandler"
      aria-label="Like"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.circle-btn {
  @apply w-14 h-14 rounded-full shadow-md transition-all duration-300 ease-out flex items-center justify-center;
}

.puff-out-center {
  animation: puff-out-center 0.8s ease-in-out forwards;
}

@keyframes puff-out-center {
  0% {
    transform: scale(1);
    filter: blur(0px);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    filter: blur(4px);
    opacity: 0;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.floating {
  animation: float 3s ease-in-out infinite;
}
</style>
