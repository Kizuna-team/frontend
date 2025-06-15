<script setup>
import { ref } from "vue";
const inputText = ref("");

const props = defineProps({
  myName: String,
  targetName: String,
});

const emit = defineEmits(["cancel"]);

// 關閉彈窗
const onCancelClick = () => {
  emit("cancel");
};

// 是空的就不會繼續執行發送動作
// const sendMessage = () => {
//   if (inputText.value.trim() === "") return;
//   emit("send", inputText.value);
//   inputText.value = "";
// };
</script>

<template>
  <div
    class="relative max-w-2xl p-6 mx-auto shadow-2xl rounded-2xl ring-1 ring-white/30 bg-primary-200 backdrop-blur-md"
  >
    <!-- ❌ 關閉 -->
    <button
      class="absolute text-xl text-gray-500 top-2 right-2 hover:text-gray-700"
      title="關閉"
      @click="onCancelClick"
    >
      X
    </button>

    <!-- 上半部：拍立得 -->
    <div class="flex justify-center gap-10 pb-4 border-b border-white/50">
      <!-- 左 -->
      <div
        class="flex flex-col items-center px-3 pt-3 pb-4 bg-white rounded-md shadow-lg w-52"
      >
        <div class="w-full bg-gray-200 rounded-sm h-44">
          <img :src="props.myAvatar" alt="My Avatar" class="avatar" />
        </div>
        <span class="mt-3 text-lg font-bold text-darkblue">{{
          props.myName
        }}</span>
      </div>
      <!-- 右 -->
      <div
        class="flex flex-col items-center px-3 pt-3 pb-4 bg-white rounded-md shadow-lg w-52"
      >
        <div class="w-full bg-gray-200 rounded-sm h-44">
          <img class="avatar" :src="props.targetAvatar" alt="Target Avatar" />
        </div>
        <span class="mt-3 text-lg font-bold text-darkblue">{{
          props.targetName
        }}</span>
      </div>
    </div>

    <!-- 烙印風格：配對成功 + 輸入區，填滿父元素寬度 -->
    <div class="mt-4">
      <div
        class="w-full px-6 py-4 rounded-md shadow-inner bg-gray-200/60 backdrop-blur-sm"
      >
        <h3 class="text-2xl font-bold text-center text-darkblue">配對成功！</h3>

        <!-- 輸入框 -->
        <div class="pt-4">
          <div
            class="flex items-center px-4 py-3 border shadow-inner bg-white/50 backdrop-blur-sm border-white/40 rounded-xl"
          >
            <input
              v-model="inputText"
              type="text"
              placeholder="Send a message."
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
