import moment from 'moment';
import React from 'react';

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

const ORDERS = [
  {
    key: 'name',
    value: <i className="fal fa-sort-alpha-up" />,
    tooltip: '이름으로 정렬',
  },
  {
    key: 'creationDate',
    value: <i className="fal fa-sort-numeric-up" />,
    tooltip: '생성일시로 정렬',
  },
];

const DIRECTIONS = [
  {
    key: 'asc',
    value: <i className="fal fa-sort-amount-down" />,
    tooltip: '오름차순으로 정렬',
  },
  {
    key: 'desc',
    value: <i className="fal fa-sort-amount-up" />,
    tooltip: '내림차순으로 정렬',
  },
];

const ROLE_CODES = [
  {
    key: 'SUPER_MAN',
    value: '시스템 관리자',
  },
  {
    key: 'MEMBER',
    value: '사용자',
  },
];

const SCREEN_TYPE = {
  WEB: 'WEB',
  PROJECTOR: 'PROJECTOR',
  CONTROLLER: 'CONTROLLER',
};

export {
  MESSAGE_CATEGORY,
  DEFAULT_INPUT_VALIDATION_MESSAGE,
  VALIDATIONS,
  DATETIME_FORMATS,
  DATETIME_FORMATS_MAP,
  ORDERS,
  DIRECTIONS,
  ROLE_CODES,
  SCREEN_TYPE,
};
