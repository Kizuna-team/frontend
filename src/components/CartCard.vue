<script setup>
import { useCartStore } from "@/stores/cart.js";
import { useProductStore } from "@/stores/products.js";
const cartStore = useCartStore();
const productStore = useProductStore();
// 傳資料
// const { cartItems, totalPrice, totalItems } = storeToRefs(cartStore); 這邊不會用到這些資訊，函式不能寫入storeToRefs?

defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="grid items-center grid-cols-5">
    <div class="col-span-2">
      <img src="" alt="" />
      <p>商品: {{ item.name }}</p>
    </div>
    <p>價格: {{ item.price }}</p>
    <!-- 問題在這 -->
    <input
      type="number"
      :value="item.quantity" min="1"
      @change="cartStore.updateQuantity(item.id, $event.target.value)"
    />
    <button
      @click="cartStore.removeFromCart(item.id)"
      class="px-4 py-1 text-white bg-blue-600 rounded w-fit hover:bg-blue-700 justify-self-end"
    >
      移除
    </button>
    <br />
  </div>
</template>

<style scoped></style>
