<script setup>
import { ref, computed, watch } from "vue"
const emit = defineEmits(["update:selected"])

const searchText = ref("")
const selected = ref([])

const friends = ref([
  { name: "林小美", img: "https://placehold.co/50" },
  { name: "陳阿明", img: "https://placehold.co/50" },
  { name: "張大偉", img: "https://placehold.co/50" },
  { name: "李小強", img: "https://placehold.co/50" },
])

const filteredFriends = computed(() =>
  friends.value.filter((f) => f.name.includes(searchText.value))
)

watch(selected, () => emit("update:selected", selected.value), { immediate: true })

const toggleSelect = (i) => {
  const idx = selected.value.indexOf(i)
  idx === -1 ? selected.value.push(i) : selected.value.splice(idx, 1)
}
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
    :key="i"
    class="flex items-center p-4 border rounded-md mb-3 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01] transition duration-200"
    @click="toggleSelect(i)"
    :class="{
      'bg-blue-100 border-blue-400': selected.includes(i),
      'bg-white': !selected.includes(i)
    }"
  >
    <img :src="friend.img" class="object-cover w-12 h-12 rounded-full" />
    <span class="ml-4 font-medium text-gray-800">{{ friend.name }}</span>
    <span
      v-if="selected.includes(i)"
      class="flex items-center justify-center ml-auto font-bold text-white bg-blue-500 rounded-full w-7 h-7"
    >
      ✓
    </span>
  </div>
</template>
