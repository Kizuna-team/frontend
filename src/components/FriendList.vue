<script setup>
import { ref, computed, watch, onMounted, defineExpose } from "vue"; // 引入 defineExpose
import axios from "@/api/axios";
import { useToast } from 'vue-toastification'
const toast = useToast()

const emit = defineEmits(["update:selected"]);

const searchText = ref("");
const selected = ref([]);
const friends = ref([]);

const userId = localStorage.getItem("userId");
console.log("✅ userId =", userId);

// 將獲取好友列表的邏輯封裝成一個函數，並暴露給父元件 
const fetchFriendsData = async () => {
  if (!userId) {
    toast(" 沒找到userId"); 
    return;
  }
  try {
    const res = await axios.get(`/api/friends?userId=${userId}`);
    // 確保後端返回的數據包含 friend_id 和 friend_name
    friends.value = res.data.map((f) => ({
      friend_id: f.friend_id, // 確保有 friend_id
      name: f.friend_name, // 使用 friend_name
    }));
  } catch (err) {
    console.error("❌ 撈好友失敗", err); 
  }
};

onMounted(() => {
  fetchFriendsData(); // 元件掛載時調用
});

const filteredFriends = computed(() =>
  friends.value.filter((f) => f.name.includes(searchText.value))
);

watch(
  selected,
  () => emit("update:selected", selected.value),
  { immediate: true }
);

const toggleSelect = (i) => {
  const idx = selected.value.indexOf(i);
  idx === -1 ? selected.value.push(i) : selected.value.splice(idx, 1);
};

// ⭐⭐⭐ 暴露 fetchFriendsData 函數給父元件 ⭐⭐⭐
defineExpose({
  fetchFriendsData
});
</script>

<template>
  <h2 class="mb-2 text-xl font-bold">選擇送禮對象</h2>
  <input
    v-model="searchText"
    type="text"
    placeholder="搜尋好友"
    class="w-full max-w-xs px-3 py-1 text-sm border rounded-md mb-4 focus:ring-2 focus:ring-[#C0D7EC]"
  />
  <p class="mb-2 text-sm text-gray-500">近期聯繫好友</p>

  <div
    v-for="(friend, i) in filteredFriends"
    :key="friend.friend_id" class="flex items-center p-4 border rounded-md mb-3 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01] transition duration-200"
    @click="toggleSelect(i)"
    :class="{
      'bg-blue-100 border-blue-400': selected.includes(i),
      'bg-white': !selected.includes(i)
    }"
  >
    <span class="ml-4 font-medium text-gray-800">{{ friend.name }}</span>
    <span
      v-if="selected.includes(i)"
      class="flex items-center justify-center ml-auto font-bold text-white bg-blue-500 rounded-full w-7 h-7"
    >
      ✓
    </span>
  </div>
</template>