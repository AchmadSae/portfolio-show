<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import MiniNavbar from './components/ui/MiniNavbar.vue'
import SparklesCore from './components/ui/SparklesCore.vue'
import Typewriter from './components/ui/Typewriter.vue'
import ProjectShowcase from './components/ui/ProjectShowcase.vue'
import AnimatedHikeCard from './components/ui/AnimatedHikeCard.vue'
import FooterSection from './components/ui/FooterSection.vue'

// Custom Cursor Animation
const cursorX = ref(0)
const cursorY = ref(0)
const dotX = ref(0)
const dotY = ref(0)
let reqId: number

const updateCursor = (e: MouseEvent) => {
  cursorX.value = e.clientX
  cursorY.value = e.clientY
}

const animateCursor = () => {
  dotX.value += (cursorX.value - dotX.value) * 0.2
  dotY.value += (cursorY.value - dotY.value) * 0.2
  reqId = requestAnimationFrame(animateCursor)
}

onMounted(() => {
  window.addEventListener('mousemove', updateCursor)
  animateCursor()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateCursor)
  cancelAnimationFrame(reqId)
})
</script>

<template>
  <div class="relative min-h-screen bg-background font-sans overflow-x-hidden selection:bg-white selection:text-black cursor-none custom-cursor-wrapper">
    <!-- Custom Cursor -->
    <div 
      class="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/40 pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 transition-transform ease-out duration-75 mix-blend-difference hidden md:block" 
      :style="{ left: `${dotX}px`, top: `${dotY}px` }"
    ></div>
    <div 
      class="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block" 
      :style="{ left: `${cursorX}px`, top: `${cursorY}px` }"
    ></div>

    <MiniNavbar id="home" />

    <main class="relative z-10 w-full flex flex-col items-center">
      <!-- Hero Section -->
      <section class="relative w-full h-[100vh] flex flex-col items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0">
          <SparklesCore 
            id="tsparticles-hero"
            background="transparent"
            :minSize="0.6"
            :maxSize="1.5"
            :particleDensity="120"
            particleColor="#ffffff"
            :speed="0.5"
          />
        </div>
        <!-- Gradient Masks -->
        <div class="absolute inset-x-20 top-1/4 bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-[2px] w-3/4 mx-auto blur-sm opacity-50" />
        <div class="absolute inset-x-20 top-1/4 bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-px w-3/4 mx-auto opacity-50" />
        
        <div class="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto space-y-8 mt-20">
          <h1 class="md:text-6xl text-5xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 tracking-tight leading-tight mix-blend-lighten">
            We build the future.
          </h1>
          <div class="text-xl md:text-3xl lg:text-4xl font-light text-gray-300 h-20">
            <p class="whitespace-pre-wrap">
              <span>We're born to </span>
              <Typewriter
                :text="['experience', 'dance', 'love', 'be alive', 'create things that make the world a better place']"
                :speed="70"
                class="text-cyan-400 font-medium"
                :waitTime="1500"
                :deleteSpeed="40"
                cursorChar="_"
              />
            </p>
          </div>
        </div>
      </section>

      <!-- Projects Section -->
      <div id="projects" class="w-full relative z-20 bg-background/50 backdrop-blur-xl border-t border-white/5 py-12">
        <ProjectShowcase />
      </div>

      <!-- Features / Highlight Cards Section -->
      <section id="portfolio" class="w-full relative z-20 py-24 px-6 relative">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/30 pointer-events-none" />
        <div class="max-w-5xl mx-auto">
          <h2 class="text-3xl md:text-5xl font-bold text-center mb-16 tracking-tight text-white/90">Our Latest Expeditions</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
             <AnimatedHikeCard 
                title="Alpine Heights"
                description="Conquer the highest peaks with our guided mountain tours. Stunning vistas await."
              />
             <AnimatedHikeCard 
                title="Forest Trail"
                description="A serene walk through dense ancient forests, blending nature with inner peace."
                :images="[
                  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560',
                  'https://images.unsplash.com/photo-1473448928956-c40dced5447f?q=80&w=2560',
                  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2560'
                ]"
              />
          </div>
        </div>
      </section>
    </main>

    <div id="products" class="relative z-30">
      <FooterSection />
    </div>
  </div>
</template>

<style>
/* Remove default cursors across the app when on desktop to ensure custom cursor acts alone */
@media (min-width: 768px) {
  .custom-cursor-wrapper,
  .custom-cursor-wrapper * {
    cursor: none !important;
  }
}
</style>
