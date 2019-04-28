import isArrayLike from 'lodash/isArrayLike';
import isObjectLike from 'lodash/isObjectLike';

/**
 * 生成uuid
 * @returns {*}
 */
function uuid() {
  function rd(a) {
    // eslint-disable-next-line
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) :
      ([1e7] + -[1e3] + -4e3 + -8e3 + -1e11).replace(/[018]/g, rd);
  }
  return rd();
}

/**
 * 字符串首字母大写
 * @param str
 * @returns {string}
 */
function firstUpperCase(str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

/**
 * 将'a-b' 这样的字符串转换为 'aB'
 * @param str
 * @returns {string}
 */
function transUpperCase(str) {
  return str
    .toLowerCase()
    .split('-')
    .map((item, idx) => (idx === 0 ? item : (item.charAt(0).toUpperCase() + item.slice(1))))
    .join('');
    // .reduce((pre, next) => pre.charAt(0).toUpperCase() + pre.slice(1) + next.charAt(0).toUpperCase() + next.slice(1), '');
}

/**
 * 判断值是否相等（string， number，object，array，boolean）
 * @param value
 * @param other
 * @returns {boolean}
 */
function isEqual(value, other) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    // eslint-disable-next-line no-self-compare
    return value !== value && other !== other;
  }

  const valueProps = Object.keys(value);
  const otherProps = Object.keys(other);
  if (valueProps.length !== otherProps.length) {
    return false;
  }

  const checked = [];
  const traverse = (valueProps, otherProps) => {
    for (let i = 0, l = valueProps.length; i < l; i++) {
      const valueProp = valueProps[i];
      if (checked.includes(valueProp)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      if (other.hasOwnProperty(valueProp) === false) {
        return false;
      }

      const otherProp = otherProps[i];

      if (!isEqual(value[valueProp], other[otherProp])) {
        return false;
      }

      checked.push(otherProp);
    }

    return true;
  };

  if (traverse(valueProps, otherProps) === false) {
    return false;
  }

  return traverse(otherProps, valueProps);
}

/**
 * 判断值是否为空
 * @param value
 * @returns {boolean}
 */
function isEmpty(value) {
  return !value || (isArrayLike(value) && value.length === 0)
    || (isObjectLike(value) && Object.keys(value).length === 0);
}

export {
  uuid,
  isEqual,
  isEmpty,
  firstUpperCase,
  transUpperCase,
};
