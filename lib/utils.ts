import * as MD5 from 'crypto-js/md5';
import * as Hex from 'crypto-js/enc-hex';
import * as FormData from 'form-data';

// eslint-disable-next-line no-undef
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
  return MD5(data).toString(Hex);
}

export function convertToFormData(object: { [key: string]: any }): FormData {
  const formData = new FormData();

  Object.keys(object).forEach((key) => {
    formData.append(key, object[key]);
  });
  return formData;
}
