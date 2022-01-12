import nodeResolve from '@rollup/plugin-node-resolve';

const plugins = [
  // json(),
  nodeResolve({ preferBuiltins: true }),
];

export default [
  {
    input: './src/index.js',
    plugins,
    output: {
      file: 'dist/graphony-core.js',
      format: 'cjs',
      inlineDynamicImports: true,
    },
  },
  {
    input: './src/index.js',
    plugins,
    output: {
      file: 'dist/graphony-core.mjs',
      format: 'esm',
      inlineDynamicImports: true,
    },
  },

];
