<script setup>
const props = defineProps({
  targetPhotos: {
    type: Array,
    required: true,
  },
});

// 純展示 + emit 事件 | 上一位下一位
const emit = defineEmits(["goPrev", "goNext"]);
// const prevUser = () => emit("goPrev");
const nextUser = () => emit("goNext");
</script>

<template>
  <section class="flex items-center gap-3 p-2 mb-4">
    <!-- 上一輪按鈕 -->
    <!-- <button
      type="button"
      class="bg-gray-200 bg-opacity-50 circle-wrap hover:bg-white hover:shadow-lg"
      @click="prevUser"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="4"
        stroke="currentColor"
        class="size-6 text-primary"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
    </button>
     -->
    <!-- 使用者卡片區 -->
    <div class="flex flex-wrap justify-center gap-3">
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
    <button
      type="button"
      class="bg-gray-200 bg-opacity-50 circle-wrap hover:bg-white hover:shadow-lg"
      @click="nextUser"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="4"
        stroke="currentColor"
        class="size-6 text-primary"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>
  </section>
</template>

<style scoped>
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
