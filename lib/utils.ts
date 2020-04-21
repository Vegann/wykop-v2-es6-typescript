import { createHash } from 'crypto';

// eslint-disable-next-line import/prefer-default-export
export function md5(string: string): string {
  const buffer = Buffer.from(string, 'utf-8');
  return createHash('md5').update(buffer).digest('hex');
}
