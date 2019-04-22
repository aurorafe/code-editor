const fs = require('fs');
const path = require('path');
const config = require('../config');
const _package = require('../package.json');
const ExtractTextPlugin = require('mini-css-extract-plugin');
const resolve = _path => path.resolve(__dirname, '..', _path);

const time = new Date();
const year = time.getFullYear();
const banner = `/*!\n * author: ${_package.author} 
 * ${_package.name} v${_package.version}
 * build-time: ${year}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}
 * LICENSE: ${_package.license}
 * (c) 2019-${year} ${_package.homepage}\n */`;

/**
 * 获取静态资源目录（默认开发环境和发布配置相同）
 * @param _path
 * @returns {string}
 */
const assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

/**
 * css等预处理器loaders
 * @param options
 * @returns {{css: *, scss: *, less: *, sass: *, postcss: *}}
 */
const cssLoaders = function (options) {
  options = options || {};
  const cssLoader = {
    loader: 'css-loader',
    options: {
      // modules: options.modules,
      sourceMap: options.sourceMap,
      // localIdentName: options.localIdentName
    }
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return [{
        loader: ExtractTextPlugin.loader,
        options: {}
      }].concat(loaders)
    } else {
      return ['style-loader'].concat(loaders);
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass')
  };
};

/**
 * styles loaders
 * @param options
 * @returns {Array}
 */
const styleLoaders = function (options) {
  const output = [];
  const loaders = cssLoaders(options);
  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    });
  }
  return output;
};

module.exports = {
  banner,
  _package,
  resolve,
  assetsPath,
  cssLoaders,
  styleLoaders,
};
