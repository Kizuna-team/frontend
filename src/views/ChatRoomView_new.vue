<script setup>
import {
  ref,
  reactive,
  nextTick,
  onMounted,
  onBeforeUnmount,
  watch,
  computed,
} from "vue";
import { io } from "socket.io-client";
import { useUserStore } from "@/stores/user.js";
import { userChatStore } from "@/stores/chat_new.js";
import { useRoute } from 'vue-router';

const route = useRoute();

// Socket.io 連接設定
const socket = io("http://localhost:3000");

// 響應式數據
const currentRoom = ref("007");
const newMessage = ref("");
const messagesContainer = ref(null);

// Store
const userStore = useUserStore();
const chatStore = userChatStore();
const roomId = ref(1);

// 當前使用者資訊
const currentUser = computed(() => ({
  id: userStore.userId,
  name: userStore.username,
  displayName: userStore.username || `User${userStore.userId}`,
  profile: userStore.profile,
}));
const isUserLoggedIn = computed(
  () => !!(userStore.accessToken && userStore.userId)
);

// 聊天室列表
const chatRooms = reactive([
  { id: 7, userName: "Alice Chen", day: "Wed", lastMessage: "message" },
  { id: 8, userName: "Bob Wang", day: "Thu", lastMessage: "last message.." },
  { id: 9, userName: "Charlie Li", day: "Fri", lastMessage: "last message.." },
]);

// 訊息接收處理
function handleIncomingMessage(msg) {
  console.log("=== 收到訊息 ===");
  console.log("原始訊息:", msg);

  // 格式化訊息
  const formattedMessage = {
    id: msg.id || Date.now(),
    content: msg.content || msg.text,
    senderId: msg.senderId,
    senderName: msg.senderName || msg.username || `User${msg.senderId}`,
    timestamp: msg.timestamp || new Date().toISOString(),
    time: msg.time || formatTime(new Date(msg.timestamp || Date.now())),
    roomId: msg.roomId || roomId.value,
  };

  console.log("格式化後的訊息:", formattedMessage);
  console.log("準備加入到 chatStore...");

  // 加入到 chatStore
  chatStore.addMessage(formattedMessage);

  console.log("加入後的所有訊息數量:", chatStore.messages.length);
  console.log("chatStore.messages:", chatStore.messages);
  console.log("=================");

  // 自動滾動到底部
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

// 加入房間 & 綁定監聽器
onMounted(() => {
  console.log("組件已掛載");
  console.log("當前使用者狀態:", {
    userId: userStore.userId,
    username: userStore.username,
    isLoggedIn: isUserLoggedIn.value,
  });

  // 設置當前房間到 chatStore
  chatStore.setCurrentRoom(roomId.value);

  // 確保使用者已登入才連接
  if (userStore.userId) {
    connectToRoom();
  } else {
    console.log("使用者未登入，等待登入後連接");
  }
});

// 連接到聊天室
const connectToRoom = () => {
  console.log("嘗試連接到房間:", roomId.value);
  console.log("使用者資訊:", {
    userId: userStore.userId,
    username: userStore.username,
  });

  const joinData = {
    roomId: roomId.value,
    userId: userStore.userId,
    userName: userStore.username || `User${userStore.userId}`,
  };

  console.log("加入房間資料:", joinData);
  socket.emit("joinRoom", joinData);

  console.log(
    "✅ 加入聊天室 Room",
    roomId.value,
    "使用者:",
    userStore.username || userStore.userId
  );

  // 只綁定一次監聽器
  socket.off("chatMessage", handleIncomingMessage);
  socket.on("chatMessage", handleIncomingMessage);

  // 監聽用戶加入/離開事件
  socket.on("userJoined", (data) => {
    console.log("用戶加入:", data);
    // 可以在這裡顯示用戶加入提示
  });

  socket.on("userLeft", (data) => {
    console.log("用戶離開:", data);
    // 可以在這裡顯示用戶離開提示
  });

  // 監聽連接狀態
  socket.on("connect", () => {
    console.log("✅ Socket 已連接");
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket 已斷開");
  });
};

watch(
  () => route.path,
  (newPath, oldPath) => {
    if (newPath === '/chat_new') {
      // 進入聊天頁面，禁用滾動
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else if (oldPath === '/chat_new') {
      // 離開聊天頁面，恢復滾動
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
  },
  { immediate: true }
);

// 確保組件卸載時恢復滾動
onBeforeUnmount(() => {
  // 恢復頁面滾動
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
  
  // 原有的清理邏輯
  socket.off("chatMessage", handleIncomingMessage);
  socket.off("userJoined");
  socket.off("userLeft");
  socket.emit("leaveRoom", {
    roomId: roomId.value,
    userId: userStore.userId,
  });
});
// 避免重複綁定：離開時移除 listener
onBeforeUnmount(() => {
  socket.off("chatMessage", handleIncomingMessage);
  socket.off("userJoined");
  socket.off("userLeft");
  socket.emit("leaveRoom", {
    roomId: roomId.value,
    userId: userStore.userId,
  });
});

// 發送訊息
const sendMessage = async () => {
  console.log("=== 開始發送訊息 ===");
  console.log("輸入的訊息:", newMessage.value);
  console.log("訊息是否為空:", !newMessage.value.trim());

  if (!newMessage.value.trim()) {
    console.log("❌ 訊息為空，取消發送");
    return;
  }

  // 檢查使用者是否已登入
  console.log("檢查登入狀態...");
  console.log("userStore.userId:", userStore.userId);
  console.log("userStore.username:", userStore.username);
  console.log("userStore.accessToken:", userStore.accessToken);

  if (!userStore.userId) {
    console.log("❌ 使用者未登入");
    alert("請先登入才能發送訊息");
    return;
  }

  console.log("✅ 使用者已登入，準備發送訊息");
  console.log("準備發送訊息:", newMessage.value);
  console.log("使用者資訊:", {
    userId: userStore.userId,
    username: userStore.username,
    roomId: roomId.value,
  });

  // 建立訊息物件
  const messageData = {
    roomId: roomId.value,
    senderId: userStore.userId,
    senderName: userStore.username || `User${userStore.userId}`,
    content: newMessage.value,
    timestamp: new Date().toISOString(),
  };

  // 建立本地顯示用的訊息格式
  const localMessage = {
    id: Date.now(),
    content: newMessage.value,
    senderId: userStore.userId,
    senderName: userStore.username || `User${userStore.userId}`,
    timestamp: new Date().toISOString(),
    time: formatTime(new Date()),
    roomId: roomId.value,
  };

  console.log("發送的訊息資料:", messageData);

  // 檢查 Socket 連接狀態
  console.log("Socket 連接狀態:", socket.connected);
  console.log("Socket ID:", socket.id);

  if (!socket.connected) {
    console.log("❌ Socket 未連接，嘗試重新連接...");
    socket.connect();
    // 等待連接
    await new Promise((resolve) => {
      socket.on("connect", resolve);
      setTimeout(resolve, 2000); // 2秒超時
    });
  }

  try {
    console.log("🚀 發送 Socket 訊息...");
    // 發送到 Socket.io 伺服器
    socket.emit("chatMessage", messageData);
    console.log("✅ Socket 訊息已發送");
    // 清空輸入框
    newMessage.value = "";

    console.log("💾 本地顯示訊息:", localMessage);
    console.log("chatStore:", chatStore);
    console.log("chatStore.addMessage:", chatStore.addMessage);

    if (chatStore && chatStore.addMessage) {
      chatStore.addMessage(localMessage);
      console.log("✅ 訊息已加入 chatStore");
    } else {
      console.error("❌ chatStore 或 addMessage 方法不存在");
    }

    newMessage.value = "";

    // 滾動到底部
    await nextTick();
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  } catch (error) {
    console.error("❌ 發送訊息時發生錯誤:", error);
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

// 監聽 userId 變化，當用戶登入時自動連接聊天室
watch(
  () => userStore.userId,
  (newUserId, oldUserId) => {
    console.log("userId變化:", { old: oldUserId, new: newUserId });
    if (newUserId && !oldUserId) {
      // 用戶剛登入，連接到聊天室
      connectToRoom();
    } else if (!newUserId && oldUserId) {
      // 用戶登出，斷開連接
      socket.emit("leaveRoom", {
        roomId: roomId.value,
        userId: oldUserId,
      });
      // chatStore.clearMessages(); // 清空訊息（如果有這個方法的話）
    }
  }
);

// 監聽房間變化
watch(
  () => currentRoom.value,
  (newRoom, oldRoom) => {
    if (userStore.userId && newRoom !== oldRoom) {
      // 離開舊房間
      if (oldRoom) {
        socket.emit("leaveRoom", {
          roomId: parseInt(oldRoom),
          userId: userStore.userId,
        });
      }

      // 加入新房間
      roomId.value = parseInt(newRoom);
      socket.emit("joinRoom", {
        roomId: roomId.value,
        userId: userStore.userId,
        userName: currentUser.value.name || `User${userStore.userId}`,
      });

      // 清空當前訊息
      chatStore.clearMessages?.();
      console.log("切換到房間:", newRoom);
    }
  }
);
</script>

<template>
  <div class="bg-gray-100 h-screen overflow-hidden flex chat-container">
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
            <div class="text-sm text-gray-500">
              Room ID: {{ roomId }}
              <span v-if="isUserLoggedIn" class="ml-2">
                | {{ currentUser.name || `User${userStore.userId}` }}
              </span>
              <span v-else class="ml-2 text-red-500">| 未登入</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 聊天訊息區域 -->
      <div
        class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        ref="messagesContainer"
      >
        <!-- 顯示來自 chatStore 的訊息 -->
        <div v-if="!isUserLoggedIn" class="text-center py-8">
          <div class="text-gray-500">請先登入才能使用聊天功能</div>
        </div>

        <div
          v-else-if="chatStore.messages.length === 0"
          class="text-center py-8"
        >
          <div class="text-gray-500">還沒有訊息，開始聊天吧！</div>
        </div>

        <div
          v-for="msg in chatStore.messages"
          :key="msg.id || msg.timestamp"
          :class="[
            'flex',
            msg.senderId === userStore.userId ? 'justify-end' : 'justify-start',
          ]"
        >
          <div class="flex flex-col">
            <!-- 顯示發送者名稱（如果不是自己的訊息） -->
            <div
              v-if="msg.senderId !== userStore.userId"
              class="text-xs text-gray-600 mb-1 pl-2 font-medium"
            >
              {{ msg.senderName || `User${msg.senderId}` }}
            </div>

            <div
              :class="[
                'rounded-2xl px-4 py-2 max-w-xs lg:max-w-md',
                msg.senderId === userStore.userId
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'bg-[#f6ba42] text-white shadow-sm',
              ]"
            >
              <!-- 訊息內容 -->
              <p class="break-words">{{ msg.content || msg.text }}</p>

              <!-- 時間 -->
              <div
                :class="[
                  'text-xs mt-1',
                  msg.senderId === userStore.userId
                    ? 'text-gray-500 text-right'
                    : 'text-white opacity-75',
                ]"
              >
                {{ msg.time || formatTime(new Date(msg.timestamp)) }}
              </div>
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
              :placeholder="isUserLoggedIn ? '輸入訊息' : '請先登入'"
              v-model="newMessage"
              @keyup.enter="sendMessage"
              :disabled="!isUserLoggedIn"
              :class="[
                'w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-colors',
                isUserLoggedIn
                  ? 'focus:ring-2 focus:ring-[#f6ba42] focus:border-transparent'
                  : 'bg-gray-100 cursor-not-allowed',
              ]"
            />
          </div>

          <!-- 發送按鈕 -->
          <button
            @click="sendMessage"
            :disabled="!isUserLoggedIn || !newMessage.trim()"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              isUserLoggedIn && newMessage.trim()
                ? 'bg-[#f6ba42] hover:bg-[#ed8b34] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
            ]"
          >
            送出
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  height: 100vh;
}

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
