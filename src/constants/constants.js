const MESSAGE_CATEGORY = {
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INFO: 'INFO',
};

const VALIDATIONS = [
  'valueMissing',
  'typeMismatch',
  'patternMismatch',
  'tooLong',
  'tooShort',
  'rangeUnderflow',
  'rangeOverflow',
  'stepMismatch',
  'badInput',
  'customError',
  'valid',
];

const DEFAULT_INPUT_VALIDATION_MESSAGE = {
  valueMissing: 'validation.valueMissing',
  typeMismatch: 'validation.typeMismatch',
  patternMismatch: 'validation.patternMismatch',
  tooLong: 'validation.tooLong',
  tooShort: 'validation.tooShort',
  rangeUnderflow: 'validation.rangeUnderflow',
  rangeOverflow: 'validation.rangeOverflow',
  stepMismatch: 'validation.stepMismatch',
  badInput: 'validation.badInput',
  customError: 'validation.customError',
  valid: 'validation.valid',
};

export { MESSAGE_CATEGORY, DEFAULT_INPUT_VALIDATION_MESSAGE, VALIDATIONS };
