'use strict';
const path = require('path');
const config = require('../config');
const utils = require('./helper');
const webpack = require('webpack');
const vueLoaderConfig = require('./vue-loader.conf');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    modules: [utils.resolve('node_modules')],
    extensions: [
      '.js', '.vue', '.jsx',
      '.json'
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': utils.resolve('src'),
      'components': utils.resolve('src/components'),
      'utils': utils.resolve('src/utils'),
    }
  },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: utils.resolve('node_modules'),
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: utils.resolve('node_modules'),
      },
      // {
      //   test: /\.svg$/,
      //   loader: 'svg-sprite-loader',
      //   include: [utils.resolve('src/icons')],
      //   options: {
      //     extract: false,
      //     symbolId: 'icon-[name]',
      //     publicPath: utils.assetsPath('svg/'),
      //     spriteFilename: svgPath => `sprite${svgPath.substr(-4)}`
      //   }
      // },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(utils.banner),
    new VueLoaderPlugin(),
    new StyleLintPlugin(),
    new FriendlyErrorsPlugin(),
    // new webpack.ProvidePlugin({
    //   maptalks: 'maptalks'
    // })
  ],
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
