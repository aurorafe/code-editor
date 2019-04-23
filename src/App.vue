<template>
  <div id="app">
    <ce-header></ce-header>
    <div class="code-editor-content">
      <split-warp v-model="value">
        <editor-codemirror
          slot="left"
          :options="options"
          :code="code"
        ></editor-codemirror>
        <div class="mount-el" id="mount-el"></div>
      </split-warp>
    </div>
  </div>
</template>

<script>
  import CeHeader from './components/header';
  import SplitWarp from './components/split-wrapper';
  // import EditorAce from './components/editor-ace';
  import EditorCodemirror from './components/editor-codemirror';

  export default {
    components: {
      CeHeader,
      SplitWarp,
      // EditorAce,
      EditorCodemirror,
    },
    data() {
      return {
        value: 0.5,
        options: {
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
        },
        code: '<div></div>',
      };
    },
  };
</script>

<style lang="less">
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', SimSun, sans-serif;
    font-weight: 400;
  }

  #app {
    height: 100%;
  }

  code {
    background-color: #f9fafc;
    padding: 0 4px;
    border: 1px solid #eaeefb;
    border-radius: 4px;
  }

  .code-editor-content {
    position: absolute;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
