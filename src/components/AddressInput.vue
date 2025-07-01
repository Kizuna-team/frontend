<script setup>
import { ref, onMounted, nextTick } from "vue";
import MapSelector from "./MapSelector.vue";
import { loadGoogleMapsAPI } from "@/api/googleMapsApi";
import { GOOGLE_MAPS_CONFIG } from "@/config/googleMaps";

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const showMapModal = ref(false);
const inputRef = ref(null);
const autocompleteInstance = ref(null);

onMounted(async () => {
  try {
    await loadGoogleMapsAPI();
    if (window.google?.maps?.places) {
      await nextTick();
      initAutocomplete();
    }
  } catch (error) {
    console.error("Places API 載入失敗:", error);
  }
});

const initAutocomplete = () => {
  if (!inputRef.value) return;

  try {
    autocompleteInstance.value = new google.maps.places.Autocomplete(
      inputRef.value,
      {
        componentRestrictions: { country: GOOGLE_MAPS_CONFIG.country },
        fields: ["formatted_address"], // 簡化：只要地址，不要 geometry
        types: ["establishment", "geocode"],
      }
    );

    autocompleteInstance.value.addListener("place_changed", handlePlaceSelect);
  } catch (error) {
    console.error("Autocomplete 初始化失敗:", error);
  }
};

const handlePlaceSelect = () => {
  const place = autocompleteInstance.value.getPlace();

  if (place.formatted_address) {
    emit("update:modelValue", place.formatted_address);
  }
};

const handleInput = (event) => {
  emit("update:modelValue", event.target.value);
};

const openMapSelector = () => {
  showMapModal.value = true;
};

const handleAddressSelected = (address) => {
  emit("update:modelValue", address);
  showMapModal.value = false;
};

const closeMapModal = () => {
  showMapModal.value = false;
};
</script>

<template>
  <div>
    <div class="flex flex-col gap-2 sm:flex-row">
      <input
        ref="inputRef"
        id="location"
        :value="modelValue"
        @input="handleInput"
        placeholder="請輸入活動地點，會自動顯示建議"
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:text-secondary"
      />
      <button
        @click="openMapSelector"
        type="button"
        class="w-full sm:w-auto px-3 py-2 bg-[#219ebc] text-white rounded hover:bg-[#1a8ba3] transition-colors whitespace-nowrap text-sm shrink-0"
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
