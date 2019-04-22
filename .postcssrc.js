// https://github.com/michael-ciniawsky/postcss-load-config

function getDirectProps(name) {
  return ['left', 'top', 'right', 'bottom'].map(val => `${name}-${val}`);
}

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {},
    // "postcss-pxtorem": {
    //   rootValue: 200,
    //   propList: [
    //     'width',
    //     'height',
    //     'margin',
    //     ...getDirectProps('margin'),
    //     'padding',
    //     ...getDirectProps('padding'),
    //     'font-size',
    //     'line-height',
    //     'top',
    //     'right',
    //     'left',
    //     'bottom',
    //     'border-radius',
    //     'max-height',
    //     'min-height',
    //     'max-width',
    //     'min-width',
    //     'border-width',
    //     'transform',
    //     'background-position',
    //     '-webkit-transform',
    //     'background-size',
    //   ],
    // },
  }
};
