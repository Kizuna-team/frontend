import { defineStore } from "pinia";
import { ref } from "vue";

export const userChatStore = defineStore("chat", () => {
  const messages = ref([]);

  function addMessage(msg) {
    messages.value.push(msg);
  }

  return { messages, addMessage };
});
