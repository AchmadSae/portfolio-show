<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  dropCap: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <p 
    class="text-sm md:text-xl lg:text-xl font-regular tracking-tight text-white/90 leading-relaxed mb-6"
    :class="{
      'first-letter:float-left first-letter:text-6xl md:first-letter:text-7xl first-letter:pr-4 first-letter:font-serif first-letter:font-bold first-letter:text-white first-letter:leading-none first-letter:mt-2': dropCap
    }"
  >
    {{ text }}
  </p>
</template>
