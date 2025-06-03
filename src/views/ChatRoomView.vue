<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { io } from "socket.io-client";
import { useUserStore } from "@/stores/user.js";
import { userChatStore } from "@/stores/chat.js";
import { watch } from "vue";
import MessageBubble from "@/components/MessageBubble.vue";

// 注意 : socket 預設是前端瀏覽器網址(localhost:5173)
// 這樣會連不上後端 localhost:3000 所以一定要指定URL
const socket = io("http://localhost:3000");
// 這次輸入的內容
const message = ref("");
// const messages = ref([]);
const userStore = useUserStore();
const chatStore = userChatStore();
const roomId = 1;

// 訊息接收處理
function handleIncomingMessage(msg) {
  // console.log(msg); // msg 會是一個物件
  chatStore.addMessage(msg);
}

// 加入房間 & 綁定監聽器
onMounted(() => {
  socket.emit("joinRoom", roomId);
  console.log("✅ 加入聊天室 Room", roomId);
  // 核心: 監聽 chatMessage 動作
  // 只綁定一次!!! (要不然傳一個訊息 會跳出多個)
  // socket.on 是接住後端 emit("什麼事件",...) 的前端監聽器
  socket.on("chatMessage", handleIncomingMessage);
});

// 避免重複綁定：離開時移除 listener
onBeforeUnmount(() => {
  socket.off("chatMessage", handleIncomingMessage); // 解除綁定
});

function sendMessage() {
  if (!message.value.trim()) return;
  // debug
  console.log(message.value);
  socket.emit("chatMessage", {
    roomId,
    senderId: userStore.userId,
    content: message.value,
  });
  message.value = "";
}

watch(
  () => userStore.userId,
  (val) => {
    console.log("userId為:", val);
  }
);
</script>

<template>
  <div class="flex flex-col h-[50vh]">
    <div class="p-4 text-lg font-bold text-white bg-blue-600">
      聊天室
    </div>
    <div class="flex-1 p-4 space-y-2 overflow-y-auto bg-gray-50">
      <MessageBubble
        v-for="(msg, index) in chatStore.messages"
        :key="index"
        :msg="msg"
        :self-id="userStore.userId"
      />
    </div>
    <div class="flex p-4 border-t">
      <input
        v-model="message"
        class="flex-1 px-3 py-2 mr-2 border rounded"
        placeholder="輸入訊息"
        @keyup.enter="sendMessage"
      >
      <button
        class="px-4 py-2 text-white bg-blue-500 rounded"
        @click="sendMessage"
      >
        發送
      </button>
    </div>
  </div>
</template>

<style></style>
