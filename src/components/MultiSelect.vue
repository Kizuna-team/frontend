<script setup>
const props = defineProps({
  modelValue: {
    type: [Array, String, Number],
    default: () => [],
  },
  options: {
    type: Array,
    required: true,
  },
  labelKey: String,
  valueKey: String,
  cols: {
    type: [Number, String],
    default: 4,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["update:modelValue"]);

const getOptionValue = (option) => {
  return props.valueKey && typeof option === "object"
    ? option[props.valueKey]
    : option;
};

const optionLabel = (option) => {
  return props.labelKey && typeof option === "object"
    ? option[props.labelKey]
    : option;
};

const optionKey = (option) => {
  return getOptionValue(option);
};

const isSelected = (option) => {
  const val = getOptionValue(option);
  if (props.multiple) {
    if (!Array.isArray(props.modelValue)) return false;
    return props.modelValue.includes(val);
  } else {
    return props.modelValue === val;
  }
};

const toggle = (option) => {
  const val = getOptionValue(option);

  if (props.multiple) {
    const newValue = Array.isArray(props.modelValue)
      ? [...props.modelValue]
      : [];
    const index = newValue.indexOf(val);
    if (index === -1) {
      newValue.push(val);
    } else {
      newValue.splice(index, 1);
    }
    emit("update:modelValue", newValue);
  } else {
    const newValue = props.modelValue === val ? null : val;
    emit("update:modelValue", newValue);
  }
};
</script>

<template>
  <div :class="`grid gap-4 px-4 py-2 grid-cols-${cols}`">
    <button
      v-for="option in options"
      :key="optionKey(option)"
      @click="toggle(option)"
      class="px-3 py-1.5 text-sm font-semibold transition rounded-full border shadow-sm hover:shadow-md"
      :class="
        isSelected(option)
          ? 'bg-primary/20 border-primary/40 text-darkblue'
          : 'border-gray-300 text-gray-400'
      "
    >
      {{ optionLabel(option) }}
    </button>
  </div>
</template>
