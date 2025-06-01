<script setup>
import { ref } from "vue";
import axios from "../api/axios";
import CartCard from "@/components/CartCard.vue";
import { useCartStore } from "../stores/cart.js";
import { useUserStore} from "../stores/user.js";
const cartStore = useCartStore();
const userStore = useUserStore();

const message = ref("");
const error = ref("");

const sendOrder = async () => {
  try{
    // 組成要送給 API 的 items 格式
    const items = cartStore.cartItems.map( item => ({
        product_id: item.id,
        quantity: item.quantity
    }));
    
    const res = await axios.post("/order/gift-orders", {
      sender_id: userStore.userId,
      // 之後從資料庫中的朋友表單撈
      receiver_id: 10,
      items: items
    });

    message.value = `送出成功，訂單編號:${res.data.id}`
    error.value = "";
    
    cartStore.clearCart();
  }catch(err){
    console.error(err);
    message.value = "";
    error.value = err.response?.data?.error || "送出失敗";
  }
};


</script>

<template>
  <h1 class="text-2xl">
    購物車列表
  </h1>
  <br>
  <div class="grid grid-cols-5 border-b">
    <p class="col-span-2">商品資訊</p>
    <p>價格 (含稅)</p>
    <p>數量</p>
  </div>
  <br>
  <div v-if="cartStore.cartItems.length > 0">
    <CartCard v-for="item in cartStore.cartItems" :key="item.id" :item="item" />
    <br>
    <div class="text-right">
      <button
        class="px-4 py-1 text-white bg-blue-600 rounded w-fit hover:bg-blue-700"
        @click="cartStore.clearCart()"
      >
        清空購物車
      </button>
      <p>總計: {{ cartStore.totalPrice }} 元</p>
      <p>總計: {{ cartStore.totalQuantity }} 元</p>
    </div>
    <div class="text-right">
      <button
        :disabled="cartStore.cartItems.length === 0"
        class="px-4 py-1 text-white bg-blue-600 rounded w-fit hover:bg-blue-700"
        @click="sendOrder"
      >
        送出訂單給 user10 (測試用)
      </button>
    </div>
        <!-- 訊息回饋 -->
    <p v-if="message" class="mt-4 text-green-600">{{ message }}</p>
    <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
  </div>
  <div v-else>
    <p>購物車為空</p>
  </div>
</template>

<style scoped></style>
