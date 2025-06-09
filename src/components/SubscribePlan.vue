<script setup>
import { onMounted, ref } from "vue";
import axios from "@/api/axios";
import { checkout } from "@/api/useSubscription.js";
import { useUserStore } from "@/stores/user";


// 使用者目前訂閱方案 id
const userStore = useUserStore();
// 用來存從資料庫抓到的方案
const plans = ref([]);
const planId = ref(null);

// 畫面一進來就抓方案
onMounted(async () => {
  try {
    // 先更新會員資料
    const meRes = await axios.get("/api/me", {
      headers: {
        Authorization: `Bearer ${userStore.accessToken}`,
      },
    });
    planId.value = meRes.data.user.subscription_plan;
    console.log("取得會員資格", planId.value);
    userStore.setSubscription(planId.value);

    // 再抓方案列表
    const res = await axios.get("/api/subPlans");
    plans.value = res.data;
  } catch (error) {
    console.error("❌ 無法取得訂閱資料", error);
  }
});
</script>

<template>
  <div class="max-w-xl p-4 mx-auto space-y-4">
    <h1 class="mb-4 text-2xl font-bold">訂閱方案</h1>
<div v-for="plan in plans" :key="plan.id" class="border rounded p-4 mb-4">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-lg font-bold">{{ plan.name }} ${{ plan.price }}/月</h3>
        <p class="text-gray-600">{{ plan.description }}</p>
      </div>

      <!-- 按鈕邏輯 -->
      <div v-if="plan.id !== 1">
        <button
          v-if="Number(planId) === Number(plan.id)"
          class="px-4 py-2 bg-gray-400 text-white rounded"
          disabled
        >
          已開通此功能
        </button>
        <button
          v-else
          class="px-4 py-2 bg-blue-500 text-white rounded"
          @click="checkout(plan.id, plan.price)"
        >
          訂閱
        </button>
      </div>

      <!-- 免費方案 (plan.id === 1) → 不顯示按鈕 -->
    </div>
  </div>
     <p>目前會員資格：{{ planId }}</p>
  </div>
</template>
