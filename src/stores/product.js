import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "@/api/axios";

export const useProductStore = defineStore("product", () => {

  const products = ref([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      products.value = res.data.map((product)=>({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        img: product.image_url,
        inventory: product.inventory,
        sales: product.sales,
      }));
      console.log(products.value);
    } catch (err) {
      console.error("取得商品資料失敗 失敗原因:", err);
    }
  }
  
  return {
    products,
    fetchProducts,
  };
});
