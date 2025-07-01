<!-- 父組件 控制配對流程與切換使用者 -->
<script setup>
import { notify } from "@/utils/notify";
import { ref, computed, onUnmounted, onMounted } from "vue";
import { useMatchStore } from "@/stores/matches.js";
import UserCard from "@/components/UserCard.vue";
import MatchBtn from "@/components/MatchBtn.vue";
import UserIntro from "@/components/UserIntro.vue";
import MatchedDoneModal from "@/components/MatchedDoneModal.vue";
import { sendLike, sendSuperLike } from "@/api/like.js";
import { fetchMatchedUsers } from "@/api/recommend.js";
import { useRouter } from "vue-router";

const router = useRouter();
const matchStore = useMatchStore();

const allProfiles = ref([]);
const relaxed = ref(false);
const limitUsers = 20;

const currentIndex = ref(0);
const currentUser = computed(() => {
  return allProfiles.value.length > 0
    ? allProfiles.value[currentIndex.value]
    : null;
});

const fetchAllMatchedUsers = async () => {
  try {
    const res = await fetchMatchedUsers();

    allProfiles.value = res.data;
    relaxed.value = res.relaxed;

    if (res.data.length === 0) {
      notify.gradient("找不到符合條件的人，請稍後再試或放寬條件");
    }
    return res.data;
  } catch (error) {
    console.error("載入使用者資料失敗", error);
  }
};

onMounted(async () => {
  await fetchAllMatchedUsers();
  console.log("配對筆數：", allProfiles.value.length);

  console.log("拿到資料：", allProfiles.value); // 現在可以看到 allProfiles 的值了
  console.log("當前的配對對象：", currentUser.value); // 資料載入後再印出
});

const isShow = ref(true);
const infoBtnTxt = ref("Hide Info");
const infoToggle = () => {
  isShow.value = !isShow.value;
  infoBtnTxt.value = isShow.value ? "Hide Info" : "Show More";
};

const nextUser = () => {
  const maxIndex = Math.min(allProfiles.value.length, limitUsers) - 1;
  if (currentIndex.value < maxIndex) {
    currentIndex.value++;
  } else {
    isCovering.value = true;
    startCountdown();
  }
};

const myOwnProfile = ref(null);
const matchedTarget = ref(null);
const mutualLike = ref(false);
const restSuperLikes = ref(null);

const isCovering = ref(false);
const confirmModal = ref(false);

const likeFlag = async (targetId) => {
  try {
    const { matched, message, targetProfile, myProfile } = await sendLike(
      targetId
    );
    if (matched) {
      matchedTarget.value = targetProfile;
      myOwnProfile.value = myProfile;

      mutualLike.value = true;
      confirmModal.value = true;
    } else {
      notify.gradient(message); // 其他提示
      nextUser(); //如果要改成動畫提示訊息的話這邊要用setTimeout 等動畫跑完
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      notify.kiwi(error.response.data.message || "等待對方回應...");
      setTimeout(() => {
        nextUser();
      }, 1500);
    }
    console.error("送出like發生錯誤", error);
  }
};

const dislikeFlag = async (targetId) => {
  try {
    await sendLike(targetId, 0);
    nextUser();
  } catch (error) {
    alert("對象重複");
    console.error("使用者送出dislike發生錯誤", error);
  }
};

const isMember = ref(false);
const totalSuperLike = ref(0);
const isSuperLikeDisabled = ref(true);
const superLikeMsg = ref("");

const handleSuperLikeStatus = (status) => {
  isMember.value = status.isMember;
  totalSuperLike.value = status.totalCount;
  isSuperLikeDisabled.value = status.isDisabled;
  superLikeMsg.value = status.msg;
};

const superLikeFlag = async (targetId) => {
  try {
    const { forcedMatched, remainingCount, message, targetProfile, myProfile } =
      await sendSuperLike(targetId);

    if (forcedMatched) {
      matchStore.setProfiles(myProfile, targetProfile);

      matchedTarget.value = targetProfile;
      myOwnProfile.value = myProfile;
      // mutualLike.value = true;
      // confirmModal.value = true;
      notify.gradient(message);
    }

    if (remainingCount !== undefined) {
      restSuperLikes.value = remainingCount;
      const message = `已送出 Super Like💖
      剩下${restSuperLikes.value}次`;
      notify.gradient(message);
    }
    nextUser();
  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      if (status === 409) {
        notify.kiwi(
          error.response.data.message || "已發送過，等待對方回應中..."
        );
        nextUser();
      }

      if (status === 403) {
        notify.warn(error.response.data.message || "今日使用次數已達上限");
        restSuperLikes.value = 0; // 把剩餘數量設為0禁用按鈕
      }
    }
    console.error("使用者送出super like發生錯誤", error);
  }
};

const closeCover = () => {
  isCovering.value = false;
  stopCountdown();
};

onUnmounted(() => {
  stopCountdown();
});

const countdownText = ref("");
let countdownInterval = null;

const timeSetting = () => {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const restTime = tomorrow - now;
  const hours = String(Math.floor(restTime / 1000 / 60 / 60)).padStart(2, "0");
  const minutes = String(Math.floor((restTime / 1000 / 60) % 60)).padStart(
    2,
    "0"
  );
  const seconds = String(Math.floor((restTime / 1000) % 60)).padStart(2, "0");
  countdownText.value = `${hours}:${minutes}:${seconds}`;
};

const startCountdown = () => {
  timeSetting();
  countdownInterval = setInterval(timeSetting, 1000);
};

const stopCountdown = () => {
  clearInterval(countdownInterval);
};

const onCancel = () => {
  confirmModal.value = false;
  nextUser();
};

const goToSubscription = () => {
  router.push("/subscription");
};
</script>

<template>
  <main
    class="flex flex-col items-center justify-between w-full max-w-2xl pt-6 pb-10 m-4 mx-auto transition-all shadow-xl bg-white/95 backdrop-blur-md rounded-3xl ring-1 ring-gray-200/50 sm:px-6 md:px-8"
  >
    <!-- 顯示對象滑滑區 -->
    <UserCard
      v-if="currentUser && currentUser.photos"
      :target-photos="currentUser.photos"
      @goNext="nextUser"
    />

    <!-- 只有成功配對時才顯示 Modal -->
    <!-- 傳給子元件 自己 pinia 的名字 和  配對對象 名<template> 會自動解 ref 別.value  -->
    <MatchedDoneModal
      v-if="confirmModal"
      :my-profile="myOwnProfile"
      :target-profile="matchedTarget"
      @cancel="onCancel"
      @go-chat="goToChatRoom"
    />

    <!-- 配對按鈕區 -->
    <div
      class="flex flex-col items-center w-full gap-6 mt-6 md:flex-row md:justify-center md:items-start"
    >
      <MatchBtn
        v-if="typeof currentUser?.userId === 'number'"
        :target-user="currentUser.userId"
        class="w-full md:w-auto"
        @like="likeFlag"
        @dislike="dislikeFlag"
        @superLike="superLikeFlag"
        @superLikeStatus="handleSuperLikeStatus"
      />
    </div>

    <!-- 更多資訊 -->
    <section class="w-full px-4 pt-6 mt-6 border-t sm:px-6 border-gray-300/50">
      <button
        type="button"
        class="relative block w-full px-6 py-2 mx-auto text-sm font-semibold transition border rounded-full shadow-md md:w-auto text-primary border-primary bg-primary/10 hover:bg-primary hover:text-white"
        @click="infoToggle"
      >
        {{ infoBtnTxt }}
      </button>
      <!-- 展示個人資訊頁面 -->
      <transition name="slide-fade">
        <UserIntro v-show="isShow" :target-user="currentUser" class="mt-4" />
      </transition>
    </section>
  </main>

  <!-- 滑完遮罩 -->
  <div
    v-if="isCovering"
    class="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 text-center bg-white/90 text-darkblue backdrop-blur-md"
    @click="closeCover"
  >
    <div
      class="w-full max-w-sm mx-auto space-y-4 sm:max-w-md md:max-w-lg lg:max-w-xl"
    >
      <p class="mb-3 text-lg font-medium">你已瀏覽完今日推薦配對</p>
      <p class="mb-6 text-lg tracking-wide text-secondary">
        將於 {{ countdownText }} 後更新
      </p>
    </div>
    <button
      class="px-6 py-2 font-semibold text-white transition-all rounded-full shadow-md bg-accent hover:bg-orange"
      @click.stop="goToSubscription"
    >
      升級解鎖更多使用者
    </button>
  </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  transform-origin: top;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: scaleY(0.95);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: scaleY(1);
}

.card-slide-enter-active,
.card-slide-leave-active {
  transition: all 0.4s ease;
}
.card-slide-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.card-slide-leave-to {
  opacity: 0;
  transform: translateX(-40px) scale(0.95);
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out both;
}
</style>
