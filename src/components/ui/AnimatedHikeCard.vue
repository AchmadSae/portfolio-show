<script setup lang="ts">
import { ArrowRight, Clock, Zap, Settings, Code } from 'lucide-vue-next'

const props = defineProps({
  title: { type: String, default: 'Mountain Hike' },
  images: {
    type: Array as () => string[],
    default: () => [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070",
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2070",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070"
    ]
  },
  stack: {
    type: String,
    default: 'Nuxt 3.x, Tailwind Css, Vue.js, MySQL'
  },
  description: {
    type: String,
    default: "Hiking on a mountain blends physical challenge with natural beauty, offering sweeping views and a profound sense of accomplishment."
  },
  stack: {
    type: String,
    default: ''
  },
  contract: {
    type: String,
    default: ''
  },
  href: { type: String, default: '#' }
})
</script>

<template>
  <a
    :href="href"
    class="group relative block w-full max-w-sm cursor-pointer rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg lg:max-w-md mx-auto"
  >
    <div class="flex flex-col">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold tracking-tight">{{ title }}</h2>
        <ArrowRight class="h-6 w-6 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
      </div>

      <div class="relative mb-6 h-36">
        <div
          v-for="(src, index) in images"
          :key="index"
          class="absolute h-full w-[45%] overflow-hidden rounded-lg border-2 border-background shadow-md transition-all duration-300 ease-in-out group-hover:translate-x-[var(--tx)] group-hover:rotate-[var(--r)]"
          :style="{
            transform: `translateX(${index * 42}px)`,
            '--tx': `${index * 80}px`,
            '--r': `${index * 5 - 5}deg`,
            zIndex: images.length - index,
          }"
        >
          <img
            :src="src"
            :alt="`${title} view ${index + 1}`"
            class="h-full w-full object-cover"
          />
        </div>
      </div>

      <div class="mb-4 mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
        <div v-if="!stats && !stack && !contract" class="flex items-center space-x-4">
          <div class="flex items-center space-x-1.5"><Clock class="h-4 w-4" /><span>~6 Hours</span></div>
          <div class="flex items-center space-x-1.5"><Settings class="h-4 w-4" /><span>8 km</span></div>
          <div class="flex items-center space-x-1.5"><Zap class="h-4 w-4" /><span>Medium</span></div>
        </div>
        <div v-else-if="stack || contract" class="flex flex-wrap gap-y-2 gap-x-4 items-center w-full">
          <div v-if="contract" class="flex items-center space-x-1.5 text-primary">
            <Clock class="h-4 w-4 shrink-0" />
            <span class="font-medium">{{ contract }}</span>
          </div>
          <div v-if="stack" class="flex items-center space-x-1.5">
            <Code class="h-4 w-4 shrink-0" />
            <span class="text-xs sm:text-sm">{{ stack }}</span>
          </div>
        </div>
        <div v-else v-for="(stat, index) in stats" :key="index" class="flex items-center space-x-1.5">
           <component :is="stat.icon" class="h-4 w-4" />
           <span>{{ stat.label }}</span>
        </div>
      </div>

      <p class="text-sm md:text-xl lg:text-xl font-regular tracking-tight leading-relaxed text-muted-foreground">
        {{ description }}
      </p>
    </div>
  </a>
</template>
