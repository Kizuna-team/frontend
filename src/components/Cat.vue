<script setup>
import { Vue3Lottie } from 'vue3-lottie'
import rawCat from '@/assets/cat.json'

const catAnimation = JSON.parse(JSON.stringify(rawCat))
</script>

<template>
  <Vue3Lottie
    :animationData="catAnimation"
    :loop="true"
    :autoplay="true"
  />
</template>
