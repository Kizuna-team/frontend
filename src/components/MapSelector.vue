<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { useToast } from "vue-toastification";
import {
  loadGoogleMapsAPI,
  getAddressFromCoordinates,
} from "@/api/googleMapsApi";
import { DEFAULT_MAP_OPTIONS, GOOGLE_MAPS_CONFIG } from "@/config/googleMaps";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  initialCenter: {
    type: Object,
    default: () => ({ lat: 25.034, lng: 121.565 }),
  },
});

const emit = defineEmits(["addressSelected", "close"]);

const toast = useToast();
const selectedMapAddress = ref("");
const mapInstance = ref(null);
const currentMarker = ref(null);
const isMapLoaded = ref(false);
const searchInput = ref("");
const searchInputRef = ref(null);
const autocompleteInstance = ref(null);

onMounted(async () => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    if (!apiKey) {
      throw new Error("未設定 Google API Key");
    }

    await loadGoogleMapsAPI();

    if (!window.google?.maps?.Map) {
      throw new Error("Google Maps API 載入失敗");
    }

    isMapLoaded.value = true;
  } catch (error) {
    console.error("Google Maps API 載入失敗:", error);
    toast.error("地圖載入失敗，請檢查 API 設定");
    isMapLoaded.value = false;
  }
});

const initMap = async () => {
  if (!isMapLoaded.value) {
    toast.error("地圖還在載入中，請稍等...");
    return;
  }

  await nextTick();

  const mapElement = document.getElementById("map");
  if (!mapElement) {
    return;
  }

  try {
    mapInstance.value = new window.google.maps.Map(mapElement, {
      ...DEFAULT_MAP_OPTIONS,
      center: props.initialCenter,
    });

    mapInstance.value.addListener("click", handleMapClick);
    initSearchAutocomplete();
  } catch (error) {
    console.error("地圖初始化失敗:", error);
    toast.error("地圖初始化失敗");
  }
};

const initSearchAutocomplete = () => {
  if (!searchInputRef.value || !window.google?.maps?.places) return;

  try {
    autocompleteInstance.value = new google.maps.places.Autocomplete(
      searchInputRef.value,
      {
        componentRestrictions: { country: GOOGLE_MAPS_CONFIG.country },
        fields: ["formatted_address", "geometry"],
        types: ["establishment", "geocode"],
      }
    );

    autocompleteInstance.value.addListener("place_changed", handlePlaceSelect);
  } catch (error) {
    console.error("搜尋框 Autocomplete 初始化失敗:", error);
  }
};

const handlePlaceSelect = () => {
  const place = autocompleteInstance.value.getPlace();

  if (place.geometry && place.formatted_address) {
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    mapInstance.value.setCenter({ lat, lng });
    mapInstance.value.setZoom(16);

    placeMarker(lat, lng);

    selectedMapAddress.value = place.formatted_address;
    searchInput.value = place.formatted_address;

    toast.success("找到位置");
  }
};

const handleMapClick = async (event) => {
  const lat = event.latLng.lat();
  const lng = event.latLng.lng();

  try {
    placeMarker(lat, lng);

    const address = await getAddressFromCoordinates(lat, lng);
    selectedMapAddress.value = address;
  } catch (error) {
    console.error("取得地址失敗:", error);
    toast.error("無法取得該位置的地址");
  }
};

const placeMarker = (lat, lng) => {
  clearMarker();

  try {
    currentMarker.value = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstance.value,
      title: "選中的位置",
      animation: window.google.maps.Animation.DROP,
    });

    forceMapRefresh();

    mapInstance.value.setCenter({ lat, lng });
  } catch (error) {
    console.error("圖標建立失敗:", error);
    toast.error("無法放置地圖圖標");
  }
};

const clearMarker = () => {
  if (currentMarker.value) {
    try {
      window.google.maps.event.clearInstanceListeners(currentMarker.value);
      currentMarker.value.setMap(null);
      currentMarker.value.setVisible(false);
      currentMarker.value = null;
    } catch (error) {
      console.error("清除圖標失敗:", error);
    }
  }
};

const forceMapRefresh = () => {
  if (mapInstance.value) {
    try {
      const center = mapInstance.value.getCenter();
      const lat = center.lat();
      const lng = center.lng();

      // 移動極小距離觸發重新渲染
      mapInstance.value.setCenter({
        lat: lat + 0.000001,
        lng: lng + 0.000001,
      });
      // 立即移回原位
      setTimeout(() => {
        mapInstance.value.setCenter({ lat, lng });
      }, 10);
    } catch (error) {
      console.error("地圖重新渲染失敗:", error);
    }
  }
};

const clearSelection = () => {
  clearMarker();
  forceMapRefresh();
  selectedMapAddress.value = "";
  searchInput.value = "";
  if (searchInputRef.value) {
    searchInputRef.value.value = "";
  }
  toast.info("已清除選擇，點擊地圖重新選擇位置");
};

const confirmSelection = () => {
  if (selectedMapAddress.value) {
    emit("addressSelected", selectedMapAddress.value);
    toast.success("地址已選擇");
  }
};

const resetModalState = () => {
  clearMarker();
  selectedMapAddress.value = "";
  searchInput.value = "";
  if (searchInputRef.value) {
    searchInputRef.value.value = "";
  }
  
  if (autocompleteInstance.value) {
    google.maps.event.clearInstanceListeners(autocompleteInstance.value);
    autocompleteInstance.value = null;
  }
};

const closeModal = () => {
  resetModalState();
  emit("close");
};

watch(
  () => props.show,
  async (show) => {
    if (show && isMapLoaded.value) {
      await nextTick();
      setTimeout(initMap, 300);
    } else if (!show) {
      resetModalState();
    }
  }
);
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
  >
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
    >
      <div class="flex items-center justify-between p-6 border-b">
        <h3 class="text-lg font-semibold text-darkblue">選擇活動地點</h3>
        <button
          @click="closeModal"
          class="text-xl text-gray-500 transition-colors hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div class="p-6">
        <div class="relative mb-4">
          <input
            ref="searchInputRef"
            v-model="searchInput"
            @keydown.enter.prevent
            type="text"
            placeholder="搜尋地址或地點名稱..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#219ebc] focus:border-transparent outline-none"
          />
        </div>
        <div id="map" class="w-full border rounded-lg h-80"></div>

        <div v-if="selectedMapAddress" class="p-3 mt-3 rounded-lg bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-xs text-gray-600">選中的地址：</p>
              <p class="text-sm font-medium truncate">
                {{ selectedMapAddress }}
              </p>
            </div>
            <button
              @click="clearSelection"
              class="flex-shrink-0 px-2 py-1 ml-2 text-xs text-red-600 transition-colors border border-red-300 rounded hover:text-red-800 hover:bg-red-50"
            >
              清除
            </button>
          </div>
        </div>

        <p v-else class="mt-3 text-sm text-gray-500">
          搜尋地址（會自動顯示建議）或點擊地圖上的任意位置來選擇地點
        </p>
      </div>

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
