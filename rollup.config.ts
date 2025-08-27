import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import oxc from 'rollup-plugin-oxc'
import { extname } from 'path'
import type { RollupOptions } from 'rollup'
import { globSync } from 'fs'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const input = Object.fromEntries(
  globSync('src/**/*.{ts,tsx}').map(file => [file.slice(4, -extname(file).length), file]),
)

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
      presets: [
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
      ],
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
      entryFileNames: '[name].cjs',
      chunkFileNames: 'chunks/[hash].cjs',
      hashCharacters: 'base36',
      dir: 'dist',
      sourcemap: true,
      hoistTransitiveImports: false,
    },
    {
      format: 'esm',
      chunkFileNames: 'chunks/[hash].js',
      hashCharacters: 'base36',
      dir: 'dist',
      sourcemap: true,
      hoistTransitiveImports: false,
    },
  ],
} as RollupOptions
