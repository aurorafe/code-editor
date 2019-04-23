/* global ace */
const javascriptSnippets = require('./javascript.snippets');

ace.define('ace/snippets/javascript', ['require', 'exports', 'module'], (e, t) => {
  t.snippetText = `${javascriptSnippets}`;
  t.scope = 'javascript';
});
