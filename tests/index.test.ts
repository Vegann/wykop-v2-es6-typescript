import { config } from 'dotenv';
import { resolve } from 'path';
import Wykop from '../lib/index';

config({ path: resolve(__dirname, '../.env.test') });
const appKey = process.env.appKey || '';
const appSecret = process.env.appSecret || '';

describe('request', () => {
  it('shows error if appKey is not wrong', () => {
    const wykop = new Wykop({ appKey: '', appSecret: '' });
    wykop.request(['Entries', 'Hot'], { page: 1, period: 6 }).catch((err) => {
      expect(err.message_en).toBe('Invalid API key');
      expect(err.code).toBe(1);
    });
  });

  it('shows response if appKey is providen and valid', () => {
    const wykop = new Wykop({ appKey, appSecret });
    wykop
      .request(['Entries', 'Hot'], { page: 1, period: 6 })
      .then((res) => {
        expect(res.data.length).toBeGreaterThan(0);
      })
      .catch((err) => expect(err).toBeUndefined);
  });
});
