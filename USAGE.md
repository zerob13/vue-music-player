# 使用指南

## 安装和使用

### 1. 安装包

```bash
npm install vue-music-vue-tailwind4
```

### 2. 引入组件和样式

有两种引入方式：

#### 方式一：分别引入（推荐）

```javascript
// main.js 或 main.ts
import { createApp } from 'vue'
import { MusicPlayer } from 'vue-music-vue-tailwind4'

// 分别引入样式文件
import 'vue-music-vue-tailwind4/index.css' // 组件样式
import 'vue-music-vue-tailwind4/tailwind.css' // Tailwind CSS样式

const app = createApp(App)
app.component('MusicPlayer', MusicPlayer)
app.mount('#app')
```

#### 方式二：按需引入

如果你的项目已经有了Tailwind CSS，只需要引入组件样式：

```javascript
import { MusicPlayer } from 'vue-music-vue-tailwind4'
import 'vue-music-vue-tailwind4/index.css' // 只引入组件样式
```

如果你的项目没有Tailwind CSS，需要同时引入两个CSS文件：

```javascript
import { MusicPlayer } from 'vue-music-vue-tailwind4'
import 'vue-music-vue-tailwind4/index.css' // 组件样式
import 'vue-music-vue-tailwind4/tailwind.css' // Tailwind CSS基础样式
```

### 3. 在组件中使用

```vue
<script setup>
import { MusicPlayer } from 'vue-music-vue-tailwind4'
import 'vue-music-vue-tailwind4/index.css'
import 'vue-music-vue-tailwind4/tailwind.css'

const songs = [
  {
    id: '1',
    title: '稻香',
    artist: '周杰伦',
    cover: '/audio/cover.jpg',
    url: '/audio/daoxiang.mp3',
    lrc: '/audio/daoxiang.lrc'
  }
]
</script>

<template>
  <div>
    <MusicPlayer :songs="songs" />
  </div>
</template>
```

## 文件说明

构建后的包含以下文件：

```
dist/
├── index.js          # ES模块版本
├── index.cjs         # CommonJS版本
├── index.css         # 组件样式文件（18.93 kB）
├── tailwind.css      # Tailwind CSS样式文件（12.32 kB）
├── tailwind.ts       # 提取的class名称列表
└── types/            # TypeScript类型定义
    └── exports.d.ts
```

### 样式文件详情

- **`index.css`**: 包含组件本身的样式，使用Vue SFC作用域样式，不会与其他样式冲突
- **`tailwind.css`**: 包含纯Tailwind CSS样式，提供基础的工具类和主题变量
- **`tailwind.ts`**: 导出提取的CSS类名字符串，可用于分析或其他用途

## 使用场景

### 场景1：项目已有Tailwind CSS
```javascript
import 'vue-music-vue-tailwind4/index.css' // 只需组件样式
```

### 场景2：项目没有Tailwind CSS
```javascript
import 'vue-music-vue-tailwind4/index.css' // 组件样式
import 'vue-music-vue-tailwind4/tailwind.css' // Tailwind基础样式
```

### 场景3：自定义样式按需加载
```javascript
// 可以选择性地引入某个样式文件
import 'vue-music-vue-tailwind4/index.css' // 必需的组件样式

// 根据需要决定是否引入Tailwind样式
if (!document.querySelector('[data-tailwind]')) {
  import('vue-music-vue-tailwind4/tailwind.css')
}
```

## 优势

- ✅ **样式分离**: 组件样式和Tailwind样式完全分离，可按需引入
- ✅ **灵活配置**: 可以选择是否使用Tailwind样式
- ✅ **无冲突**: 组件样式使用作用域，不会影响其他组件
- ✅ **体积优化**: 根据需要选择引入的样式文件
- ✅ **TypeScript支持**: 完整的类型定义
- ✅ **开箱即用**: 包含所有必需的样式，无需额外配置
