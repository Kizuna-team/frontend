<script setup>
import { notify } from "@/utils/notify";
import { ref, onMounted } from "vue";
import { useUserProfileStore } from "@/stores/userProfile";

import { useRouter } from "vue-router";
const router = useRouter();

import ProfileForm from "@/components/ProfileForm.vue";
import MultiSelect from "@/components/MultiSelect.vue";
import ProfilePhotos from "@/components/ProfilePhotos.vue";

const tab = ref("INTRO");
const userProfileStore = useUserProfileStore();

const cards = [{ title: "星座" }, { title: "MBTI" }, { title: "專業領域" }];

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
  "媒體與傳播",
  "觀光與休閒",
  "金融與保險",
];

const showFormData = ref({ ...userProfileStore.userProfile });

const resetFormData = () => {
  showFormData.value = { ...userProfileStore.userProfile };
};

onMounted(async () => {
  await userProfileStore.getProfile();
  resetFormData();
});

const updateHandler = async () => {
  try {
    let updatedUser;

    // 沒有 name 就是第一次建立用post
    if (!userProfileStore.userProfile.name) {
      updatedUser = await userProfileStore.createProfile(showFormData.value);
    } else {
      updatedUser = await userProfileStore.updateProfile(showFormData.value);
    }

    // 拿的是普通物件，不是 ref .value 是 undefined
    // await userProfileStore.getProfile(); 這行可能導致舊資料重新覆蓋

    console.log("updatedUser:", updatedUser); //  確認這邊不是 undefined

    if (updatedUser) {
      showFormData.value = { ...updatedUser };
      notify.gradient("編輯成功！");
    } else {
      notify.warn("建立失敗！欄位請勿為空");
    }
  } catch (error) {
    console.error("updateHandler 發生錯誤：", error);
    const errs = userProfileStore.error;

    if (Array.isArray(errs)) {
      errs.forEach((msg) => notify.warn(msg));
    } else if (typeof errs === "string") {
      notify.warn(errs);
    } else {
      notify.warn("發生錯誤：回傳非預期格式");
    }
  }
};

const activeIndex = ref(null);
const foldToggle = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

const profilePhotosRef = ref(null);
const handleUpload = async () => {
  try {
    const hasPhoto = profilePhotosRef.value?.hasUploadedPhoto();

    if (!hasPhoto) {
      notify.warn("至少上傳一張生活照");
      return;
    }
    // 等待圖片全部上傳
    await profilePhotosRef.value?.uploadAll();

    notify.kiwi("照片已全部上傳完成！前往引導頁面");

    // 明確控制跳轉頁面的時機
    await new Promise((resolve) => setTimeout(resolve, 1300));

    router.push("/onboarding");
  } catch (err) {
    notify.warn("圖片上傳失敗");
    console.error(" 上傳失敗", err);
  }
};
</script>

<template>
  <div
    class="min-h-screen p-6 overflow-x-hidden bg-gradient-to-b from-[#8ecae6]/10 to-white"
  >
    <div class="max-w-3xl p-8 mx-auto bg-white shadow-xl rounded-3xl">
      <div class="mb-8 text-center">
        <img src="/logo.png" alt="Logo" class="w-16 h-16 mx-auto mb-2" />
        <h2 class="text-2xl font-bold text-[#1c3b5a]">編輯個人資料</h2>
        <p class="text-sm text-gray-500">讓大家更認識你</p>
      </div>

      <div class="flex justify-center gap-2 mb-6">
        <button
          :class="
            tab === 'INTRO'
              ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-md'
              : 'bg-gray-100 text-gray-500'
          "
          class="px-4 py-2 font-semibold rounded-full"
          @click="tab = 'INTRO'"
        >
          INTRO
        </button>
        <button
          :class="
            tab === 'PHOTO'
              ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-md'
              : 'bg-gray-100 text-gray-500'
          "
          class="px-4 py-2 font-semibold rounded-full"
          @click="tab = 'PHOTO'"
        >
          PHOTO
        </button>
      </div>

      <div v-if="tab === 'INTRO'">
        <ProfileForm v-model="showFormData" />

        <div class="mt-6 space-y-3">
          <div
            v-for="(item, index) in cards"
            :key="index"
            class="overflow-hidden border shadow-sm border-primary/20 rounded-xl"
          >
            <button
              class="flex justify-between items-center w-full p-4 text-[#1c3b5a] font-semibold"
              @click="foldToggle(index)"
            >
              <span>{{ item.title }}</span>
              <i
                class="transition-transform duration-300 transform fas fa-chevron-right"
                :class="{ 'rotate-90': activeIndex === index }"
              ></i>
            </button>

            <div
              class="px-4 overflow-hidden text-sm text-gray-600 transition-[max-height,padding] duration-700 ease-in-out"
              :class="activeIndex === index ? 'max-h-64 py-3' : 'max-h-0 py-0'"
            >
              <div class="overflow-y-auto max-h-60">
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
                  :cols="3"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4 mt-8 sm:flex-row">
          <button
            @click="resetFormData"
            class="flex-1 py-3 font-semibold transition border-2 rounded-full border-darkblue text-darkblue hover:bg-darkblue hover:text-white"
          >
            還原編輯
          </button>
          <button
            @click="updateHandler"
            :disabled="userProfileStore.loading"
            class="flex-1 order-1 w-full py-3 font-medium font-semibold text-white transition-all transition duration-300 transform rounded-full shadow-md bg-gradient-to-r from-accent to-pink-400 hover:from-accent hover:to-pink-700 hover:scale-105 hover:shadow-lg sm:w-auto sm:order-2"
          >
            <span v-if="userProfileStore.loading">儲存中...</span>
            <span v-else>儲存變更</span>
          </button>
        </div>
      </div>

      <div v-else-if="tab === 'PHOTO'" class="flex flex-col gap-4">
        <ProfilePhotos ref="profilePhotosRef" />
        <button
          @click="handleUpload"
          class="flex-1 order-1 w-full py-3 font-medium font-semibold text-white transition-all transition duration-300 transform rounded-full shadow-md bg-gradient-to-r from-accent to-pink-400 hover:from-accent hover:to-pink-700 hover:scale-105 hover:shadow-lg sm:w-auto sm:order-2"
        >
          完成
        </button>
      </div>
    </div>
  </div>
</template>
