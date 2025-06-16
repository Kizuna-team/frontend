<!-- 父組件 控制配對流程與切換使用者 -->
<script setup>
import { ref, computed, onUnmounted, onMounted } from "vue";
import UserCard from "@/components/UserCard.vue";
import MatchBtn from "@/components/MatchBtn.vue";
import UserIntro from "@/components/UserIntro.vue";
import MatchedDoneModal from "@/components/MatchedDoneModel.vue";

import { sendLike, sendSuperLike } from "@/api/like.js";
import { fetchAllProfiles } from "@/api/profile.js";

// user假資料
// const users = ref([
//   {
//     id: 1,
//     name: "西西",
//     age: 28,
//     zodiac: "雙子座",
//     location: "高雄市",
//     photos: [
//       "https://im.marieclaire.com.tw/s1200c675h100b0/aq/2015/04/16/201504131747183239.jpg",
//       "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjZ6kIRmyQ8LFGVxKbivqcxwZWqoXBmy5ANTekmGdnDoahHUzSzPHbLQIeDuEV0L0dRjslUHBIg8kaQE4BU5xXoRBX4GBmUooaViZzQG44k8QURYiYcZNOqwRMnyXNw_8qzaLjeQywUmUM/s1600/emma-watson.jpg",
//       "https://cdn.wowscreen.com.tw/uploadfile/202210/goods_028263_373336.png",
//     ],
//     bio: "我是一個熱愛旅遊的人，喜歡挑戰新事物。",
//     mbti: "INTJ",
//     interests: ["攝影", "爬山", "音樂"],
//     intro: "嗨，我是西西，期待認識新朋友。",
//   },
// ]);

const allProfiles = ref([]);
const limitUsers = 20;

// 計算當前是第 X 位使用者
const currentIndex = ref(0);
const currentUser = computed(() => allProfiles.value[currentIndex.value]);

// 未加入篩選邏輯 > 人選區
const fetchAllUsers = async () => {
  try {
    const data = await fetchAllProfiles();
    allProfiles.value = data.users;
    return data;
  } catch (error) {
    console.error("載入使用者資料失敗", error);
  }
};

onMounted(async () => {
  await fetchAllUsers();
  console.log("拿到資料：", allProfiles.value); // 現在可以看到 allProfiles 的值了
  console.log("當前的配對對象：", currentUser.value); // 資料載入後再印出
});

// 使用者資訊的開合
const isShow = ref(false);
const infoBtnTxt = ref("Show More");
const infoToggle = () => {
  isShow.value = !isShow.value;
  infoBtnTxt.value = isShow.value ? "Hide Info" : "Show More";
};

// 切換到上一位使用者
const prevUser = () => {
  currentIndex.value =
    (currentIndex.value - 1 + allProfiles.value.length) %
    allProfiles.value.length;
};

// 切換到下一位使用者
// (防止顯示人數不達20位)從可配對者和限制的數量中，挑比較小的那一個
const nextUser = () => {
  const maxIndex = Math.min(allProfiles.value.length, limitUsers) - 1;
  if (currentIndex.value < maxIndex) {
    currentIndex.value++;
  } else {
    isCovering.value = true;
    startCountdown();
  }
};

// 配對Modal super-like剩餘次數 上限遮罩
const myOwnProfile = ref(null); // 自己的一整包資料
const matchedTarget = ref(null); // 存取配對成功對象一整包資料
const mutualLike = ref(false); // 是否互相喜歡
const restSuperLikes = ref(null);
// 配對關閉 ｜ 彈跳配對視窗
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
      alert(message); // 其他提示
      nextUser(); //如果要改成動畫提示訊息的話這邊要用setTimeout 等動畫跑完
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      alert(error.response.data.message || "已表達 等待對方回應");
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
    alert("對象重複"); // 其他提示
    console.error("使用者送出dislike發生錯誤", error);
  }
};

// SuperLike 按鈕畫面提示
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
    const { matched, remainingCount, message, targetProfile, myProfile } =
      await sendSuperLike(targetId);

    if (matched) {
      matchedTarget.value = targetProfile;
      myOwnProfile.value = myProfile;
      mutualLike.value = true;
      confirmModal.value = true;
      alert(message); // 要換成動畫
    }

    // 更新剩餘次數的 UI 或狀態
    if (remainingCount !== undefined) {
      restSuperLikes.value = remainingCount;
      alert(`已送出Super like 剩下${restSuperLikes.value}次`); // 要換成動畫
    }
    nextUser();
  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      if (status === 409) {
        alert(error.response.data.message || "已表達 等待對方回應");
        nextUser();
      }

      if (status === 403) {
        alert(error.response.data.message || "今日使用次數已達上限");
        restSuperLikes.value = 0; // 把剩餘數量設為0禁用按鈕
      }
    }
    console.error("使用者送出super like發生錯誤", error);
  }
};

// 關閉倒數遮罩
const closeCover = () => {
  isCovering.value = false;
  stopCountdown();
};

// 清理定時器
onUnmounted(() => {
  stopCountdown();
});

// 倒數計時畫面
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

// 用戶僅關閉配對成功畫面 不做其他事
const onCancel = () => {
  confirmModal.value = false;
  nextUser();
};
</script>

<template>
  <main
    class="flex flex-col items-center justify-around pt-6 card-bg rounded-3xl"
  >
    <!-- 顯示對象滑滑區 -->
    <UserCard
      v-if="currentUser && currentUser.photos"
      :target-photos="currentUser.photos"
      @goPrev="prevUser"
      @goNext="nextUser"
    />

    <!-- 只有成功配對時才顯示 Modal -->
    <!-- 傳給子元件 自己 pinia 的名字 和  配對對象 名<template> 會自動解 ref 別.value  -->
    <MatchedDoneModal
      v-if="confirmModal"
      :my-profile="myOwnProfile"
      :target-profile="matchedTarget"
      @cancel="onCancel"
    />

    <!-- 配對按鈕區 -->
    <MatchBtn
      v-if="typeof currentUser?.userId === 'number'"
      :target-user="currentUser.userId"
      @like="likeFlag"
      @dislike="dislikeFlag"
      @superLike="superLikeFlag"
      @superLikeStatus="handleSuperLikeStatus"
    />

    <!-- 個人資訊頁面收合區 -->
    <section class="w-full pt-4 mt-4">
      <button
        type="button"
        class="-mb-4 relative z-10 block mx-auto px-5 py-2 rounded-full font-semibold text-[#2c3e50] bg-[#f8f9fa] border border-[#2c3e50] shadow-md hover:bg-[#2c3e50] hover:text-white transition duration-300"
        @click="infoToggle"
      >
        {{ infoBtnTxt }}
      </button>
      <!-- 展示個人資訊頁面 -->
      <transition name="slide-fade">
        <UserIntro v-show="isShow" :target-user="currentUser" />
      </transition>
    </section>
  </main>

  <!-- 滑完出現遮罩 -->
  <div
    v-if="isCovering"
    class="fixed inset-0 z-50 flex flex-col items-center justify-center text-xl text-white bg-black bg-opacity-60"
    @click="closeCover"
  >
    <p class="mb-4">滑完囉！解鎖倒數</p>
    <p class="mb-4 text-lg">{{ countdownText }}</p>
    <button class="px-4 py-2 text-black bg-white rounded hover:bg-[#ffb703]">
      升級解鎖更多使用者
    </button>
  </div>
</template>

<style scoped>
.card-bg {
  position: relative;
  background-image: linear-gradient(to bottom, #c0d7ec 0%, #c0d7ec 20%),
    linear-gradient(to bottom, #7395ba 20%, #7395ba 35%),
    linear-gradient(to bottom, #8ecae6 35%, #8ecae6 55%),
    linear-gradient(to bottom, #219ebc 55%, #219ebc 75%),
    linear-gradient(to bottom, #fb8500 75%, #999999 100%);
  background-size: 100% 40%;
  background-repeat: no-repeat;
  border-radius: 12px 12px 0 0;
}

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
</style>
