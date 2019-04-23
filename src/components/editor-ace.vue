<template>
  <div class="code-editor__ace">
    <div ref="codeEditor"></div>
  </div>
</template>

<script>
  import jsBeautify from 'js-beautify/js/lib/beautify';

  let ace;
  if (typeof window !== 'undefined') {
    ace = require('brace');
    require('brace/mode/javascript');
    require('brace/theme/github');
    require('brace/ext/language_tools');
    require('brace/ext/searchbox');
    require('../editor/snippets');
  }

  export default {
    name: 'editor-ace',
    data() {
      return {
        codeText: `{
  success: true,
  data: {
    default: "hah",
    _req: function({
      _req
    }) {
      return _req
    },
    name: function({
      _req
    }) {
      return _req.query.name || this.default
    }
  }
}`,
      };
    },
    methods: {
      submit() {
        console.log('1111');
      },
      initEditor() {
        this.codeEditor = ace.edit(this.$refs.codeEditor);
        this.codeEditor.getSession().setMode('ace/mode/javascript');
        this.codeEditor.setTheme('ace/theme/github');
        this.codeEditor.setOption('tabSize', 2);
        this.codeEditor.setOption('fontSize', 15);
        this.codeEditor.setOption('enableLiveAutocompletion', true);
        this.codeEditor.setOption('enableSnippets', true);
        this.codeEditor.clearSelection();
        this.codeEditor.getSession().setUseWorker(false);
        this.codeEditor.on('change', this.onChange);
        this.codeEditor.commands.addCommand({
          name: 'save',
          bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
          exec: () => {
            this.submit();
          },
        });

        this.$nextTick(() => {
          this.codeEditor.setValue(this.codeText);
          this.format();
        });
      },
      format() {
        const context = this.codeEditor.getValue();
        const code = /^http(s)?/.test(context)
          ? context
          : jsBeautify.js_beautify(context, { indent_size: 2 });
        this.codeEditor.setValue(code);
      },
      onChange() {
        this.codeText = this.codeEditor.getValue();
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.initEditor();
      });
    },
  };
</script>

<style scoped lang="less">
  .code-editor__ace {
    height: 100%;
    font-size: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    & > div {
      height: 100%;
    }
  }
</style>
