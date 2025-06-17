<script setup>
import { ref, onMounted } from "vue";
import axios from "@/api/axios";

const products = ref([]);

onMounted(async () => {
  await fetchProducts();
});

const fetchProducts = async () => {
  const res = await axios.get("/products");
  products.value = res.data;
};

const updateInventory = async (productId, newInventory) => {
  console.log("更新商品 ID:", productId);
  console.log("新庫存數量:", newInventory);
  try {
    await axios.put(`admin/products/${productId}/inventory`, {
      inventory: Number(newInventory),
    });
    alert("更新成功");
    await fetchProducts(); // 重新載入資料
  } catch (err) {
    console.error("更新庫存失敗", err);
    alert("更新失敗，請稍後再試");
  }
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">商品庫存總覽</h1>
    <table class="w-full table-auto border">
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
              class="w-24 border p-1"
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
