import nodeResolve from '@rollup/plugin-node-resolve';

const plugins = [
  nodeResolve()  
];

export default [
  {
    input: './src/GraphonyClient.js',
    plugins,
    output: {
      file: 'dist/graphony-client.js',
      format: 'cjs',
      inlineDynamicImports: true,
    },
  },
  {
    input: './src/GraphonyClient.js',
    plugins,
    output: {
      file: 'dist/graphony-client.mjs',
      format: 'esm',
      inlineDynamicImports: true,
    },
  },

];
