<script setup>
import axios from "@/api/axios";
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const orders = ref([]);
const activeTab = ref("sent");

const fetchOrders = async () => {
  try {
    const url =
      activeTab.value === "sent"
        ? `/order/my-orders?userId=${userStore.userId}`
        : `/order/received?userId=${userStore.userId}`;
    const res = await axios.get(url);
    orders.value = res.data;
  } catch (err) {
    console.error("取得紀錄失敗", err);
  }
};

onMounted(fetchOrders);
watch(activeTab, fetchOrders);

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusLabel = (status) => {
  switch (status) {
    case "paid":
      return "已付款";
    case "pending":
      return "待付款";
    default:
      return "未知狀態";
  }
};

const statusColor = (status) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 text-sm";
    case "pending":
      return "bg-yellow-100 text-yellow-800 text-sm";
    default:
      return "bg-gray-200 text-gray-700 text-sm";
  }
};
</script>

<template>
  <div class="max-w-4xl px-4 py-8 mx-auto space-y-8">
    <div
      class="flex justify-center gap-8 text-lg font-semibold border-b border-gray-200"
    >
      <button
        @click="activeTab = 'sent'"
        :class="[
          'pb-2 transition relative',
          activeTab === 'sent'
            ? 'text-secondary border-b-4 border-secondary font-bold scale-105'
            : 'text-gray-400 hover:text-darkblue',
        ]"
      >
        我送出的
      </button>
      <button
        @click="activeTab = 'received'"
        :class="[
          'pb-2 transition relative',
          activeTab === 'received'
            ? 'text-secondary border-b-4 border-secondary font-bold scale-105'
            : 'text-gray-400 hover:text-darkblue',
        ]"
      >
        我收到的
      </button>
    </div>

    <div v-if="loading" class="py-8 text-center text-gray-500">載入中...</div>

    <div v-else>
      <div v-if="orders.length === 0" class="text-center text-gray-400 py-16">
        尚未有任何{{ activeTab === "sent" ? "購買" : "收禮" }}紀錄
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.orderId"
          class="p-5 transition duration-200 bg-white shadow-md rounded-2xl hover:shadow-lg"
        >
          <div class="flex justify-between items-center mb-2">
            <div class="text-sm text-gray-600">
              訂單編號：<span class="font-mono">{{ order.orderId }}</span>
            </div>
            <div
              class="text-xs px-2 py-1 rounded font-semibold"
              :class="statusColor(order.status)"
            >
              {{ statusLabel(order.status) }}
            </div>
          </div>

          <div class="text-sm text-gray-700 mb-1">
            {{ activeTab === "sent" ? "購買日期" : "收到日期" }}：
            {{ formatDate(order.createdAt) }}
          </div>
          <div class="text-sm text-gray-700 mb-2">
            {{ activeTab === "sent" ? "收件人" : "送禮人" }}：
            <span class="font-semibold">
              {{ activeTab === "sent" ? order.receiverName : order.senderName }}
            </span>
          </div>

          <div class="space-y-3">
            <div
              v-for="(item, index) in order.items"
              :key="index"
              class="flex items-center gap-4 p-3 border border-gray-200 rounded-xl"
            >
              <img
                :src="item.imageUrl || '/default.jpg'"
                alt="product"
                class="object-cover w-20 h-20 rounded-xl"
              />
              <div class="flex-1">
                <div class="text-base font-semibold text-gray-800">
                  {{ item.productName }}
                </div>
                <div class="text-sm text-gray-600">
                  數量：{{ item.quantity }}
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 text-right text-base font-semibold text-gray-800">
            {{ activeTab === "sent" ? "贈送金額" : "禮物價值" }}：NT$
            {{ order.amount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
