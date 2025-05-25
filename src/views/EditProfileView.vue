<!-- <script setup>
import { ref, onMounted } from "vue";
import { fetchProfile } from "@/api/editProfile.js";
const profile = ref(null);
const loading = ref(false);
const error = ref(null);

const loadProfile = async () => {
  loading.value = true;
  error.value = null;
  try {
    profile.value = await fetchProfile();
  } catch (err) {
    error.value = "載入資料失敗";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProfile();
});
</script>

<template>
  <div>
    <div v-if="loading">載入中...</div>
    <div v-if="error" style="color: red">{{ error }}</div>
    <div v-if="profile">
      <p>姓名：{{ profile.user.name }}</p>
      <p>年紀：{{ profile.user.age }}</p>
      <p>自介：{{ profile.user.bio }}</p>
      <!-- 其他個人資料欄位 -->
<!-- </div>
  </div>
</template> -->
<script setup>
import { ref, reactive, onMounted } from "vue";
import { useUserProfileStore } from "@/stores/userProfile";
import { fetchProfile, updateProfile } from "@/api/editProfile.js";

import ProfileForm from "../components/ProfileForm.vue";
import MultiSelect from "../components/MultiSelect.vue";
import ProfilePhotos from "../components/ProfilePhotos.vue";

const tab = ref("intro");
const { userProfile, setProfile, getProfile } = useUserProfileStore();
// 完整表單資料物件
const formData = reactive({
  name: "",
  gender: "",
  bio: "",
  orientation: "",
  age: null,
  location: "",
  zodiac: "",
  mbti: "",
  job: "",
  interest: [],
});

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

// 載入資料相關狀態（錯誤、讀取）
// 初始化為正在讀取中並且清除前次錯誤狀態
const error = ref(null);
const loading = ref(false);

const loadProfile = async () => {
  loading.value = true;
  error.value = null;
  try {
    const result = await fetchProfile();

    //  這會把沒回傳的欄位覆蓋掉
    // Object.assign(formData, result.user); // user 是資料庫回傳的資料結構

    // 更安全地更新表單資料
    const keys = Object.keys(formData);
    keys.forEach((key) => {
      if (result.user.hasOwnProperty(key)) {
        formData[key] = result.user[key];
      }
    });

    // 同步更新存入 Pinia 的 userProfile
    setProfile(result.user);
  } catch (err) {
    error.value = "載入資料失敗";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// 載入畫面初始資料，初始表單要有「現有資料」才能顯示
onMounted(() => {
  loadProfile();
});

// 送出時模擬等待，再更新全局狀態
const updateHandler = async () => {
  loading.value = true;
  try {
    // 送出資料到後端 呼叫API
    const result = await updateProfile(formData);
    // 用後端回傳的最新資料覆蓋 Pinia 狀態
    setProfile(result.user);
    // await getProfile(); //重新載入最新資料、同步
    alert("更新成功！");
  } catch (error) {
    alert("更新失敗");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 控制展開收合
const activeIndex = ref(null);
const foldToggle = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

// 表單用 v-model 綁定 formData.key
// 送出按鈕 @click="handleSubmit"
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#d1e3f5]">
    <div class="bg-white p-12 rounded-2xl shadow-xl w-full m-4 min-h-[1100px]">
      <!-- 分頁按鈕（卡片左上角） -->
      <div class="flex gap-2 mb-4">
        <button
          :class="
            tab === 'intro'
              ? 'bg-[#5b86b0] text-white'
              : 'bg-gray-100 text-gray-500'
          "
          class="px-4 py-1 rounded-md font-semibold"
          @click="tab = 'intro'"
        >
          INTRO
        </button>
        <button
          :class="
            tab === 'photo'
              ? 'bg-[#5b86b0] text-white'
              : 'bg-gray-100 text-gray-500'
          "
          class="px-4 py-1 rounded-md font-semibold"
          @click="tab = 'photo'"
        >
          Photo
        </button>
      </div>
      <div v-if="tab === 'intro'">
        <!-- 個人資料表單 -->
        <ProfileForm :formData="formData" />
        <!-- 星座 / MBTI / 工作選單 / 興趣 -->
        <div class="space-y-3 mb-6">
          <div
            v-for="(item, index) in cards"
            :key="index"
            class="border rounded-xl shadow-sm"
          >
            <!--  折疊卡標題  -->
            <button
              class="flex justify-between items-center w-full p-4 text-left text-[#1c3b5a] font-semibold"
              @click="foldToggle(index)"
            >
              <span>{{ item.title }}</span>
              <i
                class="fas fa-chevron-right transform transition-transform duration-300"
                :class="{ 'rotate-90': activeIndex === index }"
              ></i>
            </button>

            <!-- 折疊內容（動畫 + 不撐開） -->
            <!-- 根據 index 顯示不同 MultiSelect -->
            <div
              class="px-4 overflow-hidden transition-[max-height,padding] duration-700 ease-in-out text-sm text-gray-600"
              :class="activeIndex === index ? 'max-h-64 py-3' : 'max-h-0 py-0'"
            >
              <div class="overflow-y-auto max-h-60 w-full">
                <MultiSelect
                  v-if="index === 0"
                  v-model="formData.zodiac"
                  :options="zodiacOptions"
                  labelKey="name"
                  valueKey="name"
                  :multiple="false"
                  :cols="4"
                />
                <MultiSelect
                  v-if="index === 1"
                  v-model="formData.mbti"
                  :options="mbtiOptions"
                  :multiple="false"
                  :cols="4"
                />
                <MultiSelect
                  v-if="index === 2"
                  v-model="formData.job"
                  :options="jobOptions"
                  labelKey="jobName"
                  valueKey="jobId"
                  :multiple="false"
                  :cols="2"
                />
                <MultiSelect
                  v-if="index === 3"
                  v-model="formData.interest"
                  :options="interestOptions"
                  :multiple="true"
                  :cols="3"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 編輯檔案更新按鈕 -->
        <button
          @click="updateHandler"
          :disabled="loading"
          class="w-full bg-[#789fc6] hover:bg-[#5b86b0] text-white font-semibold py-2 rounded-lg transition"
        >
          <span v-if="loading">檔案更新中...</span>
          <span v-else>儲存變更</span>
        </button>
      </div>
      <!-- PHOTO 頁面內容 -->
      <div v-else-if="tab === 'photo'">
        <ProfilePhotos />
      </div>
    </div>
  </div>
</template>
