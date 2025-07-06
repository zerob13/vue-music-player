export interface Song {
  id: number
  title: string
  artist: string
  cover: string
  src: string
  lyrics?: LyricLine[]
}

export interface LyricLine {
  time: number // 时间戳（秒）
  words: string // 歌词文本
}

export interface MusicPlayerProps {
  // 基础配置
  playlist: Song[]

  // 位置和大小配置
  initialPosition?: { x: number, y: number } | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
  initialSize?: { width: number, height?: number | 'auto' }
  initialExpanded?: boolean

  // 播放配置
  initialVolume?: number // 0-1
  initialPlayMode?: 'sequence' | 'loop' | 'random'
  autoPlay?: boolean

  // 显示配置
  showLyrics?: boolean
  showPlayModeButton?: boolean
  showVolumeControl?: boolean

  // 交互配置
  draggable?: boolean
  resizable?: boolean
  boundaryCheck?: boolean
  positionMargin?: number

  // 皮肤配置 - 新的皮肤系统
  skin?: SkinPreset | SkinConfig
  theme?: Theme // 保持向后兼容
  playerStyle?: PlayerStyle // 保持向后兼容
}

// 皮肤预设类型 - 预定义的完整皮肤
export type SkinPreset
  = 'default' // 默认现代风格
  | 'glassmorphism' // 玻璃态风格
  | 'neumorphism' // 新拟物风格
  | 'minimal' // 极简风格
  | 'retro' // 复古风格
  | 'neon' // 霓虹风格
  | 'gradient' // 渐变风格
  | 'dark-pro' // 专业暗色
  | 'light-elegant' // 优雅浅色
  | 'colorful' // 多彩风格
()

// 自定义皮肤配置
export interface SkinConfig {
  // 基础样式
  style: PlayerStyle
  theme: Theme

  // 颜色配置
  colors?: {
    primary?: string
    secondary?: string
    accent?: string
    background?: string
    surface?: string
    text?: string
    textSecondary?: string
    border?: string
    shadow?: string
  }

  // 视觉效果
  effects?: {
    blur?: number
    borderRadius?: number
    shadows?: boolean
    gradients?: boolean
    animations?: boolean
    glowEffect?: boolean
  }

  // 布局配置
  layout?: {
    miniWidth?: number
    miniHeight?: number
    expandedWidth?: number
    padding?: number
    spacing?: number
  }
}

// 位置预设类型
export type PositionPreset = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'

// 主题类型 - 颜色主题
export type Theme
  = 'light'
  | 'dark'
  | 'purple'
  | 'blue'
  | 'green'
  | 'orange'
  | 'pink'
  | 'red'
  | 'teal'
  | 'indigo'
  | 'auto' // 跟随系统

// 播放器样式类型 - 布局和交互风格
export type PlayerStyle
  = 'modern' // 现代风格 - 圆角、阴影、动画
  | 'classic' // 经典风格 - 传统音乐播放器外观
  | 'minimal' // 极简风格 - 简洁线条、少装饰
  | 'compact' // 紧凑风格 - 节省空间
  | 'floating' // 浮动风格 - 悬浮效果
  | 'card' // 卡片风格 - 卡片式布局

// 播放模式类型
export type PlayMode = 'sequence' | 'loop' | 'random'

// 新增：音乐播放器组件 API 类型定义
export interface MusicPlayerAPI {
  // 播放控制 API
  play: () => Promise<void>
  pause: () => void
  toggle: () => Promise<void>
  stop: () => void

  // 歌曲切换 API
  next: () => void
  previous: () => void
  skipTo: (index: number) => void

  // 进度控制 API
  seekTo: (time: number) => void
  seekToPercentage: (percentage: number) => void

  // 音量控制 API
  setVolume: (volume: number) => void
  mute: () => void
  unmute: () => void
  toggleMute: () => void

  // 播放模式 API
  setPlayMode: (mode: 'sequence' | 'loop' | 'random') => void
  togglePlayMode: () => void

  // 界面控制 API
  expand: () => void
  collapse: () => void
  toggleExpanded: () => void

  // 歌词控制 API
  showLyrics: () => void
  hideLyrics: () => void
  toggleLyrics: () => void

  // 位置控制 API
  setPosition: (x: number, y: number) => void
  centerPlayer: () => void

  // 皮肤控制 API
  setSkin: (skin: SkinPreset | SkinConfig) => void
  getSkin: () => SkinPreset | SkinConfig

  // 状态获取 API
  getCurrentSong: () => Song
  getCurrentTime: () => number
  getDuration: () => number
  getVolume: () => number
  getProgress: () => number
  getPlayMode: () => 'sequence' | 'loop' | 'random'
  getPosition: () => { x: number, y: number }

  // 状态检查 API
  isPlaying: () => boolean
  isExpanded: () => boolean
  isLoading: () => boolean
  hasError: () => boolean
  isMuted: () => boolean
  isShowingLyrics: () => boolean

  // 工具方法
  reload: () => Promise<void>
  skipToNextPlayable: () => Promise<void>
}
