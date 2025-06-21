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

// 載入聊天室( 好友 + roomId )
const fetchChatRooms = async () => {
  try {
    const res = await axios.get("/friendLists");
    chatRooms.value = res.data.friends;
    console.log(chatRooms.value);
  } catch (error) {
    console.error("無法取得聊天室列表", error);
  }
}

// 抓目前正在聊天的人的資訊 找到那一列
// 要綁定畫面 所以用
const currentFriend = computed(() => {
  return chatRooms.value.find(room => String(room.roomId) === String(currentRoom.value));
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
    senderName: msg.senderName || matchedRoom?.friendName || `User${msg.senderId}`,
    created_at: msg.timestamp || new Date().toISOString(),
    time: msg.time || formatTime(new Date(msg.timestamp || Date.now())),
    roomId: msg.roomId || roomId.value,
  };

  // 加入到 chatStore
  chatStore.addMessage(formattedMessage);
}



// 加入房間 & 綁定監聽器
onMounted(() => {
  fetchChatRooms();
  // 綁定 socket 接收訊息
  socket.on("chatMessage", handleIncomingMessage);

  // 等好友列表載入完後，再設定房間並 join
  watch(chatRooms, () => {
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
  }, { immediate: true });
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
    time: formatTime(now),        // 格式化成 "下午 xx:xx"
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
          });
        });
      } catch (err) {
        console.error("❌ 載入歷史訊息失敗", err);
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
        <div v-for="room in chatRooms" :key="room.roomId" @click="currentRoom = room.roomId" :class="[
          'p-4 cursor-pointer border-b border-gray-100',
          room.roomId === currentRoom
            ? 'bg-[#f6ba42] text-white'
            : 'hover:bg-gray-50',
        ]">
          <div class="font-medium">{{ room.friendName }}</div>
          <div :class="[
            'text-sm',
            room.roomId === currentRoom ? 'opacity-90' : 'text-gray-500',
          ]">
            {{ room.day }}
          </div>
          <div :class="[
            'text-xs mt-1',
            room.roomId === currentRoom ? 'opacity-75' : 'text-gray-400',
          ]">
            {{ room.lastMessage }}
          </div>
        </div>
      </div>
    </div>

    <!-- 右側主要聊天區域 -->
    <div class="flex-1 flex flex-col min-h-0">
      <!-- 聊天室標題 -->
      <div class="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span class="text-sm font-medium text-gray-700">{{ }}</span>
          </div>
          <div>
            <div class="font-medium text-gray-800">{{ currentFriend?.friendName }}</div>
            <div class="text-sm text-gray-500">Room ID: {{ currentRoom }}</div>
          </div>
        </div>
      </div>

      <!-- 聊天訊息區 -->
      <div class="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-gray-50" ref="messagesContainer">
        <div v-if="chatStore.messages.length === 0" class="text-center py-8">
          <div class="text-gray-500">還沒有訊息，開始聊天吧！</div>
        </div>

        <div v-for="msg in chatStore.currentRoomMessages" :key="msg.id || msg.timestamp" :class="[
          'flex',
          Number(msg.senderId) === Number(userStore.userId) ? 'justify-end' : 'justify-start',
        ]">
          <div class="flex flex-col">
            <div v-if="Number(msg.senderId) !== Number(userStore.userId)"
              class="text-xs text-gray-600 mb-1 pl-2 font-medium">
              {{ currentFriend.friendName || `User${Number(msg.senderId)}` }}
            </div>
            <div :class="[
              'rounded-2xl px-4 py-2 max-w-xs lg:max-w-md',
              Number(msg.senderId) === Number(userStore.userId)
                ? 'bg-white text-gray-800 shadow-sm'
                : 'bg-[#f6ba42] text-white shadow-sm',
            ]">
              <p class="break-words">{{ msg.content || msg.text }}</p>
              <div :class="[
                'text-xs mt-1',
                Number(msg.senderId) === Number(userStore.userId)
                  ? 'text-gray-500 text-right'
                  : 'text-white opacity-75',
              ]">
                {{ msg.time }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 輸入區域（高度可撐開） -->
      <div class="bg-white border-t border-gray-200 p-4">
        <div class="flex items-start space-x-3">
          <div class="flex-1">
            <textarea
              ref="textareaRef"
              id="chat-message"
              placeholder="輸入訊息"
              rows="1"
              v-model="newMessage"
              @input="autoResize"
              @keyup.enter.prevent="sendMessage"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-colors resize-none leading-[1.5rem] min-h-[40px]"
            ></textarea>
          </div>
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
</style>
