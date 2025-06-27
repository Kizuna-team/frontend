<script setup>
import { notify } from "@/utils/notify";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserProfileStore } from "@/stores/userProfile";
import { storeToRefs } from "pinia";

import MatchSetupCard from "@/components/MatchSetupCard.vue";
import {
  saveUserInterestsApi,
  saveUserPreferenceApi,
} from "@/api/userFilter.js";
import { fetchMatchedUsers } from "@/api/recommend.js";

const userProfileStore = useUserProfileStore();
const { userProfile } = storeToRefs(userProfileStore);
const router = useRouter();

const interestsOptions = [
  { id: 1, name: "音樂" },
  { id: 2, name: "藝術與手作" },
  { id: 3, name: "旅遊" },
  { id: 4, name: "美食" },
  { id: 5, name: "運動與健身" },
  { id: 6, name: "閱讀" },
  { id: 7, name: "遊戲" },
  { id: 8, name: "寵物與動物" },
  { id: 9, name: "攝影" },
  { id: 10, name: "電影與影集" },
];

const steps = [
  {
    title: "挑幾個你感興趣的選項",
    key: "interests",
    options: interestsOptions,
    multiple: true,
  },
  {
    title: "你的音樂靈魂是什麼？",
    key: "musicMatch",
    options: [
      { id: "pop", name: "流行音樂" },
      { id: "rock", name: "搖滾" },
      { id: "jazz", name: "爵士" },
      { id: "classical", name: "古典音樂" },
      { id: "kpop", name: "K-pop" },
      { id: "hiphop", name: "嘻哈" },
      { id: "rnb", name: "R&B" },
    ],
    multiple: false,
  },
  {
    title: "你是派對動物還是獨處高手？",
    key: "introvertOrExtrovert",
    options: [
      { id: "introvert", name: "內向" },
      { id: "extrovert", name: "外向" },
    ],
    multiple: false,
  },
  {
    title: "你心中的萌寵是？",
    key: "pet",
    options: [
      { id: "cat", name: "貓" },
      { id: "dog", name: "狗" },
      { id: "reptile", name: "爬蟲類" },
      { id: "bird", name: "鳥類" },
      { id: "rabbit", name: "兔子" },
    ],
    multiple: false,
  },
  {
    title: "你是早鳥還是夜貓子？",
    key: "wakeUpTime",
    options: [
      { id: "earlyBird", name: "早睡早起" },
      { id: "nightOwl", name: "夜貓子" },
    ],
    multiple: false,
  },
  {
    title: "你希望對方的年齡介於？",
    key: "ageRange",
    type: "range",
  },
];

const step = ref(0);
const form = ref({
  interests: [],
  musicMatch: "",
  introvertOrExtrovert: "",
  pet: "",
  wakeUpTime: "",
  ageRange: [18, 35],
});

const isSetting = ref(false);
const showRelaxedNotice = ref(false);

const nextStep = () => {
  if (
    step.value === 0 &&
    (!Array.isArray(form.value.interests) || form.value.interests.length === 0)
  ) {
    notify.warn("請挑選至少一個感興趣的選項");
    return;
  }

  if (step.value === 1 && !form.value.musicMatch) {
    notify.warn("此為必填欄位");
    return;
  }

  if (step.value === 2 && !form.value.introvertOrExtrovert) {
    notify.warn("此為必填欄位");
    return;
  }

  if (step.value === 3 && !form.value.pet) {
    notify.warn("此為必填欄位");
    return;
  }

  if (step.value === 4 && !form.value.wakeUpTime) {
    notify.warn("此為必填欄位");
    return;
  }

  if (step.value === 5) {
    const [ageMin, ageMax] = [...form.value.ageRange].sort((a, b) => a - b);

    if (ageMax - ageMin < 5) {
      notify.warn("請設定至少 5 歲的年齡區間");
      return;
    }
  }

  if (step.value < steps.length - 1) step.value++;
  else submitHandler();
};

onMounted(async () => {
  await userProfileStore.getProfile();
  console.log("使用者資料 =", userProfile.value);

  const userId = userProfile.value?.userId;
  if (!userId) {
    notify.warn("使用者尚未登入");
    return;
  }

  await fetchMatchedUsers();
});

const submitHandler = async () => {
  const [ageMin, ageMax] = [...form.value.ageRange].sort((a, b) => a - b);
  if (ageMax - ageMin < 5) {
    notify.warn("年齡區間太窄，請至少設 5 歲以上範圍");
    return;
  }

  try {
    console.log(" 送出前 form 資料：", form);
    await saveUserInterestsApi(form.value.interests);
    await saveUserPreferenceApi({
      ...form.value,
      ageMin,
      ageMax,
      gender: userProfile.value.gender,
      orientation: userProfile.value.orientation, // 預設男女都可以
    });

    // 預先確認是否有放寬條件
    const res = await fetchMatchedUsers();
    if (res.relaxed) {
      showRelaxedNotice.value = true;
    }

    isSetting.value = true;
    setTimeout(() => {
      router.push("/match/result");
      isSetting.value = false;
    }, 800);
  } catch (err) {
    notify.warn("設定失敗，無法進入配對");
    console.error(err);
  }
};
</script>

<template>
  <div
    class="relative flex flex-col items-center w-full min-h-screen px-4 py-4 md:px-6 lg:px-8"
  >
    <div
      class="relative w-full max-w-lg min-h-[420px] flex items-center justify-center"
    >
      <TransitionGroup
        name="slide-fade"
        class="relative flex items-center justify-center w-full max-w-sm mb-2 md:max-w-md lg:max-w-lg"
      >
        <MatchSetupCard
          v-if="steps[step]"
          :key="step"
          v-model="form[steps[step].key]"
          :title="steps[step].title"
          :options="steps[step].options"
          :multiple="steps[step].multiple"
          :type="steps[step].type"
        />
      </TransitionGroup>
    </div>

    <!-- Loading 彈窗 -->
    <div
      v-if="isSetting"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="flex flex-col items-center justify-center w-64 h-64 p-6 bg-white rounded-[2rem] shadow-2xl bg-gradient-to-br from-white to-gray-50 ring-1 ring-gray-300 ring-opacity-40"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-12 h-12 mb-4 text-secondary animate-spin"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>

        <p class="text-xl text-gray-600">
          {{
            showRelaxedNotice
              ? "已放寬條件，重新篩選中..."
              : "正在篩選對象中..."
          }}
        </p>
      </div>
    </div>

    <button
      class="px-6 py-3 md:px-8 md:py-3 rounded-full font-bold tracking-wide border-[3px] border-[#a5c1e7] text-[#a5c1e7] text-sm md:text-base transition-all duration-300 ease-in-out bg-white hover:text-white hover:bg-gradient-to-r hover:from-[#a5c1e7] hover:to-[#dd99c1] hover:border-transparent hover:shadow-lg hover:scale-[1.04] hover:bg-origin-border hover:bg-clip-padding"
      @click="step < steps.length - 1 ? nextStep() : submitHandler()"
    >
      {{ step < steps.length - 1 ? "下一題" : "完成並配對" }}
    </button>
  </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
  position: absolute;
  width: 100%;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-100%) rotate(-8deg) scale(0.9);
}

@media (max-width: 768px) {
  button {
    min-height: 44px;
    touch-action: manipulation;
  }
}

@media (max-width: 480px) {
  button {
    min-height: 48px;
    font-size: 14px;
  }
}
</style>
