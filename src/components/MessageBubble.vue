<template>
  <div :class="bubblePosition">
    <div :class="['inline-block', 'my-3','px-4', 'py-2', 'rounded-2xl', 'shadow', bubbleColor, 'max-w-xs', 'break-words']">
      <p class="">{{ msg.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const { msg, selfId } = defineProps({
  msg: Object,
  selfId: [String, Number],
});

const bubblePosition = computed(() =>
  Number(selfId) === Number(msg.sender_id) ? "text-right" : "text-left"
);

const bubbleColor = computed(() => 
  Number(selfId) === Number(msg.sender_id) ? "bg-blue-100" : "bg-gray-100"
);
</script>
