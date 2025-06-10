<!-- 父組件 控制配對流程與切換使用者 -->
<script setup>
import { ref, computed, onUnmounted } from "vue";
import UserCard from "@/components/UserCard.vue";
import MatchBtn from "@/components/MatchBtn.vue";
import UserIntro from "@/components/UserIntro.vue";
import MatchedDoneModal from "@/components/MatchedDoneModal.vue";

import { sendLike } from "@/api/like.js";
import { sendSuperLike } from "@/api/superLike.js";
import { useUserProfileStore } from "@/stores/userProfile";

const userProfileStore = useUserProfileStore();

const users = ref([
  {
    id: 1,
    name: "西西",
    age: 28,
    zodiac: "雙子座",
    location: "高雄市",
    photos: [
      "https://im.marieclaire.com.tw/s1200c675h100b0/aq/2015/04/16/201504131747183239.jpg",
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjZ6kIRmyQ8LFGVxKbivqcxwZWqoXBmy5ANTekmGdnDoahHUzSzPHbLQIeDuEV0L0dRjslUHBIg8kaQE4BU5xXoRBX4GBmUooaViZzQG44k8QURYiYcZNOqwRMnyXNw_8qzaLjeQywUmUM/s1600/emma-watson.jpg",
      "https://cdn.wowscreen.com.tw/uploadfile/202210/goods_028263_373336.png",
    ],
    bio: "我是一個熱愛旅遊的人，喜歡挑戰新事物。",
    mbti: "INTJ",
    interests: ["攝影", "爬山", "音樂"],
    intro: "嗨，我是西西，期待認識新朋友。",
  },
  {
    id: 2,
    name: "小花",
    age: 25,
    location: "台中市",
    zodiac: "處女座",
    photos: [
      "https://image1.gamme.com.tw/news2/2022/10/07/rJyWnaOWkaOcr6c.jpg",
      "https://image1.gamme.com.tw/news2/2022/10/07/rJyWnaOWkaOcr6g.jpg",
      "https://a.ksd-i.com/s/480x_86400_583f780f8611ab72028feb102bfe29f4/static.koreastardaily.com/2018-10-05/109958-662192.jpg",
    ],
    bio: "喜歡閱讀和烹飪，平常喜歡安靜的午後時光。",
    mbti: "ENfJ",
    interests: ["閱讀", "烹飪", "瑜伽"],
    intro: "嗨，我是小花，希望找到志同道合的朋友。",
  },
  {
    id: 3,
    name: "小玉",
    age: 25,
    location: "新竹市",
    zodiac: "處女座",
    photos: [
      "https://assets.juksy.com/files/articles/63508/58c17ded2aaf9.jpg",
      "https://assets.juksy.com/files/articles/63508/58c17ddb98814.jpg",
      "https://assets.juksy.com/files/articles/63508/58c17ea5e111d.jpg",
    ],
    bio: "安靜安靜安靜安靜安靜安靜。",
    mbti: "ISTJ",
    interests: ["閱讀", "安靜", "哈哈"],
    intro: "嗨，我是小玉，希望找到志同道合的朋友。",
  },
  {
    id: 4,
    name: "小美",
    age: 27,
    location: "台北市",
    zodiac: "天秤座",
    photos: [
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/women/45.jpg",
      "https://randomuser.me/api/portraits/women/46.jpg",
    ],
    bio: "愛好美食，熱愛下廚與品嚐美味。",
    mbti: "ESFP",
    interests: ["美食", "烘焙", "旅行"],
    intro: "嗨，我是小美，期待一起探索世界美食。",
  },
  {
    id: 5,
    name: "佳佳",
    age: 30,
    location: "台南市",
    zodiac: "獅子座",
    photos: [
      "https://randomuser.me/api/portraits/women/47.jpg",
      "https://randomuser.me/api/portraits/women/48.jpg",
      "https://randomuser.me/api/portraits/women/49.jpg",
    ],
    bio: "熱愛運動，喜歡戶外活動。",
    mbti: "ENTP",
    interests: ["跑步", "健身", "登山"],
    intro: "嗨，我是佳佳，運動讓我快樂！",
  },
  {
    id: 6,
    name: "小安",
    age: 24,
    location: "台中市",
    zodiac: "巨蟹座",
    photos: [
      "https://randomuser.me/api/portraits/women/50.jpg",
      "https://randomuser.me/api/portraits/women/51.jpg",
      "https://randomuser.me/api/portraits/women/52.jpg",
    ],
    bio: "喜歡繪畫與藝術創作。",
    mbti: "INFP",
    interests: ["繪畫", "設計", "閱讀"],
    intro: "嗨，我是小安，藝術是我的生活。",
  },
  {
    id: 7,
    name: "婷婷",
    age: 29,
    location: "彰化縣",
    zodiac: "金牛座",
    photos: [
      "https://randomuser.me/api/portraits/women/53.jpg",
      "https://randomuser.me/api/portraits/women/54.jpg",
      "https://randomuser.me/api/portraits/women/55.jpg",
    ],
    bio: "熱愛音樂，擅長鋼琴。",
    mbti: "ISFP",
    interests: ["音樂", "鋼琴", "唱歌"],
    intro: "嗨，我是婷婷，音樂是我的靈魂。",
  },
  {
    id: 8,
    name: "小君",
    age: 26,
    location: "新北市",
    zodiac: "雙魚座",
    photos: [
      "https://randomuser.me/api/portraits/women/56.jpg",
      "https://randomuser.me/api/portraits/women/57.jpg",
      "https://randomuser.me/api/portraits/women/58.jpg",
    ],
    bio: "喜歡戶外攝影，享受自然。",
    mbti: "ENFP",
    interests: ["攝影", "旅行", "露營"],
    intro: "嗨，我是小君，喜歡用鏡頭記錄生活。",
  },
  {
    id: 9,
    name: "小晴",
    age: 23,
    location: "嘉義市",
    zodiac: "射手座",
    photos: [
      "https://randomuser.me/api/portraits/women/59.jpg",
      "https://randomuser.me/api/portraits/women/60.jpg",
      "https://randomuser.me/api/portraits/women/61.jpg",
    ],
    bio: "熱愛閱讀，喜歡安靜的咖啡廳。",
    mbti: "INFJ",
    interests: ["閱讀", "咖啡", "寫作"],
    intro: "嗨，我是小晴，歡迎一起分享故事。",
  },
  {
    id: 10,
    name: "小曼",
    age: 31,
    location: "桃園市",
    zodiac: "牡羊座",
    photos: [
      "https://randomuser.me/api/portraits/women/62.jpg",
      "https://randomuser.me/api/portraits/women/63.jpg",
      "https://randomuser.me/api/portraits/women/64.jpg",
    ],
    bio: "熱愛動物，家裡有兩隻貓。",
    mbti: "ESTJ",
    interests: ["動物", "閱讀", "園藝"],
    intro: "嗨，我是小曼，歡迎一起聊寵物。",
  },
]);

// 基本可顯示的使用者數量限制
const limitUsers = 20;

// 計算當前是第 X 位使用者
const currentIndex = ref(0);
const currentUser = computed(() => users.value[currentIndex.value]);

// 使用者資訊的開合
const isShow = ref(false);
const infoBtnTxt = ref("Show More");
const infoToggle = () => {
  isShow.value = !isShow.value;
  infoBtnTxt.value = isShow.value ? "Hide Info" : "Show More";
};

// 配對關閉 ｜ 彈跳配對視窗
const isCovering = ref(false);
const matchedDoneModal = ref(false);

// 切換到上一位使用者
const prevUser = () => {
  currentIndex.value =
    (currentIndex.value - 1 + users.value.length) % users.value.length;
};

// 切換到下一位使用者
// (防止顯示人數不達20位)從可配對者和限制的數量中，挑比較小的那一個
const nextUser = () => {
  const maxIndex = Math.min(users.value.length, limitUsers) - 1;
  if (currentIndex.value < maxIndex) {
    currentIndex.value++;
  } else {
    isCovering.value = true;
    startCountdown();
  }
};

const closeCover = () => {
  isCovering.value = false;
  stopCountdown();
};

// 清理定時器
onUnmounted(() => {
  stopCountdown();
});

// 配對成功 > Modal 顯示
// 發送super like 成功 顯示剩餘次數
const mutualLike = ref(false);
const restSuperLikes = ref(null);
const confirmModal = ref(false);

const likeFlag = async (userId) => {
  try {
    const { matched, message } = await sendLike(userId);
    if (matched) {
      mutualLike.value = true;
      confirmModal.value = true;
    } else {
      alert(message); // 其他提示
      nextUser(); //如果要改成動畫提示訊息的話這邊要用setTimeout 等動畫跑完
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      alert(error.response.data.message || "已表達 等待對方回應");
      nextUser();
    }
    console.error("送出like發生錯誤", error);
  }
};

const dislikeFlag = async (userId) => {
  try {
    await sendLike(userId, 0);
    nextUser();
  } catch (error) {
    alert("對象重複"); // 其他提示
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
    const { matched, remainingCount, message } = await sendSuperLike(targetId);
    if (matched) {
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
    if (error.response && error.response.status === 409) {
      alert(error.response.data.message || "已表達 等待對方回應");
      nextUser();
    }
    if (error.response && error.response.status === 403) {
      alert(error.response.data.message || "今日使用次數已達上限");
      restSuperLikes.value = 0; // 重要！把剩餘數量設為0禁用按鈕
    }
    console.error("使用者送出super like發生錯誤", error);
  }
};

// 關閉配對成功畫面
const onConfirm = () => {
  confirmModal.value = false;
  nextUser();
};

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
</script>

<template>
  <main
    class="flex flex-col items-center justify-around pt-6 card-bg rounded-3xl"
  >
    <!-- 顯示對象滑滑區 -->
    <UserCard
      :target-photos="currentUser.photos"
      @goPrev="prevUser"
      @goNext="nextUser"
    />
    <!-- 配對按鈕區 -->
    <MatchBtn
      :target-user="currentUser.id"
      @like="likeFlag"
      @dislike="dislikeFlag"
      @superLike="superLikeFlag"
      @superLikeStatus="handleSuperLikeStatus"
    />
    <!-- 只有成功配對時才顯示 Modal -->
    <!-- 傳自己的名字 和 配對對象的名字給子元件 -->
    <!-- 看父組件怎麼定義對象 -->
    <MatchedDoneModal
      v-if="matchedDoneModal"
      :my-name="userProfileStore.userProfile.name"
      :target-name="users.value.name"
      @confirm="onConfirm"
      @cancel="matchedDoneModal = false"
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
