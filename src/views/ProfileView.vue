<script setup>
import { useUserStore } from "@/stores/user";
import axios from "../api/axios";
import { ref, onMounted, computed } from "vue";

const userStore = useUserStore();

const showModal = ref(false);
const searchKeyword = ref("");

onMounted(async () => {
  // console.log(userStore.userId);
  try {
    const myUserId = userStore.userId;
    // 到資料庫撈自己的 profile
    const res = await axios.get(`/profile/${myUserId}`);
    const myProfile = res.data;

    // console.log("我的 profile:", myProfile);

    // 把從資料庫抓到的資訊塞進 pinia 集中管理
    userStore.getProfile({
      gender: myProfile.gender,
      age: myProfile.age,
      location: myProfile.location,
      bio: myProfile.bio || "(尚未填寫自我介紹)",
      interests: myProfile.interests || [],
    });
  } catch (err) {
    console.error("載入 profile 失敗", err);
    userStore.bio = "(載入失敗)";
  }
});

const  handleInterestClick = (interest) => {
  searchKeyword.value = interest;
  showModal.value = true;
}

const closeModal = () => {
  showModal.value = false;
  searchKeyword.value = "";
}

const BingSearchUrl = computed(() => {
  return `https://Bing.com/search?q=${encodeURIComponent(searchKeyword.value)}`;
});

</script>

<template>
  <div class="p-4 my-3  rounded-xl w-[500px]">
    <div class="p-4 rounded-lg hover:shadow-md bg-[#F0F0F0]">
      <!-- 圖片區 -->
      <div class="flex justify-center mb-4">
        <div class="h-[400px] bg-white w-[435px] rounded-2xl"></div>
      </div>

      <!-- 文字區 -->
      <h2 class="mb-3 text-xl font-bold text-gray-900">
        {{ userStore.username }}
      </h2>
      <p class="mb-3 text-xl font-bold text-gray-900">
        {{ userStore.profile.location }}
      </p>
      <p class="mb-3 text-xl leading-relaxed text-gray-900">
        {{ userStore.profile.bio }}
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          @click="handleInterestClick(interest)"
          v-for="(interest, index) in userStore.profile.interests"
          :key="index"
          class="px-3 py-1 text-xl transition-all duration-300 bg-blue-100 rounded-full cursor-pointer gray-700 hover:bg-[#0A1D3B] hover:text-white hover:scale-100"
        >
          {{ interest }}
      </button>
      </div>
    </div>
  </div>
  <!-- modal 遮罩 -->
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
  <!-- modal 內容框 -->
    <div class="relative w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg h-[60vh]">
      <!-- 關閉按鈕 -->
      <button
        @click="closeModal"
        class="absolute text-xl text-gray-500 top-2 right-2 hover:text-gray-800"
      >
        &times;
      </button>

      <!-- Google Search Iframe -->
      <iframe
        :src="BingSearchUrl"
        class="flex-grow w-full h-full rounded"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
</style>
