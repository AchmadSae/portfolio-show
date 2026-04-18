<script setup lang="ts">
const links = [
  { group: 'Products', items: [{ title: 'Article', href: '#' }, { title: 'Brainstorm', href: '#' }] },
  { group: 'Contact', items: [{ title: 'Email', href: '#' }, { title: 'Instagram', href: '#' }, { title: 'Facebook', href: '#' }, { title: 'Twitter', href: '#' }] }
]
</script>

<template>
  <footer class="bg-card border-t border-border py-8 sm:py-20 mt-20 relative z-10 w-full">
    <div class="mx-auto max-w-3xl px-6 flex flex-col items-center overflow-hidden">
      <a href="/" class="block font-bold text-2xl tracking-tight text-white mb-6">Connect with me</a>
      
      <div class="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
        <template v-for="(link, index) in links" :key="index">
          <a v-for="(item, i) in link.items" :key="`${index}-${i}`" :href="item.href" class="text-muted-foreground hover:text-primary transition-colors duration-150">
            {{ item.title }}
          </a>
        </template>
      </div>

      <div class="flex gap-6 mb-8">
        <a href="#" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-primary transition-colors">
          <svg class="size-10" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"></path></svg>
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-primary transition-colors">
          <svg class="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"></path></svg>
        </a>
      </div>

      <div class="pt-8 border-t border-border/50 text-center w-full">
        <span class="text-muted-foreground text-sm">© {{ new Date().getFullYear() }} KA Sae, All rights reserved</span>
      </div>
    </div>
  </footer>
</template>
