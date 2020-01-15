/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import conformToMask from 'text-mask-core/src/conformToMask';
import stringMaskToRegExpMask from './stringMaskToRegExpMask';
import { trigger, queryInputElementInside } from './utils';
import { isAndroid, isChrome } from './utils/env';
import createOptions from './createOptions';
import { BACK_CHAR, VALID_CHARS } from './constants';

const options = createOptions();

function triggerInputUpdate(el) {
  const fn = trigger.bind(null, el, 'input');
  if (isAndroid && isChrome) {
    setTimeout(fn, 0);
  } else {
    fn();
  }
}

/**
 * Fires on handler update
 * @param {HTMLInputElement} el
 * @param {String}           mask
 */
function updateMask(el, mask) {
  const { optional } = options.get(el);
  const [base, ...optionalBase] = mask.split(BACK_CHAR).reverse();

  if (!optional) {
    const initialValidMaskChars = base.split('').filter((character) => VALID_CHARS.includes(character));

    options.partiallyUpdate(el, {
      optional: optionalBase,
      initialBase: base,
      initialValidMaskChars,
    });
  }

  const parsedMask = stringMaskToRegExpMask(base);

  options.partiallyUpdate(el, {
    mask: parsedMask,
    base,
  });

  return parsedMask;
}

/**
 * Event handler
 * @param {HTMLInputElement} el
 * @param {Boolean}          force
 */
function updateValue(el, force = false) {
  // prettier-ignore
  const {
    previousValue,
    optional,
    initialBase,
    initialValidMaskChars,
  } = options.get(el);

  const { value } = el;

  let { mask } = options.get(el);

  const isValueChanged = value !== previousValue;
  const isLengthIncreased = value.length > previousValue.length;
  const isLengthDecreased = value.length < previousValue.length;
  const isUpdateNeeded = value && isValueChanged && (isLengthIncreased || isLengthDecreased);

  if (force || isUpdateNeeded) {
    const valueComparator = !previousValue ? initialValidMaskChars.length : mask.length;

    if (valueComparator < value.length && !!optional) {
      const maskComparator = !previousValue ? initialValidMaskChars.length : initialBase.length;
      const complement = optional.slice(0, value.length - maskComparator);

      mask = updateMask(el, `${complement.join('')}${initialBase}`);
    } else if (isLengthDecreased) {
      const reducement = mask.length - value.length;
      const reducedMask = mask.slice(reducement);

      if (reducedMask.length >= initialBase.length) {
        mask = reducedMask;

        options.partiallyUpdate(el, {
          mask,
        });
      } else {
        return null;
      }
    }

    const { conformedValue } = conformToMask(value, mask, {
      guide: false,
    });

    el.value = conformedValue;
    triggerInputUpdate(el);
  }

  options.partiallyUpdate(el, { previousValue: value });

  return null;
}

/**
 * Vue directive definition
 */
export default {
  /**
   * Called only once, when the directive is first bound to the element.
   * This is where you can do one-time setup work.
   *
   * @param {(HTMLInputElement|HTMLElement)} el
   * @param {?String}                        value
   */
  bind(el, { value }) {
    el = queryInputElementInside(el);

    if (value) {
      updateMask(el, value);
      updateValue(el);
    }
  },

  /**
   * Called after the containing component has updated,
   * but possibly before its children have updated.
   * The directive’s value may or may not have changed,
   * but you can skip unnecessary updates by comparing the
   * binding’s current and old values.
   *
   * @param {(HTMLInputElement|HTMLElement)} el
   * @param {?String}                        value
   * @param {?String}                        oldValue
   */
  componentUpdated(el, { value, oldValue }) {
    el = queryInputElementInside(el);

    const isMaskChanged = value !== oldValue;

    if (value) {
      // update mask first if changed
      if (isMaskChanged) {
        updateMask(el, value);
      }

      // update value
      updateValue(el, isMaskChanged);
    }
  },

  unbind(el) {
    el = queryInputElementInside(el);
    options.remove(el);
  },
};
