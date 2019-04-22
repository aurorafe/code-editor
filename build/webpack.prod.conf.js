'use strict';
const path = require('path');
const utils = require('./helper');
const config = require('../config');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

const webpackConfig = merge(require('./webpack.base.conf'), {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('scripts/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('scripts/[id].[chunkhash].js'),
  },
  plugins: [
    new ProgressBarPlugin(),
    new CleanWebpackPlugin([
      'dist'
    ], {
      root: path.resolve(__dirname, '../')
    }),
    new webpack.DllReferencePlugin({
      manifest: require('../dll/extlib-manifest.json')
    }),
    new ParallelUglifyPlugin({
      cacheDir: path.join(__dirname, '../cache/'),
      sourceMap: false,
      uglifyES: {
        output: {
          comments: false
        },
        compress: {
          inline: 1, // https://github.com/mishoo/UglifyJS2/issues/2842
          warnings: false,
          drop_console: true
        }
      }
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      allChunks: true
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
        map: {
          inline: false
        }
      }
    }),
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      version: new Date().toLocaleString('zh', {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      }),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'auto'
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),

    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, '../dll/extlib.dll.*.js'),
      publicPath: './static/scripts',
      outputPath: '../dist/static/scripts',
      includeSourcemap: false
    }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ],
  optimization: {
    // chunk for the webpack runtime code and chunk manifest
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          test: 'vendor',
          name: 'vendor',
          enforce: true
        }
      }
    }
  }
});

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin({
    // analyzerMode: 'static'
  }))
}

module.exports = webpackConfig;
