const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: ['babel-polyfill', path.join(__dirname, 'client.js')],
  output: { path: '/' },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['stage-0', 'es2015', 'react'],
          plugins: ['transform-class-properties'],
        }
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true)
      }
    })
  ],
}
