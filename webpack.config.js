const NODE_ENV = process.env.NODE_ENV
const IS_PROD = NODE_ENV === 'production'
const path = require('path')
const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')

const config = {
  entry: ['babel-polyfill', 'isomorphic-fetch', path.join(__dirname, 'client.js')],
  output: { path: '/' },
  stats: {
    warnings: false
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['stage-0', 'es2015', 'react'],
          plugins: ['transform-class-properties'],
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
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
    new ManifestPlugin(),
  ],
}
config.devtool = IS_PROD ? 'cheap-module-source-map' : 'cheap-module-eval-source-map'
if(IS_PROD) config.plugins.push(new webpack.optimize.DedupePlugin())
if(IS_PROD) config.plugins.push(new webpack.optimize.UglifyJsPlugin({mangle: false}))
if(IS_PROD) config.plugins.push(new webpack.optimize.AggressiveMergingPlugin())

if(!IS_PROD) config.plugins.unshift(new webpack.HotModuleReplacementPlugin())
if(!IS_PROD) config.entry.unshift('webpack-hot-middleware/client?noInfo=true&quiet=true')
if(!IS_PROD) config.module.loaders[0].query.presets.unshift('react-hmre')

module.exports = config
