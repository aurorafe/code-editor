<template>
  <div class="preview-wrapper" ref="preview"></div>
</template>

<script>
  import Vue from 'vue';
  import { getSource, uuid } from '../utils';

  export default {
    name: 'preview-wrapper',
    props: {
      code: {
        type: String,
        required: true,
        default: '',
      },
    },
    data() {
      return {
        codeTemplate: {
          id: '',
          template: '',
          script: '',
          style: '',
          component: null,
        },
      };
    },
    methods: {
      run() {
        this.destroyedView();
        this.getRunCode();
        this.mountView();
      },
      reset() {
        this.destroyedView();
        this.getRunCode();
        this.mountView();
      },
      mountView() {
        this.codeTemplate.id = uuid();
        // eslint-disable-next-line no-new-func
        const parseConfig = new Function(this.codeTemplate.script)();
        parseConfig.template = this.codeTemplate.template;
        const CodeComponent = Vue.extend(parseConfig);
        // 挂载组件
        this.codeTemplate.component = new CodeComponent().$mount();
        this.$refs.preview.appendChild(this.codeTemplate.component.$el);
        // 挂载样式
        if (this.codeTemplate.css !== '') {
          const styleEl = document.createElement('style');
          styleEl.type = 'text/css';
          styleEl.id = this.codeTemplate.id;
          styleEl.innerHTML = this.codeTemplate.style;
          document.head.appendChild(styleEl);
        }
      },
      destroyedView() {
        // 销毁vue组件
        if (this.codeTemplate.component) {
          this.$refs.preview.removeChild(this.codeTemplate.component.$el);
          this.codeTemplate.component.$destroy();
          this.codeTemplate.component = null;
        }
        // 清楚style样式
        const userStyle = document.getElementById(this.codeTemplate.id);
        if (userStyle) {
          document.head.removeChild(userStyle);
        }
      },
      getRunCode() {
        this.codeTemplate.template = getSource(this.code, 'template');
        this.codeTemplate.style = getSource(this.code, 'style');
        this.codeTemplate.script = getSource(this.code, 'script').replace(
          /export default/,
          'return ',
        );
      },
    },
    destroyed() {
      this.destroyedView();
    },
  };
</script>

<style scoped>
  .preview-wrapper {
    background-color: #fff;
    height: 100%;
    line-height: 1.5;
  }
</style>
