import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/components/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // eslint-disable-next-line ts/no-require-imports
    require('@egoist/tailwindcss-icons'),
  ],
} satisfies Config
