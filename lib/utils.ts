import * as cryptoJs from 'crypto-js';
import * as FormData from 'form-data';

// eslint-disable-next-line no-unused-vars
import { IPostParams } from './models';

// eslint-disable-next-line import/prefer-default-export
export function md5(string: string, postParams?: IPostParams): string {
  let data = string;
  if (postParams) {
    const clonedPostParams = { ...postParams };
    if (postParams.embed && typeof postParams.embed !== 'string') {
      delete clonedPostParams.embed;
    }

    data += Object.keys(clonedPostParams)
      .map((key) => clonedPostParams[key])
      .join(',');
  }
  return cryptoJs.MD5(data).toString(cryptoJs.enc.Hex);
}

export function convertToFormData(object: { [key: string]: any }): FormData {
  const formData = new FormData();

  Object.keys(object).forEach((key) => {
    formData.append(key, object[key]);
  });
  return formData;
}
