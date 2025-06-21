<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";
import { useToast } from 'vue-toastification'

const store = useUserStore();
const router = useRouter();
const toast = useToast()

const username = ref("");
const password = ref("");

const handleRegister = async () => {
  // debug
  // console.log('開始註冊', username.value);
  if (!username.value || !password.value) {
    toast.error("請輸入帳號與密碼");
    return;
  }

  if (
    !/[a-zA-Z]/.test(password.value) ||
    !/[0-9]/.test(password.value) ||
    password.value.length <= 6
  ) {
    toast.error("密碼格式錯誤\n請輸入至少 7 碼以上，且包含英文字母與數字");
    return;
  }

  const res = await store.register(username.value, password.value);
  // debug
  // console.log(res);
  if (res.success) {
    toast(res.message || "註冊成功，請登入");
    router.push("/login");
  } else {
    toast.error(
      `註冊失敗\n${res.message}${res.reason ? `\n原因：${res.reason}` : ""}`
    );
  }
};
</script>

<template>
  <div
    class="fixed inset-0 overflow-hidden bg-gradient-to-br from-[#8ecae6]/70 via-white/50 to-pink-200/70"
  >
    <!-- 回登入按鈕 -->
    <router-link
      to="/login"
      class="fixed z-50 bottom-6 left-6 md:top-1/2 md:left-6 md:bottom-auto md:translate-y-[-50%]"
    >
      <button
        class="flex items-center justify-center transition-transform duration-200 transform border border-white rounded-full shadow-lg w-14 h-14 bg-white/80 backdrop-blur hover:scale-125"
        title="回到登入"
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
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
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
            Join Kizuna
          </h1>
          <p class="mt-2 text-sm text-gray-600">請註冊帳號以開始使用</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- 帳號 -->
          <div>
            <label class="relative flex items-center text-gray-700">
              <Mail class="absolute w-5 h-5 text-gray-400 left-3" />
              <input
                type=""
                v-model="username"
                placeholder="使用者帳號"
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
                placeholder="密碼（至少 6 碼英數混合）"
                class="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur rounded-full border border-gray-300 focus:border-[#219ebc] focus:ring-2 focus:ring-[#219ebc] transition-all duration-200 outline-none text-gray-800"
              />
            </label>
          </div>

          <!-- 註冊按鈕 -->
          <button
            type="submit"
            class="w-full py-3 text-white font-semibold rounded-full bg-gradient-to-r from-primary to-pink-300 hover:from-[#7bb8d9] hover:to-pink-400 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            註冊
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
