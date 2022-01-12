import { resolve } from 'path'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'

const root = process.cwd()
const entry = resolve(root, 'index.js')

const plugins = [nodeResolve(), commonjs()]

export default [
  {
    input: entry,
    plugins,
    output: {
      exports: 'auto',
      file: resolve(root, 'index.mjs'),
      format: 'es'
    }
  },
]
