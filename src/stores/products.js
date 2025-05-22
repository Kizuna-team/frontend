import { defineStore } from "pinia";
import { ref, computed } from "vue";
export const useProductStore = defineStore("products", () => {
  //商品列表
  //price要是數字
  const products = ref([
    {
      id: 1,
      img: "https://lcp-prod-obs.line-scdn.net/0hB0cYFDAAHR9eIA3Q1u9iSA19EW5tURkXN1gAInplPHAITAkVNA4CDwxpP3NzUTERCQ0zHzpmPHcYETsvAhoHHHppKEoYVDEsOx8CJTlrPGQDWSEVOE4uCQ/f300",
      name: "烏龍奶茶",
      price: 350,
      inventory: 5,
    },
    // {
    //   id: 2,
    //   img: "https://lcp-prod-obs.line-scdn.net/0ho2PNKBSEMB1tNyDS5aFPSj5qPGxeRjQVBE8tIElyEXYrTCdICBgUIDh-Pkg7TCQTOhoeHQlxEXUrBhYtMQ0qHkl-BUgrQxwtMgkUHjh8EFsSQQwXC1kDCw/f300",
    //   name: "芋頭牛奶",
    //   price: 500,
    //   inventory: 6,
    // },
    // {
    //   id: 3,
    //   img: "https://lcp-prod-obs.line-scdn.net/0h8Gm2tOW-Z2hQS3en2s4YPwAWaxljOmNgOTN6VXROUhMgOVxIZGl6DB5IbAcdJ3J1bG16ex0XbC19IVthCCVUaBFIagQoIXVhH3ZURSMNRSoWOkFbHA/f300",
    //   name: "柳橙汁",
    //   price: 200,
    //   inventory: 7,
    // },
    // {
    //   id: 4,
    //   img: "https://lcp-prod-obs.line-scdn.net/0hB0cYFDAAHR9eIA3Q1u9iSA19EW5tURkXN1gAInplPHAITAkVNA4CDwxpP3NzUTERCQ0zHzpmPHcYETsvAhoHHHppKEoYVDEsOx8CJTlrPGQDWSEVOE4uCQ/f300",
    //   name: "烏龍奶茶",
    //   price: 350,
    //   inventory: 5,
    // },
    // {
    //   id: 5,
    //   img: "https://lcp-prod-obs.line-scdn.net/0ho2PNKBSEMB1tNyDS5aFPSj5qPGxeRjQVBE8tIElyEXYrTCdICBgUIDh-Pkg7TCQTOhoeHQlxEXUrBhYtMQ0qHkl-BUgrQxwtMgkUHjh8EFsSQQwXC1kDCw/f300",
    //   name: "芋頭牛奶",
    //   price: 500,
    //   inventory: 6,
    // },
    // {
    //   id: 6,
    //   img: "https://lcp-prod-obs.line-scdn.net/0h8Gm2tOW-Z2hQS3en2s4YPwAWaxljOmNgOTN6VXROUhMgOVxIZGl6DB5IbAcdJ3J1bG16ex0XbC19IVthCCVUaBFIagQoIXVhH3ZURSMNRSoWOkFbHA/f300",
    //   name: "柳橙汁",
    //   price: 200,
    //   inventory: 7,
    // },
    // {
    //   id: 7,
    //   img: "https://lcp-prod-obs.line-scdn.net/0hB0cYFDAAHR9eIA3Q1u9iSA19EW5tURkXN1gAInplPHAITAkVNA4CDwxpP3NzUTERCQ0zHzpmPHcYETsvAhoHHHppKEoYVDEsOx8CJTlrPGQDWSEVOE4uCQ/f300",
    //   name: "烏龍奶茶",
    //   price: 350,
    //   inventory: 5,
    // },
    // {
    //   id: 8,
    //   img: "https://lcp-prod-obs.line-scdn.net/0ho2PNKBSEMB1tNyDS5aFPSj5qPGxeRjQVBE8tIElyEXYrTCdICBgUIDh-Pkg7TCQTOhoeHQlxEXUrBhYtMQ0qHkl-BUgrQxwtMgkUHjh8EFsSQQwXC1kDCw/f300",
    //   name: "芋頭牛奶",
    //   price: 500,
    //   inventory: 6,
    // },
    // {
    //   id: 9,
    //   img: "https://lcp-prod-obs.line-scdn.net/0h8Gm2tOW-Z2hQS3en2s4YPwAWaxljOmNgOTN6VXROUhMgOVxIZGl6DB5IbAcdJ3J1bG16ex0XbC19IVthCCVUaBFIagQoIXVhH3ZURSMNRSoWOkFbHA/f300",
    //   name: "柳橙汁",
    //   price: 200,
    //   inventory: 7,
    // },
  ]);

  //取得所有可以購買的商品(庫存大於0) 記得計算要加computed!!!!
  const avaliableProducts = computed(() => {
    return products.value.filter((product) => product.inventory > 0);
  });

  //減少庫存
  const decreaseInventory = (ItemId) => {
    const product = products.value.find((product) => product.id === ItemId);

    if (product && product.inventory > 0) {
      product.inventory--;
    }
  };

  //增加庫存
  const increaseInventory = (ItemId) => {
    const product = products.value.find((product) => product.id === ItemId);

    if (product) {
      product.inventory++;
    }
  };
  return { products, avaliableProducts, decreaseInventory, increaseInventory }; //記得return
});
