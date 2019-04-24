<template>
  <div id="app">
    <ce-header
      @run="handleRun"
      @reset="handleReset"
    ></ce-header>
    <div class="code-editor-content">
      <split-warp v-model="value">
        <ce-codemirror
          slot="left"
          v-model="code"
        ></ce-codemirror>
        <ce-preview
          ref="preview"
          slot="right"
          :code="code"></ce-preview>
      </split-warp>
    </div>
  </div>
</template>

<script>
  import { button } from './templates';
  import CeHeader from './components/header';
  import SplitWarp from './components/split-wrapper';
  // import EditorAce from './components/editor-ace';
  import CeCodemirror from './components/editor-codemirror';
  import CePreview from './components/preview-warpper';

  export default {
    components: {
      CeHeader,
      SplitWarp,
      // EditorAce,
      CePreview,
      CeCodemirror,
    },
    data() {
      return {
        value: 0.5,
        code: button,
      };
    },
    methods: {
      handleRun() {
        this.$refs.preview.run();
      },
      handleReset() {
        this.code = button;
        this.$refs.preview.reset();
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.preview.run();
      });
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
