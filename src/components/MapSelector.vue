<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useToast } from 'vue-toastification'
import { loadGoogleMapsAPI, getAddressFromCoordinates } from '@/api/googleMapsApi'
import { DEFAULT_MAP_OPTIONS } from '@/config/googleMaps'

// Props 定義
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  initialCenter: {
    type: Object,
    default: () => ({ lat: 25.034, lng: 121.565 }) // 台北101
  }
})

// Emits 定義
const emit = defineEmits(['addressSelected', 'close'])

// 狀態管理
const toast = useToast()
const selectedMapAddress = ref('')
const mapInstance = ref(null)
const markerInstance = ref(null)
const isMapLoaded = ref(false)

// 載入 Google Maps API
onMounted(async () => {
  try {
    await loadGoogleMapsAPI()
    isMapLoaded.value = true
    console.log('Google Maps API 載入成功')
    
    // 如果彈窗已經開啟，立即初始化地圖
    if (props.show) {
      await nextTick()
      initMap()
    }
  } catch (error) {
    console.error('Google Maps API 載入失敗:', error)
    toast.error('地圖載入失敗，請檢查網路連線')
  }
})

// 監聽 show 變化，當彈窗開啟時初始化地圖
const initMap = async () => {
  if (!isMapLoaded.value) {
    toast.error('地圖還在載入中，請稍等...')
    return
  }

  await nextTick() // 確保 DOM 已渲染
  
  const mapElement = document.getElementById('map')
  if (!mapElement) {
    console.error('找不到地圖容器')
    return
  }

  // 建立地圖實例
  mapInstance.value = new google.maps.Map(mapElement, {
    ...DEFAULT_MAP_OPTIONS,
    center: props.initialCenter
  })

  // 監聽地圖點擊事件
  mapInstance.value.addListener('click', handleMapClick)
}

// 處理地圖點擊事件
const handleMapClick = async (event) => {
  const lat = event.latLng.lat()
  const lng = event.latLng.lng()

  try {
    // 在地圖上放置標記
    placeMarker(lat, lng)
    
    // 將座標轉換為地址
    const address = await getAddressFromCoordinates(lat, lng)
    selectedMapAddress.value = address
    
    console.log('選中的地址:', address)
  } catch (error) {
    console.error('取得地址失敗:', error)
    toast.error('無法取得該位置的地址')
  }
}

// 放置地圖標記
const placeMarker = (lat, lng) => {
  // 如果已有標記，先移除
  if (markerInstance.value) {
    markerInstance.value.setMap(null)
  }

  // 建立新標記
  markerInstance.value = new google.maps.Marker({
    position: { lat, lng },
    map: mapInstance.value,
    title: '選中的位置'
  })

  // 將地圖中心移動到標記位置
  mapInstance.value.setCenter({ lat, lng })
}

// 確認選擇
const confirmSelection = () => {
  if (selectedMapAddress.value) {
    emit('addressSelected', selectedMapAddress.value)
    toast.success('地址已選擇')
  }
}

// 關閉彈窗
const closeModal = () => {
  // 清理地圖和標記
  if (markerInstance.value) {
    markerInstance.value.setMap(null)
    markerInstance.value = null
  }
  mapInstance.value = null
  selectedMapAddress.value = ''
  
  emit('close')
}

// 當組件顯示時初始化地圖
const handleModalShow = async () => {
  if (props.show && isMapLoaded.value) {
    setTimeout(initMap, 100) // 給 DOM 一點時間渲染
  }
}

// 監聽 show 變化
import { watch } from 'vue'
watch(() => props.show, (newVal) => {
  if (newVal) {
    handleModalShow()
  }
})
</script>

<template>
  <!-- 地圖選擇彈窗 -->
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- 彈窗標題 -->
      <div class="flex items-center justify-between p-6 border-b">
        <h3 class="text-lg font-semibold text-darkblue">選擇活動地點</h3>
        <button 
          @click="closeModal" 
          class="text-xl text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <!-- 地圖容器 -->
      <div class="p-6">
        <div 
          id="map" 
          class="w-full border rounded-lg h-96"
        ></div>
        
        <!-- 選中的地址顯示 -->
        <div 
          v-if="selectedMapAddress" 
          class="p-3 mt-4 rounded-lg bg-gray-50"
        >
          <p class="text-sm text-gray-600">選中的地址：</p>
          <p class="font-medium">{{ selectedMapAddress }}</p>
        </div>
        
        <!-- 說明文字 -->
        <p v-else class="mt-4 text-sm text-gray-500">
          點擊地圖上的任意位置來選擇地點
        </p>
      </div>
      
      <!-- 底部按鈕 -->
      <div class="flex justify-end gap-2 p-6 border-t bg-gray-50">
        <button 
          @click="closeModal" 
          class="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
        >
          取消
        </button>
        <button 
          @click="confirmSelection" 
          :disabled="!selectedMapAddress"
          class="px-4 py-2 bg-[#219ebc] text-white rounded-lg hover:bg-[#1a8ba3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          確認選擇
        </button>
      </div>
    </div>
  </div>
</template>