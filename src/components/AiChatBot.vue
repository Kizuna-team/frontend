
<script setup>
import axios from "@/api/axios";
import { ref, watch, nextTick, defineProps } from 'vue'
import { Bot, X, Sparkles } from 'lucide-vue-next'

const isExpanded = ref(false)
const messages = ref([])
const isLoading = ref(false)
const messagesEndRef = ref(null)

const props = defineProps({
  currentRoom: {
    type: String,
    required: true,
  },
})

const scrollToBottom = () => {
  nextTick(() => {
    messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' })
  })
}

watch(messages, scrollToBottom)

const getSuggestion = async () => {
  try {
    isLoading.value = true;
    console.log(currentRoom.value);
    const res = await axios.post("/chat/ai-suggestion", {
      roomId: currentRoom.value,
    })
    messages.value = res.data.suggestion;
  } catch (err) {
    console.error("取得 AI 建議失敗", err);
    alert("Google Gemini異常 請重新再試一遍");
  }
}

const handleExpand = () => {
  isExpanded.value = true;
}

const handleClose = () => {
  isExpanded.value = false
}
</script>

<template>
  <div class="fixed bottom-20 right-20 z-50">
    <!-- 收合狀態的圓點 -->
    <div
      class="absolute transition-all duration-500"
      :class="isExpanded ? 'opacity-0 scale-0 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto'"
    >
      <div
        @click="handleExpand"
        class="group relative overflow-hidden rounded-full w-16 h-16 cursor-pointer transition-all duration-500 backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/30 shadow-2xl hover:scale-110 hover:shadow-blue-500/25 hover:shadow-2xl"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative z-10 w-full h-full flex items-center justify-center">
          <Bot class="w-8 h-8 text-white drop-shadow-lg animate-pulse" />
        </div>
        <div class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 animate-ping"></div>
      </div>
    </div>

    <!-- 展開狀態的聊天視窗 -->
    <div
      class="absolute bottom-0 right-0 transition-all duration-500"
      :class="isExpanded ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-0 pointer-events-none'"
    >
      <div class="relative overflow-hidden rounded-2xl w-80 h-96 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl flex flex-col">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>

        <div class="relative z-50 flex items-center justify-between p-4 border-b border-white/20 bg-white/5 backdrop-blur-sm flex-shrink-0">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
              <Sparkles class="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 class="text-gray-800 font-medium text-sm">AI 聊天助手</h3>
              <p class="text-gray-600 text-xs">智能對話建議</p>
            </div>
          </div>
          <button @click="handleClose" class="relative z-50 p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-all duration-200 hover:scale-110 border border-red-400/30 group">
            <X class="w-4 h-4 text-white drop-shadow-lg group-hover:text-red-200" />
          </button>
        </div>
        <div class="relative z-10 flex-1 p-3 overflow-y-auto min-h-0">
          <div v-if="messages.length === 0 && !isLoading" class="text-center text-gray-600 text-sm py-8">
            <Bot class="w-8 h-8 mx-auto mb-2 opacity-70 text-gray-600" />
            正在分析你們的對話...
          </div>

          <div v-for="msg in messages" :key="msg.id" class="mb-3">
            <div :class="['flex', msg.type === 'user' ? 'justify-end' : 'justify-start']">
              <div :class="['max-w-[80%] rounded-2xl px-3 py-2 text-sm', msg.type === 'user' ? 'bg-blue-500/30 text-gray-800 ml-4' : 'bg-white/10 text-gray-800 mr-4 border border-white/10']">
                {{ msg.content }}
                <div class="text-xs opacity-60 mt-1 text-gray-600">{{ msg.timestamp }}</div>
              </div>
            </div>
          </div>

          <div v-if="isLoading" class="flex justify-start mb-3">
            <div class="bg-white/10 text-gray-800 rounded-2xl px-3 py-2 text-sm mr-4 border border-white/10">
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                <div class="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>

        </div>

        <div class="relative z-20 p-3 border-t border-white/20 bg-white/5 backdrop-blur-sm flex-shrink-0
        ">
          <div class="mt-2 flex justify-center">
            <button
              @click="getSuggestion"
              :disabled="isLoading"
              class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs text-gray-700 transition-colors disabled:opacity-50 border border-white/20 h-10"
            >
              {{ isLoading ? '分析中...' : '獲取聊天建議' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

