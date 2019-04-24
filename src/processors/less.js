import less from 'less';

export default function (source) {
  return new Promise(resolve => {
    less.render(source, (error, result) => {
      if (error) {
        // index starts at 1
        let line = parseInt(error.line, 10) || 0;
        let ch = parseInt(error.column, 10) || 0;
        if (line > 0) {
          line -= 1;
        }
        if (ch > 0) {
          ch -= 1;
        }
        const errors = {
          line,
          ch,
          msg: error.message,
        };
        resolve({
          errors: [errors],
          result: null,
        });
      }
      resolve({
        errors: null,
        result: result.css.trim(),
      });
    });
  });
}
