<script setup>
import { onMounted, ref } from "vue";
import axios from "@/api/axios";
import { checkout } from "@/api/useSubscription.js";
import { useUserStore } from "@/stores/user";

// 使用者目前訂閱方案 id
const userStore = useUserStore();
// 用來存從資料庫抓到的方案
const plans = ref([]);

// 畫面一進來就抓方案
onMounted(async () => {
  try {
    // 先更新會員資料
    const meRes = await axios.get("/api/me", {
      headers: {
        Authorization: `Bearer ${userStore.accessToken}`,
      },
    });
    const planId = meRes.data.user.subscription_plan;
    userStore.setSubscription(planId);

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
    <div
      v-for="plan in plans"
      :key="plan.id"
      class="flex items-center justify-between p-4 border rounded-lg shadow"
    >
      <div>
        <h2 class="text-xl font-semibold">
          {{ plan.name }} ${{ plan.price }}/月
        </h2>
        <p class="text-gray-600">
          {{ plan.description || "尚未填寫描述" }}
        </p>
      </div>
      <button
        :class="[
          'px-4 py-2 text-white rounded',
          userStore.subscriptionPlan === plan.id || plan.price === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600',
        ]"
        :disabled="userStore.subscriptionPlan === plan.id || plan.price === 0"
        @click="checkout(plan.id, plan.price)"
      >
        {{ userStore.subscriptionPlan === plan.id || plan.price === 0 ? "已開通此功能" : "訂閱" }}
      </button>
    </div>
  </div>
</template>
