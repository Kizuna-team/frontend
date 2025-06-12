<script setup>
import { ref, nextTick } from "vue"
import axios from "axios"

const input = ref("")
const messages = ref([])
const chatBox = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    chatBox.value.scrollTop = chatBox.value.scrollHeight
  })
}

const send = async () => {
  if (!input.value.trim()) return

  messages.value.push({ role: "user", content: input.value })

  try {
    const res = await axios.post("http://localhost:3000/api/chat", {
      message: input.value,
    })
    messages.value.push({ role: "assistant", content: res.data.reply })
  } catch (err) {
    messages.value.push({ role: "assistant", content: "錯誤：" + err.message })
  }

  input.value = ""
  scrollToBottom()
}
</script>

<template>
  <div class="max-w-md h-[600px] mx-auto mt-10 p-4 border rounded shadow flex flex-col">
    <h1 class="mb-4 text-xl font-bold">AI 聊天測試</h1>

    <div ref="chatBox" class="flex-1 p-2 mb-4 overflow-y-auto border rounded bg-gray-50">
      <div v-for="(m, i) in messages" :key="i" class="mb-2">
        <p :class="m.role === 'user' ? 'text-blue-600' : 'text-green-600'">
          {{ m.role === 'user' ? '你：' : 'AI：' }}
        </p>
        <p>{{ m.content }}</p>
      </div>
    </div>

    <input
      v-model="input"
      @keydown.enter="send"
      placeholder="輸入訊息..."
      class="w-full p-2 mb-2 border"
    />
    <button @click="send" class="py-2 text-white bg-blue-500 rounded">送出</button>
  </div>
</template>
