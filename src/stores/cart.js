import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useProductStore } from "./products.js";

export const useCartStore = defineStore("cart", () => {
  const productStore = useProductStore();

  const cartItems = ref([]);
  // { id: 1, name: '機械鍵盤', price: 2999, quantity: 1 }

  const totalPrice = computed(() => {
    return cartItems.value.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  });

  const totalQuantity = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  const addCart = (product) => {
    const existingItem = cartItems.value.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cartItems.value.push({
        id: product.id,
        name: product.name,
        img: product.image_url,
        price: product.price,
        quantity: 1,
      });
      console.log(cartItems.value);
    }

    productStore.decreaseInventory(product.id);
  };

  const removeFromCart = (itemId) => {
  const index = cartItems.value.findIndex((item) => item.id === itemId);
  if (index > -1) {
    const item = cartItems.value[index];
    productStore.increaseInventory(itemId, item.quantity);
    cartItems.value.splice(index, 1);
  }
  };

  const updateQuantity = (itemId, newQuantity) => {
    const item = cartItems.value.find((item) => item.id === itemId);

    if (item) {
      const diff = newQuantity - item.quantity;
      item.quantity = newQuantity;

      if (diff > 0) {
        productStore.decreaseInventory(itemId, diff);
      } else {
        productStore.increaseInventory(itemId, Math.abs(diff));
      }
    }
  };


  const clearCart = () => {
    cartItems.value.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        productStore.increaseInventory(item.id);
      }
    });
    cartItems.value = [];
  };
  return {
    cartItems,
    totalPrice,
    totalQuantity,
    addCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
});
