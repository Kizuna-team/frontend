<script setup>
import SubscribePlan from '@/components/SubscribePlan.vue'
import Subscription from "@/components/SubscriptionCard.vue";
import { UserIcon, FireIcon } from "@heroicons/vue/24/outline";
</script>

<template>
  <section
    class="fixed inset-0 overflow-hidden bg-gradient-to-br from-[#8ecae6]/70 via-white/50 to-[#48bfe3]/40 pt-10"
  >
    <div class="relative z-10 px-4 py-12 mx-auto text-center max-w-7xl">
      <h1 class="mb-2 text-4xl font-extrabold">選擇您的方案</h1>
      <p class="mb-10 text-lg text-darkblue/70">升級您的體驗，解鎖更多功能</p>

      <div class="flex flex-col justify-center gap-8 md:flex-row">
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
        />
      </div>

      <!-- 返回按鈕 -->

      <div class="flex justify-center">
        <button class="css-button-fully-rounded--sky">
        返回
      </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.css-button-fully-rounded--sky {
  min-width: 200px;
  height: 40px;
  color: #fff;
  padding: 5px 10px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  outline: none;
  border-radius: 20px;
  border: 2px solid #8ecae6;
  background: #8ecae6;
}
.css-button-fully-rounded--sky:hover {
  background: #fff;
  color: #8ecae6
}
</style>