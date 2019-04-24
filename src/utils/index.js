function getSource(source, type) {
  const regex = new RegExp(`<${type}[^>]*>`);
  let openingTag = source.match(regex);

  if (!openingTag) {
    return '';
  }

  openingTag = openingTag[0];

  const sliceSource = source.slice(
    source.indexOf(openingTag) + openingTag.length,
    source.lastIndexOf(`</${type}>`),
  );

  let code = '';

  if (type === 'script') {
    code = Babel.transform(sliceSource.replace(
      /export default/,
      'const module = ',
    ), {
      presets: ['es2015', 'stage-0'],
    }).code;
    code = `${code}
return _module;`;
  } else {
    code = sliceSource;
  }

  return code;
}

/**
 * 生成uuid
 * @returns {*}
 */
function uuid() {
  function rd(a) {
    // eslint-disable-next-line
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) :
      ([1e7] + -[1e3] + -4e3 + -8e3 + -1e11).replace(/[018]/g, rd);
  }
  return rd();
}

/**
 * on
 * @type {Function}
 */
const on = (function () {
  return function (element, event, handler) {
    if (element && event && handler) {
      element.addEventListener(event, handler, false);
    }
  };
}());

/**
 * off
 * @type {Function}
 */
const off = (function () {
  return function (element, event, handler) {
    if (element && event) {
      element.removeEventListener(event, handler, false);
    }
  };
}());

export {
  on,
  off,
  uuid,
  getSource,
};
