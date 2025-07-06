import type { PlayerStyle, SkinConfig, SkinPreset, Theme } from './type.js'

// 预定义皮肤配置
export const SKIN_PRESETS: Record<SkinPreset, SkinConfig> = {
  'default': {
    style: 'modern',
    theme: 'light',
    colors: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      accent: '#06b6d4',
      background: 'rgba(255, 255, 255, 0.95)',
      surface: 'rgba(255, 255, 255, 0.8)',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: 'rgba(255, 255, 255, 0.2)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    effects: {
      blur: 20,
      borderRadius: 24,
      shadows: true,
      gradients: true,
      animations: true,
      glowEffect: false,
    },
    layout: {
      miniWidth: 320,
      miniHeight: 64,
      expandedWidth: 320,
      padding: 24,
      spacing: 16,
    },
  },

  'glassmorphism': {
    style: 'floating',
    theme: 'light',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      background: 'rgba(255, 255, 255, 0.25)',
      surface: 'rgba(255, 255, 255, 0.1)',
      text: '#1f2937',
      textSecondary: '#4b5563',
      border: 'rgba(255, 255, 255, 0.18)',
      shadow: 'rgba(31, 38, 135, 0.37)',
    },
    effects: {
      blur: 40,
      borderRadius: 20,
      shadows: true,
      gradients: true,
      animations: true,
      glowEffect: true,
    },
    layout: {
      miniWidth: 320,
      miniHeight: 64,
      expandedWidth: 320,
      padding: 24,
      spacing: 16,
    },
  },

  'neumorphism': {
    style: 'card',
    theme: 'light',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#f3f4f6',
      surface: '#f3f4f6',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: 'transparent',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    effects: {
      blur: 0,
      borderRadius: 20,
      shadows: true,
      gradients: false,
      animations: true,
      glowEffect: false,
    },
    layout: {
      miniWidth: 320,
      miniHeight: 64,
      expandedWidth: 320,
      padding: 24,
      spacing: 16,
    },
  },

  'minimal': {
    style: 'minimal',
    theme: 'light',
    colors: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#666666',
      background: '#ffffff',
      surface: '#ffffff',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e5e7eb',
      shadow: 'rgba(0, 0, 0, 0.05)',
    },
    effects: {
      blur: 0,
      borderRadius: 8,
      shadows: false,
      gradients: false,
      animations: false,
      glowEffect: false,
    },
    layout: {
      miniWidth: 300,
      miniHeight: 60,
      expandedWidth: 300,
      padding: 16,
      spacing: 12,
    },
  },

  'retro': {
    style: 'classic',
    theme: 'dark',
    colors: {
      primary: '#ff6b35',
      secondary: '#f7931e',
      accent: '#ffd23f',
      background: '#2c1810',
      surface: '#3d2817',
      text: '#f4f3ee',
      textSecondary: '#d4af37',
      border: '#8b4513',
      shadow: 'rgba(255, 107, 53, 0.3)',
    },
    effects: {
      blur: 5,
      borderRadius: 12,
      shadows: true,
      gradients: true,
      animations: true,
      glowEffect: true,
    },
    layout: {
      miniWidth: 340,
      miniHeight: 70,
      expandedWidth: 340,
      padding: 20,
      spacing: 16,
    },
  },

  'neon': {
    style: 'modern',
    theme: 'dark',
    colors: {
      primary: '#00ffff',
      secondary: '#ff00ff',
      accent: '#ffff00',
      background: 'rgba(0, 0, 0, 0.9)',
      surface: 'rgba(0, 0, 0, 0.8)',
      text: '#ffffff',
      textSecondary: '#00ffff',
      border: 'rgba(0, 255, 255, 0.3)',
      shadow: 'rgba(0, 255, 255, 0.5)',
    },
    effects: {
      blur: 10,
      borderRadius: 16,
      shadows: true,
      gradients: true,
      animations: true,
      glowEffect: true,
    },
    layout: {
      miniWidth: 320,
      miniHeight: 64,
      expandedWidth: 320,
      padding: 24,
      spacing: 16,
    },
  },

  'gradient': {
    style: 'modern',
    theme: 'light',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: 'rgba(255, 255, 255, 0.2)',
      text: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      border: 'rgba(255, 255, 255, 0.3)',
      shadow: 'rgba(0, 0, 0, 0.2)',
    },
    effects: {
      blur: 15,
      borderRadius: 20,
      shadows: true,
      gradients: true,
      animations: true,
      glowEffect: false,
    },
    layout: {
      miniWidth: 320,
      miniHeight: 64,
      expandedWidth: 320,
      padding: 24,
      spacing: 16,
    },
  },

  'dark-pro': {
    style: 'modern',
    theme: 'dark',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#8b5cf6',
      background: 'rgba(17, 24, 39, 0.95)',
      surface: 'rgba(31, 41, 55, 0.8)',
      text: '#f9fafb',
      textSecondary: '#d1d5db',
      border: 'rgba(55, 65, 81, 0.5)',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },
    effects: {
      blur: 25,
      borderRadius: 16,
      shadows: true,
      gradients: false,
      animations: true,
      glowEffect: false,
    },
    layout: {
      miniWidth: 320,
      miniHeight: 64,
      expandedWidth: 320,
      padding: 24,
      spacing: 16,
    },
  },

  'light-elegant': {
    style: 'card',
    theme: 'light',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: 'rgba(255, 255, 255, 0.9)',
      surface: 'rgba(248, 250, 252, 0.8)',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: 'rgba(226, 232, 240, 0.8)',
      shadow: 'rgba(0, 0, 0, 0.08)',
    },
    effects: {
      blur: 12,
      borderRadius: 18,
      shadows: true,
      gradients: false,
      animations: true,
      glowEffect: false,
    },
    layout: {
      miniWidth: 320,
      miniHeight: 64,
      expandedWidth: 320,
      padding: 24,
      spacing: 16,
    },
  },

  'colorful': {
    style: 'modern',
    theme: 'light',
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      accent: '#45b7d1',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
      surface: 'rgba(255, 255, 255, 0.3)',
      text: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.9)',
      border: 'rgba(255, 255, 255, 0.4)',
      shadow: 'rgba(0, 0, 0, 0.2)',
    },
    effects: {
      blur: 20,
      borderRadius: 24,
      shadows: true,
      gradients: true,
      animations: true,
      glowEffect: true,
    },
    layout: {
      miniWidth: 320,
      miniHeight: 64,
      expandedWidth: 320,
      padding: 24,
      spacing: 16,
    },
  },
}

// 获取皮肤配置
export function getSkinConfig(skin: SkinPreset | SkinConfig): SkinConfig {
  if (typeof skin === 'string') {
    return SKIN_PRESETS[skin]
  }
  return skin
}

// 生成CSS变量
export function generateCSSVariables(config: SkinConfig): Record<string, string> {
  const variables: Record<string, string> = {}

  // 颜色变量
  if (config.colors) {
    Object.entries(config.colors).forEach(([key, value]) => {
      if (value)
        variables[`--mp-color-${key}`] = value
    })
  }

  // 效果变量
  if (config.effects) {
    const { blur, borderRadius, shadows, gradients, animations, glowEffect } = config.effects
    if (blur !== undefined)
      variables['--mp-blur'] = `${blur}px`
    if (borderRadius !== undefined)
      variables['--mp-border-radius'] = `${borderRadius}px`
    if (shadows !== undefined)
      variables['--mp-shadows'] = shadows ? '1' : '0'
    if (gradients !== undefined)
      variables['--mp-gradients'] = gradients ? '1' : '0'
    if (animations !== undefined)
      variables['--mp-animations'] = animations ? '1' : '0'
    if (glowEffect !== undefined)
      variables['--mp-glow'] = glowEffect ? '1' : '0'
  }

  // 布局变量
  if (config.layout) {
    const { miniWidth, miniHeight, expandedWidth, padding, spacing } = config.layout
    if (miniWidth !== undefined)
      variables['--mp-mini-width'] = `${miniWidth}px`
    if (miniHeight !== undefined)
      variables['--mp-mini-height'] = `${miniHeight}px`
    if (expandedWidth !== undefined)
      variables['--mp-expanded-width'] = `${expandedWidth}px`
    if (padding !== undefined)
      variables['--mp-padding'] = `${padding}px`
    if (spacing !== undefined)
      variables['--mp-spacing'] = `${spacing}px`
  }

  return variables
}

// 应用皮肤到DOM元素
export function applySkinToElement(element: HTMLElement, config: SkinConfig): void {
  const variables = generateCSSVariables(config)
  Object.entries(variables).forEach(([key, value]) => {
    element.style.setProperty(key, value)
  })
}

// 检测系统主题
export function detectSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

// 合并皮肤配置
export function mergeSkinConfig(base: SkinConfig, override: Partial<SkinConfig>): SkinConfig {
  return {
    ...base,
    ...override,
    colors: { ...base.colors, ...override.colors },
    effects: { ...base.effects, ...override.effects },
    layout: { ...base.layout, ...override.layout },
  }
}
