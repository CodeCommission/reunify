const NODE_ENV = process.env.NODE_ENV
const IS_PROD = NODE_ENV === 'production'
const path = require('path')
const webpack = require('webpack')

const config = {
  entry: ['babel-polyfill', 'isomorphic-fetch', path.join(__dirname, 'client.js')],
  output: {path: `${process.cwd()}/static`, strictModuleExceptionHandling: true},
  options: {
    babelrc: false,
    cacheDirectory: true,
  },
  performance: { hints: false },
  node: {
    __filename: true,
    __dirname: true,
    path: 'empty',
    fs: 'empty',
    child_process: 'empty',
    vm: 'empty',
    net: 'empty',
    dns: 'empty',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['stage-0', 'es2015', 'react'],
          plugins: ['transform-class-properties', 'css-modules-transform'],
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.BROWSER': JSON.stringify(true),
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

if(!IS_PROD) config.plugins.unshift(new webpack.HotModuleReplacementPlugin())
if(!IS_PROD) config.entry.unshift('webpack-hot-middleware/client?noInfo=true&quiet=true')
if(!IS_PROD) config.module.loaders[0].query.presets.unshift('react-hmre')

module.exports = config
