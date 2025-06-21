<script setup>
const props = defineProps({
  title: String,
  options: Array,
  modelValue: [Array, String], // 可支援單選或多選
  multiple: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

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
  <div class="bg-white p-6 rounded-2xl shadow-xl max-w-md mx-auto text-center">
    <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
    <div class="flex flex-wrap justify-center gap-2">
      <button
        v-for="option in options"
        :key="option"
        @click="toggle(option)"
        :class="[
          'px-4 py-2 rounded-full border',
          multiple
            ? modelValue.includes(option)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100'
            : modelValue === option
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100',
        ]"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>
