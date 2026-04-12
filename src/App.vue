<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import MiniNavbar from './components/ui/MiniNavbar.vue'
import SparklesCore from './components/ui/SparklesCore.vue'
import Typewriter from './components/ui/Typewriter.vue'
import ProjectShowcase from './components/ui/ProjectShowcase.vue'
import AnimatedHikeCard from './components/ui/AnimatedHikeCard.vue'
import FooterSection from './components/ui/FooterSection.vue'
import OrbitingSkills from './components/ui/OrbitingSkills.vue'

import MagicText from './components/ui/MagicText.vue'

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
      <!-- Minimalist Dark Hero Section -->
      <section class="relative w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
        
        <h1 class="md:text-4xl text-4xl lg:text-5xl font-bold tracking-tight text-center text-white relative z-20 mix-blend-lighten py-2">
          Call me Ahmad
        </h1>
        
        <div class="w-[40rem] h-40 relative flex flex-col items-center">
          <!-- Horizontal Glow Lines -->
          <div class="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-[2px] w-3/4 mx-auto blur-sm" />
          <div class="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-px w-3/4 mx-auto" />
          <div class="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent h-[5px] w-1/4 mx-auto blur-sm" />
          <div class="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px w-1/4 mx-auto" />

          <!-- Semi-circle Core Particles -->
          <SparklesCore
            id="tsparticles-hero"
            background="transparent"
            :minSize="0.4"
            :maxSize="1"
            :particleDensity="1200"
            class="w-full h-full absolute inset-0"
            particleColor="#FFFFFF"
          />

          <!-- Radial Gradient Edge Mask -->
          <div class="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)] pointer-events-none"></div>

          <!-- Typewriter Placement Below the horizontal line -->
          <div class="absolute top-12 z-20 w-full text-center text-lg md:text-2xl font-light text-cyan-100">
            <Typewriter
              :text="['Engineering the future', 'Pixel exact precision', 'Next-generation web']"
              :speed="70"
              :waitTime="2500"
              :deleteSpeed="30"
              cursorChar="_"
            />
          </div>
        </div>
      </section>

      <!-- Orbiting Skills & About Section -->
      <section class="w-full relative z-20 bg-background border-b border-white/5">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          <!-- Left Site: Orbiting Skills -->
          <div class="flex flex-col items-center order-2 lg:order-1">
            <h2 class="text-3xl md:text-5xl font-bold text-center mb-16 tracking-tight text-white/90">Our Core Stack</h2>
            <OrbitingSkills />
          </div>

          <!-- Right Side: Business Analyst Magic Text -->
          <div class="flex flex-col justify-center order-1 lg:order-2">
            <MagicText text="As an IT Business Analyst, I bridge the gap between complex stakeholder requirements and elegant technical execution. My focus is turning high-level business problems into actionable, functional digital solutions. By leveraging deep analytical strategies, optimizing digital workflows, and steering strategic product paths, I ensure every feature is scalable, robust, and driving high-impact results." />
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
          <h2 class="text-3xl md:text-5xl font-bold text-center mb-16 tracking-tight text-white/90">Latest Projects</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
             <AnimatedHikeCard 
                title="Booking System"
                description="Conquer the highest peaks with our guided mountain tours. Stunning vistas await."
              />
             <AnimatedHikeCard 
                title="POS System"
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
