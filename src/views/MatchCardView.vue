<template>
  <div class="card-container">
    <div
      v-for="(card, index) in visibleCards"
      :key="card.id"
      class="card"
      :style="cardStyle(index)"
      @pointerdown="startDrag($event, index)"
    >
      <img
        :src="`/matchCard/${card.image}`"
        class="card-image"
        draggable="false"
      />
    </div>

    <!-- 右滑的 Lottie 動畫效果 -->
    <DotLottieVue
      v-if="showLikeAnimation"
      class="like-animation"
      style="height: 200px; width: 200px"
      autoplay
      loop
      src="https://path-to-lottie.lottie"
    />

    <p v-if="visibleCards.length === 0" class="mt-5 text-center text-gray-500">
      卡片已用完 🎉
    </p>
  </div>
</template>

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
      // 更多卡片……
    ]);

    const visibleCards = ref([...allCards.value]);
    const activeIndex = ref(null);
    const offsetX = ref(0);
    const isDragging = ref(false);
    const showLikeAnimation = ref(false);

    const startDrag = (event, index) => {
      event.preventDefault(); // 阻止預設拖曳行為
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
        offsetX.value = direction * 1000; // 飛出螢幕的距離
        isDragging.value = false;
        setTimeout(() => {
          visibleCards.value.splice(index, 1);
          activeIndex.value = null;
          offsetX.value = 0;
          showLikeAnimation.value = false;
        }, 500); // 500ms 的飛出動畫
      };

      const onEnd = () => {
        cardEl.releasePointerCapture(pointerId);
        const threshold = 80; // 降低滑動換卡的閥值
        if (Math.abs(offsetX.value) > threshold) {
          const direction = offsetX.value > 0 ? 1 : -1;
          if (direction === 1) {
            showLikeAnimation.value = true;
          }
          releaseCard(direction);
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
      startDrag,
      cardStyle,
    };
  },
};
</script>

<style scoped>
.card-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 520px;
  user-select: none; /* 禁止選取 */
}
.card {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
}
.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  pointer-events: none; /* 防止圖片自身拖曳 */
}
.like-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
