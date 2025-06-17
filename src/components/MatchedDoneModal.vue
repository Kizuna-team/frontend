<script setup>
import { ref } from "vue";
const inputText = ref("");

const props = defineProps({
  myProfile: Object,
  targetProfile: Object,
});

const emit = defineEmits(["cancel"]);

// 關閉彈窗
const onCancelClick = () => {
  emit("cancel");
};
</script>

<template>
  <div
    class="w-full px-6 py-8 rounded-md bg-[#f5f5f5] backdrop-blur-2xl shadow-inner shadow-gray-400/30"
  >
    <div
      class="relative max-w-2xl p-12 mx-auto shadow-2xl rounded-2xl ring-1 ring-white/30 bg-[#ffd] backdrop-blur-md"
    >
      <!--  關閉 -->
      <button
        class="absolute text-xl text-gray-500 top-4 right-6 hover:text-gray-700"
        title="關閉"
        @click="onCancelClick"
      >
        X
      </button>

      <!-- 上半部：拍立得 -->
      <div class="flex justify-center gap-10 pb-4 border-b border-white/50">
        <!-- 左 -->
        <div
          class="flex flex-col items-center px-3 pt-3 pb-4 bg-white rounded-md shadow-lg w-60"
        >
          <div class="w-full bg-gray-200 rounded-sm h-44">
            <img
              class="object-contain object-center w-full h-full"
              :src="props.myProfile.avatarUrl"
              alt="My Avatar"
            />
          </div>
          <span class="mt-4 text-xl font-bold text-darkblue">{{
            props.myProfile?.name
          }}</span>
        </div>
        <!-- 右 -->
        <div
          class="flex flex-col items-center px-3 pt-3 pb-4 bg-white rounded-md shadow-lg w-60"
        >
          <div class="w-full bg-gray-200 rounded-sm h-44">
            <img
              class="object-contain object-center w-full h-full"
              :src="props.targetProfile.avatarUrl"
              alt="Target Avatar"
            />
          </div>
          <span class="mt-4 text-xl font-bold text-darkblue">{{
            props.targetProfile?.name
          }}</span>
        </div>
      </div>

      <!-- 烙印風格：配對成功 + 輸入區，填滿父元素寬度 -->
      <div class="mt-4">
        <div
          class="w-full px-6 py-4 rounded-md shadow-inner bg-gray-200/60 backdrop-blur-sm"
        >
          <h3 class="text-2xl font-bold text-center text-darkblue">
            配對成功！
          </h3>

          <!-- 輸入框 -->
          <div class="pt-4">
            <div
              class="flex items-center justify-between px-4 py-3 border shadow-inner bg-white/50 backdrop-blur-sm border-white/40 rounded-xl"
            >
              <input
                v-model="inputText"
                class="flex-1 text-xl placeholder-gray-500 bg-transparent border-none outline-none text-darkblue placeholder-opacity-80"
                type="text"
                placeholder="Send a message"
                @keyup.enter="sendMessage"
              />
              <button
                class="ml-2 transition text-darkblue hover:text-accent"
                @click="sendMessage"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="rotate-45 w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 19l9 2-9-18-9 18 9-2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
