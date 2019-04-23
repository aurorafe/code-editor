<template>
  <div class="code-editor__header">
    <a href="/" class="code-editor__logo"></a>
    <div class="code-editor__header-menu">
      <button type="button" class="header-menu-button" @click="handleAction('run')">
        <span>
          <i class="code-editor-icon" style="font-size: 18px;"></i>
          <span>运行</span>
        </span>
      </button>
      <button type="button" class="header-menu-button" @click="handleAction('reset')">
        <span>
          <i class="code-editor-icon" style="font-size: 18px;"></i>
          <span>重置</span>
        </span>
      </button>
    </div>
    <div class="code-editor__ask">
      <button type="button" class="header-menu-button">
        <span>
          <i class="ivu-icon ivu-icon-ios-play-outline" style="font-size: 18px;"></i>
          <span></span>
        </span>
      </button>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ce-header',
    data() {
      return {};
    },
    methods: {
      handleAction(type) {
        this.$emit(type);
      },
    },
  };
</script>

<style lang="less" scoped>
  .code-editor {
    &__header {
      width: 100%;
      height: 50px;
      padding: 0 40px;
      box-sizing: border-box;
      z-index: 1000;
      position: fixed;
      top: 0;
      background-color: #fff;
      box-shadow: 0 1px 3px rgba(26, 26, 26, .1);
      font-size: 14px;
    }

    &__logo {
      float: left;
      height: 50px;
      line-height: 48px;
      img {
        height: 46px;
        vertical-align: middle;
      }
    }

    &__header-menu {
      float: left;
      height: 50px;
      line-height: 48px;
      margin-left: 32px;
    }

    &-icon {
      display: inline-block;
      speak: none;
      font-style: normal;
      font-weight: 400;
      font-variant: normal;
      text-transform: none;
      text-rendering: auto;
      line-height: 1;
      vertical-align: middle;
    }

    &__ask {
      float: right;
      height: 50px;
      line-height: 45px;
    }
  }

  .header-menu-button {
    color: #515a6e;
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    white-space: nowrap;
    user-select: none;
    border-radius: 4px;
    transition: color .2s linear, background-color .2s linear, border .2s linear, box-shadow .2s linear;
    background-color: transparent;
    vertical-align: middle;
    line-height: 1.5;
    padding: 6px 15px;
    font-size: 14px;
    span {
      vertical-align: middle;
    }
    &:active {
      outline: 0;
      color: #2b85e4;
      background-color: #fff;
      border-color: transparent;
    }
    &:hover {
      outline: 0;
      color: #57a3f3;
      background-color: #fff;
      border-color: transparent;
      text-decoration: none;
    }
  }
</style>
