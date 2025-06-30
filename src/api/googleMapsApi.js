import { GOOGLE_MAPS_CONFIG } from "@/config/googleMaps";

// 全域變數追蹤載入狀態
let loadPromise = null;

const loadGoogleMapsAPI = () => {
  if (window.google && window.google.maps && window.google.maps.Map) {
    return Promise.resolve();
  }

  // 如果正在載入，返回相同的 Promise
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    // 建立 script 標籤
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      GOOGLE_MAPS_CONFIG.apiKey
    }&libraries=${GOOGLE_MAPS_CONFIG.libraries.join(",")}&language=${
      GOOGLE_MAPS_CONFIG.language
    }&region=${GOOGLE_MAPS_CONFIG.region}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      const checkReady = () => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          resolve();
        } else {
          setTimeout(checkReady, 50);
        }
      };
      checkReady();
    };

    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Google Maps API 載入失敗"));
    };
    // 將 script 加入到頁面
    document.head.appendChild(script);
  });

  return loadPromise;
};

const getAddressFromCoordinates = (lat, lng) => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      reject(new Error("Google Maps API 尚未載入"));
      return;
    }

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode(
      {
        location: { lat, lng },
      },
      (results, status) => {
        if (status === "OK" && results && results.length > 0) {
          const address = results[0].formatted_address;
          resolve(address);
        } else {
          console.error("Geocoding 失敗:", status);
          reject(new Error("無法取得地址"));
        }
      }
    );
  });
};

export { loadGoogleMapsAPI, getAddressFromCoordinates };
