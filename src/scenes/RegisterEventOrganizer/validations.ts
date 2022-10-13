import { L } from '../../i18next';

export const required = {
  required: true,
  message: L('ThisFieldIsRequired'),
};
// first name rules
export const firstName = [
  required,
  {
    max: 60,
    message: L('firstNameMaxLengthValidation'),
  },
  {
    min: 2,
    message: L('firstNameMinLengthValidation'),
  },
];

// last name rules
export const lastName = [
  required,
  {
    max: 60,
    message: L('lastNameMaxLengthValidation'),
  },
  {
    min: 2,
    message: L('lastNameMinLengthValidation'),
  },
];
// birth date rules
export const birthDate = [required];
// country code
export const countryCode = [required];
// user name  rules
export const userName = [
  required,
  { pattern: /^[a-zA-Z0-9_]+$/, message: L('userNameValidation') },
];

// phone rules
export const phoneNumber = [
  {
    required: true,
    pattern: /^(?=.*\d)[\d]+$/,
    message: L('ThisFieldIsRequired'),
  },
];
// password rules
export const password = [
  required,
  { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, message: L('passwordValidation') },
];
// email rules
export const email = [
  {
    pattern:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/,
    message: L('ThisEmailIsInvalid'),
  },
];

export const accountNumber = [
  {
    pattern: /^[0-9]+$/,
    message: L('ThisFieldAcceptNumbersOnly'),
  },
];
