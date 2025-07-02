import type { App, Plugin } from 'vue'

import MusicPlayer from './MusicPlayer.vue'

export type { LyricLine, MusicPlayerProps, PlayerStyle, PlayMode, PositionPreset, Song, Theme } from './type.js'

export {
  MusicPlayer,
}

export default MusicPlayer

const componentMap = {
  MusicPlayer,
}

export const VueRendererMarkdown: Plugin = {
  install(app: App) {
    Object.entries(componentMap).forEach(([name, component]) => {
      app.component(name, component)
    })
  },
}
