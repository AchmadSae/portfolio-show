<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Papa from 'papaparse'
import { supabase } from '../lib/supabase'

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const isCheckingAuth = ref(false)
const session = ref<boolean>(false)

const adminKey = ref('')

onMounted(() => {
  // Simple check if already logged in via sessionStorage
  if (sessionStorage.getItem('admin_logged_in') === 'true') {
    session.value = true
  }
})

const handleLogin = () => {
  loading.value = true
  errorMsg.value = ''
  
  if (adminKey.value === import.meta.env.VITE_SUPABASE_ANON_KEY) {
    session.value = true
    sessionStorage.setItem('admin_logged_in', 'true')
  } else {
    errorMsg.value = 'Invalid Admin Key'
  }
  loading.value = false
}

const handleLogout = () => {
  session.value = false
  sessionStorage.removeItem('admin_logged_in')
}

// Upload Form State
const fileInput = ref<HTMLInputElement | null>(null)
const imageInput = ref<HTMLInputElement | null>(null)

const handleUpload = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  loading.value = true

  const csvFile = fileInput.value?.files?.[0]
  const imageFile = imageInput.value?.files?.[0]

  if (!csvFile) {
    errorMsg.value = 'Please select a CSV file.'
    loading.value = false
    return
  }

  let uploadedImageUrl = ''

  try {
    // 1. Upload Image if provided
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `article-images/${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('porto_bucket') 
        .upload(filePath, imageFile)

      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from('porto_bucket')
        .getPublicUrl(filePath)
      
      uploadedImageUrl = publicUrlData.publicUrl
    }

    // 2. Parse CSV
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data as any[]
          
          for (const row of rows) {
            const title = row.title || 'Untitled'
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000)
            const bodyText = row.body || row.overview || ''
            
            // Split body into paragraphs
            const paragraphs = bodyText.split('\n').filter((p: string) => p.trim() !== '')
            
            // Reconstruct the JSON structure for the article based on template
            const content = []
            
            if (paragraphs.length > 0) {
              content.push({ type: 'dropcap', text: paragraphs[0] })
            }
            if (paragraphs.length > 1) {
              content.push({ type: 'paragraph', text: paragraphs[1] })
            }

            content.push({ type: 'section', text: 'Section 01', extra: '01' })

            if (uploadedImageUrl || row.image_url) {
              content.push({ type: 'image', url: uploadedImageUrl || row.image_url })
            } else {
              content.push({ type: 'image', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=2560' }) // Fallback
            }

            for (let i = 2; i < paragraphs.length; i++) {
               content.push({ type: 'paragraph', text: paragraphs[i] })
            }

            const { error: insertError } = await supabase
              .from('articles')
              .insert({
                title,
                slug,
                content,
                cover_image_url: uploadedImageUrl || row.image_url || ''
              })
              
            if (insertError) throw new Error(`DB Insert Error: ${insertError.message}`)
          }
          
          successMsg.value = 'Successfully uploaded articles!'
          if (fileInput.value) fileInput.value.value = ''
          if (imageInput.value) imageInput.value.value = ''

        } catch (err: any) {
          errorMsg.value = err.message
        } finally {
          loading.value = false
        }
      },
      error: (err) => {
        errorMsg.value = `CSV Parse Error: ${err.message}`
        loading.value = false
      }
    })

  } catch (err: any) {
    errorMsg.value = err.message
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-black text-white/90 flex flex-col items-center justify-center p-6 selection:bg-white selection:text-black">
    <div v-if="isCheckingAuth">Loading...</div>
    
    <div v-else-if="!session" class="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Admin Login</h2>
      
      <div v-if="errorMsg" class="mb-4 text-red-400 text-sm p-3 bg-red-400/10 rounded-lg">
        {{ errorMsg }}
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs uppercase tracking-widest text-white/50 mb-2">Supabase Key</label>
          <input v-model="adminKey" type="password" placeholder="Enter your VITE_SUPABASE_ANON_KEY" class="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-white/30 transition-colors" />
        </div>
        <button 
          @click="handleLogin" 
          :disabled="loading"
          class="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Unlocking...' : 'Unlock Admin' }}
        </button>
      </div>
    </div>

    <div v-else class="w-full max-w-2xl">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <button @click="handleLogout" class="text-xs uppercase tracking-widest hover:text-white/70 transition-colors">Logout</button>
      </div>

      <div class="p-8 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
        <h2 class="text-xl font-bold mb-6">Upload New Article</h2>
        
        <div v-if="errorMsg" class="mb-4 text-red-400 text-sm p-3 bg-red-400/10 rounded-lg">
          {{ errorMsg }}
        </div>
        <div v-if="successMsg" class="mb-4 text-green-400 text-sm p-3 bg-green-400/10 rounded-lg">
          {{ successMsg }}
        </div>

        <div class="space-y-6">
          <div>
             <label class="block text-xs uppercase tracking-widest text-white/50 mb-2">Cover Image (Optional)</label>
             <input type="file" ref="imageInput" accept="image/*" class="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-colors" />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-widest text-white/50 mb-2">Article CSV</label>
            <p class="text-xs text-white/40 mb-3">Expected columns: title, overview, body</p>
            <input type="file" ref="fileInput" accept=".csv" class="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-colors" />
          </div>

          <button 
            @click="handleUpload" 
            :disabled="loading"
            class="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 mt-4"
          >
            {{ loading ? 'Processing...' : 'Upload & Create Article' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
