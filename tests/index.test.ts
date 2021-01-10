import fileMockJest from 'fetch-mock-jest';
import Wykop from '../lib/index';
import fileMock from './__mocks__/fileMock';

jest.mock('node-fetch', () => fileMockJest.sandbox());
const fetchMock = require('node-fetch');

describe('wykopConnectLink', () => {
  describe('with redirect link', () => {
    it('returns link for wykop connect', () => {
      const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd' });
      const { url } = wykop.wykopConnectLink('http://localhost:3000');

      expect(url).toEqual(
        // eslint-disable-next-line max-len
        'https://a2.wykop.pl/login/connect/appkey/asdnasdnad/redirect/aHR0cDovL2xvY2FsaG9zdDozMDAw/secure/0fd64c470ca4c85844f670113435ac08/',
      );
    });
  });

  describe('without redirect link', () => {
    it('returns link for wykop connect', () => {
      const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd' });
      const { url } = wykop.wykopConnectLink();

      expect(url).toEqual(
        // eslint-disable-next-line max-len
        'https://a2.wykop.pl/login/connect/appkey/asdnasdnad/',
      );
    });
  });
});

describe('request', () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  it('adds apisign header if appSecret is specyfied', async () => {
    const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd', userAgent: 'AAAA' });
    fetchMock.get(/Entries\/Hot\/page\/1\/period\/6/g, {
      data: { data: 'data' },
    });
    await wykop.request({
      methods: ['Entries', 'Hot'],
      namedParams: { page: 1, period: 6 },
    });

    expect(fetchMock.lastOptions().headers.apisign).toEqual('56349fb7680d68bbf4be2516f727a0bf');
  });

  it("doesn't add apisign header if  appSecret is not specyfied", async () => {
    const wykop = new Wykop({
      appKey: 'asdnasdnad',
    });
    fetchMock.get(/Entries\/Hot\/page\/1\/period\/6/g, {
      data: { data: 'data' },
    });
    await wykop.request({
      methods: ['Entries', 'Hot'],
      namedParams: { page: 1, period: 6 },
    });

    expect(fetchMock.lastOptions().headers.apisign).toBeUndefined();
  });

  it('adds User-Agent specified in config', async () => {
    const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd', userAgent: 'AAAA' });
    fetchMock.get(/Entries\/Hot\/page\/1\/period\/6/g, {
      data: { data: 'data' },
    });
    await wykop.request({
      methods: ['Entries', 'Hot'],
      namedParams: { page: 1, period: 6 },
    });

    expect(fetchMock.lastOptions().headers['User-Agent']).toEqual('AAAA');
  });

  it("doesn't add User-Agent if is not in config", async () => {
    const wykop = new Wykop({
      appKey: 'asdnasdnad',
      appSecret: 'sdakdsajd',
    });
    fetchMock.get(/Entries\/Hot\/page\/1\/period\/6/g, {
      data: { data: 'data' },
    });
    await wykop.request({
      methods: ['Entries', 'Hot'],
      namedParams: { page: 1, period: 6 },
    });

    expect(fetchMock.lastOptions().headers['User-Agent']).toBeUndefined();
  });

  it('returns error if appKey is wrong', () => {
    const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd' });
    fetchMock.get(/Entries\/Hot\/page\/1\/period\/6/g, {
      data: { error: { message_en: 'Invalid API key', code: 1 } },
    });

    wykop
      .request({
        methods: ['Entries', 'Hot'],
        namedParams: { page: 1, period: 6 },
      })
      .catch((err) => {
        expect(err.message_en).toBe('Invalid API key');
        expect(err.code).toBe(1);
      });

    expect(fetchMock.lastUrl()).toEqual(
      'https://a2.wykop.pl/Entries/Hot/page/1/period/6/appkey/asdnasdnad/',
    );
  });

  describe('userkey', () => {
    it('correctly sets userkey if user provide it', async () => {
      const wykop = new Wykop(
        {
          appKey: 'asdnasdnad',
          appSecret: 'sdakdsajd',
        },
        'userkey',
      );
      fetchMock.get(/Entries\/Hot\/page\/1\/period\/6/g, {
        data: [1, 2, 3],
      });

      await wykop
        .request({
          methods: ['Entries', 'Hot'],
          namedParams: { page: 1, period: 6 },
        })
        .then((res) => {
          expect(res.data.length).toEqual(3);
        });

      expect(fetchMock.lastUrl()).toEqual(
        'https://a2.wykop.pl/Entries/Hot/page/1/period/6/appkey/asdnasdnad/userkey/userkey/',
      );
    });

    describe('correctly sets userkey if user request login', () => {
      const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd' });
      fetchMock.get(/Entries\/Hot\/page\/1\/period\/6/g, {
        data: { userkey: 'userkey' },
      });
      wykop
        .request({
          methods: ['Entries', 'Hot'],
          namedParams: { page: 1, period: 6 },
        })
        .then((res) => {
          expect(res.data.userkey).toEqual('userkey');
          expect(wykop.userkey).toEqual('userkey');
        });

      it('uses it after', () => {
        fetchMock.get(/Entries\/Hot\/page\/1\/period\/6/g, {
          data: [1, 2, 3],
        });
        wykop
          .request({
            methods: ['Entries', 'Hot'],
            namedParams: { page: 1, period: 6 },
          })
          .then((res) => {
            expect(res.data.length).toEqual(3);
            expect(wykop.userkey).toEqual('userkey');
          });

        expect(fetchMock.lastUrl()).toEqual(
          'https://a2.wykop.pl/Entries/Hot/page/1/period/6/appkey/asdnasdnad/userkey/userkey/',
        );
      });
    });
  });

  it('returns response if appKey is providen and valid', async () => {
    const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd' });
    fetchMock.get(/Entries\/Hot\/page\/1\/period\/6/g, {
      data: [1, 2, 3],
    });
    const res = await wykop.request({
      methods: ['Entries', 'Hot'],
      namedParams: { page: 1, period: 6 },
      apiParams: ['tag'],
    });
    expect(res.data.length).toBeGreaterThan(0);

    expect(fetchMock.lastUrl()).toEqual(
      'https://a2.wykop.pl/Entries/Hot/page/1/period/6/tag/appkey/asdnasdnad/',
    );
  });

  it('returns error if Network problem', () => {
    const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd' });

    const error = new Error('Network problem');
    fetchMock.get(/Entries\/Hot\/page\/1\/period\/6/g, 404);
    wykop
      .request({
        methods: ['Entries', 'Hot'],
        namedParams: { page: 1, period: 6 },
      })
      .catch((err) => {
        expect(err).toStrictEqual(error);
      });

    expect(fetchMock.lastUrl()).toEqual(
      'https://a2.wykop.pl/Entries/Hot/page/1/period/6/appkey/asdnasdnad/',
    );
  });

  it('can reorder params', async () => {
    const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd' });
    fetchMock.get(/Entries\/Hot\/1111\/page\/1\/period\/6/g, {
      data: [1, 2, 3],
    });
    const res = await wykop.request({
      methods: ['Entries', 'Hot'],
      namedParams: { page: 1, period: 6 },
      apiParams: ['1111'],
      reorderParams: true,
    });
    expect(res.data.length).toBeGreaterThan(0);

    expect(fetchMock.lastUrl()).toEqual(
      'https://a2.wykop.pl/Entries/Hot/1111/page/1/period/6/appkey/asdnasdnad/',
    );
  });

  describe('returns corect data with postParams', () => {
    test('without embed', async () => {
      const wykop = new Wykop({ appKey: 'aaa', appSecret: 'aaa' });
      fetchMock.post(/Login\/Index/g, {
        data: { user: { login: 'QWERTY' } },
      });
      const res = await wykop.request({
        methods: ['Login', 'Index'],
        postParams: { login: 'ASD', token: { a: 'ASD' } },
      });
      expect(res.data.user.login).toEqual('QWERTY');

      expect(fetchMock.lastUrl()).toEqual('https://a2.wykop.pl/Login/Index/appkey/aaa/');

      if (fetchMock.lastOptions().headers) {
        expect(fetchMock.lastOptions().headers['Content-Type']).toEqual(
          'application/x-www-form-urlencoded',
        );
      }
    });
    test('with embed', async () => {
      const wykop = new Wykop({ appKey: 'aaa', appSecret: 'aaa' });
      const file = fileMock.create();
      fetchMock.post(/Login\/Index/g, {
        data: { user: { login: 'QWERTY' } },
      });
      const res = await wykop.request({
        methods: ['Login', 'Index'],
        postParams: { login: 'ASD', token: 'ASD', embed: file },
      });
      expect(res.data.user.login).toEqual('QWERTY');

      expect(fetchMock.lastUrl()).toEqual('https://a2.wykop.pl/Login/Index/appkey/aaa/');

      if (fetchMock.lastOptions().headers) {
        expect(fetchMock.lastOptions().headers.apisign).toEqual('cdd16ee0beb50ed2f8b24bb9a8c87176');
        expect(fetchMock.lastOptions().headers['Content-Type']).toBeUndefined();
      }
    });
  });
});
