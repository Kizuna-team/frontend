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
    class="w-full px-6 py-8 bg-[#f5f5f5] backdrop-blur-2xl rounded-md shadow-inner shadow-gray-400/30"
  >
    <div
      class="relative max-w-2xl p-10 mx-auto shadow-xl rounded-2xl bg-white/80 ring-1 ring-white/30 backdrop-blur-md"
    >
      <!--  關閉 -->
      <button
        class="absolute text-2xl text-gray-500 top-4 right-6 hover:text-gray-700"
        title="關閉"
        @click="onCancelClick"
      >
        ×
      </button>

      <!-- 上半部：拍立得 -->
      <div class="flex justify-center gap-10 pb-6 border-b border-white/50">
        <!-- 左 -->
        <div
          class="flex flex-col items-center px-3 pt-3 pb-4 transition bg-white shadow-md rounded-xl w-60 hover:shadow-lg"
        >
          <div class="w-full overflow-hidden bg-gray-100 rounded-md h-44">
            <img
              class="object-contain object-center w-full h-full"
              :src="props.myProfile.avatarUrl"
              alt="My Avatar"
            />
          </div>
          <span class="mt-4 text-lg font-bold text-darkblue">{{
            props.myProfile?.name
          }}</span>
        </div>

        <!-- 右 -->
        <div
          class="flex flex-col items-center px-3 pt-3 pb-4 transition bg-white shadow-md rounded-xl w-60 hover:shadow-lg"
        >
          <div class="w-full overflow-hidden bg-gray-100 rounded-md h-44">
            <img
              class="object-contain object-center w-full h-full"
              :src="props.targetProfile.avatarUrl"
              alt="Target Avatar"
            />
          </div>
          <span class="mt-4 text-lg font-bold text-darkblue">{{
            props.targetProfile?.name
          }}</span>
        </div>
      </div>

      <!-- 烙印風格：配對成功 + 輸入區，填滿父元素寬度 -->
      <div class="mt-6">
        <div
          class="w-full px-6 py-5 shadow-inner bg-gray-100/80 rounded-xl backdrop-blur-sm"
        >
          <h3 class="mb-4 text-2xl font-bold text-center text-darkblue">
            配對成功！開始聊天吧
          </h3>

          <!-- 輸入框 -->
          <div
            class="flex items-center justify-between px-4 py-3 border rounded-full shadow-sm bg-white/70 border-white/30 backdrop-blur"
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
</template>
