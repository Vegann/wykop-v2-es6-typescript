import FormData from 'form-data';
import MD5 from './md5';
import { IPostParams } from './types';

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
  return MD5(data);
}

export function convertToFormData(object: { [key: string]: any }): FormData {
  const formData = new FormData();

  Object.keys(object).forEach((key) => {
    formData.append(key, object[key]);
  });
  return formData;
}
