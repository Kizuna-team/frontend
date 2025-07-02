<script setup>
import axios from "@/api/axios";
import { ref, onMounted, watch, watchEffect } from "vue";
import { useUserStore } from "@/stores/user";
import { useToast } from "vue-toastification";

const userStore = useUserStore();
const orders = ref([]);
const displayOrders = ref([]);
const activeTab = ref("sent");
const loading = ref(false);
const retryingOrders = ref(new Set());
const deletingOrders = ref(new Set());
const toast = useToast();
const retryPayment = async (order) => {
  if (retryingOrders.value.has(order.orderId)) {
    return;
  }

  retryingOrders.value.add(order.orderId);

  try {
    const senderRes = await axios.get(
      `/get-user-id?username=${order.receiverName}`
    );
    const receiverId = senderRes.data?.userId;

    console.log("送出 payload:", {
      sender_id: userStore.userId,
      receiver_id: receiverId,
      items: order.items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
      message: order.message || "",
    });

    const res = await axios.post("/order/gift-orders", {
      sender_id: userStore.userId,
      receiver_id: receiverId,
      items: order.items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
      message: order.message,
    });

    if (res.data.success) {
      try {
        await axios.delete(`/order/delete/${order.orderId}`);
      } catch (deleteError) {
        // 刪除失敗不影響付款，只記錄警告
        console.warn(
          "⚠️ 舊訂單刪除失敗，但付款流程繼續:",
          deleteError.response?.status
        );
        // 可以考慮不處理這個錯誤，或者記錄到後端日誌中
      }
      // 成功後跳轉 LINE Pay 頁面
      window.location.href = res.data.paymentUrl;
    } else {
      message.value = "建立訂單失敗：" + res.data.message;
    }
  } catch (err) {
    console.error("重新付款失敗", err);
    message.value = "重新付款失敗，請稍後再試";
  } finally {
    retryingOrders.value.delete(order.orderId);
  }
};

const deleteOrder = async (order) => {
  if (
    deletingOrders.value.has(order.orderId) ||
    retryingOrders.value.has(order.orderId)
  ) {
    toast.info(`正在刪除訂單 ${order.orderId}...`);
    return;
  }

  deletingOrders.value.add(order.orderId);

  try {
    await axios.delete(`/order/delete/${order.orderId}`);
    toast.success(`訂單 ${order.orderId} 已刪除`);
    await fetchOrders();
  } catch (err) {
    console.error("刪除訂單失敗", err);
    if (err.response?.status === 404) {
      await fetchOrders();
    } else {
      toast.error("刪除訂單失敗，請稍後再試");
    }
  } finally {
    deletingOrders.value.delete(order.orderId);
  }
};

watchEffect(() => {
  if (activeTab.value === "received") {
    displayOrders.value = orders.value.flatMap((order) =>
      order.items.map((item) => ({
        orderId: order.orderId,
        createdAt: order.createdAt,
        senderName: order.senderName,
        message: order.message,
        productName: item.productName,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
      }))
    );
  } else {
    displayOrders.value = orders.value;
  }
});

const fetchOrders = async () => {
  loading.value = true;
  try {
    const url =
      activeTab.value === "sent"
        ? `/order/my-orders?userId=${userStore.userId}`
        : `/order/received?userId=${userStore.userId}`;
    const res = await axios.get(url);
    orders.value = res.data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (err) {
    console.error("取得紀錄失敗", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchOrders);
watch(activeTab, async () => {
  orders.value = [];
  displayOrders.value = [];
  await fetchOrders();
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

// ✅ QR Code Modal 控制區塊
const qrModalVisible = ref(false);
const qrModalSrc = ref("");

const showQrModal = (src) => {
  qrModalSrc.value = src;
  qrModalVisible.value = true;
};

const closeQrModal = () => {
  qrModalVisible.value = false;
};

const handleEsc = (e) => {
  if (e.key === "Escape") closeQrModal();
};

const isRetrying = (orderId) => {
  return retryingOrders.value.has(orderId);
};

const isDeleting = (orderId) => {
  return deletingOrders.value.has(orderId);
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

    <div
      v-else-if="orders.length === 0"
      class="py-16 text-center text-gray-400"
    >
      尚未有任何{{ activeTab === "sent" ? "購買" : "收禮" }}紀錄
    </div>
    <div v-if="activeTab === 'sent'" class="space-y-6">
      <div
        v-for="order in orders"
        :key="order.orderId"
        class="p-5 space-y-2 transition duration-200 bg-white shadow-md rounded-2xl hover:shadow-lg"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="text-sm text-gray-600">
            訂單編號：<span class="font-mono">{{ order.orderId }}</span>
          </div>
          <div
            v-if="activeTab === 'sent'"
            class="px-2 py-1 text-xs font-semibold rounded"
            :class="statusColor(order.status)"
          >
            {{ statusLabel(order.status) }}
          </div>
        </div>

        <div class="mb-1 text-sm text-gray-700">
          {{ activeTab === "sent" ? "購買日期" : "收到日期" }}：
          {{ formatDate(order.createdAt) }}
        </div>
        <div class="mb-2 text-sm text-gray-700">
          {{ activeTab === "sent" ? "收件人" : "送禮人" }}：
          <span class="font-semibold">
            {{ activeTab === "sent" ? order.receiverName : order.senderName }}
          </span>
        </div>

        <div
          v-if="activeTab === 'sent'"
          class="p-3 border border-gray-200 rounded-xl"
        >
          <div class="flex flex-col gap-4">
            <div
              v-for="(item, index) in order.items"
              :key="index"
              class="flex items-center gap-4"
            >
              <img
                :src="item.imageUrl || '/default.jpg'"
                alt="product"
                class="object-cover w-20 h-20 rounded-xl"
              />
              <div>
                <div class="text-base font-semibold text-gray-800">
                  {{ item.productName }}
                </div>
                <div class="text-sm text-gray-600">
                  數量：{{ item.quantity }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-base font-semibold text-right text-gray-800">
          贈送金額：NT$ {{ order.amount }}
        </div>

        <div
          v-if="activeTab === 'sent' && order.status === 'pending'"
          class="text-right"
        >
          <button
            class="px-4 py-2 text-sm font-semibold transition-all duration-200 transform rounded"
            :class="[
              isRetrying(order.orderId) || isDeleting(order.orderId)
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'text-white bg-orange hover:bg-yellow hover:scale-105 hover:shadow-lg active:scale-95',
            ]"
            :disabled="isRetrying(order.orderId) || isDeleting(order.orderId)"
            @click="retryPayment(order)"
          >
            {{ isRetrying(order.orderId) ? "載入中" : "重新付款" }}
          </button>

          <button
            class="px-4 py-2 text-sm font-semibold transition-all duration-200 transform rounded"
            :class="[
              isDeleting(order.orderId) || isRetrying(order.orderId)
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'text-white bg-red-500 hover:bg-red-600 hover:scale-105 hover:shadow-lg active:scale-95',
            ]"
            :disabled="isDeleting(order.orderId) || isRetrying(order.orderId)"
            @click="deleteOrder(order)"
          >
            {{ isDeleting(order.orderId) ? "載入中" : "刪除訂單" }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="activeTab === 'received'" class="space-y-6">
    <div
      v-for="item in displayOrders"
      :key="`${item.orderId}-${item.productName}`"
      class="p-6 space-y-4 bg-white shadow-md rounded-2xl hover:shadow-lg"
    >
      <div class="text-sm text-gray-600">
        訂單編號：<span class="font-mono">{{ item.orderId }}</span>
      </div>
      <div class="text-sm text-gray-700">
        收到日期：{{ formatDate(item.createdAt) }}
      </div>
      <div class="text-sm text-gray-700">
        送禮人：<span class="font-semibold">{{ item.senderName }}</span>
      </div>

      <div
        class="flex flex-col gap-4 p-4 border border-gray-200 rounded-xl sm:flex-row sm:items-start sm:gap-6 sm:justify-between"
      >
        <div class="flex items-center flex-1 gap-4">
          <img
            :src="item.imageUrl || '/default.jpg'"
            class="object-cover w-20 h-20 rounded-xl"
            alt="商品圖片"
          />
          <div>
            <div class="text-base font-semibold text-gray-800">
              {{ item.productName }}
            </div>
            <div class="text-sm text-gray-600">數量：{{ item.quantity }}</div>
          </div>
        </div>

        <div
          v-if="item.message"
          class="text-sm font-semibold text-gray-700 break-words sm:flex-1"
        >
          {{ item.message }}
        </div>

        <div class="flex justify-center sm:justify-end">
          <img
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${item.orderId}`"
            alt="QR Code"
            class="w-24 h-24 cursor-pointer shrink-0"
            @click="
              showQrModal(
                `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${item.orderId}`
              )
            "
          />
        </div>
      </div>
    </div>
  </div>
  <!-- QR Code Modal -->
  <div
    v-if="qrModalVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="closeQrModal"
  >
    <div class="p-6 bg-white shadow-xl rounded-xl">
      <img :src="qrModalSrc" alt="放大 QR Code" class="w-60 h-60" />
    </div>
  </div>
</template>
