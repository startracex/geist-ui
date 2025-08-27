import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import oxc from 'rollup-plugin-oxc'
import fs from 'fs-extra'
import path from 'path'
import type { RollupOptions } from 'rollup'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const files = await fs.readdir('src')

const components = (
  await Promise.all(
    files.map(async (name: string) => {
      const unitPath = path.join('src', name)
      const entry = path.join(unitPath, 'index.ts')

      const stat = await fs.stat(unitPath)
      if (!stat.isDirectory()) return null

      const hasFile = await fs.pathExists(entry)
      if (!hasFile) return null

      return [name, entry]
    }),
  )
).filter(Boolean) as [string, string][]

const input = Object.fromEntries(components)

export default {
  input,
  plugins: [
    oxc({
      transform: {
        jsx: 'preserve',
      },
      minify: true,
    }),
    babel({
      exclude: 'node_modules/**',
      extensions,
      presets: ['@babel/preset-react'],
      plugins: [
        [
          'styled-jsx/babel',
          {
            sourceMaps: false,
            optimizeForSpeed: true,
          },
        ],
        [
          '@babel/plugin-transform-runtime',
          {
            helpers: true,
            regenerator: true,
          },
        ],
      ],
      babelrc: false,
      sourceMaps: true,
      babelHelpers: 'runtime',
    }),
    commonjs(),
  ],
  external: [/^react($|\.*)/, /^react-dom($|\.*)/, /@babel\/runtime/],
  output: [
    {
      format: 'cjs',
      exports: 'named',
      dir: 'dist/commonjs',
      sourcemap: true,
      hoistTransitiveImports: false,
    },
    {
      format: 'esm',
      dir: 'dist/module',
      sourcemap: true,
      hoistTransitiveImports: false,
    },
  ],
} as RollupOptions
