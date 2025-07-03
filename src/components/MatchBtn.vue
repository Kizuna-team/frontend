<script setup>
import { notify } from "@/utils/notify";
import { ref, onMounted } from "vue";
import { fetchSuperLikeStatus } from "@/api/like.js";

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
    // console.log("API 回傳 SuperLike 狀態:", data);

    isMember.value = data.isMember;
    totalCount.value = data.remainingCount;
    isDisabled.value = totalCount.value <= 0;

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
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-6 text-[#3d3d3d]"
        >
          <path
            d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z"
          />
          <path
            d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z"
          />
        </svg>
      </button>
    </div>

    <button
      type="button"
      class="text-pink-600 circle-btn bg-gradient-to-br from-[#8ecae6]/70 via-white/50 to-pink-200/70 hover:scale-110 disabled:opacity-40"
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
