<script setup>
// 抓父層傳來的 currentUser
const { targetUser } = defineProps({
  targetUser: Object,
});

console.log("UserIntro props:", targetUser);
</script>

<template>
  <div v-if="targetUser" class="bg-[#FFF] z-0 p-5">
    <div class="flex items-center">
      <h3>{{ targetUser.name }}</h3>
      <p class="text-2xl font-semibold mx-2 text-[#219ebc]">
        {{ targetUser.age }}歲
      </p>
      <p class="text-2xl font-semibold">{{ targetUser.location }}</p>
    </div>

    <hr />
    <h4 class="">關於我</h4>
    <span class="personal-tag">
      {{ targetUser.mbti }}
    </span>
    <span class="personal-tag">
      {{ targetUser.zodiac }}
    </span>
    <h4>興趣</h4>
    <span
      v-for="interest in targetUser.interests"
      :key="interest"
      class="personal-tag"
    >
      {{ interest }}
    </span>
    <hr />
    <h4>自我介紹</h4>
    <p class="text-[#2c3e50]">
      {{ targetUser.bio }}
    </p>
  </div>
</template>

<style scoped>
hr {
  @apply my-4 border-t-4 border-primary-200 opacity-70;
}
h3 {
  @apply text-2xl my-2 font-semibold text-[#023047];
}

h4 {
  @apply text-xl my-4 font-semibold text-[#023047];
}

.personal-tag {
  @apply font-semibold mx-1 text-white text-base bg-[#023047] px-3 py-1 rounded-s my-3;
}
</style>
