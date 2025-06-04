<!-- 登入頁面 -->
<script setup>
import { useUserStore } from "../stores/user";
import ProfileView from "./ProfileView.vue";

const store = useUserStore();

const handleLogin = async () => {
  if (!store.username || !store.password) {
    alert("請輸入帳號和密碼");
    return;
  }
  try {
    await store.login(store.username, store.password);
    alert("登入成功");
  } catch (error) {
    console.error("登入失敗", error);
    const msg = error.response?.data?.message || "登入請求失敗";
    const reason = error.response?.data?.reason || error.message;
    alert(`登入失敗 失敗原因：${msg}:${reason}`);
  }
};

const loginWithGoogle = () => {
  window.location.href = "http://localhost:3000/auth/google";
};
</script>

<template>
  <!-- 在template中 會自動解包 所以存取值不用.value-->
  <div class="w-[600px] h-[450px] bg-[#C0D7EC] bg-opacity-70 rounded-[20px]">
    <div class="mx-auto w-[500px] py-10">
      <!-- 登入 + 新用戶 -->
      <div class="flex justify-between">
        <h2 class="text-[#3E6588] font-black text-2xl">登入</h2>
        <router-link to="/register" class="p-2 font-black text-[#3E6588]"
          >還沒有帳號? 點我註冊</router-link
        >
      </div>
      <!-- 帳號輸入框 -->
      <label class="block text-[#3E6588] font-bold text-l my-2 rounded-[10px]"
        >帳號</label
      >
      <input
        v-model="store.username"
        type=""
        placeholder="常用 Email"
        class="w-[500px] block py-1.5 pr-3 pl-3 text-lg border border-gray-300 text-gray-900 rounded-[10px] placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
      >
      <!-- 密碼輸入框 -->
      <label class="block text-[#3E6588] font-bold text-l my-2">密碼</label>
      <input
        v-model="store.password"
        type="password"
        placeholder="6位數以上英數組合"
        class="w-[500px] block py-1.5 pr-3 pl-3 text-lg border border-gray-300 text-gray-900 rounded-[10px] placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
      >
      <!-- 登入按鈕 -->
      <button
        @click="handleLogin"
        class="mt-5 mb-2 w-[500px] p-3 font-bold text-white bg-[#7395BA] rounded-[10px]"
      >
        登入
      </button>
      <!-- 忘記密碼 之後加功能 先切版 -->
      <a href="#" class="text-center block text-[#3E6588] font-bold text-l">
        忘記密碼?
      </a>
      <!-- 第三方登入 -->
      <a href="#" class="block mt-3 w-[500px] p-3 bg-white rounded-[10px]">
        <div class="flex">
          <svg
            width="22"
            height="21"
            viewBox="0 0 22 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="w-1/12"
          >
            <path
              d="M19.4305 8.80673H18.7286V8.77056H10.8864V12.256H15.8109C15.0925 14.2849 13.162 15.7414 10.8864 15.7414C7.99918 15.7414 5.65828 13.4005 5.65828 10.5133C5.65828 7.62604 7.99918 5.28514 10.8864 5.28514C12.2192 5.28514 13.4316 5.78791 14.3548 6.60916L16.8195 4.14453C15.2632 2.69416 13.1816 1.79971 10.8864 1.79971C6.07435 1.79971 2.17285 5.70121 2.17285 10.5133C2.17285 15.3253 6.07435 19.2268 10.8864 19.2268C15.6985 19.2268 19.6 15.3253 19.6 10.5133C19.6 9.92903 19.5399 9.35873 19.4305 8.80673Z"
              fill="#FFC107"
            />
            <path
              d="M3.17676 6.45755L6.0396 8.55708C6.81423 6.63923 8.69026 5.28514 10.8856 5.28514C12.2184 5.28514 13.4309 5.78791 14.3541 6.60916L16.8187 4.14453C15.2625 2.69416 13.1808 1.79971 10.8856 1.79971C7.53876 1.79971 4.63628 3.68925 3.17676 6.45755Z"
              fill="#FF3D00"
            />
            <path
              d="M10.8862 19.2271C13.1369 19.2271 15.1819 18.3658 16.7282 16.9651L14.0313 14.683C13.1565 15.3457 12.069 15.7417 10.8862 15.7417C8.61976 15.7417 6.69537 14.2966 5.9704 12.2798L3.12891 14.4691C4.571 17.291 7.49963 19.2271 10.8862 19.2271Z"
              fill="#4CAF50"
            />
            <path
              d="M19.4298 8.80673H18.7279V8.77057H10.8857V12.256H15.8102C15.4652 13.2306 14.8382 14.071 14.0296 14.6832L14.0309 14.6823L16.7278 16.9644C16.5369 17.1378 19.5993 14.8701 19.5993 10.5133C19.5993 9.92904 19.5392 9.35873 19.4298 8.80673Z"
              fill="#1976D2"
            />
          </svg>
          <button
            @click="loginWithGoogle"
            class="text-[#26435c] font-bold w-10/12 text-center"
          >
            使用 Google 登入
          </button>
        </div>
      </a>
    </div>
  </div>
  <ProfileView v-if="store.userId" />
</template>

<style></style>
