// https://github.com/ElemeFE/element/blob/dev/src/utils/vue-popper.js

import Vue from 'vue';
import {
  PopupManager,
} from './popup';

const PopperJS = Vue.prototype.$isServer ? function () {} : require('popper.js').default;

const stop = e => e.stopPropagation();

export default {
  props: {
    transformOrigin: {
      type: [Boolean, String],
      default: true,
    },
    placement: {
      type: String,
      default: 'bottom',
    },
    boundariesPadding: {
      type: Number,
      default: 5,
    },
    reference: {},
    popper: {},
    offset: {
      default: 0,
    },
    value: Boolean,
    visibleArrow: Boolean,
    arrowOffset: {
      type: Number,
      default: 35,
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
    popperOptions: {
      type: Object,
      default() {
        return {
          gpuAcceleration: false,
        };
      },
    },
  },

  data() {
    return {
      showPopper: false,
      currentPlacement: '',
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.showPopper = val;
        this.$emit('input', val);
      },
    },

    showPopper(val) {
      if (this.disabled) return;
      // eslint-disable-next-line no-unused-expressions
      val ? this.updatePopper() : this.destroyPopper();
      this.$emit('input', val);
    },
  },

  methods: {
    createPopper() {
      if (this.$isServer) return;
      this.currentPlacement = this.currentPlacement || this.placement;
      if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)) {
        return;
      }

      const options = this.popperOptions;
      // eslint-disable-next-line no-multi-assign
      const popper = this.popperElm = this.popperElm || this.popper || this.$refs.popper;
      // eslint-disable-next-line no-multi-assign
      let reference = this.referenceElm = this.referenceElm || this.reference || this.$refs.reference;

      if (!reference
        && this.$slots.reference
        && this.$slots.reference[0]) {
        // eslint-disable-next-line no-multi-assign
        reference = this.referenceElm = this.$slots.reference[0].elm;
      }

      if (!popper || !reference) return;
      if (this.visibleArrow) this.appendArrow(popper);
      if (this.appendToBody) document.body.appendChild(this.popperElm);
      if (this.popperJS && this.popperJS.destroy) {
        this.popperJS.destroy();
      }

      options.placement = this.currentPlacement;
      options.offset = this.offset;
      options.arrowOffset = this.arrowOffset;
      options.onCreate = () => {
        this.$emit('created', this);
        this.resetTransformOrigin();
        this.$nextTick(this.updatePopper);
      };
      // options.onUpdate = (...args) => {
      //   this.popperOptions.onUpdate(args);
      // };
      this.popperJS = new PopperJS(reference, popper, options);
      this.popperJS.popper.style.zIndex = PopupManager.nextZIndex();
      this.popperElm.addEventListener('click', stop);
    },

    updatePopper() {
      const popperJS = this.popperJS;
      if (popperJS) {
        popperJS.update();
        if (popperJS.popper) {
          popperJS.popper.style.zIndex = PopupManager.nextZIndex();
        }
      } else {
        this.createPopper();
      }
    },

    doDestroy(forceDestroy) {
      /* istanbul ignore if */
      if (!this.popperJS || (this.showPopper && !forceDestroy)) return;
      this.popperJS.destroy();
      this.popperJS = null;
    },

    destroyPopper() {
      if (this.popperJS) {
        this.resetTransformOrigin();
      }
    },

    resetTransformOrigin() {
      if (!this.transformOrigin) return;
      const placementMap = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
      };
      const placement = this.popperJS.popper.getAttribute('x-placement').split('-')[0];
      const origin = placementMap[placement];
      // eslint-disable-next-line no-nested-ternary
      this.popperJS.popper.style.transformOrigin = typeof this.transformOrigin === 'string'
        ? this.transformOrigin
        : ['top', 'bottom'].indexOf(placement) > -1 ? `center ${origin}` : `${origin} center`;
    },

    appendArrow(element) {
      let hash;
      if (this.appended) {
        return;
      }

      this.appended = true;

      // eslint-disable-next-line no-restricted-syntax
      for (const item in element.attributes) {
        if (/^_v-/.test(element.attributes[item].name)) {
          hash = element.attributes[item].name;
          break;
        }
      }

      const arrow = document.createElement('div');

      if (hash) {
        arrow.setAttribute(hash, '');
      }
      arrow.setAttribute('x-arrow', '');
      arrow.className = 'popper__arrow';
      element.appendChild(arrow);
    },
  },

  beforeDestroy() {
    this.doDestroy(true);
    if (this.popperElm && this.popperElm.parentNode === document.body) {
      this.popperElm.removeEventListener('click', stop);
      document.body.removeChild(this.popperElm);
    }
  },

  // call destroy in keep-alive mode
  deactivated() {
    this.$options.beforeDestroy[0].call(this);
  },
};
