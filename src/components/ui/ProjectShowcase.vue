<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'

interface Project {
  title: string
  description: string
  year: string
  link: string
  image: string
}

const projects: Project[] = [
  {
    title: "Lumina",
    description: "AI-powered design system generator.",
    year: "2024",
    link: "#",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2670"
  },
  {
    title: "Flux",
    description: "Real-time collaboration for creative teams.",
    year: "2024",
    link: "#",
    image: "https://images.unsplash.com/photo-1530435460869-d13625c69bbf?q=80&w=2670"
  },
  {
    title: "Prism",
    description: "Color palette extraction from any image.",
    year: "2023",
    link: "#",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=2670"
  },
  {
    title: "Vertex",
    description: "3D modeling toolkit for the web.",
    year: "2023",
    link: "#",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670"
  }
]

const hoveredIndex = ref<number | null>(null)
const mousePosition = reactive({ x: 0, y: 0 })
const smoothPosition = reactive({ x: 0, y: 0 })
const isVisible = ref(false)
const containerRef = ref<HTMLElement | null>(null)
let animationRef: number | null = null

const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor
}

const animate = () => {
  smoothPosition.x = lerp(smoothPosition.x, mousePosition.x, 0.15)
  smoothPosition.y = lerp(smoothPosition.y, mousePosition.y, 0.15)
  animationRef = requestAnimationFrame(animate)
}

onMounted(() => {
  animationRef = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animationRef) cancelAnimationFrame(animationRef)
})

const handleMouseMove = (e: MouseEvent) => {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    mousePosition.x = e.clientX - rect.left
    mousePosition.y = e.clientY - rect.top
  }
}

const handleMouseEnter = (index: number) => {
  hoveredIndex.value = index
  isVisible.value = true
}

const handleMouseLeave = () => {
  hoveredIndex.value = null
  isVisible.value = false
}
</script>

<template>
  <section ref="containerRef" @mousemove="handleMouseMove" class="relative w-full max-w-2xl mx-auto px-6 py-16">
    <h2 class="text-3xl md:text-5xl font-bold text-center mb-16 tracking-tight text-white/90">Selected Work</h2>

    <div
      class="pointer-events-none absolute z-50 overflow-hidden rounded-xl shadow-2xl transition-[opacity,transform] duration-300 ease-out"
      :style="{
        left: 0, top: 0,
        transform: `translate3d(${smoothPosition.x + 20}px, ${smoothPosition.y - 100}px, 0) scale(${isVisible ? 1 : 0.8})`,
        opacity: isVisible ? 1 : 0,
      }"
    >
      <div class="relative w-[280px] h-[180px] bg-secondary rounded-xl overflow-hidden">
        <img
          v-for="(project, index) in projects"
          :key="project.title"
          :src="project.image"
          :alt="project.title"
          class="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
          :style="{
            opacity: hoveredIndex === index ? 1 : 0,
            transform: `scale(${hoveredIndex === index ? 1 : 1.1})`,
            filter: hoveredIndex === index ? 'none' : 'blur(10px)'
          }"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
      </div>
    </div>

    <div class="space-y-0 relative z-10 w-full mb-8">
      <a
        v-for="(project, index) in projects"
        :key="project.title"
        :href="project.link"
        class="group block relative"
        @mouseenter="handleMouseEnter(index)"
        @mouseleave="handleMouseLeave"
      >
        <div class="relative py-5 border-t border-border transition-all duration-300 ease-out">
          <div
            class="absolute inset-0 -mx-4 px-4 bg-secondary/50 rounded-lg transition-all duration-300 ease-out"
            :class="hoveredIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95'"
          />

          <div class="relative flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="inline-flex items-center gap-2">
                <h3 class="text-foreground font-bold text-2xl tracking-tight">
                  <span class="relative">
                    {{ project.title }}
                    <span
                      class="absolute left-0 -bottom-0.5 h-px bg-foreground transition-all duration-300 ease-out"
                      :class="hoveredIndex === index ? 'w-full' : 'w-0'"
                    />
                  </span>
                </h3>
                <ArrowUpRight
                  class="w-4 h-4 text-muted-foreground transition-all duration-300 ease-out"
                  :class="hoveredIndex === index ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 -translate-x-2 translate-y-2'"
                />
              </div>

              <p
                class="text-sm md:text-xl lg:text-xl font-regular tracking-tight mt-2 leading-relaxed transition-all duration-300 ease-out"
                :class="hoveredIndex === index ? 'text-foreground/70' : 'text-muted-foreground'"
              >
                {{ project.description }}
              </p>
            </div>

            <span
              class="text-xs font-mono tabular-nums transition-all duration-300 ease-out mt-1"
              :class="hoveredIndex === index ? 'text-foreground/60' : 'text-muted-foreground'"
            >
              {{ project.year }}
            </span>
          </div>
        </div>
      </a>

      <div class="border-t border-border" />
    </div>
  </section>
</template>
