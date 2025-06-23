// api/googleMapsApi.js
import { GOOGLE_MAPS_CONFIG } from '@/config/googleMaps'

// 載入 Google Maps API
const loadGoogleMapsAPI = () => {
  return new Promise((resolve, reject) => {
    // 檢查是否已經載入
    if (window.google && window.google.maps) {
      resolve()
      return
    }

    // 建立 script 標籤
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=${GOOGLE_MAPS_CONFIG.libraries.join(',')}&language=${GOOGLE_MAPS_CONFIG.language}&region=${GOOGLE_MAPS_CONFIG.region}`
    script.async = true
    script.defer = true

    // 載入成功
    script.onload = () => {
      resolve()
    }

    // 載入失敗
    script.onerror = () => {
      reject(new Error('Google Maps API 載入失敗'))
    }

    // 將 script 加入到頁面
    document.head.appendChild(script)
  })
}

// 將座標轉換為地址 (Geocoding)
const getAddressFromCoordinates = (lat, lng) => {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder()
    
    geocoder.geocode(
      { 
        location: { lat, lng },
        language: 'zh-TW'  // 確保回傳中文地址
      }, 
      (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          // 取得格式化的地址
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

// 將地址轉換為座標 (可選功能)
const getCoordinatesFromAddress = (address) => {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder()
    
    geocoder.geocode(
      { 
        address: address,
        region: 'TW'  // 優先搜尋台灣地區
      }, 
      (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const location = results[0].geometry.location
          resolve({
            lat: location.lat(),
            lng: location.lng()
          })
        } else {
          console.error('地址轉座標失敗:', status)
          reject(new Error('無法找到該地址'))
        }
      }
    )
  })
}

export { loadGoogleMapsAPI, getAddressFromCoordinates, getCoordinatesFromAddress }