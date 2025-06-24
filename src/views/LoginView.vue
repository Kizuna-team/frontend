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

// 自定義 Google 登入按鈕點擊處理
const handleGoogleLogin = () => {
  // 觸發隱藏的官方 Google 登入按鈕
  const hiddenButton = document.querySelector('#google-signin-button div[role="button"]');
  if (hiddenButton) {
    hiddenButton.click();
  } else {
    toast.error("Google 登入服務未載入");
  }
};

// 處理登入成功的 callback
const handleGoogleResponse = async (res) => {
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

    // 創建隱藏的官方按鈕
    const hiddenContainer = document.getElementById("google-signin-button");
    if (hiddenContainer) {
      hiddenContainer.innerHTML = "";
      // 渲染官方按鈕但隱藏它
      window.google.accounts.id.renderButton(hiddenContainer, {
        theme: "outline",
        size: "large",
        width: 375,
        text: "signin_with",
        shape: "pill",
      });
      // 隱藏官方按鈕
      hiddenContainer.style.display = 'none';
    }
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

        <!-- 自定義 Google 登入按鈕 -->
        <button @click="handleGoogleLogin"
          class="w-full py-3 text-gray-700 font-semibold rounded-full bg-white/80 backdrop-blur border border-gray-300 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 hover:bg-[#D9E7E8]/20">
          <!-- Google Logo SVG -->
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          使用 Google 登入
        </button>
        
        <!-- 隱藏的官方 Google 登入按鈕 -->
        <div id="google-signin-button" style="display: none;"></div>
      </div>
    </div>
  </div>
</template>