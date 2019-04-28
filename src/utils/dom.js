// from https://github.com/ElemeFE/element/blob/dev/src/utils/dom.js

import Vue from 'vue';
import trim from 'lodash/trim';
import isNaN from 'lodash/isNaN';

const isServer = Vue.prototype.$isServer;
// eslint-disable-next-line no-useless-escape
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const ieVersion = isServer ? 0 : Number(document.documentMode);

const camelCase = function (name) {
  return name.replace(SPECIAL_CHARS_REGEXP, (_, separator, letter, offset) =>
    (offset ? letter.toUpperCase() : letter)).replace(MOZ_HACK_REGEXP, 'Moz$1');
};

/**
 * on
 * @type {Function}
 */
const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  }
  return function (element, event, handler) {
    if (element && event && handler) {
      element.attachEvent(`on${event}`, handler);
    }
  };
}());

/**
 * off
 * @type {Function}
 */
const off = (function () {
  if (!isServer && document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  }
  return function (element, event, handler) {
    if (element && event) {
      element.detachEvent(`on${event}`, handler);
    }
  };
}());

function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  }
  return (` ${el.className} `).indexOf(` ${cls} `) > -1;
}

function addClass(el, cls) {
  if (!el) return;
  let curClass = el.className;
  const classes = (cls || '').split(' ');

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    // eslint-disable-next-line no-continue
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ` ${clsName}`;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

function removeClass(el, cls) {
  if (!el || !cls) return;
  const classes = cls.split(' ');
  let curClass = ` ${el.className} `;

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    // eslint-disable-next-line no-continue
    if (!clsName) continue;
    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(` ${clsName} `, ' ');
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}

const getStyle = ieVersion < 9 ? function (element, styleName) {
  if (isServer) return;
  // eslint-disable-next-line consistent-return
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'styleFloat';
  }
  try {
    switch (styleName) {
      case 'opacity':
        try {
          // eslint-disable-next-line consistent-return
          return element.filters.item('alpha').opacity / 100;
        } catch (e) {
          // eslint-disable-next-line consistent-return
          return 1.0;
        }
      default:
        // eslint-disable-next-line consistent-return
        return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null);
    }
  } catch (e) {
    // eslint-disable-next-line consistent-return
    return element.style[styleName];
  }
} : function (element, styleName) {
  if (isServer) return;
  // eslint-disable-next-line consistent-return
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'cssFloat';
  }
  try {
    const computed = document.defaultView.getComputedStyle(element, '');
    // eslint-disable-next-line consistent-return
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    // eslint-disable-next-line consistent-return
    return element.style[styleName];
  }
};

function setStyle(element, styleName, value) {
  if (!element || !styleName) return;

  if (typeof styleName === 'object') {
    // eslint-disable-next-line no-restricted-syntax
    for (const prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(element, prop, styleName[prop]);
      }
    }
  } else {
    styleName = camelCase(styleName);
    if (styleName === 'opacity' && ieVersion < 9) {
      element.style.filter = isNaN(value) ? '' : `alpha(opacity=${value * 100})`;
    } else {
      element.style[styleName] = value;
    }
  }
}

export {
  on,
  off,
  hasClass,
  addClass,
  getStyle,
  setStyle,
  removeClass,
};
