import { createHash } from 'crypto';

// eslint-disable-next-line import/prefer-default-export
export function md5(secret: string, url: string, sortedPost?: string): string {
  let string = `${secret}${url}`;
  if (sortedPost) string += sortedPost;
  const buffer = Buffer.from(string, 'utf-8');
  return createHash('md5').update(buffer).digest('hex');
}
