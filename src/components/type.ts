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
