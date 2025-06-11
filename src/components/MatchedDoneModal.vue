<script setup>
import { ref } from "vue";

const props = defineProps({
  myName: String,
  // myAvatar: String,
  targetName: String,
  // targetAvatar: String,
});

const emit = defineEmits(["confirm", "cancel"]);
const inputText = ref("");

const onConfirmClick = () => {
  emit("confirm");
};
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
  <div class="container">
    <!-- 上方放兩人照片和名字 -->
    <!-- myAvatar 是陣列，取第一張照片的 avatarUrl，若沒有則用預設圖片 -->
    <div class="header">
      <div class="user-info">
        <!-- <img
          :src="props.myAvatar[0]?.avatarUrl || defaultAvatar"
          alt="My Avatar"
          class="avatar"
        /> -->
        <span>{{ props.myName }}</span>
      </div>
      <div class="user-info">
        <!-- <img :src="props.targetAvatar" alt="Target Avatar" class="avatar" /> -->
        <span>{{ props.targetName }}</span>
      </div>
    </div>

    <!-- 下方輸入欄位 -->
    <div class="input-area">
      <input
        v-model="inputText"
        type="text"
        placeholder="Send a message."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Send</button>
    </div>

    <!-- 確認和關閉 -->
    <button @click="onConfirmClick">Confirm</button>
    <button @click="onCancelClick">Cancel</button>
  </div>
</template>

<style scoped>
.container {
  width: 320px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.input-area {
  display: flex;
  gap: 8px;
}

input[type="text"] {
  flex: 1;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  padding: 6px 12px;
  border: none;
  background-color: #219ebc;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #219ebc;
}
</style>
