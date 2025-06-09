<script setup>
defineProps({
  title: String,
  icon: {
    type: [Object, Function], // 支援傳入 functional component，不能用原本的object
    required: true,
  },
  price: String,
  features: Array,
});
</script>

<template>
  <div
    class="flex flex-col justify-between w-full max-w-sm p-6 shadow bg-primary group rounded-xl hover:bg-secondary"
  >
    <div class="flex flex-col items-center text-center">
      <h2 class="mb-4 text-xl font-bold group-hover:text-white">{{ title }}</h2>
      <div
        class="mb-4 text-5xl transition group-hover:text-white"
      >
        <component :is="icon" class="w-12 h-12" />
      </div>
      <p class="mb-4 text-2xl font-bold group-hover:text-white">{{ price }}</p>
      <ul
        class="w-full space-y-1 text-left list-disc list-inside group-hover:text-white"
      >
        <li v-for="(feature, index) in features" :key="index">
          {{ feature }}
        </li>
      </ul>
    </div>
    <button class="py-2 mt-6 rounded-xl bg-secondary group-hover:bg-primary">
      訂閱
    </button>
  </div>
</template>
