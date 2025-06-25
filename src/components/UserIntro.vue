<script setup>
const { targetUser } = defineProps({
  targetUser: Object,
});
</script>

<template>
  <div
    v-if="targetUser"
    class="z-0 max-w-screen-sm p-6 mx-auto bg-white shadow-sm rounded-xl"
  >
    <!-- 基本資料 -->
    <div class="flex flex-wrap items-center gap-2 mb-4 sm:gap-3">
      <h3 class="text-xl font-bold sm:text-2xl text-darkblue">
        {{ targetUser.name }}
      </h3>
      <p class="text-base font-medium sm:text-lg text-secondary">
        {{ targetUser.age }} 歲
      </p>
      <p class="text-base text-gray-600 sm:text-lg">
        {{ targetUser.location }}
      </p>
    </div>

    <!-- 分隔線 -->
    <hr class="my-4 border-t-2 border-primary/60" />

    <!-- 關於我 -->
    <h4 class="section-title">關於我</h4>
    <div class="flex flex-wrap gap-2 mb-4">
      <span class="personal-tag">{{ targetUser.mbti }}</span>
      <span class="personal-tag">{{ targetUser.zodiac }}</span>
    </div>

    <!-- 專業領域 -->
    <h4 class="section-title">專業領域</h4>
    <div class="flex flex-wrap gap-2 mb-4">
      <span class="personal-tag">{{ targetUser.job }}</span>
    </div>

    <!-- 分隔線 -->
    <hr class="my-4 border-t-2 border-primary/60" />

    <!-- 自我介紹 -->
    <h4 class="section-title">自我介紹</h4>
    <p
      class="text-sm leading-relaxed text-gray-700 whitespace-pre-line sm:text-base"
    >
      {{ targetUser.bio }}
    </p>
  </div>
</template>

<style scoped>
.section-title {
  @apply text-lg sm:text-xl font-semibold text-darkblue mb-2;
}

.personal-tag {
  @apply inline-block text-sm sm:text-base font-medium text-white bg-darkblue px-3 py-1 rounded-full;
}
</style>
