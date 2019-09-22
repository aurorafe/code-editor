// import * as Babel from '@babel/standalone';

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
    console.log(Babel);
    // eslint-disable-next-line prefer-destructuring
    code = Babel.transform(sliceSource.replace(
      /export default/,
      'const module = ',
    ), {
      // legacy: true,
      presets: ['es2015', 'stage-0'],
      // plugins: [
      //   // 'lolizer',
      //   [
      //     'proposal-decorators',
      //     {
      //       decoratorsBeforeExport: true,
      //       legacy: false,
      //     },
      //   ],
      // ],
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
