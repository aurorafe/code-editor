<template>
  <div class="code-editor__codemirror">
    <div ref="codeEditor" v-if="merge"></div>
    <textarea
      ref="textArea"
      style="display: none;"
      :name="name"
      :placeholder="placeholder"
      v-else></textarea>
  </div>
</template>

<script>
  import '../editor/codemirror';
  import 'codemirror/lib/codemirror.css';
  import CodeMirror from 'codemirror';
  import { on, off } from '@/utils/dom';

  export default {
    name: 'editor-codemirror',
    data() {
      return {
        content: '',
        codemirror: null,
        editorInstance: null,
      };
    },
    props: {
      code: String,
      value: String,
      marker: Function,
      unseenLines: Array,
      name: {
        type: String,
        default: 'codemirror',
      },
      placeholder: {
        type: String,
        default: '',
      },
      merge: {
        type: Boolean,
        default: false,
      },
      options: {
        type: Object,
        default: () => ({
          mode: 'htmlmixed',
          lineNumbers: !0,
          // scrollbarStyle: "simple",
          autoCloseBrackets: !0,
          matchBrackets: !0,
          showCursorWhenSelecting: !0,
          autoCloseTags: !0,
          tabSize: 2,
          foldGutter: !0,
          gutters: [
            'CodeMirror-linenumbers',
            'CodeMirror-foldgutter',
            'CodeMirror-lint-markers',
          ],
          autofocus: !0,
          styleActiveLine: !0,
        }),
      },
      events: {
        type: Array,
        default: () => ([]),
      },
      globalOptions: {
        type: Object,
        default: () => ({}),
      },
      globalEvents: {
        type: Array,
        default: () => ([]),
      },
    },
    watch: {
      options: {
        deep: true,
        handler(options) {
          Object.keys(options).forEach(key => {
            this.editorInstance.setOption(key, options[key]);
          });
        },
      },
      merge() {
        this.$nextTick(this.switchMerge);
      },
      code(newVal) {
        this.handleCodeChange(newVal);
      },
      value(newVal) {
        this.handleCodeChange(newVal);
      },
    },
    methods: {
      initialize() {
        const cmOptions = Object.assign({}, this.globalOptions, this.options);
        if (this.merge) {
          this.codemirror = CodeMirror.MergeView(this.$refs.codeEditor, cmOptions);
          this.editorInstance = this.codemirror.edit;
        } else {
          this.codemirror = CodeMirror.fromTextArea(this.$refs.textArea, cmOptions);
          this.editorInstance = this.codemirror;
          this.editorInstance.setValue(this.code || this.value || this.content);
        }

        this.editorInstance.on('change', cm => {
          this.content = cm.getValue();
          if (this.$emit) {
            this.$emit('input', this.content);
          }
        });

        this.$emit('ready', this.codemirror);
        this.unseenLineMarkers();
        this.refresh();
      },
      refresh() {
        this.$nextTick(() => {
          this.editorInstance.refresh();
        });
      },
      destroy() {
        const element = this.editorInstance.doc.cm.getWrapperElement();
        element && element.remove && element.remove();
      },
      handleCodeChange(newVal) {
        if (!this.editorInstance) return;
        const cmValue = this.editorInstance.getValue();
        if (newVal !== cmValue) {
          const scrollInfo = this.editorInstance.getScrollInfo();
          this.editorInstance.setValue(newVal);
          this.content = newVal;
          this.editorInstance.scrollTo(scrollInfo.left, scrollInfo.top);
        }
        this.unseenLineMarkers();
      },
      unseenLineMarkers() {
        if (this.unseenLines !== undefined && this.marker !== undefined) {
          this.unseenLines.forEach(line => {
            const info = this.editorInstance.lineInfo(line);
            this.editorInstance.setGutterMarker(line, 'breakpoints', info.gutterMarkers ? null : this.marker());
          });
        }
      },
      switchMerge() {
        const { history } = this.editorInstance.doc;
        const { cleanGeneration } = this.editorInstance.doc;
        this.options.value = this.editorInstance.getValue();
        this.destroy();
        this.initialize();
        this.editorInstance.doc.history = history;
        this.editorInstance.doc.cleanGeneration = cleanGeneration;
      },
      handleSave(e) {
        // let keyCode = e.keyCode || e.which || e.charCode
        const ctrlKey = e.ctrlKey || e.metaKey;

        // 73 == i
        if (e.keyCode === 73 && e.shiftKey) {
          return;
        }

        if (e.keyCode < 48 || e.keyCode > 90) {
          return;
        }

        const { altKey } = e;
        let key = '';

        if (ctrlKey) {
          key = `ctrl+${e.key}`;
        }
        if (altKey) {
          key = `alt+${e.code.toLowerCase().replace('key', '')}`;
        }

        if (key) {
          if (['ctrl+s'].includes(key)) {
            this.editorInstance.save();
            this.$emit('save');
            e.preventDefault();
          }
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.initialize();
        });
        on(document, 'keydown', this.handleSave);
      });
    },
    beforeDestroy() {
      off(document, 'keydown', this.handleSave);
      this.destroy();
    },
  };
</script>

<style lang="less">
  .code-editor__codemirror {
    height: 100%;
    line-height: 1.5;

    .CodeMirror {
      height: 100%;
      font-weight: 400;
      font-size: 12px;
      color: #525252;
    }

    .CodeMirror-code {
      font-family: Consolas, Menlo, Courier, monospace;
    }

    .CodeMirror-guttermarker-subtle {
      font-family: monospace;
    }

    .cm-s-default .cm-tag {
      color: #3e76f6;
    }

    .cm-s-default .cm-attribute {
      color: #e96900;
    }

    .cm-s-default .cm-string {
      color: #31a36f;
    }

    .cm-s-default .cm-meta,.cm-s-default .cm-qualifier {
      color: #e96900;
    }

    .cm-s-default .cm-property {
      color: #9b1dea;
    }

    .cm-s-default .cm-atom {
      color: #42b983;
    }

    .cm-s-default .cm-number {
      color: #fc1e70;
    }

    .cm-s-default .cm-keyword {
      color: #e96900;
    }

    .cm-s-default .cm-variable {
      color: #3e76f6;
    }

    .cm-s-default .cm-def,.cm-s-default .cm-type,.cm-s-default .cm-variable-2,.cm-s-default .cm-variable-3 {
      color: #2db7f5;
    }

    .cm-s-default .cm-bracket.cm-tag {
      color: #525252;
    }

    .cm-s-default .cm-comment {
      color: #b3b3b3;
    }

    .CodeMirror-activeline-background {
      background: #f8f8f9;
    }
  }
</style>
