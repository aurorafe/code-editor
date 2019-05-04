import * as Babel from '@babel/standalone';

function getSource(source, type) {
  const regex = new RegExp(`<${type}[^>]*>`);
  let openingTag = source.match(regex);

  if (!openingTag) {
    return '';
  }

  // eslint-disable-next-line prefer-destructuring
  openingTag = openingTag[0];

  const sliceSource = source.slice(
    source.indexOf(openingTag) + openingTag.length,
    source.lastIndexOf(`</${type}>`),
  );

  let code = '';

  if (type === 'script') {
    // eslint-disable-next-line prefer-destructuring
    code = Babel.transform(sliceSource.replace(
      /export default/,
      'const module = ',
    ), {
      presets: ['es2015'],
    }).code;
    code = `${code}
return _module;`;
  } else {
    code = sliceSource;
  }

  return code;
}

export {
  getSource,
};
