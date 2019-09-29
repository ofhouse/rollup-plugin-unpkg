import * as path from 'path';

const unpkgPlugin = require('../../index');

export default {
  input: path.resolve(__dirname, 'main.js'),
  plugins: [unpkgPlugin()],
};
