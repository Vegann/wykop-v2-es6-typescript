import { createHash } from 'crypto';

// eslint-disable-next-line import/prefer-default-export
export function md5(string: string, postParams?: any): string {
  let data = string;
  if (postParams) {
    data += Object.keys(postParams)
      .map((key) => postParams[key])
      .join(',');
  }
  return createHash('md5').update(data).digest('hex');
}
