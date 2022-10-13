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

export const ShopName = [
  {
    max: 60,
    message: L('ShopNameMaxLengthValidation'),
  },
  {
    min: 2,
    message: L('ShopNameMinLengthValidation'),
  },
];
export const ShopDescription = [
  {
    max: 200,
    message: L('ShopDescMaxLengthValidation'),
  },
  {
    min: 2,
    message: L('ShopDescMinLengthValidation'),
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
export const userName = [required, { pattern: /^[a-zA-Z0-9]+$/, message: L('userNameValidation') }];

// phone rules
export const phoneNumber = [
  required,
  {
    max: 9,
    message: L('phoneNumberMaxLengthValidation'),
  },
  {
    min: 9,
    message: L('phoneNumberMinLengthValidation'),
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
