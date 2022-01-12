import nodeResolve from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';

const plugins = [
  nodeResolve({ preferBuiltins: true }),
  commonJs()
];

export default [
  {
    input: './src/index.js',
    plugins,
    output: {
      file: 'dist/graphony-server.js',
      format: 'cjs',
      inlineDynamicImports: true,
    },
  },
  {
    input: './src/index.js',
    plugins,
    output: {
      file: 'dist/graphony-server.mjs',
      format: 'esm',
      inlineDynamicImports: true,
    },
  },

];
