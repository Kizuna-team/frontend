<script setup>
import { defineModel, onMounted } from "vue";

const props = defineProps({
  title: String,
  options: Array,
  modelValue: [Array, String, Number],
  multiple: Boolean,
  type: String,
});

const selectedValue = defineModel();

onMounted(() => {
  if (
    props.type === "range" &&
    (!selectedValue.value || selectedValue.value.length !== 2)
  ) {
    selectedValue.value = [18, 35];
  }
});

// 切換選項 更新 selectedValue 解析 option 取Id
const toggle = (option) => {
  const optionId = option.id ?? option;

  if (props.multiple) {
    const arr = Array.isArray(selectedValue.value)
      ? [...selectedValue.value]
      : [];
    const exists = arr.includes(optionId);
    console.log("是否已存在:", exists);
    selectedValue.value = exists
      ? arr.filter((i) => i !== optionId)
      : [...arr, optionId];
  } else {
    selectedValue.value = optionId;
  }

  console.log("更新後 selectedValue.value:", selectedValue.value);
};
</script>

<template>
  <div class="mx-auto my-4 card">
    <div class="flex flex-col items-center justify-center p-6 card-info">
      <h2 class="mb-4 text-xl title">{{ title }}</h2>

      <div class="flex flex-wrap justify-center gap-2">
        <button
          v-for="option in options"
          :key="option.id ?? option"
          @click="toggle(option)"
          :class="[
            'w-[140px] px-4 py-2 rounded-full border transition duration-150 ease-in-out',
            {
              'bg-gray-300 text-black': multiple
                ? Array.isArray(modelValue) && modelValue.includes(option.id)
                : modelValue === option.id,
              'bg-white text-gray-800': multiple
                ? !(Array.isArray(modelValue) && modelValue.includes(option.id))
                : modelValue !== option.id,
            },
          ]"
        >
          {{ option.name ?? option }}
        </button>
      </div>

      <div v-if="props.type === 'range'" class="flex gap-4 mt-4">
        <label>
          最小年齡：
          <input
            type="number"
            min="18"
            max="70"
            v-model.number="selectedValue[0]"
            class="px-2 py-1 border rounded"
          />
        </label>

        <label>
          最大年齡：
          <input
            type="number"
            min="18"
            max="70"
            v-model.number="selectedValue[1]"
            class="px-2 py-1 border rounded"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  border-radius: 1.5rem;
  background: white;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  max-width: 420px;
  width: 90%;
  margin: 1rem auto;
  z-index: 0;
}

.card:hover {
  transform: scale(1.03);
}

.card::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 4px;
  border-radius: 1.5rem;
  background: white;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: -1;
  transition: background 0.4s ease;
}

.card:hover::before {
  background: linear-gradient(to left, #a5c1e7, #dd99c1);
}

.card-info {
  border-radius: 1.5rem;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  font-weight: bold;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #333;
}

.card-info .options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  word-break: break-word;
}
</style>
