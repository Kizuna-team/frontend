<script setup>
// 抓父層傳來的 currentUser
defineProps({
  targetUser: Object,
});
</script>

<template>
  <div class="bg-[#fff3cd] -mt-5 relative z-0 p-5">
    <div class="flex items-center">
      <h3>{{ targetUser.name }}</h3>
      <p class="text-2xl font-semibold mx-2 text-[#ffb485]">
        {{ targetUser.age }}歲
      </p>
      <p class="text-2xl font-semibold">{{ targetUser.location }}</p>
    </div>

    <hr class="my-2" />
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
    <hr class="my-2" />
    <h4>自我介紹</h4>
    <p class="text-[#2c3e50]">
      {{ targetUser.bio }}
    </p>
  </div>
</template>

<style scoped>
h3 {
  @apply text-2xl my-2 font-semibold text-[#2c3e50];
}

h4 {
  @apply text-xl my-2 font-semibold text-[#2c3e50];
}

.personal-tag {
  @apply font-semibold mx-1 text-white text-base bg-[#C0D7EC] px-3 py-1 rounded-s my-1;
}
</style>
