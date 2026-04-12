<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  id?: string
  background?: string
  particleSize?: number
  minSize?: number
  maxSize?: number
  speed?: number
  particleColor?: string
  particleDensity?: number
}>()

const isLoaded = ref(false)

const particlesLoaded = async () => {
  isLoaded.value = true
}

// Ensure the component handles tsparticles rendering with simple default mode
</script>

<template>
  <div class="relative w-full h-full" :class="{ 'opacity-100 transition-opacity duration-1000 ease-in-out': isLoaded, 'opacity-0': !isLoaded }">
    <vue-particles
      :id="id || 'tsparticles'"
      class="w-full h-full"
      @particles-loaded="particlesLoaded"
      :options="{
        background: { color: { value: background || 'transparent' } },
        fullScreen: { enable: false, zIndex: 1 },
        fpsLimit: 120,
        particles: {
          color: { value: particleColor || '#ffffff' },
          links: { enable: false },
          move: {
            direction: 'none',
            enable: true,
            outModes: { default: 'out' },
            random: false,
            speed: speed || { min: 0.1, max: 1 },
            straight: false,
          },
          number: {
            density: { enable: true, width: 400, height: 400 },
            value: particleDensity || 120,
          },
          opacity: {
            value: { min: 0.1, max: 1 },
            animation: { enable: true, speed: speed || 2, sync: false },
          },
          shape: { type: 'circle' },
          size: {
            value: { min: minSize || 0.4, max: maxSize || 2 },
          },
        },
        detectRetina: true,
      }"
    />
  </div>
</template>
