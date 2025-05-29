<script setup>
import { ref, computed } from "vue";

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

// 計算當前是第 X 位使用者
const currentIndex = ref(0);

const currentUser = computed(() => users.value[currentIndex.value]);
// 切換到上一位使用者
const prevUser = () => {
  currentIndex.value =
    (currentIndex.value - 1 + users.value.length) % users.value.length;
};
// 切換到下一位使用者
const nextUser = () => {
  currentIndex.value = (currentIndex.value + 1) % users.value.length;
};

const isShow = ref(false);
const infoBtnTxt = ref("Show More");
const infoToggle = () => {
  isShow.value = !isShow.value;
  infoBtnTxt.value = isShow.value ? "Hide Info" : "Show More";
};
</script>

<template>
  <main
    class="bg-[#E0E0E0] px-6 pt-6 flex items-center justify-around flex-col"
  >
    <section class="flex items-center p-2 gap-3 mb-4">
      <button type="button" @click="prevUser" class="circle-wrap">
        <div class="left-arrow transform -translate-x-[2px]"></div>
      </button>

      <div class="flex flex-wrap gap-3">
        <div
          v-for="photo in currentUser.photos"
          :key="photo"
          class="bg-white rounded-lg shadow p-2 w-64"
        >
          <img
            :src="photo"
            alt="avatar"
            class="w-full object-cover rounded h-80"
          />
        </div>
      </div>

      <button type="button" @click="nextUser" class="circle-wrap">
        <div class="right-arrow transform translate-x-[2px]"></div>
      </button>
    </section>
    <!-- 個人資訊頁面 -->
    <section class="px-4 pt-4 w-full mt-4">
      <button
        @click="infoToggle"
        type="button"
        class="-mb-4 relative z-10 block mx-auto px-5 py-2 rounded-full font-semibold text-[#2c3e50] bg-[#f8f9fa] border border-[#2c3e50] shadow-md hover:bg-[#2c3e50] hover:text-white transition duration-300"
      >
        {{ infoBtnTxt }}
      </button>
      <transition name="fade-slide">
        <div v-show="isShow" class="bg-[#fff3cd] -mt-5 relative z-0 p-5">
          <div class="flex items-center">
            <h3>{{ currentUser.name }}</h3>
            <p class="font-semibold mx-2 text-[#ffb485]">
              {{ currentUser.age }}
            </p>
            <p class="font-semibold">{{ currentUser.location }}</p>
          </div>

          <hr class="my-2" />
          <h4 class="">關於我</h4>
          <span class="personal-tag">
            {{ currentUser.mbti }}
          </span>
          <span class="personal-tag">
            {{ currentUser.zodiac }}
          </span>
          <h4>興趣</h4>
          <span
            v-for="interest in currentUser.interests"
            :key="interest"
            class="personal-tag"
          >
            {{ interest }}
          </span>
          <hr class="my-2" />
          <h4>自我介紹</h4>
          <p class="text-[#2c3e50]">
            {{ currentUser.bio }}
          </p>
        </div>
      </transition>
    </section>
  </main>
</template>

<style scoped>
h3 {
  @apply text-2xl my-2 font-semibold text-[#2c3e50];
}

h4 {
  @apply text-xl my-2 font-semibold text-[#2c3e50];
}

.personal-tag {
  @apply font-semibold mx-1 text-white text-base bg-[#C0D7EC] px-3 py-1 rounded-s my-1;
}

.left-arrow {
  width: 0;
  height: 0;
  border-top: 0.6rem solid transparent;
  border-bottom: 0.6rem solid transparent;
  border-right: 1.4rem solid #2c3e50;
}
.right-arrow {
  width: 0;
  height: 0;
  border-top: 0.6rem solid transparent;
  border-bottom: 0.6rem solid transparent;
  border-left: 1.4rem solid #2c3e50;
}
.circle-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  background-color: #f8f9fa;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
