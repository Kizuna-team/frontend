<script setup>
import { ref } from "vue";
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";

const CARDS = [
  { id: 1, image: "matchCard1.jpg" },
  { id: 2, image: "matchCard2.jpg" },
  { id: 3, image: "matchCard3.jpg" },
  { id: 4, image: "matchCard4.jpg" },
  { id: 5, image: "matchCard5.jpg" },
  { id: 6, image: "matchCard6.jpg" },
  { id: 7, image: "matchCard7.jpg" },
];

const THRESHOLD = 80;
const ANIM_DURATION = 1500;
const SWIPE_DELAY = 300;

const visibleCards = ref(CARDS.slice());
const activeIndex = ref(null);
const offsetX = ref(0);
const isDragging = ref(false);

// 合併動畫
const showAnimation = ref(false);
const animationSrc = ref("");
const LIKE_SRC =
  "https://lottie.host/f6ac6a5b-4442-4209-ae5f-ee63f71bfb0b/DpgWdcYku3.lottie";
const DISLIKE_SRC =
  "https://lottie.host/34f23395-87b6-4ad5-ad39-50c969768d5f/wHBwQ1NtUR.lottie";

const onAnimationComplete = () => {
  showAnimation.value = false;
};

function startDrag(evt, idx) {
  evt.preventDefault();
  activeIndex.value = idx;
  offsetX.value = 0;
  isDragging.value = true;

  const el = evt.currentTarget;
  const pid = evt.pointerId;
  el.setPointerCapture(pid);
  const startX = evt.clientX;

  // handlers
  const onMove = (e) => {
    if (isDragging.value) offsetX.value = e.clientX - startX;
  };
  const onEnd = () => {
    el.releasePointerCapture(pid);
    const dir = offsetX.value > 0 ? 1 : -1;
    if (Math.abs(offsetX.value) > THRESHOLD) {
      // 觸發動畫
      animationSrc.value = dir > 0 ? LIKE_SRC : DISLIKE_SRC;
      showAnimation.value = true;
      setTimeout(() => releaseCard(dir), SWIPE_DELAY);
    } else {
      resetDrag();
    }
    cleanup();
  };
  const onCancel = () => {
    resetDrag();
    cleanup();
  };

  // 綁 listener
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onEnd);
  window.addEventListener("pointercancel", onCancel);

  function cleanup() {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onEnd);
    window.removeEventListener("pointercancel", onCancel);
  }
}

function releaseCard(direction) {
  isDragging.value = false;
  setTimeout(() => {
    visibleCards.value.splice(activeIndex.value, 1);
    activeIndex.value = null;
    offsetX.value = 0;
    showAnimation.value = false;
  }, ANIM_DURATION - SWIPE_DELAY);
}

function resetDrag() {
  isDragging.value = false;
  offsetX.value = 0;
  activeIndex.value = null;
}

function cardStyle(i) {
  const z = visibleCards.value.length - i;
  if (activeIndex.value === i) {
    return {
      transform: `translateX(${offsetX.value}px) rotate(${
        offsetX.value / 10
      }deg)`,
      opacity: 1 - Math.min(Math.abs(offsetX.value) / 300, 1),
      transition: isDragging.value ? "none" : "0.5s ease-out",
      zIndex: z,
    };
  }
  const tilt = i % 2 === 0 ? -2 : 2;
  const xOff = i % 2 === 0 ? "-10px" : "10px";
  return {
    transform: `translate(${xOff}, ${i * 6}px) rotate(${tilt}deg)`,
    transition: "0.5s ease-out",
    zIndex: z,
  };
}
</script>

<template>
  <div class="absolute inset-0 flex items-center justify-center select-none">
    <div class="relative w-80 h-[520px]">
      <!-- 卡片堆疊 -->
      <div
        v-for="(card, i) in visibleCards"
        :key="card.id"
        class="absolute inset-0 rounded-[20px] bg-white shadow-md flex items-center justify-center cursor-grab"
        :style="cardStyle(i)"
        @pointerdown="startDrag($event, i)"
      >
        <img
          :src="`/matchCard/${card.image}`"
          class="w-full h-full object-cover rounded-[20px] pointer-events-none"
          draggable="false"
        />
      </div>

      <!-- 合併後的 Lottie 動畫 -->
      <DotLottieVue
        v-if="showAnimation"
        :autoplay="true"
        :loop="false"
        @complete="onAnimationComplete"
        class="absolute inset-0 m-auto pointer-events-none"
        style="width: 60%; height: 60%; z-index: 9999"
        :src="animationSrc"
      />

      <p v-if="!visibleCards.length" class="mt-4 text-center text-gray-500">
        今日滑滑次數已達上限！
      </p>
    </div>
  </div>
</template>
