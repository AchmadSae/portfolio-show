<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const isOpen = ref(false)
const headerShapeClass = ref('rounded-full')
let shapeTimeout: ReturnType<typeof setTimeout> | null = null

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

watch(isOpen, (newVal) => {
  if (shapeTimeout) clearTimeout(shapeTimeout)
  if (newVal) {
    headerShapeClass.value = 'rounded-xl'
  } else {
    shapeTimeout = setTimeout(() => {
      headerShapeClass.value = 'rounded-full'
    }, 300)
  }
})

onUnmounted(() => {
  if (shapeTimeout) clearTimeout(shapeTimeout)
})

const navLinksData = [
  { label: 'Home', href: '#home' },
  { label: 'Project', href: '#projects' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Product', href: '#products' },
]
</script>

<template>
  <header
    :class="`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center pl-6 pr-6 py-3 backdrop-blur-md border border-[#333] bg-[#1f1f1f99] w-[calc(100%-2rem)] sm:w-auto transition-[border-radius] duration-300 ease-in-out ${headerShapeClass}`"
  >
    <div class="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
      <div class="flex items-center">
        <!-- Logo Element -->
        <div class="relative w-5 h-5 flex items-center justify-center">
          <span class="absolute w-1.5 h-1.5 rounded-full bg-gray-200 top-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
          <span class="absolute w-1.5 h-1.5 rounded-full bg-gray-200 left-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
          <span class="absolute w-1.5 h-1.5 rounded-full bg-gray-200 right-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
          <span class="absolute w-1.5 h-1.5 rounded-full bg-gray-200 bottom-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
        </div>
      </div>

      <nav class="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm font-medium">
        <a
          v-for="link in navLinksData"
          :key="link.href"
          :href="link.href"
          class="group relative inline-block overflow-hidden h-5 flex items-center text-sm"
        >
          <div class="flex flex-col transition-transform duration-300 ease-out transform group-hover:-translate-y-1/2">
            <span class="text-gray-400 font-medium">{{ link.label }}</span>
            <span class="text-white font-medium">{{ link.label }}</span>
          </div>
        </a>
      </nav>

      <div class="hidden sm:flex items-center gap-2 sm:gap-3">
        <button class="px-4 py-1.5 sm:px-3 text-xs sm:text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200 w-full sm:w-auto">
          LogIn
        </button>
        <div class="relative group w-full sm:w-auto">
          <div class="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
          <button class="relative z-10 px-4 py-1.5 sm:px-3 text-xs sm:text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200 w-full sm:w-auto">
            Signup
          </button>
        </div>
      </div>

      <button class="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none" @click="toggleMenu" :aria-label="isOpen ? 'Close Menu' : 'Open Menu'">
        <svg v-if="isOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
    </div>

    <div :class="`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`">
      <nav class="flex flex-col items-center space-y-4 text-base w-full">
        <a v-for="link in navLinksData" :key="link.href" :href="link.href" class="text-gray-300 hover:text-white transition-colors w-full text-center">
          {{ link.label }}
        </a>
      </nav>
      <div class="flex flex-col items-center space-y-4 mt-6 w-full">
        <button class="px-4 py-2 text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:text-white transition-colors duration-200 w-full">
          LogIn
        </button>
        <button class="px-4 py-2 text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full w-full">
          Signup
        </button>
      </div>
    </div>
  </header>
</template>
