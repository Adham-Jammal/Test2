import { L } from '../../i18next';

const rules = {
  name: [
    {
      required: true,
      message: L('ThisFieldIsRequired'),
    },
  ],
  password: [
    {
      required: true,
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      message: L('passwordValidation'),
    },
  ],
  email: [
    {
      required: true,
      message: L('ThisFieldIsRequired'),
    },
    {
      pattern:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/,
      message: L('ThisEmailIsInvalid'),
    },
  ],
  phoneNumber: [
    {
      required: true,
      pattern: /^(?=.*\d)[\d]+$/,
      message: L('ThisFieldIsRequired'),
    },
  ],
  lastName: [
    {
      max: 60,
      message: L('NameMaxLengthValidation'),
    },
    {
      min: 2,
      message: L('NameMinLengthValidation'),
    },
  ],
};

export default rules;
