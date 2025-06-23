const GOOGLE_MAPS_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  libraries: ['places'],
  language: 'zh-TW',
  region: 'TW'
}

const DEFAULT_MAP_OPTIONS = {
  center: { lat: 25.034, lng: 121.565 }, // 台北101 座標
  zoom: 15,              // 縮放層級
  mapTypeControl: false, // 隱藏地圖類型控制項
  streetViewControl: false, // 隱藏街景控制項
  fullscreenControl: true,  // 顯示全螢幕按鈕
  zoomControl: true      // 顯示縮放按鈕
}

export { GOOGLE_MAPS_CONFIG, DEFAULT_MAP_OPTIONS }