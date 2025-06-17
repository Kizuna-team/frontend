<script setup>
defineProps(["photo", "firstName", "lastName"]);
</script>

<template>
  <div class="w-full overflow-hidden bg-white shadow-md rounded-xl">
    <img :src="photo" alt="Member Photo" class="object-cover w-full h-40" />
    <div class="p-4 text-center">
      <p class="text-lg font-semibold text-darkblue">
        {{ firstName }} {{ lastName }}
      </p>
    </div>
  </div>
</template>
