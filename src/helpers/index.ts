import _ from 'lodash';
import {ValidateStatus} from 'antd/lib/form/FormItem';
import { L } from '../i18next';

export interface ErrorObjDto {
  validateStatus: ValidateStatus;
  errorMsg: string | null;
}

export interface ImageObjDto {
  uid: number;
  name: string;
  status: string;
  url: string;
  thumbUrl: string;
}

// validate arabic name
export const validateArName = (value: string): ErrorObjDto => {
  const regex = /^[\u0600-\u06FF0-9\s.\-_()+]+$/;
  if (value !== '' && !regex.test(value)) {
    return {
      validateStatus: 'warning',
      errorMsg: L('YouAreWritingEnglishSymbols'),
    };
  }
  if (value !== '') {
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }

  return {
    validateStatus: 'error',
    errorMsg: L('ThisFieldIsRequired'),
  };
};

// validate English  name
export const validateEnName = (value: string): ErrorObjDto => {
  const regex = /^[A-Za-z0-9\s.\-_()+]+$/;
  if (value !== '' && !regex.test(value)) {
    return {
      validateStatus: 'warning',
      errorMsg: L('YouAreWritingArabicSymbols'),
    };
  }
  if (value !== '') {
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }
  return {
    validateStatus: 'error',
    errorMsg: L('ThisFieldIsRequired'),
  };
};

// convert image to image object
export const convertImageToImageArr = (imageUrl: string, imageName: string):ImageObjDto[]=> {
  if (imageUrl && !_.isNull(imageUrl)) {
    const newImage = [
      {
        uid: 1,
        name: imageName,
        status: 'done',
        url: imageUrl,
        thumbUrl: imageUrl,
      },
    ];
    return newImage;
  }
  return [];
};

// convert image to image object
export const convertImagesUrlsToImageArr = (imagesUrls: string[], imageName: string):ImageObjDto[] => {
  if (imagesUrls && !_.isNull(imagesUrls) && imagesUrls.length > 0) {
    const newImagesArr = Array.from(imagesUrls, (imageUrl, index) => ({
      uid: index,
      name: `${imageName}${index}`,
      status: 'done',
      url: imageUrl,
      thumbUrl: imageUrl,
    }));
    return newImagesArr;
  }
  return [];
};
