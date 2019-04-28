<template>
  <div
    class="split-wrapper"
    ref="splitWrapper">
    <div
      class="left-pane split-pane"
      :style="calcRight"
      ref="left"
    >
      <slot name="left"></slot>
    </div>
    <div
      class="split-trigger-con"
      ref="line"
      :style="calcLeft"
      @mousedown="handleMouseDown"
    >
      <div class="split-trigger-con__bar vertical">
        <i class="bar-item"></i>
        <i class="bar-item"></i>
        <i class="bar-item"></i>
        <i class="bar-item"></i>
        <i class="bar-item"></i>
        <i class="bar-item"></i>
        <i class="bar-item"></i>
        <i class="bar-item"></i>
      </div>
    </div>
    <div
      class="right-pane split-pane"
      ref="right"
      :style="calcLeft"
    >
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { on, off } from '@/utils/dom';

  const isServer = Vue.prototype.$isServer;

  export default {
    name: 'split-wrapper',
    props: {
      value: {
        type: Number,
        default: 0.5,
        validator: value => value > 0 && value < 1,
      },
      min: {
        type: [Number, String],
        default: '40px',
      },
      max: {
        type: [Number, String],
        default: '40px',
      },
    },
    data() {
      return {
        offset: 0,
        splitValue: 50,
        isMoving: false,
        startPosition: 0,
      };
    },
    computed: {
      valueIsPx() {
        return typeof this.value === 'string';
      },
      calcLeft() {
        return {
          left: `${this.splitValue}%`,
        };
      },
      calcRight() {
        return {
          right: `${100 - this.splitValue}%`,
        };
      },
      computedMin() {
        return this.getComputedThresholdValue('min');
      },
      computedMax() {
        return this.getComputedThresholdValue('max');
      },
    },
    watch: {
      value() {
        this.computeSlitValue();
      },
    },
    methods: {
      px2percent(numerator, denominator) {
        return parseFloat(numerator) / parseFloat(denominator);
      },
      getComputedThresholdValue(type) {
        const size = this.$refs.splitWrapper.offsetWidth;
        if (this.valueIsPx) return typeof this[type] === 'string' ? this[type] : size * this[type];
        return typeof this[type] === 'string' ? this.px2percent(this[type], size) : this[type];
      },
      getMin(value1, value2) {
        if (this.valueIsPx) return `${Math.min(parseFloat(value1), parseFloat(value2))}px`;
        return Math.min(value1, value2);
      },
      getMax(value1, value2) {
        if (this.valueIsPx) return `${Math.max(parseFloat(value1), parseFloat(value2))}px`;
        return Math.max(value1, value2);
      },
      getAnotherOffset(value) {
        let res = 0;
        if (this.valueIsPx) res = `${this.$refs.splitWrapper.offsetWidth - parseFloat(value)}px`;
        else res = 1 - value;
        return res;
      },
      handleMouseDown(e) {
        this.startPosition = e.pageX;
        this.offset = this.value;
        this.isMoving = true;
        on(document, 'mousemove', this.handleMouseMove);
        on(document, 'mouseup', this.handleMouseUp);
        this.$emit('on-move-start');
      },
      handleMouseMove(e) {
        const offset = e.pageX - this.startPosition;
        const outerWidth = this.$refs.splitWrapper.offsetWidth;
        let value = this.valueIsPx ? `${parseFloat(this.offset) + offset}px` : (this.px2percent(outerWidth * this.offset + offset, outerWidth));
        const anotherValue = this.getAnotherOffset(value);
        if (parseFloat(value) <= parseFloat(this.computedMin)) value = this.getMax(value, this.computedMin);
        if (parseFloat(anotherValue) <= parseFloat(this.computedMax)) value = this.getAnotherOffset(this.getMax(anotherValue, this.computedMax));
        this.$emit('input', value);
        this.$emit('on-moving', e);
      },
      handleMouseUp() {
        this.isMoving = false;
        off(document, 'mousemove', this.handleMouseMove);
        off(document, 'mouseup', this.handleMouseUp);
        this.$emit('on-move-end');
      },
      computeSlitValue() {
        this.splitValue = (this.valueIsPx ? this.px2percent(this.value, this.$refs.splitWrapper.offsetWidth) : this.value) * 10000 / 100;
      },
      handleResize() {
        this.computeSlitValue();
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.computeSlitValue();
      });
      if (isServer) return;
      on(window, 'resize', this.handleResize);
    },
    beforeDestroy() {
      if (isServer) return;
      off(window, 'resize', this.handleResize);
    },
  };
</script>

<style lang="less" scoped>
  .split-wrapper {
    position: relative;
    width: 100%;
    height: 100%;

    .split-pane {
      position: absolute;
      top: 0;
      bottom: 0;

      &.left-pane {
        left: 0;
      }

      &.right-pane {
        right: 0;
      }
    }
  }

  .split-trigger {
    &-con {
      position: absolute;
      z-index: 10;
      top: 50%;
      width: 6px;
      height: 100%;
      background: #f8f8f9;
      border-top: none;
      border-bottom: none;
      cursor: col-resize;
      transform: translate(-50%, -50%);
      &__bar {
        position: absolute;
        left: 1px;
        top: 50%;
        height: 32px;
        overflow: hidden;
        transform: translateY(-50%);
      }
      .bar-item {
        width: 4px;
        height: 1px;
        background: rgba(23, 35, 61, .25);
        float: left;
        margin-top: 3px;
      }
    }
  }
</style>
