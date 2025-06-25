<script setup>
const { targetUser } = defineProps({
  targetUser: Object,
  isVisible: Boolean,
});

// 新增：檢查是否有值的輔助函數
const hasValue = (value) => {
  return value && value !== "" && value !== null && value !== undefined;
};

// 新增：檢查是否有任何關於我的資訊
const hasAboutMeInfo = (user) => {
  return hasValue(user?.mbti) || hasValue(user?.zodiac);
};

// 新增：檢查是否有專業領域資訊
const hasProfessionalInfo = (user) => {
  return hasValue(user?.job);
};
</script>

<template>
  <div class="user-intro-wrapper">
    <div v-if="targetUser " class="bg-[#FFF] z-0 p-5 info-card">
      <div class="flex items-center">
        <h3>{{ targetUser.name }}</h3>
        <p class="text-[18px] font-semibold mx-2 text-[#219ebc]">
          {{ targetUser.age }}歲
        </p>
        <p class="text-2xl font-semibold">{{ targetUser.location }}</p>
      </div>
    </div>

    <div v-if="hasAboutMeInfo(targetUser)" class="info-card">
      <h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-6"
        >
          <path
            fill-rule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            clip-rule="evenodd"
          />
        </svg>
        關於我
      </h4>
      <span v-if="hasValue(targetUser.mbti)" class="personal-tag">
        {{ targetUser.mbti }}
      </span>
      <span v-if="hasValue(targetUser.zodiac)" class="personal-tag">
        {{ targetUser.zodiac }}
      </span>
    </div>

    <div v-if="hasProfessionalInfo(targetUser)" class="info-card">
      <h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-6"
        >
          <path
            fill-rule="evenodd"
            d="M12 6.75a5.25 5.25 0 0 1 6.775-5.025.75.75 0 0 1 .313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 0 1 1.248.313 5.25 5.25 0 0 1-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 1 1 2.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0 1 12 6.75ZM4.117 19.125a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
            clip-rule="evenodd"
          /></svg
        >專業領域
      </h4>
      <span v-if="hasValue(targetUser.job)" class="personal-tag">
        {{ targetUser.job }}
      </span>
    </div>

    <div v-if="targetUser" class="info-card">
      <h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-6"
        >
          <path
            fill-rule="evenodd"
            d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z"
            clip-rule="evenodd"
          />
        </svg>
        自我介紹
      </h4>
      <p class="text-[#2c3e50] text-[16px]">
        {{ targetUser.bio }}
      </p>
    </div>
  </div>
</template>

<style scoped>
hr {
  @apply my-4 border-t-4 border-primary opacity-70;
}
h3 {
  @apply text-2xl my-2 font-semibold text-[#023047] flex items-center gap-2;
}

h4 {
  @apply text-[18px] my-2 font-semibold text-[#023047] flex items-center gap-2;
}

.personal-tag {
  @apply bg-gradient-to-r from-primary to-pink-300 text-white px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 cursor-pointer inline-block mx-1;
}
.info-card {
  @apply bg-white/80 p-6 rounded-2xl shadow-lg border-l-4 border-primary transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-xl mb-4 opacity-100 translate-y-0;
}
</style>
