/**
 * A special object to identify next character as optional
 * For example `?`
 *
 * @type {Object}
 */
export const NEXT_CHAR_OPTIONAL = {
  __nextCharOptional__: true,
};

export const NEXT_CHAR = '?';

/**
 * A special object to identify back character as optional
 * For example `&`
 *
 * @type {Object}
 */
export const BACK_CHAR_OPTIONAL = {
  __backCharOptional__: true,
};

export const BACK_CHAR = '&';

export const NUMERIC_CHAR = /\d/;
export const ALPHA_CHAR = /[a-z]/i;
export const ALPHA_NUMERIC_CHAR = /[a-z0-9]/i;

export const VALID_CHARS = [NUMERIC_CHAR, ALPHA_CHAR, ALPHA_NUMERIC_CHAR];

/**
 * @type {Object<String,RegExp|NEXT_CHAR_OPTIONAL|BACK_CHAR_OPTIONAL>}
 */
export const defaultMaskReplacers = {
  '#': NUMERIC_CHAR,
  A: ALPHA_CHAR,
  N: ALPHA_NUMERIC_CHAR,
  [NEXT_CHAR]: NEXT_CHAR_OPTIONAL,
  [BACK_CHAR]: BACK_CHAR_OPTIONAL,
  X: /./,
};
