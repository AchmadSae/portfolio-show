<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../lib/supabase'
import MiniNavbar from '../components/ui/MiniNavbar.vue'
import FooterSection from '../components/ui/FooterSection.vue'
import ArticleParagraph from '../components/ui/ArticleParagraph.vue'

const article = ref<any>(null)
const loading = ref(true)
const recentArticles = ref<any[]>([])
const comments = ref<any[]>([])

const newCommentEmail = ref('')
const newCommentText = ref('')
const commentError = ref('')
const isPosting = ref(false)

const postComment = async () => {
  if (!newCommentEmail.value || !newCommentText.value) {
    commentError.value = "Email and comment are required."
    return
  }
  
  if (!article.value) {
    commentError.value = "Cannot post a comment on this placeholder article."
    return
  }

  isPosting.value = true
  commentError.value = ""

  const { data: existing } = await supabase
    .from('tmp_comments')
    .select('id')
    .eq('article_id', article.value.id)
    .eq('commenter_email', newCommentEmail.value)
    
  if (existing && existing.length > 0) {
    commentError.value = "You have already commented on this article."
    isPosting.value = false
    return
  }

  const { data, error } = await supabase
    .from('tmp_comments')
    .insert({
      article_id: article.value.id,
      commenter_email: newCommentEmail.value,
      content: newCommentText.value,
      status: 'approved'
    })
    .select()

  if (error) {
    commentError.value = error.message
  } else if (data && data.length > 0) {
    comments.value.unshift(data[0])
    newCommentText.value = ''
  }

  isPosting.value = false
}

const likes = ref(23)
const hasLiked = ref(false)

const handleLike = () => {
  if (!hasLiked.value) {
    likes.value++
    hasLiked.value = true
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options).toUpperCase()
}

const parsedContent = computed(() => {
  if (!article.value || !article.value.content) return null

  let contentData = article.value.content

  // Handle case where content is stored as a string (JSON string or raw text)
  if (typeof contentData === 'string') {
    try {
      contentData = JSON.parse(contentData)
    } catch (e) {
      // If it's plain text instead of JSON, split into paragraphs
      const paragraphs = contentData.split('\n').filter((p: string) => p.trim() !== '').map((p: string, idx: number) => ({
        type: idx === 0 ? 'dropcap' : 'paragraph',
        text: p
      }))
      
      // Include cover image if available
      if (article.value.cover_image_url) {
        paragraphs.unshift({ type: 'image', url: article.value.cover_image_url })
      }
      
      return paragraphs
    }
  }

  if (Array.isArray(contentData)) {
    return contentData
  }

  return null
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const fetchArticle = async (id?: string) => {
  scrollToTop()
  loading.value = true
  
  try {
    let data: any = null
    let error: any = null
    
    if (id) {
      const result = await supabase.from('articles').select('*').eq('id', id).single()
      data = result.data
      error = result.error
    } else {
      const result = await supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(1).single()
      data = result.data
      error = result.error
    }
      
    if (data && !error) {
      article.value = data
      
      const { data: commentsData } = await supabase
        .from('tmp_comments')
        .select('*')
        .eq('article_id', data.id)
        .order('created_at', { ascending: false })
        
      if (commentsData) {
        comments.value = commentsData
      }

      const { data: recentData } = await supabase
        .from('articles')
        .select('id, title')
        .neq('id', data.id)
        .order('created_at', { ascending: false })
        
      if (recentData) {
        recentArticles.value = recentData
      }
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticle()
})
</script>

<template>
  <div class="relative min-h-screen bg-background font-sans text-white/90 selection:bg-white selection:text-black">
    <!-- Top Navigation -->
    <MiniNavbar id="article-nav" />

    <main class="relative z-10 w-full flex flex-col items-center pt-32 pb-24">
      <article class="max-w-4xl w-full px-6 md:px-12 flex flex-col items-center">
        <!-- Date -->
        <div class="text-xs tracking-widest text-white/50 uppercase mb-8">
          {{ article ? formatDate(article.created_at) : '14 MAY 2015' }}
        </div>

        <!-- Title -->
        <h1 class="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-center leading-tight mb-12 max-w-3xl">
          {{ article ? article.title : "From Junior Designer to Creative Director and beyond. The things I've learnt along the way." }}
        </h1>

        <!-- Author Info -->
        <div class="flex items-center gap-4 mb-20">
          <div class="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-serif font-bold text-xl">
            V
          </div>
          <div class="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          </div>
        </div>

        <!-- Content Body -->
        <div class="w-full max-w-3xl">
          <template v-if="loading">
             <div class="animate-pulse flex flex-col gap-4 mb-12">
                <div class="h-4 bg-white/20 rounded w-full"></div>
                <div class="h-4 bg-white/20 rounded w-full"></div>
                <div class="h-4 bg-white/20 rounded w-3/4"></div>
             </div>
          </template>
          <template v-else-if="parsedContent && parsedContent.length > 0">
             <template v-for="(block, idx) in parsedContent" :key="idx">
                <ArticleParagraph v-if="block.type === 'dropcap'" :text="block.text" :dropCap="true" />
                <ArticleParagraph v-else-if="block.type === 'paragraph'" :text="block.text" />
                
                <div v-else-if="block.type === 'section'" class="flex items-center gap-4 my-12 justify-center">
                  <div class="h-px bg-white/20 w-12"></div>
                  <span class="font-serif italic text-white/70"><strong class="font-sans not-italic font-bold text-white mr-2">{{ block.extra || '01' }}</strong> {{ block.text }}</span>
                  <div class="h-px bg-white/20 w-12"></div>
                </div>

                <div v-else-if="block.type === 'image'" class="w-full mb-12">
                  <img :src="block.url" alt="Article Content" class="w-full h-auto object-cover rounded-md opacity-90 hover:opacity-100 transition-opacity" />
                </div>
                
                <div v-else-if="block.type === 'quote'" class="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
                  <div class="md:col-span-12 md:pl-8 md:border-l border-white/10 flex flex-col justify-center">
                    <blockquote class="font-serif text-2xl leading-snug mb-6 text-white">
                      {{ block.text }}
                    </blockquote>
                    <div class="flex items-center gap-3 text-xs tracking-wider uppercase font-bold text-white/70">
                      <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">"</div>
                      {{ block.extra || 'Author Reference' }}
                    </div>
                  </div>
                </div>
             </template>
          </template>
          <template v-else>
          <ArticleParagraph 
            text="I vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus."
            :dropCap="true"
          />

          <ArticleParagraph 
            text="Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
          />

          <!-- Section 01 -->
          <div class="flex items-center gap-4 my-12 justify-center">
            <div class="h-px bg-white/20 w-12"></div>
            <span class="font-serif italic text-white/70"><strong class="font-sans not-italic font-bold text-white mr-2">01</strong> Learn from people better than you</span>
            <div class="h-px bg-white/20 w-12"></div>
          </div>

          <!-- Image -->
          <div class="w-full mb-12">
            <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=2560" alt="Author working" class="w-full h-[300px] object-contain rounded-md opacity-90 hover:opacity-100 transition-opacity" />
          </div>

          <ArticleParagraph 
            text="At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus."
          />

          <ArticleParagraph 
            text="Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
          />

          <!-- Section 02 -->
          <div class="flex items-center gap-4 my-12 justify-center">
            <div class="h-px bg-white/20 w-12"></div>
            <span class="font-serif italic text-white/70"><strong class="font-sans not-italic font-bold text-white mr-2">02</strong> If you love it, do easy to hone your craft everyday and become awesome</span>
            <div class="h-px bg-white/20 w-12"></div>
          </div>

          <!-- Grid for text and quote -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            <div class="md:col-span-7">
              <ArticleParagraph 
                text="At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus."
              />
              <ArticleParagraph 
                text="Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
              />
            </div>
            
            <!-- Pull Quote -->
            <div class="md:col-span-5 md:pl-8 md:border-l border-white/10 flex flex-col justify-center">
              <blockquote class="font-serif text-2xl leading-snug mb-6 text-white">
                Nam libero tempore, cum soluta nobis est eligendi optio cumque minus id quod maxime placeat
              </blockquote>
              <div class="flex items-center gap-3 text-xs tracking-wider uppercase font-bold text-white/70">
                <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  "
                </div>
                Author Reference
              </div>
            </div>
          </div>
          </template>

          <!-- Bottom Actions -->
          <div class="flex items-center justify-center gap-8 py-8 border-t border-white/10 mt-16 text-sm tracking-widest uppercase text-white/60">
            <button 
              @click="handleLike" 
              :class="['transition-colors flex items-center gap-2', hasLiked ? 'text-white' : 'hover:text-white']"
            >
              <span :class="['w-1.5 h-1.5 rounded-full', hasLiked ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-current']"></span> 
              {{ likes }} Likes
            </button>
            <button class="hover:text-white transition-colors flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-current"></span> Share
            </button>
          </div>

          <!-- Comments Section -->
          <div class="mt-16">
            <div class="flex items-center justify-between mb-8 text-xs tracking-widest uppercase text-white/60">
              <span>Comments ({{ comments.length }})</span>
            </div>
            
            <div class="mb-12 space-y-8" v-if="comments.length > 0">
              <div v-for="comment in comments" :key="comment.id" class="border-b border-white/10 pb-8">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs uppercase">{{ comment.commenter_email.charAt(0) }}</div>
                  <div>
                    <div class="text-sm font-bold">{{ comment.commenter_email.split('@')[0] }}</div>
                    <div class="text-[10px] text-white/40 tracking-wider uppercase">{{ formatDate(comment.created_at) }}</div>
                  </div>
                </div>
                <p class="text-sm text-white/80 leading-relaxed">{{ comment.content }}</p>
              </div>
            </div>

            <div class="border border-white/10 p-4 rounded-md">
              <input v-model="newCommentEmail" type="email" placeholder="Your email address..." class="w-full bg-transparent border-none outline-none mb-4 text-white/90 placeholder-white/30 text-sm" />
              <div class="w-full h-px bg-white/10 mb-4"></div>
              <textarea v-model="newCommentText" placeholder="Leave a comment..." class="w-full bg-transparent border-none outline-none resize-none h-24 text-white/90 placeholder-white/30 text-sm"></textarea>
              <div class="flex justify-between items-center mt-4">
                <div class="text-xs text-red-400 max-w-[60%]">{{ commentError }}</div>
                <div class="flex gap-4">
                  <button @click="postComment" :disabled="isPosting" class="bg-white text-black text-xs font-bold tracking-widest uppercase px-6 py-2 hover:bg-white/90 transition-colors disabled:opacity-50">
                    {{ isPosting ? 'Posting...' : 'Post Comment' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>

    <!-- More Entries -->
    <section class="w-full bg-white/5 py-16 border-t border-white/10">
      <div class="max-w-4xl mx-auto px-6">
        <h3 class="text-xs font-bold tracking-widest uppercase text-center text-white/60 mb-12">More Entries</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          <div class="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block transform -translate-x-1/2"></div>
          
          <template v-if="recentArticles.length > 0">
            <a v-for="(item, index) in recentArticles" :key="item.id" @click.prevent="fetchArticle(item.id)" href="#" :class="[
              'group flex gap-4 p-4 hover:bg-white/5 transition-colors rounded-lg cursor-pointer',
              index % 2 === 1 ? 'text-right justify-end' : ''
            ]">
              <div v-if="index % 2 === 0" class="text-white/30 group-hover:text-white transition-colors mt-1">←</div>
              <div>
                <h4 class="font-serif font-bold text-lg leading-tight mb-2 group-hover:text-cyan-400 transition-colors">{{ item.title }}</h4>
              </div>
              <div v-if="index % 2 === 1" class="text-white/30 group-hover:text-white transition-colors mt-1">→</div>
            </a>
          </template>
          
          <template v-else>
            <a href="#/article" @click="scrollToTop" class="group flex gap-4 p-4 hover:bg-white/5 transition-colors rounded-lg">
              <div class="text-white/30 group-hover:text-white transition-colors mt-1">←</div>
              <div>
                <h4 class="font-serif font-bold text-lg leading-tight mb-2 group-hover:text-cyan-400 transition-colors">Making 6 figures as a freelance designer and working only 6 months in the year. How I do it.</h4>
              </div>
            </a>
            
            <a href="#/article" @click="scrollToTop" class="group flex gap-4 p-4 hover:bg-white/5 transition-colors rounded-lg text-right justify-end">
              <div>
                <h4 class="font-serif font-bold text-lg leading-tight mb-2 group-hover:text-cyan-400 transition-colors">My first design pack. The Blade ecommerce pack - download and check out the goodness.</h4>
              </div>
              <div class="text-white/30 group-hover:text-white transition-colors mt-1">→</div>
            </a>
          </template>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <FooterSection />

    <!-- Side Fixed "Subscribe to this shit" -->
    <div class="fixed left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-left ml-4 text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors cursor-pointer hidden xl:flex items-center gap-4">
      Support this project ~ KA_SAE
      <div class="w-16 h-px bg-current"></div>
    </div>
  </div>
</template>
