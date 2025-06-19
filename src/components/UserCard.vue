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
  <section class="flex flex-col items-center w-full gap-4 px-4 mb-6">
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
    <div class="flex flex-wrap justify-center gap-4">
      <div
        v-for="photo in props.targetPhotos"
        :key="photo"
        class="w-64 aspect-[3/4] rounded-xl overflow-hidden shadow-md bg-white"
      >
        <img
          :src="photo"
          alt="user photo"
          class="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>
    <!-- 下一輪按鈕 -->
    <button
      type="button"
      class="transition duration-300 bg-white border shadow-sm circle-wrap border-primary hover:bg-primary hover:text-white"
      @click="nextUser"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="4"
        stroke="currentColor"
        class="size-6"
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
