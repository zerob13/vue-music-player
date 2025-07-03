<div align="center">
  <img src="./public/kv.png" alt="Vue Music Player Logo" width="120" height="120">

  # Vue Music Player

  *一个精美的Vue3音乐播放器组件，支持现代化UI设计、丰富动画效果和完整的播放功能。*

  [![NPM Version](https://img.shields.io/npm/v/vue3-music-player?color=8b5cf6&style=flat-square)](https://www.npmjs.com/package/vue3-music-player)
  [![License](https://img.shields.io/npm/l/vue3-music-player?color=ec4899&style=flat-square)](./license)
  [![Vue 3](https://img.shields.io/badge/Vue-3.x-4fc08d?style=flat-square&logo=vue.js)](https://vuejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
</div>

---

## ✨ 特性

### 🎮 播放功能
- **完整播放控制** - 播放/暂停、上一首/下一首、循环播放
- **音量控制** - 音量滑块调节、静音/取消静音、悬停显示
- **智能进度条** - 拖拽跳转、点击定位、悬停预览、缓冲显示
- **歌词同步** - 实时滚动高亮、点击歌词跳转、展开/收起控制
- **播放列表** - 多首歌曲切换、歌曲信息展示

### 🎨 视觉设计
- **现代化UI** - 毛玻璃效果、渐变背景、阴影层次、圆角设计
- **动画效果** - 专辑封面旋转、彩虹边框流动、脉冲呼吸、按钮悬停
- **响应式布局** - 完美适配桌面端和移动端
- **暗色模式** - 自动跟随系统主题，完美的明暗切换
- **两种模式** - 迷你播放器和完整播放器，流畅切换动画

### ⚡ 技术特色
- **Vue 3 + TypeScript** - 现代化框架，完整类型安全
- **Tailwind CSS 4** - 最新版本的原子化CSS框架
- **Vite构建** - 快速的开发和构建体验
- **组合式API** - 灵活的状态管理和逻辑复用
- **智能错误处理** - 音频加载失败的友好提示和重试机制

## 🎮 功能演示

### 播放控制
- ▶️ **播放/暂停** - 一键切换播放状态，流畅的动画过渡
- ⏮️ **上一首/下一首** - 快速切换歌曲，支持循环播放
- 🔊 **音量控制** - 拖拽式音量滑块，支持静音/取消静音
- ⏱️ **进度控制** - 支持拖拽、点击跳转、悬停预览时间点

### 歌词功能
- 📝 **实时同步** - 歌词随播放进度自动滚动和高亮
- 🎯 **交互跳转** - 点击任意歌词行跳转到对应时间
- 📖 **展开/收起** - 灵活的歌词面板显示控制
- 🎨 **视觉效果** - 当前歌词高亮，非活跃歌词半透明

### 视觉效果
- 🌈 **彩虹边框** - 播放时的流动彩色边框动画
- 💿 **封面旋转** - 专辑封面的平滑旋转效果
- ✨ **毛玻璃背景** - 现代化的半透明背景效果
- 🎯 **脉冲动画** - 播放时整体的呼吸脉冲效果
- 💫 **悬停交互** - 按钮和控件的悬停放大效果
### 界面模式
- 🔹 **迷你模式** - 紧凑的播放器界面，适合固定在页面角落
- 🔸 **完整模式** - 完整的播放器界面，显示所有功能和信息
- 🔄 **流畅切换** - 两种模式间的平滑过渡动画
- 📱 **自适应布局** - 根据屏幕尺寸自动调整界面元素

## 🚀 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite 7.0
- **样式框架**: Tailwind CSS 4.1
- **图标库**: Carbon Icons
- **组合函数**: @vueuse/core
- **包管理器**: pnpm
- **开发工具**: ESLint + Vitest

## 📦 快速开始

### 1. 安装依赖
```bash
# 确保安装了 pnpm
npm install -g pnpm

# 克隆项目
git clone https://github.com/Simon-He95/vue-music.git
cd vue-music

# 安装依赖
pnpm install
```

### 2. 启动开发服务器
```bash
# 启动开发服务器 (默认端口 3333)
pnpm dev

# 或者指定其他端口
pnpm dev --port 8080
```

### 3. 构建生产版本
```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 4. 音频文件配置
将您的音频文件放在 `public/audio/` 目录下：
```
public/audio/
├── daoxiang.mp3          # 音频文件
├── daoxiang.lrc.ts       # 对应的歌词文件
├── kaibuliaokou.mp3      # 音频文件
├── kaibuliaokou.lrc.ts   # 对应的歌词文件
└── sample1.mp3           # 更多音频文件...
```

**支持的音频格式**: `mp3`, `wav`, `ogg`, `m4a`, `flac`

### 5. 歌词文件格式
歌词文件使用TypeScript格式，例如 `song.lrc.ts`：
```typescript
export default [
  { time: 0, words: '第一句歌词' },
  { time: 5.5, words: '第二句歌词' },
  { time: 12, words: '第三句歌词' },
  // time: 时间戳(秒)，支持小数
  // words: 歌词文本
]
```

### 6. 自定义播放列表
在 `MusicPlayer.vue` 组件中配置您的歌曲列表：

```typescript
const playlist = ref<Song[]>([
  {
    id: 1,
    title: '稻香',
    artist: '周杰伦',
    cover: 'https://example.com/cover.jpg',
    src: '/audio/daoxiang.mp3',
    lyrics: daoxiangLyrics // 从 .lrc.ts 文件导入
  },
  {
    id: 2,
    title: '开不了口',
    artist: '周杰伦',
    cover: 'https://example.com/cover2.jpg',
    src: '/audio/kaibuliaokou.mp3',
    lyrics: kaibuliaoukouLyrics
  }
  // 添加更多歌曲...
])
```

## 🎯 使用方法

### 作为Vue组件使用
```vue
<script setup>
import type { Song } from 'vue3-music-player'
import { MusicPlayer } from 'vue3-music-player'

// 准备播放列表数据
const playlist: Song[] = [
  {
    id: 1,
    title: '歌曲名称',
    artist: '艺术家',
    cover: '封面图片URL',
    src: '/audio/song.mp3',
    lyrics: [ // 可选
      { time: 0, words: '歌词内容' }
    ]
  }
]
</script>

<template>
  <div class="app">
    <MusicPlayer :playlist="playlist" />
  </div>
</template>
```

### 播放器操作指南

#### 基础控制
- **播放/暂停**: 点击中央的播放按钮
- **切换歌曲**: 使用左右箭头按钮或键盘方向键
- **音量调节**:
  - 悬停在音量图标上显示音量滑块
  - 拖拽滑块或点击任意位置调节音量
  - 点击音量图标快速静音/取消静音

#### 进度控制
- **跳转播放**: 点击进度条任意位置直接跳转
- **拖拽控制**: 拖拽进度条上的小圆点精确控制
- **悬停预览**: 鼠标悬停在进度条上预览时间点

#### 歌词交互
- **展开歌词**: 点击歌词按钮展开歌词面板
- **歌词跳转**: 点击任意歌词行跳转到对应播放时间
- **自动滚动**: 歌词会随播放进度自动滚动和高亮
- **收起歌词**: 点击收起按钮或播放器外区域关闭歌词面板

#### 界面模式
- **迷你模式**: 默认的紧凑显示模式
- **完整模式**: 点击展开按钮显示完整播放器界面
- **模式切换**: 流畅的动画过渡效果

## 🎨 界面特色

### 🌈 动画效果
- **彩虹边框** - 播放时的流动彩色边框，呈现波浪式动画
- **专辑旋转** - 封面图片的平滑旋转效果，播放时持续旋转
- **脉冲呼吸** - 整体播放器的轻微缩放脉冲效果
- **按钮悬停** - 所有交互元素的放大和阴影效果
- **模式切换** - 迷你/完整模式间的流畅过渡动画

### 🎯 视觉设计
- **毛玻璃效果** - 半透明背景配合模糊效果
- **渐变色彩** - 多层次的颜色渐变背景
- **阴影层次** - 多重阴影营造立体感
- **圆角设计** - 现代化的圆角矩形界面
- **色彩主题** - 自动适配明暗主题

### 📱 响应式特性
- **断点适配** - 智能适配不同屏幕尺寸
- **触摸优化** - 移动端的触摸手势支持
- **布局调整** - 小屏幕下的界面元素重新排列
- **字体缩放** - 根据屏幕尺寸自动调整字体大小

## 🔧 配置选项

### 主题定制
播放器会自动跟随系统的明暗主题设置：
- **自动检测** - 基于 `prefers-color-scheme` 媒体查询
- **动态切换** - 主题变化时的平滑过渡效果
- **颜色适配** - 所有UI元素都完美适配明暗主题

### 错误处理
播放器具有完善的错误处理机制：
- **音频加载失败** - 显示友好的错误提示信息
- **网络连接问题** - 自动重试机制和状态反馈
- **格式不支持** - 清晰的格式支持说明
- **封面加载失败** - 自动显示精美的默认封面

### 性能优化
- **懒加载** - 音频文件的按需加载
- **缓存策略** - 智能的资源缓存机制
- **防抖处理** - 拖拽和滚动事件的性能优化
- **内存管理** - 及时清理不需要的资源引用

## 🌟 技术亮点

### 现代化开发
- **Vue 3 Composition API** - 使用最新的组合式API，逻辑更清晰
- **TypeScript 全覆盖** - 完整的类型定义，开发更安全
- **Tailwind CSS 4** - 最新版本的原子化CSS框架
- **Vite 7.0** - 极速的开发和构建体验
- **ESLint 配置** - 统一的代码风格和质量检查

### 性能优化
- **按需加载** - 音频资源的懒加载机制
- **事件防抖** - 拖拽和滚动的性能优化
- **内存管理** - 自动清理无用的事件监听器
- **缓存策略** - 智能的资源缓存和复用
- **60fps 动画** - 流畅的CSS3动画效果

### 用户体验
- **键盘支持** - 完整的键盘快捷键操作
- **无障碍访问** - 支持屏幕阅读器和键盘导航
- **触摸优化** - 移动端的触摸手势支持
- **渐进增强** - 优雅降级的功能设计
- **多浏览器兼容** - 支持现代浏览器的完整特性

## 🎵 音频格式支持

| 格式 | 支持程度 | 说明 |
|------|----------|------|
| MP3 | ✅ 完全支持 | 最常用的音频格式 |
| WAV | ✅ 完全支持 | 无损音频格式 |
| OGG | ✅ 完全支持 | 开源音频格式 |
| M4A | ✅ 完全支持 | 苹果音频格式 |
| FLAC | ⚠️ 部分支持 | 取决于浏览器支持 |

## 📱 浏览器兼容性

| 浏览器 | 最低版本 | 支持程度 |
|--------|----------|----------|
| Chrome | 90+ | ✅ 完全支持 |
| Firefox | 88+ | ✅ 完全支持 |
| Safari | 14+ | ✅ 完全支持 |
| Edge | 90+ | ✅ 完全支持 |
| 移动浏览器 | - | ✅ 完全支持 |

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 开发规范
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 代码规范
- 编写必要的测试用例
- 保持代码注释的完整性

## License

[MIT](./LICENSE) License © 2022 [Simon He](https://github.com/Simon-He95)

<a href="https://github.com/Simon-He95/sponsor" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/Simon-He95/sponsor/sponsors.svg">
    <img src="https://cdn.jsdelivr.net/gh/Simon-He95/sponsor/sponsors.svg"/>
  </a>
</p>

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/Simon-He95/sponsor/sponsors_circle.svg">
    <img src="https://cdn.jsdelivr.net/gh/Simon-He95/sponsor/sponsors_circle.svg"/>
  </a>
</p>

## 组件 API

MusicPlayer 组件通过 `defineExpose` 暴露了丰富的 API，允许父组件程序化地控制播放器：

### 基础用法

```vue
<script setup lang="ts">
import type { MusicPlayerAPI } from '@/components/exports'
import { ref } from 'vue'
import { MusicPlayer } from '@/components/exports'

const playerRef = ref<MusicPlayerAPI>()

function playMusic() {
  playerRef.value?.play()
}

function pauseMusic() {
  playerRef.value?.pause()
}

function nextTrack() {
  playerRef.value?.next()
}

function showLyrics() {
  playerRef.value?.showLyrics()
}
</script>

<template>
  <div>
    <MusicPlayer ref="playerRef" :playlist="playlist" />
    <div class="controls">
      <button @click="playMusic">
        播放
      </button>
      <button @click="pauseMusic">
        暂停
      </button>
      <button @click="nextTrack">
        下一首
      </button>
      <button @click="showLyrics">
        显示歌词
      </button>
    </div>
  </div>
</template>
```

### API 分类

#### 播放控制
- `play()` - 开始播放
- `pause()` - 暂停播放
- `toggle()` - 切换播放/暂停状态
- `stop()` - 停止播放并重置进度

#### 歌曲切换
- `next()` - 下一首歌曲
- `previous()` - 上一首歌曲
- `skipTo(index: number)` - 跳转到指定索引的歌曲

#### 进度控制
- `seekTo(time: number)` - 跳转到指定时间（秒）
- `seekToPercentage(percentage: number)` - 跳转到指定百分比位置

#### 音量控制
- `setVolume(volume: number)` - 设置音量（0-1）
- `mute()` - 静音
- `unmute()` - 取消静音
- `toggleMute()` - 切换静音状态

#### 播放模式
- `setPlayMode(mode: 'sequence' | 'loop' | 'random')` - 设置播放模式
- `togglePlayMode()` - 循环切换播放模式

#### 界面控制
- `expand()` - 展开播放器
- `collapse()` - 收起播放器
- `toggleExpanded()` - 切换展开状态

#### 歌词控制
- `showLyrics()` - 显示歌词
- `hideLyrics()` - 隐藏歌词
- `toggleLyrics()` - 切换歌词显示状态

#### 位置控制
- `setPosition(x: number, y: number)` - 设置播放器位置
- `centerPlayer()` - 将播放器居中显示

#### 状态获取
- `getCurrentSong()` - 获取当前歌曲信息
- `getCurrentTime()` - 获取当前播放时间
- `getDuration()` - 获取歌曲总时长
- `getVolume()` - 获取当前音量
- `getProgress()` - 获取播放进度百分比
- `getPlayMode()` - 获取当前播放模式
- `getPosition()` - 获取播放器位置

#### 状态检查
- `isPlaying()` - 是否正在播放
- `isExpanded()` - 是否已展开
- `isLoading()` - 是否正在加载
- `hasError()` - 是否有错误
- `isMuted()` - 是否静音
- `isShowingLyrics()` - 是否显示歌词

#### 工具方法
- `reload()` - 重新加载当前歌曲
- `skipToNextPlayable()` - 跳过错误歌曲到下一首可播放的

### 高级用法示例

```vue
<script setup lang="ts">
import type { MusicPlayerAPI } from '@/components/exports'
import { onMounted, ref } from 'vue'
import { MusicPlayer } from '@/components/exports'

const playerRef = ref<MusicPlayerAPI>()

onMounted(() => {
  // 自动播放第一首歌
  setTimeout(() => {
    playerRef.value?.play()
  }, 1000)

  // 设置音量为 50%
  playerRef.value?.setVolume(0.5)

  // 设置随机播放模式
  playerRef.value?.setPlayMode('random')

  // 将播放器定位到屏幕右下角
  playerRef.value?.setPosition(window.innerWidth - 340, window.innerHeight - 84)
})

// 监听键盘快捷键
function handleKeydown(event: KeyboardEvent) {
  if (!playerRef.value)
    return

  switch (event.code) {
    case 'Space':
      event.preventDefault()
      playerRef.value.toggle()
      break
    case 'ArrowRight':
      event.preventDefault()
      playerRef.value.next()
      break
    case 'ArrowLeft':
      event.preventDefault()
      playerRef.value.previous()
      break
    case 'KeyL':
      event.preventDefault()
      playerRef.value.toggleLyrics()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
```
