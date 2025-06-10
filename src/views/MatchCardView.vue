<script>
import { ref } from "vue";
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";

export default {
  components: { DotLottieVue },
  setup() {
    const allCards = ref([
      { id: 1, image: "matchCard1.jpg" },
      { id: 2, image: "matchCard2.jpg" },
      { id: 3, image: "matchCard3.jpg" },
      { id: 4, image: "matchCard4.jpg" },
      { id: 5, image: "matchCard5.jpg" },
      { id: 6, image: "matchCard6.jpg" },
      { id: 7, image: "matchCard7.jpg" },
    ]);

    const visibleCards = ref([...allCards.value]);
    const activeIndex = ref(null);
    const offsetX = ref(0);
    const isDragging = ref(false);
    const showLikeAnimation = ref(false);
    const showDislikeAnimation = ref(false);

    const onAnimationComplete = () => {
      showLikeAnimation.value = false;
    };

    const startDrag = (event, index) => {
      event.preventDefault();
      activeIndex.value = index;
      offsetX.value = 0;
      isDragging.value = true;

      const cardEl = event.currentTarget;
      const pointerId = event.pointerId;
      cardEl.setPointerCapture(pointerId);
      const initialX = event.clientX;

      const onMove = (moveEvent) => {
        if (!isDragging.value) return;
        offsetX.value = moveEvent.clientX - initialX;
      };

      const releaseCard = (direction) => {
        // 播動畫
        if (direction === 1) {
          showLikeAnimation.value = true;
        } else {
          showDislikeAnimation.value = true;
        }

        isDragging.value = false;

        setTimeout(() => {
          visibleCards.value.splice(activeIndex.value, 1);
          activeIndex.value = null;
          offsetX.value = 0;

          // 隱藏動畫（動畫時間約 800ms 可依實際調整）
          showLikeAnimation.value = false;
          showDislikeAnimation.value = false;
        }, 800);
      };

      const onEnd = () => {
        cardEl.releasePointerCapture(pointerId);
        const threshold = 80;
        if (Math.abs(offsetX.value) > threshold) {
          const direction = offsetX.value > 0 ? 1 : -1;
          if (direction === 1) {
            showLikeAnimation.value = true;
            setTimeout(() => {
              releaseCard(direction);
            }, 300);
          } else {
            showDislikeAnimation.value = true;
            setTimeout(() => {
              releaseCard(direction);
            }, 300);
          }
        } else {
          isDragging.value = false;
          offsetX.value = 0;
          activeIndex.value = null;
        }
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onCancel);
      };

      const onCancel = () => {
        cardEl.releasePointerCapture(pointerId);
        isDragging.value = false;
        offsetX.value = 0;
        activeIndex.value = null;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onCancel);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onCancel);
    };

    const cardStyle = (index) => {
      if (activeIndex.value === index) {
        return {
          transform: `translateX(${offsetX.value}px) rotate(${
            offsetX.value / 10
          }deg)`,
          opacity: 1 - Math.min(Math.abs(offsetX.value) / 300, 1),
          transition: isDragging.value ? "none" : "0.5s ease-out",
          zIndex: visibleCards.value.length - index,
        };
      } else {
        return {
          transform: `translate(${index % 2 === 0 ? "-10px" : "10px"}, ${
            index * 6
          }px) rotate(${index % 2 === 0 ? "-2deg" : "2deg"})`,
          transition: "0.5s ease-out",
          zIndex: visibleCards.value.length - index,
        };
      }
    };

    return {
      visibleCards,
      activeIndex,
      offsetX,
      isDragging,
      showLikeAnimation,
      showDislikeAnimation,
      startDrag,
      cardStyle,
      onAnimationComplete,
    };
  },
};
</script>

<template>
  <div
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-[520px] select-none"
  >
    <!-- 卡片 -->
    <div
      v-for="(card, index) in visibleCards"
      :key="card.id"
      class="absolute w-full h-full rounded-[20px] bg-white shadow-md flex items-center justify-center cursor-grab"
      :style="cardStyle(index)"
      @pointerdown="startDrag($event, index)"
    >
      <img
        :src="`/matchCard/${card.image}`"
        class="w-full h-full object-cover rounded-[20px] pointer-events-none"
        draggable="false"
      />
    </div>

    <!-- 喜歡動畫（右滑） -->
    <DotLottieVue
      v-if="showLikeAnimation"
      autoplay
      loop="false"
      class="absolute z-50 pointer-events-none"
      style="
        width: 80%;
        height: 80%;
        /* top: 20%; */
        left: 50%;
        transform: translateX(-50%);
      "
      src="https://lottie.host/cbc45ccd-9052-4345-a7ed-a06054e3c59a/80ofaH0avC.lottie"
    />

    <!-- 不喜歡動畫（左滑） -->
    <DotLottieVue
      v-if="showDislikeAnimation"
      autoplay
      loop="false"
      class="absolute z-50 pointer-events-none"
      style="
        width: 30%;
        height: 30%;
        top: 25%;
        left: 50%;
        transform: translateX(-50%);
      "
      src="https://lottie.host/d1683488-202e-4128-9001-b9592d93aaad/zoqyNJxq9B.lottie"
    />

    <p v-if="visibleCards.length === 0" class="mt-5 text-center text-gray-500">
      今日滑滑次數已達上限！
    </p>
  </div>
</template>
