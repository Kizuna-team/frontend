
<script setup>
import axios from "@/api/axios";
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const orders = ref([]);

const fetchOrders = async () => {
  try {
    const res = await axios.get(`/order/my-orders?userId=${userStore.userId}`);
    orders.value = res.data;
  } catch (err) {
    console.error("取得購買紀錄失敗", err);
  }
};

onMounted(() => {
  fetchOrders();
});

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
    case "canceled":
      return "已取消";
    default:
      return "未知狀態";
  }
};

const statusColor = (status) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "canceled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-200 text-gray-700";
  }
};
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">我的購買紀錄</h1>

    <div v-if="orders.length === 0" class="text-gray-500">尚未有任何購買紀錄</div>

    <div v-else class="space-y-6">
      <div
        v-for="order in orders"
        :key="order.orderId"
        class="border border-gray-300 rounded-lg shadow-sm bg-white p-4"
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

        <div class="text-sm text-gray-700 mb-2">
          購買日期：{{ formatDate(order.createdAt) }}
        </div>
        <div class="text-sm text-gray-700 mb-2">
          收件人：<span class="font-semibold">{{ order.receiverName }}</span>
        </div>

        <div class="mt-3 text-sm text-gray-700">
          <p class="font-semibold mb-1">購買商品：</p>
          <ul class="list-disc list-inside">
            <li v-for="(item, index) in order.items" :key="index">
              {{ item.productName }} × {{ item.quantity }}
            </li>
          </ul>
        </div>

        <div class="mt-4 text-right text-base font-semibold text-gray-800">
          金額：NT$ {{ order.amount }}
        </div>
      </div>
    </div>
  </div>
</template>

