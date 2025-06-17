// stores/chat.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const userChatStore = defineStore("chat", () => {
  // 狀態
  const messages = ref([]);
  const currentRoomId = ref(null);
  const onlineUsers = ref([]);
  const isConnected = ref(false);

  // 新增訊息
  const addMessage = (message) => {
    console.log("chatStore.addMessage 被呼叫");
    console.log("接收到的訊息:", message);
    
    // 確保訊息有必要的屬性
    const formattedMessage = {
      id: message.id || Date.now(),
      content: message.content || message.text,
      senderId: message.senderId,
      senderName: message.senderName || `User${message.senderId}`,
      timestamp: message.timestamp || new Date().toISOString(),
      roomId: message.roomId || currentRoomId.value,
      ...message
    };
    
    console.log("格式化的訊息:", formattedMessage);
    console.log("加入前 messages 長度:", messages.value.length);
    
    messages.value.push(formattedMessage);
    
    console.log("加入後 messages 長度:", messages.value.length);
    console.log("目前所有訊息:", messages.value);
  };

  // 清空訊息
  // const clearMessages = () => {
  //   console.log("清空所有訊息");
  //   messages.value = [];
  // };

  // 設置目前房間
  const setCurrentRoom = (roomId) => {
    console.log("設置當前房間:", roomId);
    currentRoomId.value = roomId;
  };

  // 移除特定訊息
  const removeMessage = (messageId) => {
    const index = messages.value.findIndex(msg => msg.id === messageId);
    if (index !== -1) {
      messages.value.splice(index, 1);
      console.log("已移除訊息:", messageId);
    }
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

  // 獲取特定房間的訊息
  const getMessagesByRoom = (roomId) => {
    return messages.value.filter(msg => msg.roomId === roomId);
  };

  // 計算屬性 - 目前房間的訊息
  const currentRoomMessages = computed(() => {
    if (!currentRoomId.value) return messages.value;
    return getMessagesByRoom(currentRoomId.value);
  });

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
    // clearMessages,
    setCurrentRoom,
    removeMessage,
    updateOnlineUsers,
    setConnectionStatus,
    getMessagesByRoom,
  };
});
