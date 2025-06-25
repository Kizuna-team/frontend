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
import { Bot, X, Sparkles } from "lucide-vue-next";
import { io } from "socket.io-client";
import { useUserStore } from "@/stores/user.js";
import { userChatStore } from "@/stores/chat.js";
import { createRecognition } from "@/config/voiceRecognition.js";
import { Vue3Lottie } from "vue3-lottie";
import voiceInputAnimation from "@/assets/voice.json";
import StickerPanel from "@/components/StickerPanel.vue";
import StickerButton from "@/components/StickerButton.vue";
import { defaultStickers } from "@/config/stickerData.js";

// Socket.io 連接設定
const socket = io(import.meta.env.VITE_API_BASE_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000,
});

let suggestionFromAI = false;

// test
const isExpanded = ref(false);
const messages = ref([]);
const isLoading = ref(false);
const messagesEndRef = ref(null);

const scrollToBottom = () => {
  nextTick(() => {
    messagesEndRef.value?.scrollIntoView({ behavior: "smooth" });
  });
};

watch(messages, scrollToBottom);

const handleExpand = () => {
  isExpanded.value = true;
};

const handleClose = () => {
  isExpanded.value = false;
};
// test

const userStore = useUserStore();
const chatStore = userChatStore();
const roomId = ref("");
// 依照內容自動調整對話框高度
const textareaRef = ref(null);
const isListening = ref(false);

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
const stickerPanelRef = ref(null);
const stickerButtonRef = ref(null);

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


const currentRoom = ref("");
const newMessage = ref("");
const aiMessage = ref("");
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

const handleClickOutside = (event) => {
  const panelElement = stickerPanelRef.value?.stickerPanelRef;
  const buttonElement = stickerButtonRef.value?.stickerButtonRef;

  if (panelElement && buttonElement) {
    if (
      !panelElement.contains(event.target) &&
      !buttonElement.contains(event.target)
    ) {
      showStickerPanel.value = false;
    }
  }
};
//移除事件監聽器
document.removeEventListener("click", handleClickOutside);

const formatTime = (date) => {
  return date.toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const startVoiceInput = () => {
  try {
    const recognition = createRecognition();
    if (!recognition) return;

    isListening.value = true;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // 將辨識的語音轉成文字塞進輸入框中
      newMessage.value = transcript;
      isListening.value = false;
    };

    recognition.onerror = (event) => {
      console.error("語音辨識錯誤：", event.error);
      alert("語音辨識發生錯誤：" + event.error);
      isListening.value = false;
    };

    recognition.onend = () => {
      isListening.value = false;
    };

    recognition.start();
  } catch (err) {
    console.error("語音啟動錯誤", err);
    isListening.value = false;
  }
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
const handleStickerSelect = async (sticker) => {
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
const getSuggestion = async () => {
  isLoading.value = true;
  try {
    const res = await axios.post("/chat/ai-suggestion", {
      roomId: currentRoom.value,
    });
    aiMessage.value = res.data.suggestion;
    suggestionFromAI = true;

    // 等 DOM 更新後 再調整高度
    await nextTick();
    autoResize();
    isLoading.value = false;
  } catch (err) {
    console.error("取得 AI 建議失敗", err);
    alert("Google Gemini異常 請重新再試一遍");
  }
};

const handleEnter = (e) => {
  if (e.shiftKey) return;
  e.preventDefault();

  if (suggestionFromAI) {
    suggestionFromAI = false;
    return;
  }

  if (newMessage.value.trim()) {
    sendMessage();
  }
};

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
            type: msg.type || "text",
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
  <div class="flex flex-col md:flex-row h-screen">
    <!-- 好友列表區域 -->
    <div class="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex md:flex-col overflow-x-auto md:overflow-y-auto">
      <div class="p-4 border-b border-gray-200 hidden md:block">
        <h1 class="text-xl font-semibold text-gray-800">聊天室</h1>
      </div>
      <div class="flex md:flex-col flex-row md:flex-1">
        <div
          v-for="room in chatRooms"
          :key="room.roomId"
          @click="currentRoom = room.roomId"
          :class="[
            'cursor-pointer border-b md:border-b-0 md:border-t border-gray-100 flex items-center md:items-start md:flex-row flex-col px-3 py-2 md:p-4 gap-2 transition-all',
            currentRoom === room.roomId ? 'bg-[#f6ba42] text-white' : 'hover:bg-gray-50',
          ]"
          class="shrink-0 min-w-[96px] md:min-w-0"
        >
          <img :src="room.avatarUrl || '/default-chat-avatar.png'" class="object-cover w-10 h-10 border-2 border-white rounded-full" />
          <div class="font-medium text-xs md:text-base text-center md:text-left">
            {{ room.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 聊天訊息與輸入區域 -->
    <div class="flex flex-col flex-1 min-h-0 max-h-[calc(100vh-160px)] md:max-h-full">
      <!-- 訊息列表 -->
      <div class="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50" ref="messagesContainer">
        <div v-if="chatStore.messages.length === 0" class="py-8 text-center">
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
            <div
              v-if="Number(msg.senderId) !== Number(userStore.userId)"
              class="pl-2 mb-1 text-xs font-medium text-gray-600"
            >
              {{ currentFriend.friendName || `User${Number(msg.senderId)}` }}
            </div>
            <div
              :class="[
                'rounded-2xl px-4 py-2 max-w-xs lg:max-w-md break-words',
                Number(msg.senderId) === Number(userStore.userId)
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'bg-[#f6ba42] text-white shadow-sm',
              ]"
            >
              <div v-if="msg.type === 'sticker'" class="flex flex-col items-center">
                <img
                  v-if="msg.stickerUrl"
                  :src="msg.stickerUrl"
                  :alt="msg.stickerEmoji || 'sticker'"
                  class="object-contain w-16 h-16"
                  @error="handleStickerError"
                  :style="{ display: 'block' }"
                />
                <span v-show="!msg.stickerUrl" class="text-4xl">
                  {{ msg.stickerEmoji || '🙂' }}
                </span>
              </div>
              <p>{{ msg.content || msg.text }}</p>
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

      <!-- 訊息輸入欄 -->
      <div class="relative flex-shrink-0 p-4 bg-white border-t border-gray-200">
        <StickerPanel
          ref="stickerPanelRef"
          :show="showStickerPanel"
          :stickers="defaultStickers"
          @select-sticker="handleStickerSelect"
        />
        <div class="flex flex-wrap items-end gap-2 sm:gap-3">
          <StickerButton
            ref="stickerButtonRef"
            :disabled="!isUserLoggedIn"
            :active="showStickerPanel"
            @toggle="toggleStickerPanel"
          />
          <button
            @click="startVoiceInput"
            aria-label="語音輸入"
            class="p-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-[#f6ba42]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
              />
            </svg>
          </button>
          <div class="relative flex-1">
            <input
              type="text"
              placeholder="輸入訊息或使用語音..."
              @keydown.enter="handleEnter"
              v-model="newMessage"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#f6ba42] focus:border-transparent"
            />
            <div
              v-if="isListening"
              class="z-[99] absolute inset-y-0 right-2 flex items-center"
            >
              <Vue3Lottie
                :animationData="voiceInputAnimation"
                :height="48"
                :width="48"
                :loop="true"
                :autoPlay="true"
              />
            </div>
          </div>
          <button
            @click="sendMessage"
            :disabled="!newMessage.trim()"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              newMessage.trim()
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
          <div class="fixed z-50 bottom-20 right-20">
            <!-- 收合狀態的圓點 -->
            <div class="absolute transition-all duration-500" :class="isExpanded
              ? 'opacity-0 scale-0 pointer-events-none'
              : 'opacity-100 scale-100 pointer-events-auto'
              ">
              <div @click="handleExpand"
                class="relative w-16 h-16 overflow-hidden transition-all duration-500 border rounded-full shadow-2xl cursor-pointer group backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-white/30 hover:scale-110 hover:shadow-blue-500/25 hover:shadow-2xl">
                <div
                  class="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-xl group-hover:opacity-100">
                </div>
                <div class="relative z-10 flex items-center justify-center w-full h-full">
                  <Bot class="w-8 h-8 text-white drop-shadow-lg animate-pulse" />
                </div>
                <div
                  class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 animate-ping">
                </div>
              </div>
            </div>

            <!-- 展開狀態的聊天視窗 -->
            <div class="absolute bottom-0 right-0 transition-all duration-500" :class="isExpanded
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-0 pointer-events-none'
              ">
              <div
                class="relative flex flex-col overflow-hidden border shadow-2xl rounded-2xl w-80 h-96 backdrop-blur-xl bg-white/10 border-white/20">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>

                <div
                  class="relative z-50 flex items-center justify-between flex-shrink-0 p-4 border-b border-white/20 bg-white/5 backdrop-blur-sm">
                  <div class="flex items-center space-x-2">
                    <div
                      class="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400">
                      <Sparkles class="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-800">
                        AI 聊天助手
                      </h3>
                      <p class="text-xs text-gray-600">智能對話建議</p>
                    </div>
                  </div>
                  <button @click="handleClose"
                    class="relative z-50 p-2 transition-all duration-200 border rounded-full bg-red-500/20 hover:bg-red-500/40 hover:scale-110 border-red-400/30 group">
                    <X class="w-4 h-4 text-white drop-shadow-lg group-hover:text-red-200" />
                  </button>
                </div>
                <div class="relative z-10 flex-1 min-h-0 p-3 overflow-y-auto">
                  <div v-if="isLoading" class="py-8 text-sm text-center text-gray-600">
                    <Bot class="w-8 h-8 mx-auto mb-2 text-gray-600 opacity-70" />
                    正在分析你們的對話...
                  </div>
                  <textarea type="text" v-model="aiMessage"
                    class="w-full h-[200px] p-3 rounded-xl border border-white/30 bg-white/10 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 backdrop-blur-sm shadow-inner"></textarea>
                </div>
                <div class="relative z-20 flex-shrink-0 p-3 border-t border-white/20 bg-white/5 backdrop-blur-sm">
                  <div class="flex justify-center mt-2">
                    <button @click="getSuggestion" :disabled="isLoading"
                      class="h-10 px-3 py-1 text-xs text-gray-700 transition-colors border rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 border-white/20">
                      {{ isLoading ? "分析中..." : "獲取聊天建議" }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
</template>

<style>
::-webkit-scrollbar {
  height: 4px;
}
::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}

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
</style>
