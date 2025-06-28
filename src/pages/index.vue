<script setup lang="ts">
import MusicPlayer from '../components/MusicPlayer.vue'

const name = ref('')

const router = useRouter()
function go() {
  if (name.value)
    router.push(`/hi/${encodeURIComponent(name.value)}`)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 py-8">
    <div>
      <!-- 原有内容 -->
      <div class="text-center mb-12">
        <div class="text-4xl inline-block mb-4" i-carbon-campsite />
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Vue Music Player
        </h1>
      </div>

      <!-- 音乐播放器 -->
        <MusicPlayer />
    </div>
  </div>
</template>

<style scoped>

</style>
