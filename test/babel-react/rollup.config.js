import * as path from 'path';
import babel from 'rollup-plugin-babel';

const unpkgPlugin = require('../../index');
const babelConfig = require('./.babelrc');

export default {
  input: path.resolve(__dirname, 'main.js'),
  plugins: [
    babel({
      ...babelConfig,
      exclude: 'node_modules/**',
      babelrc: false,
    }),

    unpkgPlugin(),
  ],
};
