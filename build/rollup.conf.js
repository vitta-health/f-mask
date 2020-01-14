import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';


export default {
  input: 'src/index.js',
  plugins: [
    nodeResolve(),
    babel(),
  ],
  output: [
    {
      format: 'umd',
      name: 'VueFMask',
      exports: 'named',
      file: 'dist/f-mask.js',
    },
    {
      format: 'esm',
      file: 'dist/f-mask.esm.js',
    },
  ],
}
