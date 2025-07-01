import type { App, Plugin } from 'vue'

import MusicPlayer from './components/MusicPlayer.vue'


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
