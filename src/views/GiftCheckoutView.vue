<script setup>
import GiftItem from "@/components/GiftItem.vue"
import FriendList from "@/components/FriendList.vue"
import FriendRequestsPanel from "@/components/FriendRequestsPanel.vue"; // 引入新的好友邀請面板
import { ref } from "vue"

const subtotal = ref(0)
const selectedFriends = ref([])
const friendListRef = ref(null);

const updateSubtotal = (val) => (subtotal.value = val)
const updateSelected = (val) => (selectedFriends.value = val)

// 當 FriendRequestsPanel 發出 friendConfirmed 事件時，會調用此函數
const handleFriendConfirmed = () => {
  if (friendListRef.value) {
    // 調用 FriendList 元件內部暴露的 fetchFriendsData 方法，重新獲取好友列表
    friendListRef.value.fetchFriendsData(); 
  }
};

const confirmPurchase = () => {
  alert(`你選了 ${selectedFriends.value.length} 位好友，總金額 $${subtotal.value}`)
}
</script>

<template>
  <main class="max-w-[1400px] mx-auto mt-12 px-4 flex justify-between items-start gap-8">
    <div class="pt-4 pb-8 flex-grow min-w-[600px]">
      <h1 class="mb-6 text-2xl font-bold">購買禮物</h1>
      <p class="mb-4 text-gray-500">禮物資訊</p>

      <GiftItem @update:subtotal="updateSubtotal" />

      <FriendList @update:selected="updateSelected" ref="friendListRef" />

      <div class="flex justify-between mt-6 text-xl font-bold">
        <span>訂單合計金額：</span>
        <span>$ {{ subtotal }}</span>
      </div>

      <p class="mt-2 text-sm leading-relaxed text-center text-gray-600">
        若有此商品適用的優惠券，請先點選「確認購買清單」在結帳頁點擊「選擇優惠券」 進行使用。
      </p>

      <button
        class="w-full h-10 mt-4 font-bold text-white bg-[#219ebc] border-2 border-[#219ebc] rounded-full transition duration-300 hover:bg-white hover:text-[#219ebc] active:scale-95"
        @click="confirmPurchase"
      >
        確認購買清單
      </button>
    </div>

    <FriendRequestsPanel @friendConfirmed="handleFriendConfirmed" /> 
  </main>
</template>

<style scoped>
/* 保持不變 */
</style>