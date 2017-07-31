const NODE_ENV = process.env.NODE_ENV
const IS_PROD = NODE_ENV === 'production'
const webpack = require('webpack')
const path = require('path')

const config = {
  entry: ['babel-polyfill', 'isomorphic-fetch', path.join(__dirname, 'client.js')],
  output: { path: '/' },
  stats: {
    warnings: false
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
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
        'BROWSER': JSON.stringify(true),
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }
    }),
  ],
}
config.devtool = IS_PROD ? 'cheap-module-source-map' : 'cheap-module-eval-source-map'
if(IS_PROD) config.plugins.push(new webpack.optimize.DedupePlugin())
if(IS_PROD) config.plugins.push(new webpack.optimize.UglifyJsPlugin({mangle: false}))
if(IS_PROD) config.plugins.push(new webpack.optimize.AggressiveMergingPlugin())

module.exports = config
