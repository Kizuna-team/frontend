<script setup>
const props = defineProps({
  title: String,
  options: Array,
  modelValue: [Array, String], // 可支援單選或多選
  multiple: Boolean,
});

const emit = defineEmits(["update:modelValue"]);
// const { multiple, modelValue } = toRefs(props);
// 不要用 toRefs 解構 modelValue，否則失去 reactivity

const toggle = (option) => {
  if (props.multiple) {
    const arr = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const exists = arr.includes(option);
    const updated = exists ? arr.filter((i) => i !== option) : [...arr, option];
    emit("update:modelValue", updated);
  } else {
    emit("update:modelValue", option);
  }
};
</script>

<template>
  <div class="mx-auto my-4 card">
    <div class="flex flex-col items-center justify-center p-6 card-info">
      <h2 class="mb-4 text-xl title">{{ title }}</h2>
      <div class="flex flex-wrap justify-center gap-2">
        <button
          v-for="option in options"
          :key="option"
          :class="[
            'w-[140px] px-4 py-2 rounded-full border transition duration-150 ease-in-out',
            {
              'bg-gray-300 text-black': multiple
                ? Array.isArray(modelValue) && modelValue.includes(option)
                : modelValue === option,
              'bg-white text-gray-800': multiple
                ? !(Array.isArray(modelValue) && modelValue.includes(option))
                : modelValue !== option,
            },
          ]"
          @click="toggle(option)"
        >
          {{ option }}
        </button>
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
