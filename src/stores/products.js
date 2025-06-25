import { defineStore } from "pinia";
import {  computed } from "vue";
export const useProductStore = defineStore("products", () => {
  const avaliableProducts = computed(() => {
    return products.value.filter((product) => product.inventory > 0);
  });

  const decreaseInventory = (ItemId, amount = 1) => {
    const product = products.value.find((product) => product.id === ItemId);

    if (product) {
    const safeAmount = Math.max(0, amount);
    product.inventory = Math.max(product.inventory - safeAmount, 0);
  }
  };

  const increaseInventory = (ItemId, amount = 1) => {
    const product = products.value.find((product) => product.id === ItemId);

    if (product) {
      product.inventory += amount
    }
  };
  return { products, avaliableProducts, decreaseInventory, increaseInventory }; 
});
