<script setup>
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import axios from "@/api/axios";

const userStore = useUserStore();
const router = useRouter();

const subscriptionName = ref("（載入中）"); // 顯示「免費會員」或「高級會員」
const expireDate = ref(""); // 顯示訂閱到期日（只有高級才有）

const goSubscribe = () => {
  router.push("/subscribe");
};

// ✅ 一進入會員中心頁面就 call /api/me 更新訂閱狀態
onMounted(async () => {
  try {
    const res = await axios.get("/api/me", {
      headers: {
        Authorization: `Bearer ${userStore.accessToken}`,
      },
    });
    console.log("✅ 取得會員資料成功", res.data); // <--有跑到這
    const user = res.data.user;
    console.log("user", user); // <--有跑到這

    // 存入 store 裡（如果你要用的話）
    userStore.setSubscription(user.subscription_plan);

    // 顯示會員等級文字
    subscriptionName.value = user.subscription_name;

    // 如果不是免費會員，就計算訂閱到期日
    if (user.subscription_plan !== 1 && user.paid_at) {
      const paidAt = new Date(user.paid_at);
      const expire = new Date(paidAt);
      // 測試用兩分鐘
      expire.setTime(paidAt.getTime() + 2 * 60 * 1000);
      const yyyy = expire.getFullYear();
      const MM = String(expire.getMonth() + 1).padStart(2, "0");
      const dd = String(expire.getDate()).padStart(2, "0");
      const hh = String(expire.getHours()).padStart(2, "0");
      const mm = String(expire.getMinutes()).padStart(2, "0");
      
      expireDate.value = `${yyyy}/${MM}/${dd} ${hh}:${mm}`;
      console.log("paid_at 原始", user.paid_at);
      console.log("計算後 expireDate", expireDate.value);
    }
  } catch (error) {
    console.error("⚠️ 無法取得會員資料", error);
  }
});
</script>

<template>
  <div class="max-w-lg p-6 mx-auto">
    <h2 class="mb-4 text-2xl font-bold">會員中心</h2>
    <p class="mb-2">使用者名稱：{{ userStore.username }}</p>

    <p class="mb-2">
      會員等級：
      <span>{{ subscriptionName }}</span>
    </p>

    <!-- 顯示訂閱到期日（只有不是免費會員才會出現） -->
    <p v-if="expireDate" class="mb-4">
      訂閱至：<span class="font-bold">{{ expireDate }} 到期</span>
    </p>

    <button
      @click="goSubscribe"
      class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-800"
    >
      查看訂閱方案
    </button>
  </div>
</template>
