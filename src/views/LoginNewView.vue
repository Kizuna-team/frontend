<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");
const rememberMe = ref(false);

const handleLogin = () => {
  console.log("Logging in:", {
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value,
  });
};
</script>

<template>
  <div
    class="fixed inset-0 overflow-hidden bg-gradient-to-br from-[#8ecae6]/70 via-white/50 to-pink-200/70"
  >
    <!-- 註冊按鈕 -->
    <router-link
      to="/registerNew"
      class="fixed z-50 bottom-6 right-6 md:top-1/2 md:right-6 md:bottom-auto md:translate-y-[-50%]"
    >
      <button
        class="flex items-center justify-center transition transition-transform duration-200 transform border border-white rounded-full shadow-lg w-14 h-14 bg-white/80 backdrop-blur hover:scale-125"
        title="前往註冊"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-6 h-6 text-[#219ebc]"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      </button>
    </router-link>

    <div class="flex items-center justify-center w-full h-full px-4">
      <div
        class="relative w-full max-w-md p-10 bg-gradient-to-br from-white/90 to-white/70 ring-1 ring-white/40 backdrop-blur-xl hover:scale-[1.02] transition-transform duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
      >
        <div class="flex justify-center mb-2">
          <img src="/logo.png" alt="Kizuna Logo" class="h-10" />
        </div>
        <!-- 標題 -->
        <div class="mb-8 text-center">
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-800">
            Welcome Kizuna
          </h1>
          <p class="mt-2 text-sm text-gray-600">請先登入以繼續使用</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="relative flex items-center text-gray-700">
              <Mail class="absolute w-5 h-5 text-gray-400 left-3" />
              <input
                type="email"
                v-model="email"
                placeholder="電子郵件"
                class="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur rounded-full border border-gray-300 focus:border-[#219ebc] focus:ring-2 focus:ring-[#219ebc] transition-all duration-200 outline-none text-gray-800"
              />
            </label>
          </div>

          <!-- Password -->
          <div>
            <label class="relative flex items-center text-gray-700">
              <Lock class="absolute w-5 h-5 text-gray-400 left-3" />
              <input
                type="password"
                v-model="password"
                placeholder="密碼"
                class="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur rounded-full border border-gray-300 focus:border-[#219ebc] focus:ring-2 focus:ring-[#219ebc] transition-all duration-200 outline-none text-gray-800"
              />
            </label>
          </div>

          <!-- 記住我 + 忘記密碼 -->
          <div class="flex items-center justify-between text-sm text-gray-600">
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="rememberMe"
                class="w-4 h-4 accent-[#219ebc] rounded border-gray-300 font-medium"
              />
              <span>記住我</span>
            </label>
            <a href="#" class="text-[#219ebc] hover:underline">忘記密碼？</a>
          </div>

          <!-- 登入按鈕 -->
          <button
            type="submit"
            class="w-full py-3 text-white font-semibold rounded-full bg-gradient-to-r from-primary to-pink-300 hover:from-[#7bb8d9] hover:to-pink-400 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            登入
          </button>
        </form>

        <!-- 分隔 or -->
        <div class="flex items-center my-6 text-gray-500">
          <span class="flex-grow h-px bg-gray-300"></span>
          <span class="px-4 font-medium">or</span>
          <span class="flex-grow h-px bg-gray-300"></span>
        </div>

        <!-- Google 登入 -->
        <button
          class="flex items-center justify-center w-full gap-3 py-3 text-sm font-semibold rounded-full border border-gray-300 bg-white/80 backdrop-blur hover:bg-white hover:border-[#219ebc] transition-all duration-200"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            class="w-5 h-5"
          />
          <span class="text-gray-800">使用 Google 登入</span>
        </button>
      </div>
    </div>
  </div>
</template>
