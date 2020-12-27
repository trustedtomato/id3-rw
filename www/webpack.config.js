const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    'analysing-your-whole-music-library/bootstrap': './src/analysing-your-whole-music-library/bootstrap.js',
    'id3-editor/bootstrap': './src/id3-editor/bootstrap.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  mode: 'development',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: '**/*.html', context: 'src/' },
        { from: '**/*.css', context: 'src/' }
      ]
    })
  ],
  experiments: {
    // IMPORTANT! Without this, webpack is not able to load WebAssembly.
    // asyncWebAssembly is currently not supported by wasm-bindgen,
    // see https://github.com/rustwasm/wasm-bindgen/issues/2343
    syncWebAssembly: true
  }
};
