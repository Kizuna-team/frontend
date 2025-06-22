<script setup>
import axios from "@/api/axios";
import {
  ref,
  nextTick,
  onMounted,
  onBeforeUnmount,
  watch,
  computed,
} from "vue";
import { io } from "socket.io-client";
import { useUserStore } from "@/stores/user.js";
import { userChatStore } from "@/stores/chat.js";

// Socket.io 連接設定
const socket = io(import.meta.env.VITE_API_BASE_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000,
});

// Store
const userStore = useUserStore();
const chatStore = userChatStore();
const roomId = ref("");
// 依照內容自動調整對話框高度
const textareaRef = ref(null);

const autoResize = () => {
  const element = textareaRef.value;
  if (!element) return;
  element.style.height = "auto"; // 先還原
  element.style.height = element.scrollHeight + "px"; // 根據內容撐高
};

// 聊天室列表
const chatRooms = ref([]);

// 貼圖相關
const showStickerPanel = ref(false);

// 貼圖資料 - 你可以在這裡設定自己的貼圖
const stickers = ref([
  {
    id: 1,
    name: "蛋包飯",
    url: "/stickers/01.png", // 替換成你的貼圖路徑
    emoji: "🍙",
  },
  {
    id: 2,
    name: "蛋糕",
    url: "/stickers/02.png",
    emoji: "🍰",
  },
  {
    id: 3,
    name: "布丁",
    url: "/stickers/03.png",
    emoji: "🍮",
  },
  {
    id: 4,
    name: "烏龜",
    url: "/stickers/04.png",
    emoji: "🐢",
  },
  {
    id: 5,
    name: "蝴蝶",
    url: "/stickers/05.png",
    emoji: "🦋",
  },
  {
    id: 6,
    name: "貓咪",
    url: "/stickers/06.png",
    emoji: "🐈",
  },
  {
    id: 7,
    name: "外星人1",
    url: "/stickers/07.png",
    emoji: "👽",
  },
  {
    id: 8,
    name: "外星人2",
    url: "/stickers/08.png",
    emoji: "👾",
  },
  {
    id: 9,
    name: "外星人3",
    url: "/stickers/09.png",
    emoji: "🤖",
  },
  {
    id: 10,
    name: "大便",
    url: "/stickers/10.png",
    emoji: "💩",
  },
]);

// 載入聊天室( 好友 + roomId )
const fetchChatRooms = async () => {
  try {
    const res = await axios.get("/friendLists");
    chatRooms.value = res.data.friends;
    console.log(chatRooms.value);
  } catch (error) {
    console.error("無法取得聊天室列表", error);
  }
};

// 抓目前正在聊天的人的資訊 找到那一列
// 要綁定畫面 所以用
const currentFriend = computed(() => {
  return chatRooms.value.find(
    (room) => String(room.roomId) === String(currentRoom.value)
  );
});

// 響應式數據
const currentRoom = ref("");
const newMessage = ref("");
// 用來做訊息自動滾動
const messagesContainer = ref(null);

// 當前使用者資訊
const currentUser = computed(() => ({
  id: userStore.userId,
  name: userStore.username,
  displayName: userStore.username || `User${userStore.userId}`,
}));
const isUserLoggedIn = computed(
  () => !!(userStore.accessToken && userStore.userId)
);

// 訊息接收處理
function handleIncomingMessage(msg) {
  // 格式化訊息
  const formattedMessage = {
    id: msg.id || Date.now(),
    content: msg.content || msg.text,
    senderId: msg.senderId,
    senderName:
      msg.senderName ||
      currentFriend.value?.friendName ||
      `User${msg.senderId}`,
    created_at: msg.timestamp || new Date().toISOString(),
    time: msg.time || formatTime(new Date(msg.timestamp || Date.now())),
    roomId: msg.roomId || roomId.value,
    type: msg.type || "text", // 新增訊息類型
    stickerUrl: msg.stickerUrl || null, // 新增貼圖URL
    stickerEmoji: msg.stickerEmoji || null,
  };

  // 加入到 chatStore
  chatStore.addMessage(formattedMessage);
}



// 加入房間 & 綁定監聽器
onMounted(() => {
  fetchChatRooms();
  // 綁定 socket 接收訊息
  socket.on("chatMessage", handleIncomingMessage);
  document.addEventListener("click", handleClickOutside);
  // 等好友列表載入完後，再設定房間並 join
  watch(
    chatRooms,
    () => {
      if (chatRooms.value.length > 0 && userStore.userId) {
        const defaultRoom = chatRooms.value[0].roomId;
        currentRoom.value = defaultRoom;
        chatStore.setCurrentRoom(defaultRoom);

        socket.emit("joinRoom", {
          roomId: defaultRoom,
          userId: userStore.userId,
          userName: userStore.username || `User${userStore.userId}`,
        });
      }
    },
    { immediate: true }
  );
});

// 確保組件卸載時恢復滾動
onBeforeUnmount(() => {
  // 恢復頁面滾動
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "auto";

  // 原有的清理邏輯
  socket.off("chatMessage", handleIncomingMessage);
  socket.off("userJoined");
  socket.off("userLeft");
  socket.emit("leaveRoom", {
    roomId: roomId.value,
    userId: userStore.userId,
  });
});

// 點擊外部關閉貼圖面板
const stickerPanelRef = ref(null);
const stickerButtonRef = ref(null);

const handleClickOutside = (event) => {
  if (stickerPanelRef.value && stickerButtonRef.value) {
    if (
      !stickerPanelRef.value.contains(event.target) &&
      !stickerButtonRef.value.contains(event.target)
    ) {
      showStickerPanel.value = false;
    }
  }
};

const formatTime = (date) => {
  return date.toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// 發送訊息
const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  const now = new Date();

  // 本地顯示用訊息格式（完整）
  const localMessage = {
    id: Date.now(),
    roomId: currentFriend.value.roomId,
    senderId: userStore.userId,
    senderName: userStore.username || `User${userStore.userId}`,
    content: newMessage.value,
    timestamp: now.toISOString(), // 原始 ISO
    time: formatTime(now), // 格式化成 "下午 xx:xx"
  };

  console.log(localMessage);

  // !!透過 socket 廣播出去（後端會寫入資料庫)，再廣播給所有人!!
  socket.emit("chatMessage", {
    roomId: localMessage.roomId,
    senderId: localMessage.senderId,
    senderName: localMessage.senderName,
    content: localMessage.content,
    timestamp: localMessage.timestamp,
  });

  // 清空輸入
  newMessage.value = "";
  autoResize(); 
};

// 切換貼圖面板顯示
const toggleStickerPanel = () => {
  showStickerPanel.value = !showStickerPanel.value;
  autoResize(); 
};

// 發送貼圖
const sendSticker = async (sticker) => {
  const now = new Date();

  const stickerMessage = {
    id: Date.now(),
    roomId: currentFriend.value.roomId,
    senderId: userStore.userId,
    senderName: userStore.username || `User${userStore.userId}`,
    content: "", // 文字描述，作為備用
    timestamp: now.toISOString(),
    time: formatTime(now),
    type: "sticker",
    stickerUrl: sticker.url,
    stickerEmoji: sticker.emoji,
  };

  socket.emit("chatMessage", {
    roomId: stickerMessage.roomId,
    senderId: stickerMessage.senderId,
    senderName: stickerMessage.senderName,
    content: "",
    timestamp: stickerMessage.timestamp,
    type: "sticker",
    stickerUrl: sticker.url,
    stickerEmoji: sticker.emoji,
  });

  // 關閉貼圖面板
  showStickerPanel.value = false;
};

// 加入 ai 建議 API
const getSuggestion = async()=>{
  try{
    const res =  await axios.post("/chat/ai-suggestion",{
      roomId: currentRoom.value,
    })
    newMessage.value = res.data.suggestion;

    // 等 DOM 更新後 再調整高度
    await nextTick();
    autoResize();
  }catch(err){
    console.error("取得 AI 建議失敗", err);
    alert("Google Gemini異常 請重新再試一遍");
  }
}

// 監聽訊息長度 實現自動滾到訊息底部的功能
watch(
  () => chatStore.currentRoomMessages.length,
  async () => {
    await nextTick(); // 等畫面渲染
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  }
);

// 監聽房間變化
// watch(source, callback, options?)
watch(
  // 監聽 ref 變數 currentRoom 的變化
  () => currentRoom.value,
  // 因為等下會打 取歷史資料的api
  async (newRoom, oldRoom) => {
    if (userStore.userId && newRoom !== oldRoom) {
      // 離開舊房間
      if (oldRoom) {
        socket.emit("leaveRoom", {
          roomId: oldRoom,
          userId: userStore.userId,
        });
      }

      // 更新當前房間
      roomId.value = newRoom;
      chatStore.setCurrentRoom(newRoom);

      // 加入新房間
      socket.emit("joinRoom", {
        roomId: roomId.value,
        userId: userStore.userId,
        userName: currentUser.value.name || `User${userStore.userId}`,
      });

      // 清空當前訊息
      chatStore.clearMessages?.();

      // 載入歷史訊息
      try {
        const res = await axios.get(`/messages/${newRoom}`);
        res.data.messages.forEach((msg) => {
          chatStore.addMessage({
            ...msg,
            senderId: msg.sender_id,
            roomId: msg.room_id,
            timestamp: msg.created_at,
            time: formatTime(new Date(msg.created_at)),
            type: msg.type || 'text',
            stickerUrl: msg.sticker_url || null,
            stickerEmoji: msg.sticker_emoji || null,
          });
        });
      } catch (err) {
        console.error("載入歷史訊息失敗", err);
      }

      console.log("切換到新房間:", newRoom);
    }
  }
);

watch(newMessage, autoResize);

</script>

<template>
  <div class="bg-gray-100 h-[90vh] flex flex-row">
    <!-- 左側邊欄 -->
    <div class="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div class="p-4 border-b border-gray-200">
        <h1 class="text-xl font-semibold text-gray-800">聊天室</h1>
      </div>
      <div class="flex-1 overflow-y-auto">
        <!-- 每一行代表一個聊天室(有幾個好友就有幾個聊天室) -->
        <!-- 用 v-for 跑整個好友清單 -->
        <!-- 點選某個 聊天室某一列 時 將 currentRoom 設為該聊天室的 roomId-->
        <div
          v-for="room in chatRooms"
          :key="room.roomId"
          @click="currentRoom = room.roomId"
          :class="[
            'p-4 cursor-pointer border-b border-gray-100',
            room.roomId === currentRoom
              ? 'bg-[#f6ba42] text-white'
              : 'hover:bg-gray-50',
          ]"
        >
          <div class="font-medium">{{ room.friendName }}</div>
          <div
            :class="[
              'text-sm',
              room.roomId === currentRoom ? 'opacity-90' : 'text-gray-500',
            ]"
          >
            {{ room.day }}
          </div>
          <div
            :class="[
              'text-xs mt-1',
              room.roomId === currentRoom ? 'opacity-75' : 'text-gray-400',
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
            <!-- TODO:這邊之後放我的好友的大頭貼 -->
            <span class="text-sm font-medium text-gray-700">{{}}</span>
          </div>
          <div>
            <!-- 當還沒有選擇聊天室時 chatRoom.find()找不到資料 => 所以試圖讀取 .friendName 會掛掉 -->
            <div class="font-medium text-gray-800">
              {{ currentFriend?.friendName }}
            </div>
            <div class="text-sm text-gray-500">Room ID: {{ currentRoom }}</div>
          </div>
        </div>
      </div>
      <!-- 聊天訊息區域 -->
      <!-- 外層容器 滾動區域 -->
      <div
        class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        ref="messagesContainer"
      >
        <!-- 空訊息提示 -->
        <div v-if="chatStore.messages.length === 0" class="text-center py-8">
          <div class="text-gray-500">還沒有訊息，開始聊天吧！</div>
        </div>

        <div
          v-for="msg in chatStore.currentRoomMessages"
          :key="msg.id || msg.timestamp"
          :class="[
            'flex',
            Number(msg.senderId) === Number(userStore.userId)
              ? 'justify-end'
              : 'justify-start',
          ]"
        >
          <div class="flex flex-col">
            <!-- 顯示發送者名稱（如果不是自己的訊息） -->
            <div
              v-if="Number(msg.senderId) !== Number(userStore.userId)"
              class="text-xs text-gray-600 mb-1 pl-2 font-medium"
            >
              {{ currentFriend.friendName || `User${Number(msg.senderId)}` }}
            </div>
            <!-- 訊息泡泡 我發的訊息 白底靠右 ; 對方訊息 黃底靠左-->
            <div
              :class="[
                'rounded-2xl px-4 py-2 max-w-xs lg:max-w-md',
                Number(msg.senderId) === Number(userStore.userId)
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'bg-[#f6ba42] text-white shadow-sm',
              ]"
            >
              <!-- 貼圖訊息 -->
              <div
                v-if="msg.type === 'sticker'"
                class="flex flex-col items-center"
              >
                <!-- 如果有貼圖URL則顯示圖片，否則顯示emoji -->
                <img
                  v-if="msg.stickerUrl"
                  :src="msg.stickerUrl"
                  :alt="msg.stickerEmoji || 'sticker'"
                  class="w-16 h-16 object-contain"
                  @error="handleStickerError"
                  :style="{ display: 'block' }"
                />

                <!-- emoji作為備用顯示 -->
                <span v-show="!msg.stickerUrl" class="text-4xl">{{
                  msg.stickerEmoji || "🙂"
                }}</span>
              </div>

              <!-- 訊息內容 -->
              <p class="break-words">{{ msg.content || msg.text }}</p>

              <!-- 時間 -->
              <div
                :class="[
                  'text-xs mt-1',
                  Number(msg.senderId) === Number(userStore.userId)
                    ? 'text-gray-500 text-right'
                    : 'text-white opacity-75',
                ]"
              >
                {{ msg.time }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 輸入區域 -->
      <div class="bg-white border-t border-gray-200 p-4 flex-shrink-0 relative">
        <!-- 貼圖選擇面板 -->
        <div
          v-if="showStickerPanel"
          ref="stickerPanelRef"
          class="absolute bottom-full left-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10"
        >
          <div class="flex flex-col">
            <div class="text-sm font-medium text-gray-700 mb-2">選擇貼圖</div>
            <div class="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              <button
                v-for="sticker in stickers"
                :key="sticker.id"
                @click="sendSticker(sticker)"
                class="p-2 hover:bg-[#f6ba42] rounded-lg transition-colors flex flex-col items-center"
              >
                <!-- 顯示貼圖圖片，如果載入失敗則顯示emoji -->
                <img
                  :src="sticker.url"
                  :alt="sticker.name"
                  class="w-8 h-8 object-contain mb-1"
                  @error="
                    $event.target.style.display = 'none';
                    $event.target.nextElementSibling.style.display = 'block';
                  "
                />
                <span class="text-2xl hidden">{{ sticker.emoji }}</span>
                <span class="text-xs text-gray-600 text-center"></span>
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-end space-x-3">
          <!-- 貼圖按鈕 -->
          <button
            ref="stickerButtonRef"
            @click="toggleStickerPanel"
            :disabled="!isUserLoggedIn"
            :class="[
              'p-2 rounded-lg transition-colors flex-shrink-0',
              isUserLoggedIn
                ? 'text-gray-600 hover:bg-gray-100 hover:text-[#f6ba42]'
                : 'text-gray-400 cursor-not-allowed',
              showStickerPanel ? 'bg-gray-100 text-[#f6ba42]' : '',
            ]"
          >
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
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
              newMessage.trim()
                ? 'bg-[#f6ba42] hover:bg-[#ed8b34] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
            ]"
          >
            送出
          </button>
          <button
            class="ml-2 px-3 py-2 bg-[#f6ba42] text-white rounded"
            @click="getSuggestion"
          >
            AI 建議
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

/* 確保訊息容器能正確滾動 */
.overflow-y-auto[ref="messagesContainer"] {
  flex: 1;
  min-height: 0;
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
/* 貼圖面板動畫 */
.sticker-panel-enter-active,
.sticker-panel-leave-active {
  transition: all 0.3s ease;
}

.sticker-panel-enter-from,
.sticker-panel-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
