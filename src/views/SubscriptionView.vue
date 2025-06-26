<script setup>
import axios from "@/api/axios";
import SubscriptionCard from "@/components/SubscriptionCard.vue";
import { UserIcon, FireIcon } from "@heroicons/vue/24/outline";
import { onMounted, ref } from "vue";
import { checkout } from "@/api/useSubscription.js";
import { useUserStore } from "@/stores/user";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

// 使用者目前訂閱方案 id
const userStore = useUserStore();

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
    // 後端傳來已經是 本地時間了 所以直接dayjs()
  const paidAt = dayjs(user.paid_at); 
  const expire = paidAt.add(2, "minute");

  expireDate.value = expire.tz("Asia/Taipei").format("YYYY/MM/DD HH:mm");
    }
  } catch (error) {
    console.error("無法取得會員資料", error);
  }
});
</script>

<template>
  <section
    class="w-full min-h-screen bg-gradient-to-br from-[#8ecae6]/30 via-white/50 to-[#48bfe3]/10 pt-10 pt-16 pb-16"
  >
    <div class="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
      <!-- 會員資格卡片 -->
      <div class="p-6 mt-10 bg-white shadow-lg rounded-2xl sm:p-8">
        <h2
          class="mb-4 text-2xl font-bold text-center sm:text-3xl text-darkblue"
        >
          您目前的會員資格
        </h2>
        <p class="mb-2 text-gray-700">
          <span class="font-semibold">使用者名稱：</span>
          {{ userStore.username }}
        </p>
        <p class="mb-2 text-gray-700">
          <span class="font-semibold">會員等級：</span>
          <span class="font-semibold text-secondary">{{
            subscriptionName
          }}</span>
        </p>
        <p v-if="expireDate" class="mb-4 text-gray-700">
          <span class="font-semibold">訂閱至：</span>
          <span class="font-semibold">{{ expireDate }} 到期</span>
        </p>
      </div>

      <!-- 方案選擇 -->
      <div class="mt-12 text-center">
        <h1 class="mb-3 text-3xl font-extrabold sm:text-4xl text-darkblue">
          選擇您的方案
        </h1>
        <p class="mb-8 text-base sm:text-lg text-darkblue/70">
          升級您的體驗，解鎖更多功能
        </p>
        <div
          class="flex flex-col gap-6 sm:flex-row sm:justify-center sm:gap-8 lg:gap-12"
        >
          <SubscriptionCard
            title="普通會員"
            price="免費"
            :icon="UserIcon"
            description="體驗基本功能，適合初次探索的用戶"
            :features="[
              '最多可儲存 20 筆瀏覽紀錄',
              '每日最多配對 20 人',
              '可參加社群活動',
              '每日 1 次超級喜歡',
            ]"
            @subscribe="() => handleSubscribe('basic')"
          />

          <SubscriptionCard
            title="高級會員"
            price="$299 / 月"
            :icon="FireIcon"
            description="解鎖進階功能，讓你更快速找到理想對象"
            :features="[
              '包含所有普通會員功能',
              '每日最多配對 50 人',
              '可主辦最多 5 個活動',
              '開啟送禮功能',
              '每日 5 次超級喜歡',
            ]"
            :isRecommended="true"
            :isHighlighted="true"
            @subscribe="() => checkout(2, 299)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
