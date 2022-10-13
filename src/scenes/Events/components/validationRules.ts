import { L } from '../../../i18next';

// required rule
export const required = { required: true, message: L('ThisFieldIsRequired') };

// organizer Website links validation
export const websiteLinkValidation = [
  {
    required: true,
    pattern: /^((ftp|http|https):\/\/)?(www\.)?([A-z]+)\.([A-z]{2,})/,
    message: L('PleaseEnterValidUrl'),
  },
];
