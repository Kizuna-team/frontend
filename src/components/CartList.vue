<script setup>
import CartCard from "@/components/CartCard.vue";
import { useCartStore } from "@/stores/cart.js";
const cartStore = useCartStore();
//解構出來的東西不是響應式
</script>

<template>
  <h1 class="text-2xl">購物車</h1>
  <br />
  <div class="grid grid-cols-5 border-b">
    <p class="col-span-2">商品資訊</p>
    <p>價格 (含稅)</p>
    <p>數量</p>
  </div>
  <br />
  <div v-if="cartStore.cartItems.length > 0">
    <CartCard v-for="item in cartStore.cartItems" :key="item.id" :item="item" />
    <br />
    <div class="text-right">
      <button
        @click="cartStore.clearCart()"
        class="px-4 py-1 text-white bg-blue-600 rounded w-fit hover:bg-blue-700"
      >
        清空購物車
      </button>
      <p>總計: {{ cartStore.totalPrice }} 元</p>
    </div>
  </div>
  <div v-else>
    <p>購物車為空</p>
  </div>
</template>

<style scoped></style>
