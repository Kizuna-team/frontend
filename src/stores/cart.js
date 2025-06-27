import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCartStore = defineStore("cart", () => {
  const cartItems = ref([]);

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
    }
  };

  const removeFromCart = (itemId) => {
    const index = cartItems.value.findIndex((item) => item.id === itemId);
    if (index > -1) {
      cartItems.value.splice(index, 1);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    const item = cartItems.value.find((item) => item.id === itemId);

    if (item) {
      item.quantity = newQuantity;
    }
  };

  return {
    cartItems,
    totalQuantity,
    addCart,
    removeFromCart,
    updateQuantity,
  };
});
