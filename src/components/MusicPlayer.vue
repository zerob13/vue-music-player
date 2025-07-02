<script setup lang="ts">
import type { Song } from './type'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import svg from '../../public/favicon.svg?raw'

const props = defineProps({
  playlist: {
    type: Array as () => Song[],
    required: true,
  },
  initialPosition: {
    type: Object as () => { x?: number, y?: number },
    default: () => ({}),
  },
})

// 响应式数据
const isPlaying = ref(false)
const isLoading = ref(false)
const isExpanded = ref(false) // 添加展开状态
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7)
const currentIndex = ref(0)
const hasError = ref(false)
const errorMessage = ref('')

// 进度条相关
const isDragging = ref(false)
const isHovering = ref(false)
const tooltipPosition = ref(0)
const tooltipTime = ref(0)
const bufferPercentage = ref(0)

// 音量拖拽相关
const isVolumeDragging = ref(false)
const showVolumeSlider = ref(false)
const isVolumeButtonDragging = ref(false)
const isMuted = ref(false)
const volumeBeforeMute = ref(0.7) // 静音前的音量

// 播放器拖拽和缩放相关
const isDraggingPlayer = ref(false)
const isResizing = ref(false)
const playerPosition = ref({ x: 50, y: 50 }) // 设置一个安全的初始位置

// 位置记忆相关的状态
const miniPosition = ref({ x: 0, y: 0 }) // mini模式的位置
const playerSize = ref({ width: 320, height: 'auto' })
const dragOffset = ref({ x: 0, y: 0 })
const hasDraggedPlayer = ref(false) // 添加标记来跟踪是否真正拖拽了

// 封面图片加载相关
const coverImageError = ref(false)

// 播放模式：sequence 顺序播放，loop 单曲循环，random 随机播放
const playMode = ref<'sequence' | 'loop' | 'random'>('sequence')

// 默认的音乐封面SVG占位图
const defaultCoverSvg = `data:image/svg+xml;base64,${btoa(svg)}`

// 处理封面图片加载错误
function handleCoverImageError() {
  coverImageError.value = true
}

// 重置封面图片错误状态
function resetCoverImageError() {
  coverImageError.value = false
}

const currentSong = computed(() => props.playlist[currentIndex.value])
// 获取当前封面图片URL
const currentCover = computed(() => {
  return coverImageError.value ? defaultCoverSvg : currentSong.value.cover
})

// 歌词相关
const showLyrics = ref(false)
const currentLyricIndex = ref(-1)
const lastScrollTime = ref(0) // 添加滚动防抖
const autoScrollLyrics = ref(true) // 自动滚动开关

// DOM 引用
const audioPlayer = ref<HTMLAudioElement>()
const progressBar = ref<HTMLElement>()
const volumeBar = ref<HTMLElement>()
const lyricsContainer = ref<HTMLElement>()

// 事件监听器引用
let resizeHandler: (() => void) | null = null
let clickHandler: ((event: Event) => void) | null = null

// 计算属性
const progressPercentage = computed(() =>
  duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0,
)
const currentLyrics = computed(() => currentSong.value.lyrics || [])

// 方法
function toggleExpanded() {
  if (isExpanded.value) {
    // 当前是展开模式，要切换到mini模式
    // 恢复到mini模式的保存位置
    playerPosition.value = { ...miniPosition.value }
  }
  else {
    // 当前是mini模式，要切换到展开模式
    // 保存当前mini模式的位置
    miniPosition.value = { ...playerPosition.value }

    // 展开模式始终居中显示
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const expandedWidth = 320 // 展开模式的宽度
    const expandedHeight = 830 // 展开模式的高度

    playerPosition.value = {
      x: (windowWidth - expandedWidth) / 2,
      y: (windowHeight - expandedHeight) / 2,
    }
  }

  isExpanded.value = !isExpanded.value

  // 切换后检查边界
  setTimeout(() => {
    checkPlayerBoundaries()
  }, 50)
}

// 处理迷你播放器点击事件 - 避免拖拽时触发切换
function handleMiniPlayerClick() {
  // 如果真正拖拽了播放器，不执行切换操作
  if (hasDraggedPlayer.value) {
    return
  }
  toggleExpanded()
}

async function togglePlay() {
  if (!audioPlayer.value)
    return

  try {
    // 如果有错误，先尝试重新加载
    if (hasError.value) {
      await loadCurrentSong()
      return
    }

    if (isPlaying.value) {
      audioPlayer.value.pause()
      isPlaying.value = false
    }
    else {
      await audioPlayer.value.play()
      isPlaying.value = true
    }
  }
  catch (error) {
    console.error('播放错误:', error)
    hasError.value = true
    errorMessage.value = `播放失败: ${currentSong.value.title}`
    isPlaying.value = false
  }
}

function nextSong() {
  if (playMode.value === 'loop') {
    // 单曲循环模式下，点击下一首应该重新播放当前歌曲
    if (audioPlayer.value) {
      audioPlayer.value.currentTime = 0
      if (isPlaying.value) {
        audioPlayer.value.play().catch((error) => {
          console.error('重新播放失败:', error)
        })
      }
    }
    return
  }

  if (playMode.value === 'random') {
    // 随机播放，不能和当前一样
    let next = Math.floor(Math.random() * props.playlist.length)
    if (props.playlist.length > 1) {
      while (next === currentIndex.value) {
        next = Math.floor(Math.random() * props.playlist.length)
      }
    }
    currentIndex.value = next
    loadCurrentSong()
    return
  }

  // 顺序播放模式
  if (currentIndex.value < props.playlist.length - 1) {
    currentIndex.value++
    loadCurrentSong()
  }
  // 顺序播放到最后一首就不再继续
}

function previousSong() {
  if (playMode.value === 'loop') {
    // 单曲循环模式下，点击上一首应该重新播放当前歌曲
    if (audioPlayer.value) {
      audioPlayer.value.currentTime = 0
      if (isPlaying.value) {
        audioPlayer.value.play().catch((error) => {
          console.error('重新播放失败:', error)
        })
      }
    }
    return
  }

  if (playMode.value === 'random') {
    // 随机播放时，上一首也随机选择
    let prev = Math.floor(Math.random() * props.playlist.length)
    if (props.playlist.length > 1) {
      while (prev === currentIndex.value) {
        prev = Math.floor(Math.random() * props.playlist.length)
      }
    }
    currentIndex.value = prev
    loadCurrentSong()
    return
  }

  // 顺序播放模式
  if (currentIndex.value > 0) {
    currentIndex.value--
    loadCurrentSong()
  }
  // 顺序播放到第一首就不再继续
}

// 自动跳过有错误的歌曲
async function skipToNextPlayableSong() {
  let attempts = 0
  const maxAttempts = props.playlist.length

  while (attempts < maxAttempts && hasError.value) {
    if (currentIndex.value < props.playlist.length - 1) {
      currentIndex.value++
    }
    else {
      // 如果是最后一首，从头开始
      currentIndex.value = 0
    }

    await loadCurrentSong()
    attempts++

    // 如果找到可播放的歌曲，跳出循环
    if (!hasError.value) {
      break
    }
  }

  if (attempts >= maxAttempts) {
    console.warn('所有歌曲都无法播放')
    isPlaying.value = false
  }
}

async function loadCurrentSong() {
  if (!audioPlayer.value)
    return

  try {
    isLoading.value = true
    hasError.value = false
    errorMessage.value = ''

    // 停止当前播放
    audioPlayer.value.pause()

    // 设置新的音频源
    audioPlayer.value.src = currentSong.value.src

    // 重置播放时间
    currentTime.value = 0

    // 加载音频
    audioPlayer.value.load()

    // 如果之前在播放状态，尝试自动播放
    if (isPlaying.value) {
      // 等待音频可以播放
      await new Promise((resolve, reject) => {
        function handleCanPlay() {
          audioPlayer.value?.removeEventListener('canplay', handleCanPlay)
          audioPlayer.value?.removeEventListener('error', handleError)
          resolve(undefined)
        }
        function handleError(e: Event) {
          audioPlayer.value?.removeEventListener('canplay', handleCanPlay)
          audioPlayer.value?.removeEventListener('error', handleError)
          reject(e)
        }

        audioPlayer.value?.addEventListener('canplay', handleCanPlay, { once: true })
        audioPlayer.value?.addEventListener('error', handleError, { once: true })

        // 5秒超时
        setTimeout(() => {
          audioPlayer.value?.removeEventListener('canplay', handleCanPlay)
          audioPlayer.value?.removeEventListener('error', handleError)
          reject(new Error('加载超时'))
        }, 5000)
      })

      await audioPlayer.value.play()
    }
  }
  catch (error) {
    console.error('加载歌曲错误:', error)
    hasError.value = true
    errorMessage.value = `无法加载: ${currentSong.value.title}`
    isPlaying.value = false
  }
  finally {
    isLoading.value = false
  }
}

function seekTo(event: MouseEvent) {
  if (!progressBar.value || !audioPlayer.value)
    return

  const rect = progressBar.value.getBoundingClientRect()
  const percentage = (event.clientX - rect.left) / rect.width
  const newTime = percentage * duration.value

  audioPlayer.value.currentTime = newTime
  currentTime.value = newTime
}

function setVolumeHorizontal(event: MouseEvent) {
  if (!volumeBar.value || !audioPlayer.value)
    return

  const rect = volumeBar.value.getBoundingClientRect()
  const percentage = (event.clientX - rect.left) / rect.width // 横向滑块，从左到右

  volume.value = Math.max(0, Math.min(1, percentage))
  audioPlayer.value.volume = volume.value

  // 通过滑块调整音量时取消静音状态
  if (volume.value > 0) {
    isMuted.value = false
  }
}

// 音量拖拽功能
function startVolumeDragging(event: MouseEvent) {
  isVolumeDragging.value = true
  setVolumeHorizontal(event)
  document.addEventListener('mousemove', onVolumeDragging)
  document.addEventListener('mouseup', stopVolumeDragging)
  event.preventDefault()
  event.stopPropagation()
}

function onVolumeDragging(event: MouseEvent) {
  if (!isVolumeDragging.value || !volumeBar.value)
    return
  setVolumeHorizontal(event)
  event.preventDefault()
}

function stopVolumeDragging() {
  isVolumeDragging.value = false
  document.removeEventListener('mousemove', onVolumeDragging)
  document.removeEventListener('mouseup', stopVolumeDragging)
}

// 音量按钮拖拽功能 - 点击音量按钮后可直接左右拖动调整音量
function startVolumeButtonDragging(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()

  isVolumeButtonDragging.value = true
  showVolumeSlider.value = true

  const startX = event.clientX
  const startVolume = volume.value
  let hasDragged = false // 跟踪是否发生了拖拽

  const onVolumeButtonDrag = (dragEvent: MouseEvent) => {
    if (!isVolumeButtonDragging.value)
      return

    const deltaX = Math.abs(dragEvent.clientX - startX)

    // 如果鼠标移动超过5px，认为是拖拽
    if (deltaX > 5) {
      hasDragged = true

      const sensitivity = 0.005 // 调整灵敏度
      const newVolume = Math.max(0, Math.min(1, startVolume + (dragEvent.clientX - startX) * sensitivity))

      volume.value = newVolume
      isMuted.value = false // 拖拽时取消静音状态

      if (audioPlayer.value) {
        audioPlayer.value.volume = newVolume
      }
    }

    dragEvent.preventDefault()
  }

  const stopVolumeButtonDrag = (upEvent: MouseEvent) => {
    isVolumeButtonDragging.value = false
    document.removeEventListener('mousemove', onVolumeButtonDrag)
    document.removeEventListener('mouseup', stopVolumeButtonDrag)

    // 如果没有拖拽，则执行静音切换
    if (!hasDragged) {
      toggleMute()
    }

    upEvent.preventDefault()
    upEvent.stopPropagation()
  }

  document.addEventListener('mousemove', onVolumeButtonDrag)
  document.addEventListener('mouseup', stopVolumeButtonDrag)
}

// 音量静音切换
function toggleMute() {
  if (isMuted.value) {
    // 取消静音，恢复之前的音量
    volume.value = volumeBeforeMute.value
    isMuted.value = false
  }
  else {
    // 静音，保存当前音量
    volumeBeforeMute.value = volume.value
    volume.value = 0
    isMuted.value = true
  }

  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value
  }
}

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function onLoadedMetadata() {
  if (audioPlayer.value) {
    duration.value = audioPlayer.value.duration
  }
}

function onTimeUpdate() {
  if (audioPlayer.value) {
    currentTime.value = audioPlayer.value.currentTime
    updateCurrentLyricIndex()
    updateBufferProgress()
  }
}

function onSongEnd() {
  if (playMode.value === 'loop') {
    // 单曲循环 - 重置到开头继续播放
    if (audioPlayer.value) {
      audioPlayer.value.currentTime = 0
      audioPlayer.value.play().catch((error) => {
        console.error('单曲循环播放失败:', error)
        hasError.value = true
        errorMessage.value = `播放失败: ${currentSong.value.title}`
        isPlaying.value = false
      })
    }
    return
  }
  if (playMode.value === 'random') {
    nextSong()
    return
  }
  if (currentIndex.value < props.playlist.length - 1) {
    nextSong()
  }
  else {
    isPlaying.value = false
  }
}

function onAudioError(error: Event) {
  console.error('音频播放错误:', error)
  const audioElement = error.target as HTMLAudioElement

  // 获取更详细的错误信息
  let errorDetails = '未知错误'
  if (audioElement && audioElement.error) {
    switch (audioElement.error.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        errorDetails = '播放被中止'
        break
      case MediaError.MEDIA_ERR_NETWORK:
        errorDetails = '网络错误'
        break
      case MediaError.MEDIA_ERR_DECODE:
        errorDetails = '音频解码错误'
        break
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorDetails = '音频格式不支持或文件不存在'
        break
      default:
        errorDetails = '播放失败'
    }
  }

  hasError.value = true
  errorMessage.value = `${errorDetails}: ${currentSong.value.title}`
  isPlaying.value = false
  isLoading.value = false

  console.log(`音频错误详情: ${errorDetails}`)
  console.log(`文件路径: ${currentSong.value.src}`)
}

function onAudioCanPlay() {
  console.log('音频可以播放')
  hasError.value = false
  errorMessage.value = ''
  isLoading.value = false
}

function onLoadStart() {
  isLoading.value = true
}

// 进度条拖拽功能
function startDragging(event: MouseEvent) {
  isDragging.value = true
  seekTo(event)
  document.addEventListener('mousemove', onDragging)
  document.addEventListener('mouseup', stopDragging)
}

function onDragging(event: MouseEvent) {
  if (!isDragging.value || !progressBar.value)
    return

  const rect = progressBar.value.getBoundingClientRect()
  const percentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
  tooltipPosition.value = percentage * 100
  tooltipTime.value = percentage * duration.value

  if (audioPlayer.value) {
    audioPlayer.value.currentTime = tooltipTime.value
  }
}

// 进度条悬停处理函数
function onProgressHover(event: MouseEvent) {
  if (!progressBar.value || isDragging.value)
    return

  const rect = progressBar.value.getBoundingClientRect()
  const percentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
  tooltipPosition.value = percentage * 100
  tooltipTime.value = percentage * duration.value
}

function stopDragging() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDragging)
  document.removeEventListener('mouseup', stopDragging)
}

// 歌词相关功能
function toggleLyrics() {
  showLyrics.value = !showLyrics.value
}

function seekToLyricTime(time: number) {
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = time
    currentTime.value = time
  }
}

function updateCurrentLyricIndex() {
  const lyrics = currentLyrics.value
  if (lyrics.length === 0) {
    currentLyricIndex.value = -1
    return
  }

  let index = -1
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime.value >= lyrics[i].time) {
      index = i
    }
    else {
      break
    }
  }

  // 只有当歌词索引真正变化时才更新和滚动
  if (currentLyricIndex.value !== index) {
    const previousIndex = currentLyricIndex.value
    currentLyricIndex.value = index

    // 自动滚动歌词 - 添加防抖机制和开关控制
    const now = Date.now()
    if (autoScrollLyrics.value && index >= 0 && lyricsContainer.value && index !== previousIndex && (now - lastScrollTime.value) > 800) {
      lastScrollTime.value = now

      const activeLine = lyricsContainer.value.children[index] as HTMLElement
      if (activeLine) {
        // 使用更温和的滚动方式
        const container = lyricsContainer.value
        const lineTop = activeLine.offsetTop
        const lineHeight = activeLine.offsetHeight
        const containerHeight = container.clientHeight
        const scrollTop = container.scrollTop

        // 只有当当前行不在可视区域中央时才滚动
        const lineCenter = lineTop + lineHeight / 2
        const containerCenter = scrollTop + containerHeight / 2
        const threshold = containerHeight * 0.3 // 30%的容器高度作为阈值

        if (Math.abs(lineCenter - containerCenter) > threshold) {
          // 计算目标滚动位置，让当前行在容器中央
          const targetScrollTop = lineTop - containerHeight / 2 + lineHeight / 2

          container.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth',
          })
        }
      }
    }
  }
}

// 更新缓冲进度
function updateBufferProgress() {
  if (!audioPlayer.value || !duration.value)
    return

  const buffered = audioPlayer.value.buffered
  if (buffered.length > 0) {
    const bufferedEnd = buffered.end(buffered.length - 1)
    bufferPercentage.value = (bufferedEnd / duration.value) * 100
  }
}

// 播放器拖拽功能
function startPlayerDragging(event: MouseEvent) {
  // 阻止在可交互元素上开始拖拽
  const target = event.target as HTMLElement
  const interactiveElements = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A']
  const hasInteractiveClass = target.closest('.progress-bar, .volume-slider-container, .volume-controls, .lyrics-line, .volume-btn, .close-btn')

  if (interactiveElements.includes(target.tagName) || hasInteractiveClass) {
    return
  }

  isDraggingPlayer.value = true
  hasDraggedPlayer.value = false // 重置拖拽标记
  dragOffset.value = {
    x: event.clientX - playerPosition.value.x,
    y: event.clientY - playerPosition.value.y,
  }
  document.addEventListener('mousemove', onPlayerDragging)
  document.addEventListener('mouseup', stopPlayerDragging)
  event.preventDefault()
  event.stopPropagation()
}

function onPlayerDragging(event: MouseEvent) {
  if (!isDraggingPlayer.value)
    return

  // 计算新位置
  const newX = event.clientX - dragOffset.value.x
  const newY = event.clientY - dragOffset.value.y

  // 如果鼠标移动超过5px，则认为是真正的拖拽
  const deltaX = Math.abs(newX - playerPosition.value.x)
  const deltaY = Math.abs(newY - playerPosition.value.y)
  if (deltaX > 5 || deltaY > 5) {
    hasDraggedPlayer.value = true
  }

  // 获取播放器尺寸
  const playerWidth = isExpanded.value ? playerSize.value.width : 320

  let playerHeight
  if (isExpanded.value) {
    playerHeight = 605
    if (showLyrics.value) {
      playerHeight += 225
    }
    if (hasError.value) {
      playerHeight += 130 // 错误提示区域额外高度
    }
  }
  else {
    playerHeight = 64
  }

  // 获取窗口尺寸
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  // 应用边界限制，保留16px边距
  const margin = 16
  const boundedX = Math.max(margin, Math.min(newX, windowWidth - playerWidth - margin))
  const boundedY = Math.max(margin, Math.min(newY, windowHeight - playerHeight - margin))

  console.log(`拖拽位置: (${boundedX}, ${boundedY})`, playerHeight)
  playerPosition.value = {
    x: boundedX,
    y: boundedY,
  }
  event.preventDefault()
}

function stopPlayerDragging(event?: MouseEvent) {
  document.removeEventListener('mousemove', onPlayerDragging)
  document.removeEventListener('mouseup', stopPlayerDragging)

  // 立即重置拖拽状态
  isDraggingPlayer.value = false

  // 如果真正发生了拖拽且是在mini模式下，记录位置
  if (hasDraggedPlayer.value && !isExpanded.value) {
    miniPosition.value = { ...playerPosition.value }

    // 延迟重置当前拖拽标记
    setTimeout(() => {
      hasDraggedPlayer.value = false
    }, 100)
  }

  // 对于展开模式，拖拽后不需要记录位置，因为下次展开仍然会居中
  if (hasDraggedPlayer.value && isExpanded.value) {
    setTimeout(() => {
      hasDraggedPlayer.value = false
    }, 100)
  }

  if (event) {
    event.preventDefault()
  }
}

const playModeIcon = computed(() => {
  switch (playMode.value) {
    case 'loop':
      return 'i-carbon-repeat-one'
    case 'random':
      return 'i-carbon-shuffle'
    default:
      return 'i-carbon-repeat'
  }
})
const playModeText = computed(() => {
  switch (playMode.value) {
    case 'loop':
      return '单曲循环'
    case 'random':
      return '随机播放'
    default:
      return '顺序播放'
  }
})
function togglePlayMode() {
  if (playMode.value === 'sequence')
    playMode.value = 'loop'
  else if (playMode.value === 'loop')
    playMode.value = 'random'
  else playMode.value = 'sequence'
}

// 边界检查函数
function checkPlayerBoundaries() {
  // 如果正在拖拽或调整大小，不进行边界检查
  if (isDraggingPlayer.value || isResizing.value) {
    return
  }

  const playerWidth = isExpanded.value ? playerSize.value.width : 320 // 迷你模式固定20rem

  // 根据展开状态估算高度
  let playerHeight
  if (isExpanded.value) {
    // 展开模式高度估算：封面(12rem) + 歌曲信息(3rem) + 控制器(4rem) + 间距等 ≈ 25rem = 400px
    playerHeight = 605
    if (showLyrics.value) {
      playerHeight += 225
    }
    if (hasError.value) {
      playerHeight += 130 // 错误提示区域额外高度
    }
  }
  else {
    playerHeight = 64 // 迷你模式固定4rem
  }

  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  // 确保至少有16px的边距
  const margin = 16
  const boundedX = Math.max(margin, Math.min(playerPosition.value.x, windowWidth - playerWidth - margin))
  const boundedY = Math.max(margin, Math.min(playerPosition.value.y, windowHeight - playerHeight - margin))

  // 只有位置发生明显变化时才更新，避免微小的调整
  const deltaX = Math.abs(boundedX - playerPosition.value.x)
  const deltaY = Math.abs(boundedY - playerPosition.value.y)

  // 增加更大的阈值，减少不必要的位置调整
  if (deltaX > 30 || deltaY > 30) {
    playerPosition.value = {
      x: boundedX,
      y: boundedY,
    }
  }
}

// 防抖的边界检查函数
let boundaryCheckTimeout: NodeJS.Timeout | null = null
function debouncedBoundaryCheck() {
  if (boundaryCheckTimeout) {
    clearTimeout(boundaryCheckTimeout)
  }
  boundaryCheckTimeout = setTimeout(() => {
    checkPlayerBoundaries()
  }, 100)
}

// 监听器
watch(currentIndex, () => {
  loadCurrentSong()
  currentLyricIndex.value = -1 // 重置歌词索引
  lastScrollTime.value = 0 // 重置滚动时间戳
  resetCoverImageError() // 重置封面图片错误状态

  // 重置歌词滚动位置
  if (lyricsContainer.value) {
    lyricsContainer.value.scrollTop = 0
  }
})

watch(volume, (newVolume) => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = newVolume
  }
})

// 监听播放器展开状态变化，防抖检查边界
watch(isExpanded, () => {
  debouncedBoundaryCheck()
})

// 监听歌词显示状态变化，防抖检查边界
watch(showLyrics, () => {
  debouncedBoundaryCheck()
})

// 监听播放器尺寸变化，重新检查边界
watch(() => playerSize.value.width, () => {
  debouncedBoundaryCheck()
})

// 新增：监听hasError变化，防抖检查边界
watch(() => [hasError.value, showLyrics.value], () => {
  debouncedBoundaryCheck()
})

// 生命周期
onMounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value
    loadCurrentSong()
  }

  // 设置默认位置
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  // 计算默认的右下角位置
  const defaultMiniPosition = {
    x: windowWidth - 320 - 20, // 320px宽度 + 20px边距
    y: windowHeight - 64 - 20, // 64px高度 + 20px边距
  }

  // mini 模式位置 - 支持从 props 传入，否则使用右下角默认位置
  miniPosition.value = {
    x: props.initialPosition.x ?? defaultMiniPosition.x,
    y: props.initialPosition.y ?? defaultMiniPosition.y,
  }

  // 初始位置
  if (isExpanded.value) {
    // 展开模式居中显示
    const expandedWidth = 400
    const expandedHeight = 600
    playerPosition.value = {
      x: (windowWidth - expandedWidth) / 2,
      y: (windowHeight - expandedHeight) / 2,
    }
  }
  else {
    // mini模式使用设定的位置
    playerPosition.value = { ...miniPosition.value }
  }

  // 初始化边界检查
  checkPlayerBoundaries()

  // 监听窗口大小变化，重新检查边界
  resizeHandler = () => {
    debouncedBoundaryCheck()
  }
  window.addEventListener('resize', resizeHandler)

  // 点击外部关闭音量滑块
  clickHandler = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.volume-controls') && showVolumeSlider.value) {
      showVolumeSlider.value = false
    }
  }
  document.addEventListener('click', clickHandler)
})

// 组件卸载时清理事件监听器
onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  if (clickHandler) {
    document.removeEventListener('click', clickHandler)
  }
})
</script>

<template>
  <div
    class="music-player"
    :class="{ expanded: isExpanded, mini: !isExpanded, playing: isPlaying, dragging: isDraggingPlayer }"
    :style="{
      transform: `translate(${playerPosition.x}px, ${playerPosition.y}px)`,
      width: isExpanded ? `${playerSize.width}px` : '20rem',
    }"
    @mousedown="startPlayerDragging"
  >
    <!-- 流线型边框效果 -->
    <!-- 流线型边框效果 - 现在通过CSS伪元素实现 -->

    <!-- 背景模糊效果 -->
    <div class="player-backdrop" :class="{ 'mini-backdrop': !isExpanded, 'expanded-backdrop': isExpanded }" />

    <!-- 迷你模式 -->
    <div v-if="!isExpanded" class="mini-player" @click="handleMiniPlayerClick">
      <div class="mini-left">
        <div class="mini-cover">
          <img
            :src="currentCover"
            :alt="currentSong.title"
            class="cover-image"
            :class="{ playing: isPlaying }"
            @error="handleCoverImageError"
          >
        </div>
        <div class="mini-info">
          <div class="mini-title">
            {{ currentSong.title }}
          </div>
          <div class="mini-artist">
            {{ currentSong.artist }}
          </div>
          <div v-if="hasError" class="mini-error">
            <i class="i-carbon-warning-alt text-xs" />
            <span>播放失败</span>
          </div>
        </div>
      </div>
      <div class="mini-controls">
        <button class="mini-control-btn mini-prev-btn" title="上一首" @click.stop="previousSong">
          <i class="i-carbon-skip-back" />
        </button>
        <button class="mini-play-btn" :disabled="isLoading || hasError" :class="{ error: hasError, playing: isPlaying }" @click.stop="togglePlay">
          <i v-if="isLoading" class="i-carbon-restart animate-spin play-icon" />
          <i v-else-if="hasError" class="i-carbon-warning play-icon" />
          <i v-else :class="isPlaying ? 'i-carbon-pause-filled' : 'i-carbon-play-filled'" class="play-icon" />
        </button>
        <button class="mini-control-btn mini-next-btn" title="下一首" @click.stop="nextSong">
          <i class="i-carbon-skip-forward" />
        </button>
      </div>
    </div>

    <!-- 完整模式 -->
    <div v-else class="expanded-content">
      <!-- 顶部音量控制 -->
      <div class="top-controls">
        <div class="volume-controls">
          <button
            class="volume-btn"
            :class="{ active: showVolumeSlider || isVolumeButtonDragging, muted: isMuted }"
            @mousedown="startVolumeButtonDragging"
          >
            <i
              :class="isMuted || volume === 0 ? 'i-carbon-volume-mute' : volume < 0.5 ? 'i-carbon-volume-down' : 'i-carbon-volume-up'"
              class="volume-icon"
            />
            <span class="volume-text">{{ isMuted ? '0%' : `${Math.round(volume * 100)}%` }}</span>
          </button>

          <div
            class="volume-slider-container"
            :class="{ show: showVolumeSlider }"
          >
            <div
              ref="volumeBar"
              class="volume-slider"
              @click="setVolumeHorizontal"
              @mousedown="startVolumeDragging"
            >
              <div
                class="volume-fill"
                :style="{ width: `${volume * 100}%` }"
              />
              <div
                class="volume-thumb"
                :style="{ left: `${volume * 100}%` }"
                :class="{ dragging: isVolumeDragging }"
              />
            </div>
          </div>
        </div>
        <!-- 播放模式按钮 -->
        <button
          class="playmode-btn"
          :class="{ active: playMode !== 'sequence' }"
          :title="playModeText"
          @click="togglePlayMode"
        >
          <i class="text-base" :class="[playModeIcon]" />
        </button>
        <!-- 右上角关闭按钮 -->
        <button class="close-btn" @click="toggleExpanded">
          <i class="i-carbon-close text-lg" />
        </button>
      </div>

      <!-- 专辑封面 -->
      <div class="album-cover-container">
        <div class="album-cover" :class="{ playing: isPlaying }">
          <img
            :src="currentCover"
            :alt="currentSong.title"
            class="cover-image"
            @error="handleCoverImageError"
          >
        </div>
      </div>

      <!-- 歌曲信息 -->
      <div class="song-info">
        <h3 class="song-title">
          {{ currentSong.title }}
        </h3>
        <p class="song-artist">
          {{ currentSong.artist }}
        </p>
        <!-- 错误消息 -->
        <div v-if="hasError" class="error-message">
          <i class="i-carbon-warning-alt text-sm" />
          <span>{{ errorMessage }}</span>
          <div class="error-actions">
            <button class="retry-btn" @click="loadCurrentSong">
              <i class="i-carbon-restart text-xs" />
              重试
            </button>
            <button class="skip-btn" @click="skipToNextPlayableSong">
              <i class="i-carbon-skip-forward text-xs" />
              跳过
            </button>
          </div>
        </div>
      </div>

      <!-- 歌词显示 -->
      <div v-if="showLyrics" class="lyrics-section">
        <div class="lyrics-header">
          <h4 class="lyrics-title">
            <i class="i-carbon-microphone text-sm" />
            歌词
          </h4>
          <button class="lyrics-toggle" @click="toggleLyrics">
            <i class="i-carbon-chevron-up text-sm" />
          </button>
        </div>
        <div ref="lyricsContainer" class="lyrics-container">
          <div
            v-for="(line, index) in currentLyrics"
            :key="index"
            class="lyrics-line"
            :class="{
              active: index === currentLyricIndex,
              passed: index < currentLyricIndex,
            }"
            @click="seekToLyricTime(line.time)"
          >
            {{ line.words }}
          </div>
          <div v-if="currentLyrics.length === 0" class="no-lyrics">
            <i class="i-carbon-music text-2xl opacity-50" />
            <p>暂无歌词</p>
          </div>
        </div>
      </div>

      <!-- 歌词切换按钮（收起状态） -->
      <div v-else class="lyrics-toggle-mini">
        <button class="lyrics-toggle-btn" @click="toggleLyrics">
          <i class="i-carbon-microphone text-sm" />
          <span>显示歌词</span>
          <i class="i-carbon-chevron-down text-sm" />
        </button>
      </div>

      <!-- 进度条 -->
      <div class="progress-section">
        <div class="time-display">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
        <div
          ref="progressBar"
          class="progress-bar"
          @click="seekTo"
          @mousedown="startDragging"
          @mousemove="onProgressHover"
          @mouseup="stopDragging"
          @mouseenter="isHovering = true"
          @mouseleave="() => { isHovering = false; stopDragging(); }"
        >
          <div
            class="progress-fill"
            :style="{ width: `${progressPercentage}%` }"
          />
          <div
            class="progress-thumb"
            :style="{ left: `${progressPercentage}%` }"
            :class="{ dragging: isDragging }"
          />
          <!-- 缓冲进度条 -->
          <div
            class="progress-buffer"
            :style="{ width: `${bufferPercentage}%` }"
          />
        </div>
        <!-- 进度条标签 -->
        <div v-if="isDragging || isHovering" class="progress-labels">
          <span class="progress-tooltip" :style="{ left: `${tooltipPosition}%` }">
            {{ formatTime(tooltipTime) }}
          </span>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="controls">
        <button
          class="control-btn"
          :disabled="playMode === 'sequence' && currentIndex === 0"
          @click="previousSong"
        >
          <i class="i-carbon-skip-back-filled text-2xl" />
        </button>

        <button
          class="play-btn"
          :disabled="isLoading || hasError"
          :class="{ error: hasError }"
          @click="togglePlay"
        >
          <i v-if="isLoading" class="i-carbon-restart text-3xl animate-spin" />
          <i v-else-if="hasError" class="i-carbon-warning text-3xl" />
          <i v-else :class="isPlaying ? 'i-carbon-pause-filled' : 'i-carbon-play-filled'" class="text-3xl" />
        </button>

        <button
          class="control-btn"
          :disabled="playMode === 'sequence' && currentIndex === playlist.length - 1"
          @click="nextSong"
        >
          <i class="i-carbon-skip-forward-filled text-2xl" />
        </button>
      </div>
    </div>

    <!-- 隐藏的音频元素 -->
    <audio
      ref="audioPlayer"
      preload="metadata"
      crossorigin="anonymous"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @ended="onSongEnd"
      @error="onAudioError"
      @canplay="onAudioCanPlay"
      @loadstart="onLoadStart"
    />
  </div>
</template>

<style scoped>
.music-player {
  position: fixed; /* 改为 fixed 定位，确保拖拽功能正常 */
  top: 0;
  left: 0;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: visible; /* 改为 visible 以显示边框动画 */
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  cursor: grab;
}

.music-player.dragging {
  cursor: grabbing;
  user-select: none;
  z-index: 1000;
  transition: none; /* 拖拽时禁用过渡效果 */
}

.music-player.mini {
  width: 20rem;
  height: 4rem;
  border-radius: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.dark .music-player.mini {
  background: rgba(31, 41, 55, 0.95);
  border: 1px solid rgba(75, 85, 99, 0.4);
}

.music-player.expanded {
  width: 20rem;
  height: auto;
  border-radius: 1.5rem;
}

/* 播放时的流动边框动画 - 使用双伪元素实现边框裁剪 */
.music-player.playing::before {
  content: '';
  position: absolute;
  inset: -3px;
  background: linear-gradient(45deg, #8b5cf6, #ec4899, #06b6d4, #10b981, #f59e0b, #ef4444, #8b5cf6);
  background-size: 400% 400%;
  animation: flowing-gradient 3s linear infinite;
  z-index: -2;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.music-player.playing::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: -1;
}

.music-player.mini.playing::before {
  border-radius: calc(2rem + 3px);
}

.music-player.mini.playing::after {
  border-radius: 2rem;
}

.music-player.expanded.playing::before {
  border-radius: calc(1.5rem + 3px);
}

.music-player.expanded.playing::after {
  border-radius: 1.5rem;
}

.music-player:not(.playing)::before,
.music-player:not(.playing)::after {
  opacity: 0;
}

@keyframes flowing-gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 背景效果 */
.player-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1));
  backdrop-filter: blur(8px);
  pointer-events: none;
  z-index: 2;
}

.mini-backdrop {
  border-radius: 2rem;
}

.expanded-backdrop {
  border-radius: 1.5rem;
}

/* 迷你播放器样式 */
.mini-player {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem;
  height: 100%;
  cursor: move; /* 默认为移动光标 */
  transition: all 0.3s ease;
  position: relative;
  z-index: 20;
  opacity: 1;
  transform: translateY(0);
  gap: 1rem;
}

.mini-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 0.75rem;
  cursor: pointer; /* 点击展开的区域 */
}

.music-player.expanded .mini-player {
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
}

/* 完整模式内容 */
.expanded-content {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s ease;
  padding: 1.5rem;
  position: relative;
  z-index: 20;
  cursor: move; /* 默认为拖拽光标 */
}

.music-player.expanded .expanded-content {
  opacity: 1;
  transform: translateY(0);
}

/* 统一的图片样式 */
.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.cover-image.playing {
  animation: rotate 10s linear infinite;
}

.mini-player:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.dark .mini-player:hover {
  background: rgba(255, 255, 255, 0.05);
}

.mini-player:hover .mini-controls {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.02);
}

.dark .mini-player:hover .mini-controls {
  background: rgba(0, 0, 0, 0.25);
}

.mini-cover {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer; /* 点击展开 */
}

.mini-cover:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.dark .mini-cover {
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.mini-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.mini-cover img:hover {
  transform: scale(1.15);
}

.mini-cover img.playing {
  animation: rotate 10s linear infinite;
}

/* 完整模式样式 */
.album-cover-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  cursor: default; /* 阻止继承拖拽光标 */
}

.song-info {
  text-align: center;
  margin-bottom: 1.5rem;
  cursor: default; /* 阻止继承拖拽光标 */
}

.song-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #374151;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .song-title {
  color: #f9fafb;
}

.song-artist {
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .song-artist {
  color: #d1d5db;
}

/* 错误消息样式 */
.error-message {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 0.5rem;
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 500;
}

.dark .error-message {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #f87171;
}

.error-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.retry-btn,
.skip-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.retry-btn {
  background: rgba(34, 197, 94, 0.2);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.retry-btn:hover {
  background: rgba(34, 197, 94, 0.3);
  transform: scale(1.05);
}

.skip-btn {
  background: rgba(59, 130, 246, 0.2);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.skip-btn:hover {
  background: rgba(59, 130, 246, 0.3);
  transform: scale(1.05);
}

.dark .retry-btn {
  background: rgba(34, 197, 94, 0.25);
  color: #4ade80;
  border-color: rgba(34, 197, 94, 0.4);
}

.dark .skip-btn {
  background: rgba(59, 130, 246, 0.25);
  color: #60a5fa;
  border-color: rgba(59, 130, 246, 0.4);
}

.progress-section {
  margin-bottom: 1.5rem;
  cursor: default; /* 阻止继承拖拽光标 */
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.dark .time-display {
  color: #9ca3af;
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  height: 4rem; /* 确保容器有固定高度 */
  cursor: default; /* 阻止继承拖拽光标 */
}

.control-btn {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #f3f4f6;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #374151;
  cursor: pointer;
  flex-shrink: 0;
  /* 确保按钮垂直居中对齐 */
  align-self: center;
}

.dark .control-btn {
  background: #374151;
  color: #d1d5db;
}

.control-btn:hover:not(:disabled) {
  background: #e5e7eb;
  transform: scale(1.1);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.dark .control-btn:hover:not(:disabled) {
  background: #4b5563;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none; /* 禁用状态下不进行缩放 */
}

.play-btn {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #ec4899 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  cursor: pointer;
  box-shadow:
    0 8px 16px rgba(139, 92, 246, 0.2),
    0 4px 8px rgba(236, 72, 153, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
  align-self: center;
  position: relative;
  overflow: hidden;
}

.play-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.play-btn:hover::before {
  opacity: 1;
}

.play-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #db2777 100%);
  transform: scale(1.05);
  box-shadow:
    0 12px 24px rgba(139, 92, 246, 0.3),
    0 6px 12px rgba(236, 72, 153, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
}

.play-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.play-btn.error {
  background: linear-gradient(to right, #dc2626, #ef4444);
  animation: pulse-error 2s ease-in-out infinite;
}

.play-btn.error:hover:not(:disabled) {
  background: linear-gradient(to right, #b91c1c, #dc2626);
}

@keyframes pulse-error {
  0%, 100% {
    box-shadow: 0 20px 25px -5px rgba(220, 38, 38, 0.1);
  }
  50% {
    box-shadow: 0 25px 50px -12px rgba(220, 38, 38, 0.3);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.mini-play-btn.error:hover {
  background: linear-gradient(to right, #b91c1c, #dc2626);
}

.volume-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.volume-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: rgba(107, 114, 128, 0.08);
  border: 1px solid rgba(107, 114, 128, 0.15);
  border-radius: 0.75rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  font-size: 0.875rem;
}

.volume-btn:hover {
  background: rgba(107, 114, 128, 0.12);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.1);
  border-color: rgba(107, 114, 128, 0.25);
}

.volume-btn.active {
  background: rgba(139, 92, 246, 0.12);
  border-color: rgba(139, 92, 246, 0.25);
  color: #8b5cf6;
}

.volume-btn.muted {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.25);
  color: #dc2626;
}

.volume-btn.muted:hover {
  background: rgba(239, 68, 68, 0.16);
  border-color: rgba(239, 68, 68, 0.35);
}

.dark .volume-btn {
  background: rgba(156, 163, 175, 0.08);
  border-color: rgba(156, 163, 175, 0.15);
  color: #9ca3af;
}

.dark .volume-btn:hover {
  background: rgba(156, 163, 175, 0.12);
  border-color: rgba(156, 163, 175, 0.25);
  box-shadow: 0 4px 12px rgba(156, 163, 175, 0.1);
}

.dark .volume-btn.active {
  background: rgba(168, 85, 247, 0.12);
  border-color: rgba(168, 85, 247, 0.25);
  color: #a855f7;
}

.dark .volume-btn.muted {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.25);
  color: #f87171;
}

.dark .volume-btn.muted:hover {
  background: rgba(239, 68, 68, 0.16);
  border-color: rgba(239, 68, 68, 0.35);
}

.volume-text {
  font-size: 0.7rem;
  font-weight: 500;
}

.volume-slider-container {
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 0.5rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 10;
}

.volume-slider-container.show {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0.25rem);
}

.volume-slider {
  position: relative;
  width: 6rem;
  height: 0.25rem;
  background: #e5e7eb;
  border-radius: 9999px;
  cursor: pointer;
  overflow: visible;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dark .volume-slider {
  background: #4b5563;
}

.volume-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(to right, #8b5cf6, #ec4899);
  border-radius: 9999px;
  transition: width 0.1s ease;
}

.volume-thumb {
  position: absolute;
  top: 50%;
  width: 0.75rem;
  height: 0.75rem;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  opacity: 0;
  border: 2px solid #8b5cf6;
}

.volume-slider:hover .volume-thumb,
.volume-thumb.dragging {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.2);
}

.mini-info {
  flex: 1;
  min-width: 0;
  line-height: 1.2;
  cursor: pointer; /* 点击展开 */
}

.mini-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.125rem;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  transition: color 0.2s ease;
}

.mini-player:hover .mini-title {
  color: #111827;
}

.dark .mini-title {
  color: #f9fafb;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.dark .mini-player:hover .mini-title {
  color: #ffffff;
}

.mini-artist {
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
  transition: color 0.2s ease;
}

.mini-player:hover .mini-artist {
  color: #4b5563;
}

.dark .mini-artist {
  color: #9ca3af;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.dark .mini-player:hover .mini-artist {
  color: #d1d5db;
}

.mini-error {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.65rem;
  color: #dc2626;
  font-weight: 500;
  margin-top: 0.125rem;
}

.dark .mini-error {
  color: #f87171;
}

.mini-play-btn {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  flex-shrink: 0;
  box-shadow:
    0 8px 32px rgba(102, 126, 234, 0.4),
    0 4px 16px rgba(118, 75, 162, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  font-size: 1.125rem;
  position: relative;
  overflow: hidden;
}

.mini-play-btn::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  border-radius: 50%;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mini-play-btn:hover {
  transform: scale(1.08) translateY(-2px);
  box-shadow:
    0 16px 40px rgba(102, 126, 234, 0.5),
    0 8px 24px rgba(118, 75, 162, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.mini-play-btn:hover::before {
  opacity: 0.6;
}

.mini-play-btn:active {
  transform: scale(0.96) translateY(0);
  transition: all 0.1s ease;
}

.mini-play-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.mini-play-btn.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow:
    0 8px 32px rgba(239, 68, 68, 0.4),
    0 4px 16px rgba(220, 38, 38, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.mini-play-btn.playing {
  animation: pulse 2s ease-in-out infinite;
}

.mini-play-btn.playing::before {
  opacity: 0.8;
  animation: pulse-ring 2s ease-in-out infinite;
}

.play-icon {
  font-size: 1.25rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  transition: all 0.2s ease;
}

.mini-play-btn:hover .play-icon {
  transform: scale(1.1);
}

@keyframes pulse {
  0%, 100% {
    box-shadow:
      0 8px 32px rgba(102, 126, 234, 0.4),
      0 4px 16px rgba(118, 75, 162, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow:
      0 12px 40px rgba(102, 126, 234, 0.6),
      0 6px 24px rgba(118, 75, 162, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.4;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

/* 迷你播放器控制按钮组 */
.mini-controls {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;
  padding: 0.25rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: default; /* 阻止继承父级的 move cursor */
}

.dark .mini-controls {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.mini-control-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  font-size: 0.875rem;
}

.mini-control-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  color: #1f2937;
  transform: scale(1.05);
}

.mini-control-btn:active {
  transform: scale(0.95);
}

.dark .mini-control-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #d1d5db;
}

.dark .mini-control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #f9fafb;
}

/* 特殊样式调整 */
.mini-prev-btn:hover {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
}

.mini-next-btn:hover {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2));
}

/* 关闭按钮 */
.top-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
  cursor: default; /* 阻止继承拖拽光标 */
}

.close-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: rgba(107, 114, 128, 0.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(107, 114, 128, 0.2);
  transform: scale(1.1);
  color: #374151;
}

.dark .close-btn {
  color: #d1d5db;
}

.dark .close-btn:hover {
  color: #f9fafb;
}

.volume-icon {
  font-size: 1rem;
}

.dark .music-player {
  background: rgba(31, 41, 55, 0.8);
}

.album-cover-container {
  display: flex;
  justify-content: center;
}

.album-cover {
  position: relative;
  width: 12rem;
  height: 12rem;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.album-cover.playing {
  animation: rotate 10s linear infinite;
}

.album-cover img {
  transition: transform 0.3s ease;
}

.album-cover:hover img {
  transform: scale(1.05);
}

/* 改进的进度条样式 */
.progress-bar {
  position: relative;
  width: 100%;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 9999px;
  cursor: pointer;
  overflow: visible;
  margin: 0.5rem 0;
}

.dark .progress-bar {
  background: #4b5563;
}

.progress-buffer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(156, 163, 175, 0.4);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(to right, #8b5cf6, #ec4899);
  border-radius: 9999px;
  transition: width 0.1s ease;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  width: 1rem;
  height: 1rem;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  opacity: 0;
}

.progress-bar:hover .progress-thumb,
.progress-thumb.dragging {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.2);
}

.progress-tooltip {
  position: absolute;
  bottom: 100%;
  transform: translateX(-50%);
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 0.7rem;
  border-radius: 0.25rem;
  white-space: nowrap;
  margin-bottom: 0.5rem;
  pointer-events: none;
}

.progress-labels {
  position: relative;
  height: 0;
}

/* 歌词显示区域样式 */
.lyrics-section {
  margin: 1rem 0;
  border-radius: 0.75rem;
  overflow: hidden;
  /* 防止内容变化时的跳动 */
  contain: layout style;
  will-change: auto;
  cursor: default; /* 阻止继承拖拽光标 */
}

.lyrics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  margin-bottom: 0.5rem;
}

.lyrics-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0;
}

.dark .lyrics-title {
  color: #9ca3af;
}

.lyrics-toggle {
  background: rgba(107, 114, 128, 0.1);
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.375rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lyrics-toggle:hover {
  background: rgba(107, 114, 128, 0.2);
  transform: scale(1.1);
}

.dark .lyrics-toggle {
  color: #d1d5db;
  background: rgba(156, 163, 175, 0.1);
}

.dark .lyrics-toggle:hover {
  background: rgba(156, 163, 175, 0.2);
}

.lyrics-container {
  max-height: 200px;
  overflow-y: auto;
  padding: 0 0.25rem;
  scroll-behavior: smooth;
  /* 添加更稳定的滚动 */
  scrollbar-width: thin;
  overscroll-behavior: contain;
  /* 减少滚动时的视觉跳动 */
  will-change: scroll-position;
}

.lyrics-line {
  padding: 0.625rem 1rem;
  color: #9ca3af;
  font-size: 0.875rem;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0.5rem;
  margin: 0.125rem 0;
  /* 减少布局变化 */
  transform: translateZ(0);
  backface-visibility: hidden;
  position: relative;
}

.lyrics-line:hover {
  background: rgba(139, 92, 246, 0.08);
  color: #8b5cf6;
  transform: translateX(0.125rem) translateZ(0);
}

.lyrics-line.active {
  color: #8b5cf6;
  font-weight: 600;
  transform: translateX(0.25rem) translateZ(0);
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.12) 0%, rgba(236, 72, 153, 0.08) 50%, transparent 100%);
  font-size: 0.95rem;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.lyrics-line.passed {
  color: #d1d5db;
}

.dark .lyrics-line {
  color: #6b7280;
}

.dark .lyrics-line:hover {
  color: #a855f7;
  background: rgba(168, 85, 247, 0.08);
}

.dark .lyrics-line.active {
  color: #a855f7;
  background: linear-gradient(90deg, rgba(168, 85, 247, 0.12) 0%, rgba(236, 72, 153, 0.08) 50%, transparent 100%);
  border-left-color: #a855f7;
}

.dark .lyrics-line.passed {
  color: #4b5563;
}

.no-lyrics {
  text-align: center;
  padding: 3rem 1rem;
  color: #d1d5db;
  opacity: 0.6;
}

.dark .no-lyrics {
  color: #4b5563;
}

.lyrics-toggle-mini {
  margin: 0.75rem 0;
  text-align: center;
  cursor: default; /* 阻止继承拖拽光标 */
}

.lyrics-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: rgba(107, 114, 128, 0.1);
  border: 1px solid rgba(107, 114, 128, 0.2);
  border-radius: 1.5rem;
  color: #6b7280;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.lyrics-toggle-btn:hover {
  background: rgba(107, 114, 128, 0.15);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15);
  border-color: rgba(107, 114, 128, 0.3);
}

.dark .lyrics-toggle-btn {
  background: rgba(156, 163, 175, 0.1);
  border-color: rgba(156, 163, 175, 0.2);
  color: #9ca3af;
}

.dark .lyrics-toggle-btn:hover {
  background: rgba(156, 163, 175, 0.15);
  border-color: rgba(156, 163, 175, 0.3);
  box-shadow: 0 4px 12px rgba(156, 163, 175, 0.15);
}

/* 歌词容器滚动条样式 */
.lyrics-container::-webkit-scrollbar {
  width: 3px;
}

.lyrics-container::-webkit-scrollbar-track {
  background: transparent;
}

.lyrics-container::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.3);
  border-radius: 2px;
}

.lyrics-container::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.6);
}

.playmode-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: rgba(107, 114, 128, 0.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-right: 0.5rem;
}

.playmode-btn:hover {
  background: rgba(107, 114, 128, 0.2);
  transform: scale(1.1);
  color: #374151;
}

.playmode-btn.active {
  background: rgba(139, 92, 246, 0.12);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.25);
}

.dark .playmode-btn {
  background: rgba(156, 163, 175, 0.08);
  color: #9ca3af;
}

.dark .playmode-btn:hover {
  background: rgba(156, 163, 175, 0.12);
  color: #f9fafb;
}

.dark .playmode-btn.active {
  background: rgba(168, 85, 247, 0.12);
  color: #a855f7;
  border-color: rgba(168, 85, 247, 0.25);
}
</style>
