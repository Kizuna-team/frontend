<script setup>
import { ref } from 'vue'
import MapSelector from './MapSelector.vue'

// Props 定義
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '請輸入活動地點'
  },
  label: {
    type: String,
    default: '活動地點'
  },
  required: {
    type: Boolean,
    default: false
  }
})

// Emits 定義
const emit = defineEmits(['update:modelValue'])

// 本地狀態
const showMapModal = ref(false)

// 更新值的方法
const updateValue = (value) => {
  emit('update:modelValue', value)
}

// 開啟地圖選擇器
const openMapSelector = () => {
  showMapModal.value = true
}

// 處理地圖選擇結果
const handleAddressSelected = (address) => {
  updateValue(address)
  showMapModal.value = false
}

// 關閉地圖
const closeMapModal = () => {
  showMapModal.value = false
}
</script>

<template>
  <div>
    <label 
      for="location" 
      class="block mb-2 text-lg font-bold text-darkblue"
    >
      {{ label }}{{ required ? '*' : '' }}：
    </label>
    <div class="flex gap-2">
      <input
        id="location"
        :value="modelValue"
        @input="updateValue($event.target.value)"
        :placeholder="placeholder"
        class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:text-secondary"
      />
      <button 
        @click="openMapSelector"
        type="button"
        class="px-3 py-2 bg-[#219ebc] text-white rounded hover:bg-[#1a8ba3] transition-colors whitespace-nowrap text-sm"
      >
        📍 地圖選擇
      </button>
    </div>

    <!-- 地圖選擇器組件 -->
    <MapSelector
      v-if="showMapModal"
      :show="showMapModal"
      @address-selected="handleAddressSelected"
      @close="closeMapModal"
    />
  </div>
</template>