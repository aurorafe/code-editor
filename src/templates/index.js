const button = `<template>
  <div class="demo-content"></div>
</template>
<script>
  export default {
    name: 'map-base',
    data() {
      return {
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      };
    },
    watch: {},
    methods: {},
  };
</script>

<style lang="less">
  .demo-content {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #cbe0ff;
    &-datgui {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 1;
      pointer-events: auto;
    }
  }
</style>
`;

export {
  button,
};
