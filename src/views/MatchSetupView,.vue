<script setup>
import { ref } from "vue";
import QuestionCard from "@/components/QuestionCard.vue";
import axios from "@/api/axios";
import { useRouter } from "vue-router";

const router = useRouter();
const userId = localStorage.getItem("userId");

// 所有題目
const steps = [
  {
    title: "選擇你的興趣（2～5 項）",
    key: "interests",
    options: [
      "音樂",
      "電影與影集",
      "旅遊",
      "美食",
      "運動與健身",
      "閱讀",
      "遊戲",
      "攝影",
      "藝術與手作",
      "寵物與動物",
    ],
    multiple: true,
  },
  {
    title: "喜歡的音樂風格？",
    key: "musicMatch",
    options: ["流行音樂", "搖滾", "爵士", "古典音樂", "K-pop", "嘻哈", "R&B"],
    multiple: false,
  },
  {
    title: "你是內向還是外向？",
    key: "introvertOrExtrovert",
    options: ["內向", "外向"],
    multiple: false,
  },
  {
    title: "喜歡的寵物？",
    key: "pet",
    options: ["貓", "狗", "爬蟲類", "鳥類", "兔子"],
    multiple: false,
  },
  {
    title: "生活作息？",
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
  if (step.value === 0) {
    const len = form.value.interests.length;
    if (len < 2 || len > 5) return alert("請選擇 2～5 個興趣");
  }
  if (step.value < steps.length - 1) step.value++;
  else handleSubmit();
};

const handleSubmit = async () => {
  try {
    await axios.post("/api/user-interests", {
      userId,
      interestIds: form.value.interests,
    });
    await axios.post("/api/user-preferences", {
      userId,
      musicMatch: form.value.musicMatch,
      introvertOrExtrovert: form.value.introvertOrExtrovert,
      pet: form.value.pet,
      wakeUpTime: form.value.wakeUpTime,
      ageMin: 20,
      ageMax: 40,
    });
    alert("設定完成，進入配對池！");
    router.push("/matching-pool");
  } catch (err) {
    alert("儲存失敗！");
    console.error(err);
  }
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-100 to-white"
  >
    <QuestionCard v-bind="steps[step]" v-model="form[steps[step].key]" />
    <button
      class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full"
      @click="nextStep"
    >
      {{ step < steps.length - 1 ? "下一題 ➡" : "完成並配對" }}
    </button>
  </div>
</template>
