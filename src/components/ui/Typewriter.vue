<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  text: {
    type: [String, Array],
    required: true
  },
  speed: {
    type: Number,
    default: 50
  },
  initialDelay: {
    type: Number,
    default: 0
  },
  waitTime: {
    type: Number,
    default: 2000
  },
  deleteSpeed: {
    type: Number,
    default: 30
  },
  loop: {
    type: Boolean,
    default: true
  },
  showCursor: {
    type: Boolean,
    default: true
  },
  hideCursorOnType: {
    type: Boolean,
    default: false
  },
  cursorChar: {
    type: String,
    default: '|'
  },
  cursorClass: {
    type: String,
    default: 'ml-1'
  }
})

const displayText = ref('')
const currentIndex = ref(0)
const isDeleting = ref(false)
const currentTextIndex = ref(0)

const texts = (Array.isArray(props.text) ? props.text : [props.text]) as string[]
let timeoutId: ReturnType<typeof setTimeout> | null = null

const startTyping = () => {
  const currentText = texts[currentTextIndex.value]

  if (isDeleting.value) {
    if (displayText.value === '') {
      isDeleting.value = false
      if (currentTextIndex.value === texts.length - 1 && !props.loop) return
      
      currentTextIndex.value = (currentTextIndex.value + 1) % texts.length
      currentIndex.value = 0
      timeoutId = setTimeout(() => { startTyping() }, props.waitTime)
    } else {
      timeoutId = setTimeout(() => {
        displayText.value = displayText.value.slice(0, -1)
        startTyping()
      }, props.deleteSpeed)
    }
  } else {
    if (currentIndex.value < currentText.length) {
      timeoutId = setTimeout(() => {
        displayText.value += currentText[currentIndex.value]
        currentIndex.value++
        startTyping()
      }, props.speed)
    } else if (texts.length > 1) {
      timeoutId = setTimeout(() => {
        isDeleting.value = true
        startTyping()
      }, props.waitTime)
    }
  }
}

onMounted(() => {
  if (props.initialDelay > 0) {
    timeoutId = setTimeout(startTyping, props.initialDelay)
  } else {
    startTyping()
  }
})

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<template>
  <div class="inline whitespace-pre-wrap tracking-tight">
    <span>{{ displayText }}</span>
    <span
      v-if="showCursor"
      :class="[
         cursorClass, 
         'animate-pulse transition-opacity',
         (hideCursorOnType && (currentIndex < texts[currentTextIndex].length || isDeleting)) ? 'hidden' : ''
      ]"
    >
      {{ cursorChar }}
    </span>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: cursor-blink 1s step-start infinite;
}
@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
