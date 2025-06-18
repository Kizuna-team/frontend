// stores/chat.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const userChatStore = defineStore("chat", () => {
  // 狀態
  const messages = ref([]);
  const currentRoomId = ref(null);
  const onlineUsers = ref([]);
  const isConnected = ref(false);

  const formatTime = (date) => {
    return date.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // 新增訊息 接收到訊息時 順便將時間格式化
  const addMessage = (message) => {
    console.log("chatStore.addMessage 被呼叫");
    console.log("接收到的訊息:", message);

    // 確保訊息有必要的屬性
    const formattedMessage = {
      id: message.id || Date.now(),
      content: message.content || message.text,
      senderId: message.senderId,
      senderName: message.senderName || `User${message.senderId}`,
      timestamp: message.timestamp ||
        message.created_at && formatTime(new Date(message.created_at)) ||
        formatTime(new Date()),
      roomId: message.roomId || currentRoomId.value,
      ...message
    };

    console.log("格式化的訊息:", formattedMessage);
    console.log("加入前 messages 長度:", messages.value.length);

    messages.value.push(formattedMessage);

    console.log("加入後 messages 長度:", messages.value.length);
    console.log("目前所有訊息:", messages.value);
  };

  // OK 用雙方專屬的room_id獲取特定房間的訊息
  const getMessagesByRoom = (roomId) => {
    return messages.value.filter(msg => msg.roomId === roomId);
  };

  // OK 獲取目前房間的訊息
  const currentRoomMessages = computed(() => {
    if (!currentRoomId.value) return messages.value;
    return getMessagesByRoom(currentRoomId.value);
  });

  // 設置目前房間
  const setCurrentRoom = (roomId) => {
    console.log("設置當前房間:", roomId);
    currentRoomId.value = roomId;
  };

  // 更新線上用戶列表
  const updateOnlineUsers = (users) => {
    onlineUsers.value = users;
    console.log("更新線上用戶:", users);
  };

  // 設置連接狀態
  const setConnectionStatus = (status) => {
    isConnected.value = status;
    console.log("連接狀態:", status);
  };

  // 計算屬性 - 訊息數量
  const messageCount = computed(() => messages.value.length);

  // 計算屬性 - 線上用戶數量
  const onlineUserCount = computed(() => onlineUsers.value.length);

  return {
    // 狀態
    messages,
    currentRoomId,
    onlineUsers,
    isConnected,

    // 計算屬性
    currentRoomMessages,
    messageCount,
    onlineUserCount,

    // 方法 - 確保所有方法都有被 return
    addMessage,
    setCurrentRoom,
    updateOnlineUsers,
    setConnectionStatus,
    getMessagesByRoom,
  };
});
