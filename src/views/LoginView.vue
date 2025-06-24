<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "../stores/user";
import { Mail, Lock } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useToast } from 'vue-toastification'

const router = useRouter();
const store = useUserStore();
const toast = useToast()

const username = ref("");
const password = ref("");
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const handleLogin = async () => {
  if (!username.value || !password.value) {
    toast.error("請輸入帳號和密碼");
    return;
  }
  try {
    await store.login(username.value, password.value);
    toast("登入成功，歡迎回來！");
    router.push("/edit-profile");
  } catch (error) {
    console.error("登入失敗", error);
    const msg = error.response?.data?.message || "伺服器無回應";
    const reason = error.response?.data?.reason || error.message;
    toast.error(`登入失敗\n原因：${msg}:${reason}`);
  }
};

// Google 登入按鈕點擊處理
// const handleGoogleLogin = () => {
//   // 彈出 Google 登入視窗
//   window.google.accounts.id.prompt();
// };

// 處理登入成功的 callback
const handleGoogleResponse = async (res) => {
  // console.log("Google response:", res);

  const idToken = res.credential;
  if (!idToken) {
    toast.error("登入失敗 無效的 Google 憑證");
    return;
  }
  try {
    await store.loginWithGoogle(idToken);
    toast("Google 登入成功！");
    router.push("/");
  } catch (err) {
    console.error("Google 登入錯誤", err);
    toast.error("Google 登入失敗，請稍後再試");
  }
};

// 初始化 google API 並設定 callback
onMounted(() => {
  if (window.google && window.google.accounts) {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: false,
    });

    const el = document.getElementById("google-signin-button");
    if (el) el.innerHTML = "";

    // 渲染 Google 登入按鈕
    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
        text: "signin_with",
        shape: "pill",
      }
    );
  } else {
    console.error("Google API 未載入");
  }
});
</script>

<template>
  <div class="fixed inset-0 overflow-hidden bg-gradient-to-br from-[#8ecae6]/70 via-white/50 to-pink-200/70">
    <!-- 註冊按鈕 -->
    <router-link to="/register"
      class="fixed z-50 bottom-6 right-6 md:top-1/2 md:right-6 md:bottom-auto md:translate-y-[-50%]">
      <button
        class="flex items-center justify-center transition transition-transform duration-200 transform border border-white rounded-full shadow-lg w-14 h-14 bg-white/80 backdrop-blur hover:scale-125"
        title="前往註冊">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
          class="w-6 h-6 text-[#219ebc]">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </router-link>

    <div class="flex items-center justify-center w-full h-full px-4">
      <div
        class="relative w-full max-w-md p-10 bg-gradient-to-br from-white/90 to-white/70 ring-1 ring-white/40 backdrop-blur-xl hover:scale-[1.02] transition-transform duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
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

        <div class="space-y-6">
          <!-- 帳號 -->
          <div>
            <label class="relative flex items-center text-gray-700">
              <Mail class="absolute w-5 h-5 text-gray-400 left-3" />
              <input type="" v-model="username" placeholder="使用者帳號"
                class="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur rounded-full border border-gray-300 focus:border-[#219ebc] focus:ring-2 focus:ring-[#219ebc] transition-all duration-200 outline-none text-gray-800" />
            </label>
          </div>

          <!-- Password -->
          <div>
            <label class="relative flex items-center text-gray-700">
              <Lock class="absolute w-5 h-5 text-gray-400 left-3" />
              <input type="password" v-model="password" placeholder="密碼"
                class="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur rounded-full border border-gray-300 focus:border-[#219ebc] focus:ring-2 focus:ring-[#219ebc] transition-all duration-200 outline-none text-gray-800" />
            </label>
          </div>

          <!-- 登入按鈕 -->
          <button @click.prevent="handleLogin"
            class="w-full py-3 text-white font-semibold rounded-full bg-gradient-to-r from-primary to-pink-300 hover:from-[#7bb8d9] hover:to-pink-400 shadow-lg hover:shadow-xl transition-all duration-200">
            登入
          </button>
        </div>

        <!-- or -->
        <div class="flex items-center my-6 text-gray-500">
          <span class="flex-grow h-px bg-gray-300"></span>
          <span class="px-4 font-medium">or</span>
          <span class="flex-grow h-px bg-gray-300"></span>
        </div>

        <!-- Google 登入 - 使用官方按鈕 -->
        <div class="w-full h-[48px]">
          <div id="google-signin-button" class="w-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>
