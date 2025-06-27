<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MatchSetupCard from "@/components/MatchSetupCard.vue";
import axios from "@/api/axios";

const router = useRouter();
// const userId = localStorage.getItem("userId");

//  統一物件陣列
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
  ageRange: [18, 35], // 年齡區間 [最小, 最大]
});

const nextStep = () => {
  if (step.value < steps.length - 1) step.value++;
  else submitHandler();
};

const submitHandler = async () => {
  try {
    console.log("📝 送出前 form 資料：", form);

    const [ageMin, ageMax] = form.value.ageRange.sort((a, b) => a - b);

    await axios.post("/user-filter/interests", {
      interestIds: form.value.interests,
    });

    await axios.post("/user-filter/preference", {
      musicMatch: form.value.musicMatch,
      introvertOrExtrovert: form.value.introvertOrExtrovert,
      pet: form.value.pet,
      wakeUpTime: form.value.wakeUpTime,
      ageMin,
      ageMax,
    });
    console.log("🐛 各欄位值：", {
      interests: form.value.interests,
      musicMatch: form.value.musicMatch,
      introvertOrExtrovert: form.value.introvertOrExtrovert,
      pet: form.value.pet,
      wakeUpTime: form.value.wakeUpTime,
      ageRange: form.value.ageRange,
    });
    alert("設定完成，開始配對");
    router.push("/match");
  } catch (err) {
    alert("儲存失敗！");
    console.error(err);
  }
};
</script>

<template>
  <div
    class="relative flex flex-col items-center justify-center w-full min-h-screen px-4 py-4 md:px-6 lg:px-8"
  >
    <TransitionGroup
      name="slide-fade"
      tag="div"
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

    <button
      class="px-6 py-3 md:px-8 md:py-3 rounded-full font-bold tracking-wide text-[#a5c1e7] border-[3px] border-[#a5c1e7] bg-white transition-all duration-500 ease-in-out hover:text-white hover:bg-gradient-to-r hover:from-[#a5c1e7] hover:to-[#dd99c1] hover:border-transparent hover:shadow-lg hover:scale-[1.04] text-sm md:text-base"
      @click="step < steps.length - 1 ? nextStep() : submitHandler()"
    >
      {{ step < steps.length - 1 ? "下一題 ➡" : "完成並配對" }}
    </button>
  </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-100%) rotate(-8deg) scale(0.9);
}

/* 手機觸控優化 */
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
