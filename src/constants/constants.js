import moment from 'moment';

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

const DATETIME_FORMATS = [
  {
    key: 'YYYY-MM-DD HH:mm:ss',
    value: `YYYY-MM-DD HH:mm:ss (${moment().format('YYYY-MM-DD HH:mm:ss')})`,
    dateTimeFormat: {
      F: 'YYYY-MM-DD HH:mm:ss',
      DT: 'YYYY-MM-DD HH:mm',
      D: 'YYYY-MM-DD',
      HM: 'HH:mm',
    },
    default: true,
  },
  {
    key: 'YYYY/MM/DD HH:mm:ss',
    value: `YYYY/MM/DD HH:mm:ss (${moment().format('YYYY/MM/DD HH:mm:ss')})`,
    dateTimeFormat: {
      F: 'YYYY/MM/DD HH:mm:ss',
      DT: 'YYYY/MM/DD HH:mm',
      D: 'YYYY/MM/DD',
      HM: 'HH:mm',
    },
  },
  {
    key: 'MM/DD/YYYY HH:mm:ss',
    value: `MM/DD/YYYY HH:mm:ss (${moment().format('MM/DD/YYYY HH:mm:ss')})`,
    dateTimeFormat: {
      F: 'MM/DD/YYYY HH:mm:ss',
      DT: 'MM/DD/YYYY HH:mm',
      D: 'MM/DD/YYYY',
      HM: 'HH:mm',
    },
  },
  {
    key: 'MMM/DD,YYYY HH:mm:ss',
    value: `MMM/DD,YYYY HH:mm:ss (${moment().format('MMM/DD,YYYY HH:mm:ss')})`,
    dateTimeFormat: {
      F: 'MMM/DD,YYYY HH:mm:ss',
      DT: 'MMM/DD,YYYY HH:mm',
      D: 'MMM/DD,YYYY',
      HM: 'HH:mm',
    },
  },
];

const DATETIME_FORMATS_MAP = {};
DATETIME_FORMATS.forEach((info) => {
  DATETIME_FORMATS_MAP[info.key] = info.dateTimeFormat;
});

export { MESSAGE_CATEGORY, DEFAULT_INPUT_VALIDATION_MESSAGE, VALIDATIONS, DATETIME_FORMATS, DATETIME_FORMATS_MAP };
