<script setup>
import axios from "@/api/axios";
import SubscriptionCard from "@/components/SubscriptionCard.vue";
import { UserIcon, FireIcon } from "@heroicons/vue/24/outline";
import { onMounted, ref } from "vue";
import { checkout } from "@/api/useSubscription.js";
import { useUserStore } from "@/stores/user";

// 使用者目前訂閱方案 id
const userStore = useUserStore();
// 用來存從資料庫抓到的方案
const plans = ref([]);
const planId = ref(null);

const subscriptionName = ref("（載入中）"); // 顯示「免費會員」或「高級會員」
const expireDate = ref(""); // 顯示訂閱到期日（只有高級才有）

onMounted(async () => {
  try {
    const res = await axios.get("/api/me", {
      headers: {
        Authorization: `Bearer ${userStore.accessToken}`,
      },
    });
    const user = res.data.user;

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
    }
  } catch (error) {
    console.error("無法取得會員資料", error);
  }
});
</script>
<template>
  <section class="pt-10">
    <div class="absolute inset-0 -z-10 bg-gradient-to-br from-[#8ecae6]/30 via-white/50 to-[#48bfe3]/10"></div>
          <div class="mt-10 max-w-lg p-6 mx-auto bg-white rounded-lg">
        <h2 class="mb-4 text-2xl font-bold">您目前的會員資格</h2>
        <p class="mb-2">使用者名稱：{{ userStore.username }}</p>

        <p class="mb-2">
          會員等級：
          <span>{{ subscriptionName }}</span>
        </p>
        <!-- 顯示訂閱到期日（只有不是免費會員才會出現） -->
        <p v-if="expireDate" class="mb-4">
          訂閱至：<span class="font-bold">{{ expireDate }} 到期</span>
        </p>
      </div>
      <div class="relative z-10 px-4 py-12 mx-auto text-center max-w-7xl">
        <h1 class="mb-2 text-4xl font-extrabold">選擇您的方案</h1>
        <p class="mb-10 text-lg text-darkblue/70">升級您的體驗，解鎖更多功能</p>

        <div class="flex flex-col justify-center gap-8 md:flex-row">
          <SubscriptionCard title="普通會員" price="免費" :icon="UserIcon" description="體驗基本功能，適合初次探索的用戶" :features="[
            '最多可儲存 20 筆瀏覽紀錄',
            '每日最多配對 20 人',
            '可參加社群活動',
            '每日 1 次超級喜歡',
          ]" @subscribe="() => handleSubscribe('basic')" />

          <SubscriptionCard title="高級會員" price="$299 / 月" :icon="FireIcon" description="解鎖進階功能，讓你更快速找到理想對象" :features="[
            '包含所有普通會員功能',
            '每日最多配對 50 人',
            '可主辦最多 5 個活動',
            '開啟送禮功能',
            '每日 5 次超級喜歡',
          ]" :isRecommended="true" :isHighlighted="true" @subscribe="() => checkout(2, 299)" />
        </div>
      </div>
  </section>
</template>
