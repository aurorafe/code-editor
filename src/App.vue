<template>
  <div class="ce-content">
    <ce-header
      @run="handleRun"
      @reset="handleReset"
    ></ce-header>
    <div class="code-editor-content">
      <split-warp v-model="value">
        <ce-codemirror
          slot="left"
          v-model="code"
          @save="handleRun"
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
  // import _get from 'lodash/get';
  import { button } from './templates';
  import CeHeader from './components/header';
  import SplitWarp from './components/split-wrapper';
  import CeCodemirror from './components/editor-codemirror';
  import CePreview from './components/preview-warpper';

  export default {
    components: {
      CeHeader,
      SplitWarp,
      CePreview,
      CeCodemirror,
    },
    data() {
      return {
        value: 0.5,
        code: button,
      };
    },
    watch: {
      $route() {
        console.log(this.$route);
      },
    },
    methods: {
      handleRun() {
        this.$refs.preview.run();
      },
      handleReset() {
        this.code = button;
        this.$refs.preview.reset();
      },
      fetchCode() {
        // const name = _get(this, '$route.query.name', 'map-base');
        // axios.get(`./public/codes${name}.vue`, {
        //   baseURL: './',
        // })
        //   .then(res => {
        //     this.code = _get(res, 'data', button);
        //   }).catch(() => {
        //   this.code = button;
        // }).finally(() => {
        //   this.$refs.preview.run();
        // });
      },
    },
    mounted() {
      this.fetchCode();
      this.$refs.preview.run();
    },
  };
</script>

<style lang="less">
  .ce-content {
    height: 100%;
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
  }
</style>
