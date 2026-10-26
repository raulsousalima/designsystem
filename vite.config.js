import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { readdirSync, existsSync } from 'node:fs'

// Every folder in systems/ with an index.html is a design system page,
// published at /systems/<nome>/. New systems are picked up without editing this file.
const systems = readdirSync(resolve(__dirname, 'systems'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(resolve(__dirname, 'systems', d.name, 'index.html')))
  .map((d) => d.name)

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...Object.fromEntries(systems.map((s) => [s, resolve(__dirname, 'systems', s, 'index.html')])),
      },
    },
  },
})
