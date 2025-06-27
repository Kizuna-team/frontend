<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";

import { ref } from "vue";

const props = defineProps({
  targetPhotos: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["goNext"]);
const selectedPhoto = ref(null);

const openPreview = (photo) => {
  selectedPhoto.value = photo;
};

const closePreview = () => {
  selectedPhoto.value = null;
};

const nextUser = () => {
  emit("goNext");
};
</script>

<template>
  <section class="flex items-center gap-3 p-2 mb-4 animate-cardIn">
    <Swiper
      :modules="[EffectCards]"
      effect="cards"
      grabCursor
      class="w-[250px] h-[340px] mx-auto rounded-2xl shadow-xl"
    >
      <SwiperSlide
        v-for="photo in props.targetPhotos"
        :key="photo.image_url"
        class="overflow-hidden cursor-pointer rounded-2xl"
        @click="openPreview(photo.image_url)"
      >
        <img
          :src="photo.image_url"
          alt="User Photo"
          class="object-cover w-full h-full"
        />
      </SwiperSlide>
    </Swiper>

    <button
      type="button"
      class="absolute z-20 -translate-y-1/2 border border-white rounded-full shadow-md top-1/2 right-6 bg-white/60 backdrop-blur-sm circle-wrap hover:scale-110"
      @click="nextUser"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="3"
        stroke="currentColor"
        class="w-5 h-5 text-primary"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>

    <Teleport to="body">
      <div
        v-if="selectedPhoto"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click.self="closePreview"
      >
        <div class="relative max-w-[90vw] max-h-[90vh]">
          <img
            :src="selectedPhoto"
            alt="預覽圖片"
            class="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
          />
          <button
            class="absolute w-8 h-8 text-white rounded-full top-3 right-3 bg-black/30 hover:bg-black/50 backdrop-blur"
            @click.stop="closePreview"
          >
            ✕
          </button>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.circle-wrap {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
}

@keyframes cardIn {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-cardIn {
  animation: cardIn 0.4s ease-out both;
}
</style>
