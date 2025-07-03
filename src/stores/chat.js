import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const userChatStore = defineStore("chat", () => {
  const messages = ref([]);
  const currentRoomId = ref(null);
  const onlineUsers = ref([]);
  const isConnected = ref(false);
  const fetchedRoomIds = ref(new Set());
  const chatRooms = ref([]);

  function setChatRooms(rooms) {
    chatRooms.value = rooms;
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const addMessage = (message) => {
    // 確保訊息有必要的屬性
    const formattedMessage = {
      id: message.id || Date.now(),
      content: message.content || message.text,
      senderId: message.senderId,
      senderName: message.senderName || `User${message.senderId}`,
      timestamp:
        message.timestamp ||
        (message.created_at && formatTime(new Date(message.created_at))) ||
        formatTime(new Date()),
      roomId: message.roomId || currentRoomId.value,
      ...message,
    };

    messages.value.push(formattedMessage);
  };

  const getMessagesByRoom = (roomId) => {
    return messages.value.filter((msg) => msg.roomId === roomId);
  };

  const currentRoomMessages = computed(() => {
    if (!currentRoomId.value) return messages.value;
    return getMessagesByRoom(currentRoomId.value);
  });

  const setCurrentRoom = (roomId) => {
    currentRoomId.value = roomId;
  };

  const updateOnlineUsers = (users) => {
    onlineUsers.value = users;
  };

  const setConnectionStatus = (status) => {
    isConnected.value = status;
  };

  const messageCount = computed(() => messages.value.length);

  const onlineUserCount = computed(() => onlineUsers.value.length);

  return {
    messages,
    currentRoomId,
    onlineUsers,
    isConnected,

    currentRoomMessages,
    messageCount,
    onlineUserCount,

    fetchedRoomIds,
    chatRooms,

    setChatRooms,

    addMessage,
    setCurrentRoom,
    updateOnlineUsers,
    setConnectionStatus,
    getMessagesByRoom,
  };
});
