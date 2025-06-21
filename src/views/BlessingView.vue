<template>
  <div class="flex flex-col items-center py-8">
    <h2 class="mb-6 text-2xl font-bold text-[#219ebc]">選擇一張祝福卡片</h2>
    <div class="flex gap-4 mb-8">
      <img
        v-for="(img, idx) in images"
        :key="idx"
        :src="img"
        class="object-cover w-32 h-32 border-4 rounded-lg cursor-pointer"
        :class="
          selectedIndex === idx ? 'border-[#219ebc]' : 'border-transparent'
        "
        @click="selectImage(idx)"
        alt="祝福圖片"
      />
    </div>
    <div v-if="selectedIndex !== null" class="flex flex-col items-center">
      <div class="relative w-96 h-96">
        <img
          :src="images[selectedIndex]"
          class="object-cover rounded-lg w-96 h-96"
          alt="選中的祝福圖片"
        />
        <div
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <span
            class="px-4 text-2xl text-center text-gray-400 whitespace-pre-line drop-shadow-lg"
            >{{ message }}</span
          >
        </div>
      </div>
      <textarea
        v-model="message"
        class="p-2 mt-4 text-gray-800 bg-white rounded resize-none w-80 bg-opacity-80"
        placeholder="在這裡輸入你的祝福訊息"
        rows="3"
      ></textarea>
      <div class="flex gap-6 mt-6">
        <button
          class="px-6 py-2 font-bold text-white transition bg-blue-500 rounded-full hover:bg-blue-600"
          @click="sendBlessing"
        >
          下一步
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import card1 from "@/assets/card-blue.jpg";
import card2 from "@/assets/card-green.jpg";
import card3 from "@/assets/card-pink.jpg";
import card4 from "@/assets/card-sky-blue.jpg";
import card5 from "@/assets/card-yellow.jpg";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from 'vue-toastification'
const router = useRouter();
const toast = useToast()

const images = [card1, card2, card3, card4, card5];

const selectedIndex = ref(null);
const message = ref("");

function selectImage(idx) {
  selectedIndex.value = idx;
}

function sendBlessing() {
  if (
    selectedIndex.value === null ||
    !message.value.trim()
  ) {
    toast("請選擇卡片並輸入訊息");
    return;
  }

  localStorage.setItem(
    "blessingDraft",
    JSON.stringify({
      image: images[selectedIndex.value],
      message: message.value,
      // receiverId: xxx
    })
  );
  // 跳轉到付款頁
  router.push("/blessing/pay");
}
</script>
