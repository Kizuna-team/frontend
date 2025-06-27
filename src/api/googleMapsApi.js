import { GOOGLE_MAPS_CONFIG } from "@/config/googleMaps";

let isLoading = false;
let loadPromise = null;

const loadGoogleMapsAPI = () => {
  if (window.google && window.google.maps && window.google.maps.Map) {
    return Promise.resolve();
  }

  if (isLoading && loadPromise) {
    return loadPromise;
  }

  const existingScript = document.querySelector(
    'script[src*="maps.googleapis.com"]'
  );
  if (existingScript) {
    return new Promise((resolve, reject) => {
      const checkLoaded = () => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
    });
  }

  isLoading = true;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      GOOGLE_MAPS_CONFIG.apiKey
    }&libraries=${GOOGLE_MAPS_CONFIG.libraries.join(",")}&language=${
      GOOGLE_MAPS_CONFIG.language
    }&region=${GOOGLE_MAPS_CONFIG.region}&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      const checkReady = () => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          isLoading = false;
          resolve();
        } else {
          setTimeout(checkReady, 50);
        }
      };
      checkReady();
    };

    script.onerror = () => {
      isLoading = false;
      loadPromise = null;
      reject(new Error("Google Maps API 載入失敗"));
    };

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
        language: "zh-TW",
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
