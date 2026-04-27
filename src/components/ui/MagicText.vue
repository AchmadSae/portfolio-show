<script setup lang="ts">
import { ref, computed } from 'vue'
import { useElementBounding } from '@vueuse/core'

const props = defineProps({
  text: {
    type: String,
    required: true
  }
})

const words = computed(() => props.text.split(' '))

const container = ref<HTMLElement | null>(null)

const { top } = useElementBounding(container)

// Calculate progress from 0 to 1 as the element scrolls through the viewport window
const progress = computed(() => {
  if (typeof window === 'undefined') return 0
  const windowHeight = window.innerHeight
  // Start revealing when the element is in the bottom 90% of the screen
  const startY = windowHeight * 0.4
  // End revealing when the element is 25% from top
  const endY = windowHeight * 0.1
  
  if (top.value > startY) return 0
  if (top.value < endY) return 1
  
  return 1 - ((top.value - endY) / (startY - endY))
})

const getWordOpacity = (index: number) => {
  const start = index / words.value.length
  const end = start + (1 / words.value.length)
  
  if (progress.value <= start) return 0
  if (progress.value >= end) return 1
  
  return (progress.value - start) / (end - start)
}
</script>

<template>
  <p ref="container" class="flex flex-wrap leading-tight p-4">
    <span
      v-for="(word, i) in words"
      :key="i"
      class="relative mt-[8px] mr-[4px] text-sm md:text-xl lg:text-xl font-regular tracking-tight"
    >
      <span class="absolute opacity-20 text-white">{{ word }}</span>
      <span
        class="text-white transition-opacity duration-150 block"
        :style="{ opacity: getWordOpacity(i) }"
      >{{ word }}</span>
    </span>
  </p>
</template>
