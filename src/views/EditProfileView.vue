<!-- 負責串接 Store 和子元件，處理送出邏輯 -->
<script setup>
import { ref, onMounted } from "vue";
import { useUserProfileStore } from "@/stores/userProfile";

import ProfileForm from "@/components/ProfileForm.vue";
import MultiSelect from "@/components/MultiSelect.vue";
import ProfilePhotos from "@/components/ProfilePhotos.vue";

const tab = ref("intro");
const userProfileStore = useUserProfileStore();
// const userProfile = userProfileStore.userProfile 地雷

const cards = [
  { title: "星座" },
  { title: "MBTI" },
  { title: "工作" },
  { title: "興趣" },
];

// 傳入 MultiSelect 元件的「選項資料」
const zodiacOptions = [
  { name: "牡羊座" },
  { name: "金牛座" },
  { name: "雙子座" },
  { name: "巨蟹座" },
  { name: "獅子座" },
  { name: "處女座" },
  { name: "天秤座" },
  { name: "天蠍座" },
  { name: "射手座" },
  { name: "摩羯座" },
  { name: "水瓶座" },
  { name: "雙魚座" },
];
const mbtiOptions = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];
const jobOptions = [
  "科技與工程",
  "教育與學術",
  "藝術與設計",
  "醫療與照護",
  "餐飲與零售",
  "商業與行政",
];
// 興趣（多選，純字串陣列）
const interestOptions = [
  "海邊",
  "旅行",
  "登山",
  "籃球",
  "排球",
  "網球",
  "睡覺",
  "追劇",
  "閱讀",
];

// 暫存資料表單 (不會存後端)
// 初始值 為空或預設的暫存資料 淺拷貝巢狀物件問題
const showFormData = ref({ ...userProfileStore.userProfile });

// 還原、反悔成最後的儲存狀態
const resetFormData = () => {
  showFormData.value = { ...userProfileStore.userProfile };
};

// 載入初始資料、更新後的正式資料，更新完再同步回暫存資料
onMounted(async () => {
  await userProfileStore.getProfile();
  resetFormData();
});

const updateHandler = async () => {
  try {
    let updatedUser;

    // 沒有id就是第一次建立用post，送出暫存資料更新正式資料
    if (!userProfileStore.userProfile.userId) {
      updatedUser = await userProfileStore.createProfile(showFormData.value);
    } else {
      updatedUser = await userProfileStore.updateProfile(showFormData.value);
    }
    // 更新資料後 需要把後端儲存成功的資料重新設回表單
    // 拿的是普通物件，不是 ref .value 是 undefined
    // await userProfileStore.getProfile(); 這行可能導致舊資料重新覆蓋
    // resetFormData();
    // 用最新資料更新畫面表單

    console.log("updatedUser:", updatedUser); //  確認這邊不是 undefined
    showFormData.value = { ...updatedUser };
    alert("編輯成功");
  } catch (error) {
    console.error("updateHandler 發生錯誤：", error);
    alert(userProfileStore.error || "更新失敗");
  }
};

// 控制展開收合
const activeIndex = ref(null);
const foldToggle = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

// 照片區
const profilePhotosRef = ref(null);
const handleUpload = async () => {
  try {
    // const uploadedPhotos = await profilePhotosRef.value?.uploadAll();
    // 上傳成功的資料更新進表單或送後端
    profilePhotosRef.value?.uploadAll();
    console.log(" 圖片上傳完成，更新進表單");
  } catch (err) {
    console.error("❌ 上傳失敗", err);
    alert("圖片上傳失敗，請稍後再試");
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-darkblue">
    <div class="w-full p-12 m-4 bg-white shadow-xl rounded-2xl">
      <!-- 分頁按鈕（卡片左上角） -->
      <div class="flex gap-2 mb-4">
        <button
          :class="
            tab === 'INTRO'
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-gray-500'
          "
          class="px-4 py-1 font-semibold rounded-md"
          @click="tab = 'INTRO'"
        >
          INTRO
        </button>
        <button
          :class="
            tab === 'PHOTO'
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-gray-500'
          "
          class="px-4 py-1 font-semibold rounded-md"
          @click="tab = 'PHOTO'"
        >
          PHOTO
        </button>
      </div>
      <div v-if="tab === 'INTRO'">
        <!-- 個人資料表單 -->
        <ProfileForm v-model="showFormData" />
        <!-- 星座 / MBTI / 工作選單 / 興趣 -->
        <div class="mb-6 space-y-3">
          <div
            v-for="(item, index) in cards"
            :key="index"
            class="border shadow-sm rounded-xl"
          >
            <!--  折疊卡標題  -->
            <button
              class="flex justify-between items-center w-full p-4 text-left text-[#1c3b5a] font-semibold"
              @click="foldToggle(index)"
            >
              <span>{{ item.title }}</span>
              <i
                class="transition-transform duration-300 transform fas fa-chevron-right"
                :class="{ 'rotate-90': activeIndex === index }"
              ></i>
            </button>

            <!-- 切換展開的區塊 -->
            <!-- 根據 index 顯示 MultiSelect -->
            <div
              class="px-4 overflow-hidden transition-[max-height,padding] duration-700 ease-in-out text-sm text-gray-600"
              :class="activeIndex === index ? 'max-h-64 py-3' : 'max-h-0 py-0'"
            >
              <div class="w-full overflow-y-auto max-h-60">
                <MultiSelect
                  v-if="index === 0"
                  v-model="showFormData.zodiac"
                  :options="zodiacOptions"
                  labelKey="name"
                  valueKey="name"
                  :multiple="false"
                  :cols="3"
                />
                <MultiSelect
                  v-if="index === 1"
                  v-model="showFormData.mbti"
                  :options="mbtiOptions"
                  :multiple="false"
                  :cols="3"
                />
                <MultiSelect
                  v-if="index === 2"
                  v-model="showFormData.job"
                  :options="jobOptions"
                  :multiple="false"
                  :cols="5"
                />
                <MultiSelect
                  v-if="index === 3"
                  v-model="showFormData.interests"
                  :options="interestOptions"
                  :multiple="true"
                  :cols="3"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- 表單按鈕們 -->
        <div class="flex justify-end gap-4 mt-6">
          <button
            @click="resetFormData"
            class="w-full text-[#5b86b0] border-2 border-[#5b86b0] bg-white hover:bg-[#5b86b0] hover:text-white font-semibold py-2 rounded-lg transition"
          >
            還原編輯
          </button>
          <!-- 檔案更新按 -->
          <button
            @click="updateHandler"
            :disabled="userProfileStore.loading"
            class="w-full bg-[#789fc6] hover:bg-[#5b86b0] text-white font-semibold py-2 rounded-lg transition"
          >
            <span v-if="userProfileStore.loading">儲存中...</span>
            <span v-else>儲存變更</span>
          </button>
        </div>
      </div>

      <!-- PHOTO 頁面內容 -->
      <div v-else-if="tab === 'PHOTO'" class="flex flex-col">
        <ProfilePhotos ref="profilePhotosRef" />
        <button
          @click="handleUpload"
          class="px-4 py-1 my-4 font-bold text-gray-500 bg-gray-100 rounded hover:bg-secondary hover:text-white"
        >
          完成
        </button>
      </div>
    </div>
  </div>
</template>
