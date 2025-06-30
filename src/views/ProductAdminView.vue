<script setup>
import { ref, onMounted } from "vue";
import axios from "@/api/axios";
import { useToast } from 'vue-toastification'

const products = ref([]);
const toast = useToast()

onMounted(async () => {
  await fetchProducts();
});

const fetchProducts = async () => {
  const res = await axios.get("/products");
  products.value = res.data;
};

const updateInventory = async (productId, newInventory) => {
  try {
    await axios.put(`admin/products/${productId}/inventory`, {
      inventory: Number(newInventory),
    });
    toast("更新成功");
    await fetchProducts(); // 重新載入資料
  } catch (err) {
    console.error("更新庫存失敗", err);
    toast.error("更新失敗，請稍後再試");
  }
};
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">商品庫存總覽</h1>
    <table class="w-full border table-auto">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 border">商品名稱</th>
          <th class="p-2 border">價格</th>
          <th class="p-2 border">剩餘庫存</th>
          <th class="p-2 border">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p.id">
          <td class="p-2 border">{{ p.name }}</td>
          <td class="p-2 border">{{ p.price }}</td>
          <td class="p-2 border">
            <input
              v-model.number="p.inventory"
              type="number"
              class="w-24 p-1 border"
            />
          </td>
          <td class="p-2 border">
            <button
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-[darkblue]"
              @click="updateInventory(p.id, p.inventory)"
            >
              更新庫存
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
