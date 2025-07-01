const GOOGLE_MAPS_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  libraries: ["places"],
  language: "zh-TW",
  region: "TW",
  country: "TW",
};

const DEFAULT_MAP_OPTIONS = {
  center: { lat: 25.034, lng: 121.565 },
  zoom: 15,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  zoomControl: true,
};

export { GOOGLE_MAPS_CONFIG, DEFAULT_MAP_OPTIONS };
