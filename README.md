# Vu## ✨ 特性

- 🎵 **完整播放功能**### 播放控制
- ▶️### 视觉效果
- 🌈 播放时的彩虹边框动画
- 💿 专辑封面旋转效果
- ✨ 毛玻璃背景和渐变色
- 🎯 脉冲动画和悬停交互
- 📝 歌词滚动和高亮显示
- 🎚️ 进度条缓冲显示和拖拽反馈停切换
- ⏮️ 上一首歌曲
- ⏭️ 下一首歌曲
- 🔊 音量调节滑块
- ⏱️ 智能进度控制（支持拖拽、点击跳转、悬停预览）
- 📝 歌词同步显示和交互跳转暂停、上一首/下一首、音量控制、智能进度条
- 📝 **歌词同步显示** - 实时歌词滚动、点击歌词跳转、歌词展开/收起
- 🎚️ **高级进度条** - 拖拽控制、缓冲显示、悬停预览、实时提示
- 🎨 **现代化UI设计** - 毛玻璃效果、渐变色、阴影、流线型边框动画
- 📱 **响应式布局** - 支持桌面端和移动端，自适应不同屏幕尺寸
- 🌙 **暗色模式支持** - 完美适配明暗主题切换
- 🎭 **两种显示模式** - 迷你模式和完整模式，支持流畅切换动画
- ⚡ **Vue 3 + TypeScript** - 使用最新技术栈，类型安全
- 🎪 **丰富动画效果** - 专辑旋转、彩虹光环、脉冲动画、按钮悬停效果
- 🔧 **智能错误处理** - 音频加载失败时的友好提示和重试机制ayer

一个精美的Vue3音乐播放器组件，支持现代化UI、动画效果和完整的播放功能。

## ✨ 特性

- 🎵 **完整播放功能** - 播放/暂停、上一首/下一首、音量控制、进度条
- 🎨 **现代化UI设计** - 毛玻璃效果、渐变色、阴影、流线型边框动画
- 📱 **响应式布局** - 支持桌面端和移动端，自适应不同屏幕尺寸
- 🌙 **暗色模式支持** - 完美适配明暗主题切换
- 🎭 **两种显示模式** - 迷你模式和完整模式，支持流畅切换动画
- ⚡ **Vue 3 + TypeScript** - 使用最新技术栈，类型安全
- 🎪 **丰富动画效果** - 专辑旋转、彩虹光环、脉冲动画、按钮悬停效果
- � **智能错误处理** - 音频加载失败时的友好提示和重试机制

## 🎮 功能演示

### 播放控制
- ▶️ 播放/暂停切换
- ⏮️ 上一首歌曲
- ⏭️ 下一首歌曲
- � 音量调节滑块
- ⏱️ 播放进度控制

### 视觉效果
- � 播放时的彩虹边框动画
- 💿 专辑封面旋转效果
- ✨ 毛玻璃背景和渐变色
- 🎯 脉冲动画和悬停交互

### 界面模式
- � **迷你模式** - 紧凑的播放器，适合固定在页面角落
- 🔸 **完整模式** - 展开的播放器，显示完整的播放信息和控制

## 🚀 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **样式**: CSS3 + UnoCSS
- **图标**: Carbon Icons
- **包管理**: pnpm

## 📦 快速开始

### 1. 安装依赖
```bash
# 安装 pnpm (如果还未安装)
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 2. 启动开发服务器
```bash
pnpm dev
```

### 3. 添加音频文件
将您的音频文件放在 `public/audio/` 目录下：
```
public/audio/
├── sample1.mp3
├── sample2.mp3
├── sample3.mp3
├── sample4.mp3
└── sample5.mp3
```

支持的音频格式：`mp3`, `wav`, `ogg`, `m4a`

### 4. 自定义播放列表和歌词
编辑 `src/components/MusicPlayer.vue` 中的 `playlist` 数组来配置您的歌曲：

```typescript
const playlist = ref<Song[]>([
  {
    id: 1,
    title: '您的歌曲标题',
    artist: '艺术家名称',
    cover: '封面图片URL',
    src: '/audio/your-audio-file.mp3',
    lyrics: [ // 可选的歌词数据
      { time: 0, text: '第一句歌词' },
      { time: 5, text: '第二句歌词' },
      { time: 10, text: '第三句歌词' }
      // 时间单位为秒
    ]
  }
  // 添加更多歌曲...
])
```

## 🎯 使用方法

### 基础使用
```vue
<script setup>
import MusicPlayer from './components/MusicPlayer.vue'
</script>

<template>
  <div class="app">
    <MusicPlayer />
  </div>
</template>
```

### 模式切换
- **迷你模式**: 点击播放器可展开
- **完整模式**: 点击顶部向下箭头可收起

### 播放控制
- **播放/暂停**: 点击中央播放按钮
- **切换歌曲**: 使用左右箭头按钮
- **调节音量**: 拖动音量滑块
- **跳转播放**: 点击进度条任意位置或拖拽进度条
- **歌词交互**:
  - 点击"显示歌词"按钮展开歌词面板
  - 歌词会随播放自动滚动和高亮
  - 点击任意歌词行可跳转到对应时间
  - 点击收起按钮隐藏歌词面板

## 🎨 界面特色

### 视觉效果
- 🌈 **彩虹边框**: 播放时出现流动的彩色边框
- 💿 **旋转动画**: 专辑封面播放时旋转
- ✨ **毛玻璃效果**: 背景模糊和透明度
- 🎯 **脉冲动画**: 播放时的整体脉冲效果

### 交互反馈
- 🔘 **悬停效果**: 按钮悬停时的缩放和阴影
- 📱 **响应式**: 自动适配移动端和桌面端
- 🌙 **主题适配**: 自动跟随系统暗色模式
- ⚠️ **错误处理**: 音频加载失败时的友好提示

## 🔧 配置选项

### 错误处理
播放器具有智能错误处理机制：
- 自动检测音频加载失败
- 显示错误提示信息
- 支持点击重试功能
- 错误状态的视觉反馈

### 响应式断点
```css
/* 移动端适配 */
@media (max-width: 640px) {
  /* 自动调整播放器尺寸和布局 */
}
```

## 🌟 技术亮点

- **Vue 3 Composition API**: 现代化的组合式 API
- **TypeScript**: 完整的类型安全
- **CSS3 动画**: 流畅的 60fps 动画效果
- **响应式设计**: 完美的移动端体验
- **无障碍访问**: 键盘导航和屏幕阅读器支持

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
