<script setup>
import { ref } from "vue";
// import { useRouter } from "vue-router";
import MatchSetupCard from "@/components/MatchSetupCard.vue";
// import axios from "@/api/axios";

// const router = useRouter();
// const userId = localStorage.getItem("userId");

const steps = [
  {
    title: "挑幾個你感興趣的選項",
    key: "interests",
    options: [
      "音樂",
      "藝術與手作",
      "旅遊",
      "美食",
      "運動與健身",
      "閱讀",
      "遊戲",
      "寵物與動物",
      "攝影",
      "電影與影集",
    ],
    multiple: true,
  },
  {
    title: "你的音樂靈魂是什麼？",
    key: "musicMatch",
    options: ["流行音樂", "搖滾", "爵士", "古典音樂", "K-pop", "嘻哈", "R&B"],
    multiple: false,
  },
  {
    title: "你是派對動物還是獨處高手？",
    key: "introvertOrExtrovert",
    options: ["內向", "外向"],
    multiple: false,
  },
  {
    title: "你心中的萌寵是？",
    key: "pet",
    options: ["貓", "狗", "爬蟲類", "鳥類", "兔子"],
    multiple: false,
  },
  {
    title: "你是早鳥還是夜貓子？",
    key: "wakeUpTime",
    options: ["早睡早起", "夜貓子"],
    multiple: false,
  },
];

const step = ref(0);
const form = ref({
  interests: [],
  musicMatch: "",
  introvertOrExtrovert: "",
  pet: "",
  wakeUpTime: "",
});

const nextStep = () => {
  if (step.value < steps.length - 1) step.value++;
  // else handleSubmit();
};

// const handleSubmit = async () => {
//   try {
//     await axios.post("/api/user-interests", {
//       userId,
//       interestIds: form.value.interests,
//     });
//     await axios.post("/api/user-preferences", {
//       userId,
//       musicMatch: form.value.musicMatch,
//       introvertOrExtrovert: form.value.introvertOrExtrovert,
//       pet: form.value.pet,
//       wakeUpTime: form.value.wakeUpTime,
//       ageMin: 20,
//       ageMax: 40,
//     });
//     alert("設定完成，進入配對池！");
//     router.push("/matching-pool");
//   } catch (err) {
//     alert("儲存失敗！");
//     console.error(err);
//   }
// };
</script>

<template>
  <div
    class="relative min-h-[500px] w-full flex flex-col items-center justify-center"
  >
    <TransitionGroup
      name="slide-fade"
      tag="div"
      class="relative h-[400px] w-full flex justify-center items-center"
    >
      <MatchSetupCard
        v-if="steps[step]"
        :key="step"
        v-model="form[steps[step].key]"
        :title="steps[step].title"
        :options="steps[step].options"
        :multiple="steps[step].multiple"
      />
    </TransitionGroup>

    <button
      class="mt-6 px-8 py-3 rounded-full font-bold tracking-wide text-[#a5c1e7] border-[3px] border-[#a5c1e7] bg-white transition-all duration-500 ease-in-out hover:text-white hover:bg-gradient-to-r hover:from-[#a5c1e7] hover:to-[#dd99c1] hover:border-transparent hover:shadow-lg hover:scale-[1.04]"
      @click="nextStep"
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
</style>
