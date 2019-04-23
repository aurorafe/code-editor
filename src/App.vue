<template>
  <div id="app">
    <ce-header></ce-header>
    <div class="code-editor-content">
      <split-warp v-model="value">
        <editor-ace slot="left"></editor-ace>
        <div class="mount-el" id="mount-el"></div>
      </split-warp>
    </div>
  </div>
</template>

<script>
  import CeHeader from './components/header';
  import SplitWarp from './components/split-wrapper';
  import EditorAce from './components/editor-ace';

  export default {
    components: {
      CeHeader,
      SplitWarp,
      EditorAce,
    },
    data() {
      return {
        value: 0.5,
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
