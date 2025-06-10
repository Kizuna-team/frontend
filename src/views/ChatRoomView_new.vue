<template>
  <div class="bg-gray-100 h-screen overflow-hidden flex">
    <!-- 左側邊欄 -->
    <div class="w-80 bg-white border-r border-gray-200 flex flex-col">
      <!-- 標題 -->
      <div class="p-4 border-b border-gray-200">
        <h1 class="text-xl font-semibold text-gray-800">聊天室</h1>
      </div>

      <!-- 聊天室列表 -->
      <div class="flex-1 overflow-y-auto">
        <div
          v-for="room in chatRooms"
          :key="room.id"
          @click="currentRoom = room.id"
          :class="[
            'p-4 cursor-pointer border-b border-gray-100',
            room.id === currentRoom
              ? 'bg-[#f6ba42] text-white'
              : 'hover:bg-gray-50',
          ]"
        >
          <div class="font-medium">{{ room.name }}</div>
          <div
            :class="[
              'text-sm',
              room.id === currentRoom ? 'opacity-90' : 'text-gray-500',
            ]"
          >
            {{ room.day }}
          </div>
          <div
            :class="[
              'text-xs mt-1',
              room.id === currentRoom ? 'opacity-75' : 'text-gray-400',
            ]"
          >
            {{ room.lastMessage }}
          </div>
        </div>
      </div>
    </div>

    <!-- 右側主要聊天區域 -->
    <div class="flex-1 flex flex-col">
      <!-- 聊天室標題欄 -->
      <div
        class="bg-white border-b border-gray-200 p-4 flex items-center justify-between"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center"
          >
            <span class="text-sm font-medium text-gray-700">{{
              currentRoom
            }}</span>
          </div>
          <div>
            <div class="font-medium text-gray-800">{{ currentRoom }}</div>
          </div>
        </div>
      </div>

      <!-- 聊天訊息區域 -->
      <!-- 聊天背景顏色 -->
      <div
        class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        ref="messagesContainer"
      >
        <!-- 判斷左右訊息框 -->
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['flex', msg.isSelf ? 'justify-end' : 'justify-start']"
        >
        <!-- 訊息框顏色 -->
          <div
            :class="[
              'rounded-2xl px-4 py-2 max-w-xs lg:max-w-md',
              msg.isSelf
                ? 'bg-white text-gray-800 shadow-sm '
                : 'bg-[#f6ba42] text-white shadow-sm',
            ]"
          >
            <!-- 訊息內容 -->
            <p class="break-words">{{ msg.text }}</p>

            <!-- 時間 -->
            <div
              :class="[
                'text-xs mt-1',
                msg.isSelf ? 'text-gray-800 text-right' : 'text-white',
              ]"
            >
              {{ msg.time }}
            </div>
          </div>
        </div>
      </div>

      <!-- 輸入區域 -->
      <div class="bg-white border-t border-gray-200 p-4">
        <div class="flex items-end space-x-3">
          <!-- 左側工具按鈕 -->
          <button class="text-gray-400 hover:text-gray-600 mb-2">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>

          <!-- 輸入框 -->
          <div class="flex-1">
            <input
              type="text"
              placeholder="輸入訊息"
              v-model="newMessage"
              @keyup.enter="sendMessage"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f6ba42] focus:border-transparent outline-none"
            />
          </div>

          <!-- 發送按鈕 -->
          <button
            @click="sendMessage"
            class="bg-[#f6ba42] hover:bg-[#ed8b34] text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            送出
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";

// 響應式數據
const currentRoom = ref("007");
const newMessage = ref("");
const messagesContainer = ref(null);

// 聊天室列表
const chatRooms = reactive([
  { id: "007", name: "007", day: "Wed", lastMessage: "message" },
  { id: "008", name: "008", day: "Thu", lastMessage: "last message..." },
  { id: "009", name: "009", day: "Fri", lastMessage: "last message..." },
]);

// 訊息列表
const messages = reactive([
  { id: 1, text: "HI", time: "下午07:01", isSelf: false },
  {
    id: 2,
    text: "HI",
    time: "下午07:01",
    isSelf: true,
  },
]);

// 發送訊息
const sendMessage = async () => {
  if (newMessage.value.trim()) {
    const currentTime = new Date().toLocaleTimeString("zh-TW", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });

    messages.push({
      id: Date.now(),
      text: newMessage.value,
      time: currentTime,
      isSelf: true,
    });

    newMessage.value = "";

    // 滾動到底部
    await nextTick();
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  }
};

// 格式化時間
const formatTime = (date) => {
  return date.toLocaleTimeString("zh-TW", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
/* 自定義滾動條樣式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
