process.noDeprecation = true;
let appPackage;
try {
  appPackage = require('../../package.json');
} catch (err) {
  appPackage = require('./package.json');
}
const NODE_ENV = process.env.NODE_ENV;
const API_URL = process.env.API_URL || process.env.HOSTNAME;
const APP_NAME = (process.env.APP_NAME = appPackage.name);
const APP_VERSION = (process.env.APP_VERSION = appPackage.version);
const IS_PROD = NODE_ENV === 'production';
const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  entry: ['babel-polyfill', 'isomorphic-fetch', path.join(__dirname, 'client.js')],
  output: {
    path: `${process.cwd()}/static`,
    publicPath: '/',
    strictModuleExceptionHandling: false
  },
  node: {
    __filename: true,
    __dirname: true,
    path: 'empty',
    fs: 'empty',
    child_process: 'empty',
    vm: 'empty',
    net: 'empty',
    dns: 'empty'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory',
        exclude: /node_modules\/(?!(reunify)\/).*/,
        query: {
          presets: ['env', 'react'],
          plugins: [
            'transform-class-properties',
            [
              'babel-plugin-styled-components',
              {
                ssr: true,
                displayName: true
              }
            ]
          ]
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        babelrc: false,
        cacheDirectory: true
      }
    }),
    new webpack.DefinePlugin({
      'process.BROWSER': JSON.stringify(true),
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify(NODE_ENV),
        API_URL: JSON.stringify(API_URL),
        APP_VERSION: JSON.stringify(APP_VERSION),
        APP_NAME: JSON.stringify(APP_NAME)
      }
    }),
    new ExtractTextPlugin('main.css')
  ]
};
config.devtool = IS_PROD ? 'cheap-module-source-map' : 'cheap-module-eval-source-map';
if (IS_PROD) config.plugins.push(new webpack.optimize.DedupePlugin());
if (IS_PROD) config.plugins.push(new webpack.optimize.UglifyJsPlugin({mangle: false}));
if (IS_PROD) config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());

if (!IS_PROD) config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
if (!IS_PROD) config.entry.unshift('webpack-hot-middleware/client?noInfo=true&quiet=true');
if (!IS_PROD) config.module.loaders[0].query.presets.unshift('react-hmre');

module.exports = config;
