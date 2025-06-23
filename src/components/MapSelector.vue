<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
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
const allMarkers = ref([]) // 追蹤所有建立過的標記

// 載入 Google Maps API
onMounted(async () => {
  try {
    console.log('🚀 開始載入 Google Maps API')
    
    // 檢查 API Key
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
    console.log('🔑 API Key 狀況:')
    console.log('- 是否存在:', !!apiKey)
    console.log('- 長度:', apiKey?.length || 0)
    console.log('- 前 10 字元:', apiKey?.substring(0, 10) || '無')
    console.log('- 是否以 AIza 開頭:', apiKey?.startsWith('AIza') || false)
    
    if (!apiKey) {
      throw new Error('環境變數 VITE_GOOGLE_API_KEY 未設定')
    }
    
    if (apiKey.length < 35) {
      throw new Error('API Key 長度不正確，應該是 39 字元')
    }
    
    await loadGoogleMapsAPI()
    
    console.log('📋 檢查 API 載入狀況:')
    console.log('- window.google:', !!window.google)
    console.log('- window.google.maps:', !!window.google?.maps)
    console.log('- window.google.maps.Map:', !!window.google?.maps?.Map)
    console.log('- window.google.maps.Marker:', !!window.google?.maps?.Marker)
    console.log('- window.google.maps.Geocoder:', !!window.google?.maps?.Geocoder)
    
    // 等待一下再檢查，有時候需要時間初始化
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('📋 延遲 1 秒後再次檢查:')
    console.log('- window.google:', !!window.google)
    console.log('- window.google.maps:', !!window.google?.maps)
    console.log('- window.google.maps.Map:', !!window.google?.maps?.Map)
    
    // 確認 API 完全載入
    if (window.google && window.google.maps && window.google.maps.Map) {
      isMapLoaded.value = true
      console.log('✅ Google Maps API 載入成功')
    } else {
      throw new Error('Google Maps API 載入不完整 - 缺少必要的物件')
    }
  } catch (error) {
    console.error('❌ Google Maps API 載入失敗:', error)
    
    // 更詳細的錯誤資訊
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
    if (!apiKey) {
      toast.error('未設定 Google API Key，請檢查 .env 檔案中的 VITE_GOOGLE_API_KEY')
    } else if (apiKey.length < 30) {
      toast.error('Google API Key 格式可能不正確')
    } else {
      toast.error('地圖載入失敗，請檢查網路連線或 API 設定')
    }
    
    isMapLoaded.value = false
  }
})

// 監聽 show 變化，當彈窗開啟時初始化地圖
// 初始化地圖
const initMap = async () => {
  if (!isMapLoaded.value) {
    console.error('Google Maps API 尚未載入完成')
    toast.error('地圖還在載入中，請稍等...')
    return
  }

  // 檢查 Google Maps API 是否完全可用
  if (!window.google || !window.google.maps || !window.google.maps.Map) {
    console.error('Google Maps API 未正確載入')
    toast.error('地圖載入失敗，請重新嘗試')
    return
  }

  await nextTick() // 確保 DOM 已渲染
  
  const mapElement = document.getElementById('map')
  if (!mapElement) {
    console.error('找不到地圖容器')
    return
  }

  console.log('🗺️ 開始初始化地圖')

  try {
    // 建立地圖實例
    mapInstance.value = new window.google.maps.Map(mapElement, {
      ...DEFAULT_MAP_OPTIONS,
      center: props.initialCenter
    })

    console.log('🗺️ 地圖初始化成功')

    // 監聽地圖點擊事件
    mapInstance.value.addListener('click', handleMapClick)
  } catch (error) {
    console.error('地圖初始化失敗:', error)
    toast.error('地圖初始化失敗')
  }
}

// 處理地圖點擊事件
const handleMapClick = async (event) => {
  console.log('🗺️ 地圖被點擊')
  
  const lat = event.latLng.lat()
  const lng = event.latLng.lng()

  try {
    // 直接放置標記（這會自動清除舊的）
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
  console.log('📍 放置標記到新位置:', { lat, lng })
  
  // 強制清除所有標記
  clearAllMarkers()

  console.log('📍 建立新標記')
  
  try {
    // 建立新標記
    const newMarker = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstance.value,
      title: '選中的位置 (點擊可清除)',
      animation: window.google.maps.Animation.DROP
    })

    // 同時保存到兩個地方
    markerInstance.value = newMarker
    allMarkers.value = [newMarker] // 只保存當前的一個標記
    
    console.log('📍 新標記已建立，總標記數:', allMarkers.value.length)

    // 監聽標記點擊事件
    newMarker.addListener('click', (event) => {
      console.log('📍 點擊標記，準備清除所有標記')
      // 阻止事件冒泡
      if (event && event.stop) {
        event.stop()
      }
      
      // 清除標記和地址
      clearAllMarkers()
      selectedMapAddress.value = ''
      toast.info('已清除選擇')
    })

    // 將地圖中心移動到標記位置
    mapInstance.value.setCenter({ lat, lng })
    
  } catch (error) {
    console.error('標記建立失敗:', error)
    toast.error('無法放置地圖標記')
  }
}

// 溫和的清除標記方法
const clearAllMarkers = () => {
  console.log('🗑️ 開始溫和清除所有標記')
  
  // 方法1: 逐個清除並銷毀標記
  allMarkers.value.forEach((marker, index) => {
    if (marker) {
      try {
        // 移除所有事件監聽器
        window.google.maps.event.clearInstanceListeners(marker)
        // 從地圖移除
        marker.setMap(null)
        // 強制隱藏
        marker.setVisible(false)
        console.log(`🗑️ 已清除標記 ${index + 1}`)
      } catch (error) {
        console.error(`🗑️ 清除標記 ${index + 1} 失敗:`, error)
      }
    }
  })
  
  // 方法2: 清除主要參考
  if (markerInstance.value) {
    try {
      window.google.maps.event.clearInstanceListeners(markerInstance.value)
      markerInstance.value.setMap(null)
      markerInstance.value.setVisible(false)
      markerInstance.value = null
      console.log('🗑️ 已清除主要標記參考')
    } catch (error) {
      console.error('🗑️ 清除主要標記失敗:', error)
    }
  }
  
  // 清空陣列
  allMarkers.value = []
  
  // 方法3: 如果還是有殘留，強制刷新地圖視圖（不重建）
  if (mapInstance.value) {
    try {
      // 輕微移動地圖中心點，觸發重新渲染
      const center = mapInstance.value.getCenter()
      const lat = center.lat()
      const lng = center.lng()
      
      // 移動一個極小的距離，用戶感覺不到
      mapInstance.value.setCenter({
        lat: lat + 0.000001,
        lng: lng + 0.000001
      })
      
      // 立即移回原位
      setTimeout(() => {
        mapInstance.value.setCenter({ lat, lng })
      }, 10)
      
      console.log('🔄 已觸發地圖重新渲染')
    } catch (error) {
      console.error('🔄 地圖重新渲染失敗:', error)
    }
  }
  
  console.log('🗑️ 溫和清除完成，剩餘標記數:', allMarkers.value.length)
}

// 清除選擇（保留給清除按鈕使用）
const clearSelection = () => {
  console.log('🗑️ 手動清除選擇')
  clearAllMarkers()
  selectedMapAddress.value = ''
  toast.info('已清除選擇，點擊地圖重新選擇位置')
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
  console.log('🚪 關閉彈窗，清除所有標記')
  
  // 關閉時強制清除所有標記
  clearAllMarkers()
  selectedMapAddress.value = ''
  
  emit('close')
}

// 當組件顯示時初始化地圖（移除舊的函數）

// 監聽 show 變化，當彈窗開啟時初始化地圖
watch(() => props.show, async (newVal, oldVal) => {
  console.log('👀 Watch 觸發 - show 變化:', { 從: oldVal, 到: newVal })
  
  if (newVal && isMapLoaded.value) {
    console.log('🗺️ 彈窗開啟，準備初始化地圖')
    
    // 等待 DOM 渲染完成
    await nextTick()
    
    // 再次檢查容器是否存在
    const mapElement = document.getElementById('map')
    console.log('🔍 檢查地圖容器:', {
      存在: !!mapElement,
      顯示狀態: mapElement ? window.getComputedStyle(mapElement).display : '容器不存在'
    })
    
    setTimeout(() => {
      initMap()
    }, 300) // 給更多時間讓 Modal 完全顯示
  } else if (newVal && !isMapLoaded.value) {
    console.log('⚠️ 彈窗開啟但 Google Maps API 尚未載入')
  } else if (!newVal) {
    console.log('🚪 彈窗關閉')
  }
}, { immediate: true })
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
          class="w-full border rounded-lg h-80"
        ></div>
        
        <!-- 選中的地址顯示 -->
        <div 
          v-if="selectedMapAddress" 
          class="p-3 mt-3 rounded-lg bg-gray-50"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-xs text-gray-600">選中的地址：</p>
              <p class="text-sm font-medium truncate">{{ selectedMapAddress }}</p>
            </div>
            <button 
              @click="clearSelection"
              class="flex-shrink-0 px-2 py-1 ml-2 text-xs text-red-600 transition-colors border border-red-300 rounded hover:text-red-800 hover:bg-red-50"
            >
              清除
            </button>
          </div>
        </div>
        
        <!-- 說明文字 -->
        <p v-else class="mt-3 text-sm text-gray-500">
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