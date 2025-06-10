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

      <!-- 喜歡 / 不喜歡標記 -->
      <div
        v-if="activeIndex === index"
        class="absolute text-4xl font-bold top-5"
        :class="{
          'text-green-500 right-5': offsetX > 50,
          'text-red-500 left-5': offsetX < -50,
        }"
      >
        {{ offsetX > 50 ? "✅" : offsetX < -50 ? "❌" : "" }}
      </div>
    </div>

    <p v-if="visibleCards.length === 0" class="mt-5 text-center text-gray-500">
      卡片已用完 🎉
    </p>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    // 假設卡片資料，依序堆疊
    const allCards = ref([
      { id: 1, image: "matchCard1.jpg" },
      { id: 2, image: "matchCard2.jpg" },
      { id: 3, image: "matchCard3.jpg" },
      { id: 4, image: "matchCard4.jpg" },
      { id: 5, image: "matchCard5.jpg" },
    ]);

    const visibleCards = ref([...allCards.value]);
    const activeIndex = ref(null);
    const offsetX = ref(0);
    const isDragging = ref(false);

    const startDrag = (event, index) => {
      activeIndex.value = index;
      offsetX.value = 0;
      isDragging.value = true;

      const onMove = (moveEvent) => {
        if (!isDragging.value) return;
        // 計算拖曳偏移量
        offsetX.value = moveEvent.clientX - event.clientX;
      };

      const onEnd = () => {
        const threshold = 150; // 滑動超過 150px 後觸發飛出動畫
        if (Math.abs(offsetX.value) > threshold) {
          const direction = offsetX.value > 0 ? 1 : -1;
          // 設定偏移到螢幕外 (例如 1000px)
          offsetX.value = direction * 1000;
          isDragging.value = false;
          // 等待動畫結束後再移除該卡片
          setTimeout(() => {
            visibleCards.value.splice(index, 1);
            activeIndex.value = null;
            offsetX.value = 0;
          }, 400);
        } else {
          // 未達閾值則回彈
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
      // 如果是正在拖曳的卡片，應用拖曳的 transform
      if (activeIndex.value === index) {
        return {
          transform: `translateX(${offsetX.value}px) rotate(${
            offsetX.value / 10
          }deg)`,
          opacity: 1 - Math.min(Math.abs(offsetX.value) / 300, 1),
          transition: isDragging.value ? "none" : "0.4s ease-out",
          zIndex: visibleCards.value.length - index,
        };
      } else {
        // 其餘卡片，採用疊加效果（輕微上下偏移、旋轉與縮放）
        return {
          transform: `translate(0, ${index * 8}px) rotate(${
            index % 2 === 0 ? -5 : 5
          }deg) scale(${1 - index * 0.05})`,
          transition: "0.4s ease-out",
          zIndex: visibleCards.value.length - index,
        };
      }
    };

    return {
      visibleCards,
      activeIndex,
      offsetX,
      isDragging,
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
</style>
