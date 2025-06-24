import { GOOGLE_MAPS_CONFIG } from '@/config/googleMaps'

// 全域變數追蹤載入狀態
let isLoading = false
let loadPromise = null

// 載入 Google Maps API
const loadGoogleMapsAPI = () => {
  // 如果已經載入完成，直接返回
  if (window.google && window.google.maps && window.google.maps.Map) {
    return Promise.resolve()
  }

  // 如果正在載入，返回相同的 Promise
  if (isLoading && loadPromise) {
    return loadPromise
  }

  // 檢查是否已經有 script 標籤
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
  if (existingScript) {
    console.log('Google Maps script 已存在，等待載入完成')
    return new Promise((resolve, reject) => {
      const checkLoaded = () => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          resolve()
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
    })
  }

  // 開始載入
  isLoading = true
  
  loadPromise = new Promise((resolve, reject) => {
    // 建立 script 標籤
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=${GOOGLE_MAPS_CONFIG.libraries.join(',')}&language=${GOOGLE_MAPS_CONFIG.language}&region=${GOOGLE_MAPS_CONFIG.region}&loading=async`
    script.async = true
    script.defer = true

    // 載入成功
    script.onload = () => {
      // 等待 API 完全初始化
      const checkReady = () => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          isLoading = false
          console.log('Google Maps API 載入並初始化完成')
          resolve()
        } else {
          setTimeout(checkReady, 50)
        }
      }
      checkReady()
    }

    // 載入失敗
    script.onerror = () => {
      isLoading = false
      loadPromise = null
      reject(new Error('Google Maps API 載入失敗'))
    }

    // 將 script 加入到頁面
    document.head.appendChild(script)
  })

  return loadPromise
}

// 將座標轉換為地址 (Geocoding)
const getAddressFromCoordinates = (lat, lng) => {
  return new Promise((resolve, reject) => {
    // 確保 API 已載入
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      reject(new Error('Google Maps API 尚未載入'))
      return
    }

    const geocoder = new google.maps.Geocoder()
    
    geocoder.geocode(
      { 
        location: { lat, lng },
        language: 'zh-TW'
      }, 
      (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const address = results[0].formatted_address
          resolve(address)
        } else {
          console.error('Geocoding 失敗:', status)
          reject(new Error('無法取得地址'))
        }
      }
    )
  })
}

export { loadGoogleMapsAPI, getAddressFromCoordinates }