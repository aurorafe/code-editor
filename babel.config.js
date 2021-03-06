module.exports = {
  presets: [
    ['@babel/env', {
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
      },
      loose: true,
      modules: false,
    }],
  ],
  plugins: [
    'transform-vue-jsx',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread',
    [
      '@babel/plugin-proposal-decorators',
      { legacy: true },
    ],
    [
      '@babel/plugin-proposal-class-properties', // 兼容class内的箭头函数
      { loose: true },
    ],
  ],
  ignore: [
    'dist/*.js',
  ],
  comments: false,
};
