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
  initialPosition?: { x: number; y: number } | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
  initialSize?: { width: number; height?: number | 'auto' }
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
  
  // 样式配置
  theme?: 'default' | 'purple' | 'blue' | 'green' | 'orange'
  playerStyle?: 'modern' | 'classic' | 'minimal'
}

// 位置预设类型
export type PositionPreset = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'

// 主题类型
export type Theme = 'default' | 'purple' | 'blue' | 'green' | 'orange'

// 播放器样式类型
export type PlayerStyle = 'modern' | 'classic' | 'minimal'

// 播放模式类型
export type PlayMode = 'sequence' | 'loop' | 'random'
