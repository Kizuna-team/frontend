<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const store = useUserStore();
const router = useRouter();

const username = ref("");
const password = ref("");

//
const handleRegister = async () => {
  // debug
  // console.log('開始註冊', username.value);
  if (!username.value || !password.value) {
    alert("請輸入帳號或密碼");
    return;
  }

  const res = await store.register(username.value, password.value);
  // debug
  // console.log(res);
  if (res.success) {
    alert(res.message || "註冊成功，請登入");
    router.push("/login"); // 註冊完成後 導回登入頁
  } else {
    alert(`${res.message}${res.reason ? `\n原因:${res.reason}` : ""}`);
  }
};
</script>

<template>
  <div class="w-[600px] h-[400px] bg-[#C0D7EC] bg-opacity-70 rounded-[20px]">
    <div class="mx-auto w-[500px] py-10">
      <!-- 註冊 + 已有帳號?登入 -->
      <div class="flex justify-between">
        <h2 class="text-[#3E6588] font-black text-2xl">註冊</h2>
        <router-link to="/login" class="p-2 font-black text-[#3E6588]"
          >已有帳號? 登入</router-link
        >
      </div>
      <!-- 填寫註冊資訊 -->
      <form @submit.prevent="handleRegister">
        <!-- 帳號輸入框 -->
        <label class="block text-[#3E6588] font-bold text-l my-2 rounded-[10px]"
          >帳號</label
        >
        <input
          v-model="username"
          type=""
          placeholder="常用 Email"
          class="w-[500px] block py-1.5 pr-3 pl-3 text-lg border border-gray-300 text-gray-900 rounded-[10px] placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
        />
        <!-- 密碼輸入框 -->
        <label class="block text-[#3E6588] font-bold text-l my-2">密碼</label>
        <input
          v-model="password"
          type="password"
          placeholder="6位數以上英數組合"
          class="w-[500px] block py-1.5 pr-3 pl-3 text-lg border border-gray-300 text-gray-900 rounded-[10px] placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
        />
        <!-- 註冊按鈕 -->
        <button
          type="submit"
          class="mt-5 mb-2 w-[500px] p-3 font-bold text-white bg-[#7395BA] rounded-[10px]"
        >
          註冊( 新增帳號 )
        </button>
      </form>
      <!-- 授權 -->
      <a href="#" class="text-center block text-[#3E6588] font-bold text-l"
        >註冊即表示您同意 服務條款 與 隱私權政策</a
      >
    </div>
  </div>
</template>
