<script setup>
import GiftItem from "@/components/GiftItem.vue"
import FriendList from "@/components/FriendList.vue"
import { ref } from "vue"

const subtotal = ref(0)
const selectedFriends = ref([])

const updateSubtotal = (val) => (subtotal.value = val)
const updateSelected = (val) => (selectedFriends.value = val)

const confirmPurchase = () => {
  alert(`你選了 ${selectedFriends.value.length} 位好友，總金額 $${subtotal.value}`)
}
</script>

<template>
  <main class="max-w-[1000px] mx-auto mt-12 px-4">
    <div class="max-w-2xl pt-4 pb-8 mx-auto">
      <h1 class="mb-6 text-2xl font-bold">購買禮物</h1>
      <p class="mb-4 text-gray-500">禮物資訊</p>

      <GiftItem @update:subtotal="updateSubtotal" />

      <FriendList @update:selected="updateSelected" />

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
  </main>
</template>
