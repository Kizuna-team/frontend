<script setup>
const props = defineProps({
  targetPhotos: {
    type: Array,
    required: true,
  },
});

// 純展示 + emit 事件 | 上一位下一位
const emit = defineEmits(["goPrev", "goNext"]);
const prevUser = () => emit("goPrev");
const nextUser = () => emit("goNext");
</script>

<template>
  <section class="flex items-center gap-3 p-2 mb-4">
    <!-- 上一輪按鈕 -->
    <button type="button" @click="prevUser" class="circle-wrap bg-[#f8f9fa]">
      <div class="left-arrow transform -translate-x-[2px]"></div>
    </button>
    <!-- 使用者卡片區 -->
    <div class="flex flex-wrap gap-3">
      <div
        v-for="photo in props.targetPhotos"
        :key="photo"
        class="aspect-[3/4] bg-white rounded-lg shadow p-2 w-64 overflow-hidden"
      >
        <img
          :src="photo"
          alt="avatar"
          class="object-cover w-full h-full rounded"
        />
      </div>
    </div>
    <!-- 下一輪按鈕 -->
    <button type="button" class="circle-wrap bg-[#f8f9fa]" @click="nextUser">
      <div class="right-arrow transform translate-x-[2px]"></div>
    </button>
  </section>
</template>

<style scoped lang="postcss">
.left-arrow {
  width: 0;
  height: 0;
  border-top: 0.6rem solid transparent;
  border-bottom: 0.6rem solid transparent;
  border-right: 1.4rem solid #2c3e50;
}
.right-arrow {
  width: 0;
  height: 0;
  border-top: 0.6rem solid transparent;
  border-bottom: 0.6rem solid transparent;
  border-left: 1.4rem solid #2c3e50;
}
.circle-wrap {
  /* 記得class另外補上背景色 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
