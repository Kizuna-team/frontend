<!-- 父組件 控制配對流程與切換使用者 -->
<script setup>
import { ref, computed } from "vue";
import UserCard from "@/components/UserCard.vue";
import MatchBtn from "@/components/MatchBtn.vue";
import UserIntro from "@/components/UserIntro.vue";

// user假資料
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
    interests: ["閱讀", "安靜", "安靜"],
    intro: "嗨，我是小玉，希望找到志同道合的朋友。",
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
    alert("已經沒有更多使用者了！");
  }
};

const likeFlag = (userId) => {
  console.log("我喜歡對方：", userId);
  nextUser(); // 自動切換到下一位
};

const dislikeFlag = (userId) => {
  console.log("我不喜歡對方：", userId);
  nextUser(); // 一樣切換到下一位
};

// 待新增 const isMatchLocked = ref(false)
</script>

<template>
  <main class="bg-[#E0E0E0] pt-6 flex items-center justify-around flex-col">
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
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: max-height 0.4s ease, opacity 0.4s ease;
  overflow: hidden;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  max-height: 1000px; /* 根據內容估一個夠大的值即可 */
  opacity: 1;
}
</style>
