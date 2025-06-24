<script setup>
import { ref, onMounted, nextTick } from 'vue'
import MapSelector from './MapSelector.vue'
import { loadGoogleMapsAPI } from '@/api/googleMapsApi'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const showMapModal = ref(false)
const inputRef = ref(null)
const autocompleteInstance = ref(null)

// 載入 Google Maps 並初始化 Autocomplete
onMounted(async () => {
  try {
    await loadGoogleMapsAPI()
    if (window.google?.maps?.places) {
      await nextTick()
      initAutocomplete()
    }
  } catch (error) {
    console.error('Places API 載入失敗:', error)
  }
})

// 初始化 Places Autocomplete
const initAutocomplete = () => {
  if (!inputRef.value) return

  try {
    autocompleteInstance.value = new google.maps.places.Autocomplete(inputRef.value, {
      componentRestrictions: { country: 'TW' },
      fields: ['formatted_address'],  // 簡化：只要地址，不要 geometry
      types: ['establishment', 'geocode']
    })

    autocompleteInstance.value.addListener('place_changed', handlePlaceSelect)
  } catch (error) {
    console.error('Autocomplete 初始化失敗:', error)
  }
}

// 處理 Places 選擇
const handlePlaceSelect = () => {
  const place = autocompleteInstance.value.getPlace()
  
  if (place.formatted_address) {
    emit('update:modelValue', place.formatted_address)
  }
}

// 處理手動輸入
const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const openMapSelector = () => {
  showMapModal.value = true
}

const handleAddressSelected = (address) => {
  emit('update:modelValue', address)
  showMapModal.value = false
}

const closeMapModal = () => {
  showMapModal.value = false
}
</script>

<template>
  <div>
    <div class="flex gap-2">
      <input
        ref="inputRef"
        id="location"
        :value="modelValue"
        @input="handleInput"
        placeholder="請輸入活動地點，會自動顯示建議"
        class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:text-secondary"
      />
      <button 
        @click="openMapSelector"
        type="button"
        class="px-3 py-2 bg-[#219ebc] text-white rounded hover:bg-[#1a8ba3] transition-colors whitespace-nowrap text-sm"
      >
        地圖選擇
      </button>
    </div>
    
    <p class="mt-1 text-xs text-gray-500">
      開始輸入會顯示地址建議，或點擊地圖選擇
    </p>

    <MapSelector
      :show="showMapModal"
      @address-selected="handleAddressSelected"
      @close="closeMapModal"
    />
  </div>
</template>