<template>
  <div class="card-container">
    <div
      v-for="(card, index) in visibleCards"
      :key="card.id"
      class="card"
      :style="cardStyle(index)"
      @pointerdown="startDrag($event, index)"
    >
      <img :src="`/matchCard/${card.image}`" class="card-image" />
    </div>

    <!-- 右滑喜歡時的 Lottie 動畫效果，居中顯示 -->
    <DotLottieVue
      v-if="showLikeAnimation"
      class="like-animation"
      style="height: 500px; width: 500px"
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
    // 假設有多張卡片供使用
    const allCards = ref([
      { id: 1, image: "matchCard1.jpg" },
      { id: 2, image: "matchCard2.jpg" },
      { id: 3, image: "matchCard3.jpg" },
      { id: 4, image: "matchCard4.jpg" },
      { id: 5, image: "matchCard5.jpg" },
      // 可依需求持續新增
    ]);

    const visibleCards = ref([...allCards.value]);
    const activeIndex = ref(null);
    const offsetX = ref(0);
    const isDragging = ref(false);
    const showLikeAnimation = ref(false);

    const startDrag = (event, index) => {
      activeIndex.value = index;
      offsetX.value = 0;
      isDragging.value = true;

      const onMove = (moveEvent) => {
        if (!isDragging.value) return;
        offsetX.value = moveEvent.clientX - event.clientX;
      };

      const onEnd = () => {
        const threshold = 80; // 降低滑動換卡的閾值
        if (Math.abs(offsetX.value) > threshold) {
          const direction = offsetX.value > 0 ? 1 : -1;
          // 若為右滑（正方向），則觸發喜歡動畫
          if (direction === 1) {
            showLikeAnimation.value = true;
          }
          // 將卡片飛出螢幕
          offsetX.value = direction * 1000;
          isDragging.value = false;
          // 等待飛出動畫完成後移除卡片，同時隱藏動畫
          setTimeout(() => {
            visibleCards.value.splice(index, 1);
            activeIndex.value = null;
            offsetX.value = 0;
            showLikeAnimation.value = false;
          }, 300);
        } else {
          // 未達閾值則回彈到原點
          isDragging.value = false;
          offsetX.value = 0;
          activeIndex.value = null;
        }
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onEnd);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onEnd);
    };

    const cardStyle = (index) => {
      // 正在拖曳的卡片使用使用者的 offset 與旋轉動畫
      if (activeIndex.value === index) {
        return {
          transform: `translateX(${offsetX.value}px) rotate(${
            offsetX.value / 10
          }deg)`,
          opacity: 1 - Math.min(Math.abs(offsetX.value) / 300, 1),
          transition: isDragging.value ? "none" : "0.3s ease-out",
          zIndex: visibleCards.value.length - index,
        };
      } else {
        // 非拖曳時，卡片呈現輕微堆疊與旋轉效果
        return {
          transform: `translate(${index % 2 === 0 ? "-10px" : "10px"}, ${
            index * 6
          }px) rotate(${index % 2 === 0 ? "-2deg" : "2deg"})`,
          transition: "0.3s ease-out",
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
  /* 使容器置中 */
  transform: translate(-50%, -50%);
  width: 320px;
  height: 520px;
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
}

.like-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* 可根據需求調整尺寸 */
}
</style>
