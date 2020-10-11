import mockAxios from 'jest-mock-axios';
import Wykop from '../lib/index';
import fileMock from './__mocks__/fileMock';

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
    mockAxios.reset();
  });

  it('adds apisign header if appSecret is specyfied', () => {
    const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd', userAgent: 'AAAA' });
    wykop.request({
      methods: ['Entries', 'Hot'],
      namedParams: { page: 1, period: 6 },
    });
    const firstRequestInfo = mockAxios.lastReqGet();
    mockAxios.mockResponse({ data: { data: 'data' } });

    expect(firstRequestInfo.config.headers.apisign).toEqual('56349fb7680d68bbf4be2516f727a0bf');
  });

  it("doesn't add apisign header if  appSecret is not specyfied", () => {
    const wykop = new Wykop({
      appKey: 'asdnasdnad',
    });
    wykop.request({
      methods: ['Entries', 'Hot'],
      namedParams: { page: 1, period: 6 },
    });
    const firstRequestInfo = mockAxios.lastReqGet();
    mockAxios.mockResponse({ data: { data: 'data' } });

    expect(firstRequestInfo.config.headers.apisign).toBeUndefined();
  });

  it('adds User-Agent specified in config', () => {
    const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd', userAgent: 'AAAA' });
    wykop.request({
      methods: ['Entries', 'Hot'],
      namedParams: { page: 1, period: 6 },
    });
    const firstRequestInfo = mockAxios.lastReqGet();
    mockAxios.mockResponse({ data: { data: 'data' } });

    expect(firstRequestInfo.config.headers['User-Agent']).toEqual('AAAA');
  });

  it("doesn't add User-Agent if is not in config", () => {
    const wykop = new Wykop({
      appKey: 'asdnasdnad',
      appSecret: 'sdakdsajd',
    });
    wykop.request({
      methods: ['Entries', 'Hot'],
      namedParams: { page: 1, period: 6 },
    });
    const firstRequestInfo = mockAxios.lastReqGet();
    mockAxios.mockResponse({ data: { data: 'data' } });

    expect(firstRequestInfo.config.headers['User-Agent']).toBeUndefined();
  });

  it('returns error if appKey is wrong', () => {
    const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd' });

    wykop
      .request({
        methods: ['Entries', 'Hot'],
        namedParams: { page: 1, period: 6 },
      })
      .catch((err) => {
        expect(err.message_en).toBe('Invalid API key');
        expect(err.code).toBe(1);
      });
    const firstRequestInfo = mockAxios.lastReqGet();
    mockAxios.mockResponse({ data: { error: { message_en: 'Invalid API key', code: 1 } } });

    expect(firstRequestInfo.url).toEqual(
      'https://a2.wykop.pl/Entries/Hot/page/1/period/6/appkey/asdnasdnad/',
    );
  });

  describe('userkey', () => {
    it('correctly sets userkey if user provide it', () => {
      const wykop = new Wykop(
        {
          appKey: 'asdnasdnad',
          appSecret: 'sdakdsajd',
        },
        'userkey',
      );

      wykop
        .request({
          methods: ['Entries', 'Hot'],
          namedParams: { page: 1, period: 6 },
        })
        .then((res) => {
          expect(res.data.length).toEqual(3);
        });
      const firstRequestInfo = mockAxios.lastReqGet();
      mockAxios.mockResponse({
        data: {
          data: [1, 2, 3],
        },
      });
      expect(firstRequestInfo.url).toEqual(
        'https://a2.wykop.pl/Entries/Hot/page/1/period/6/appkey/asdnasdnad/userkey/userkey/',
      );
    });

    describe('correctly sets userkey if user request login', () => {
      const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd' });

      wykop
        .request({
          methods: ['Entries', 'Hot'],
          namedParams: { page: 1, period: 6 },
        })
        .then((res) => {
          expect(res.data.userkey).toEqual('userkey');
          expect(wykop.userkey).toEqual('userkey');
        });
      mockAxios.mockResponse({
        data: {
          data: { userkey: 'userkey' },
        },
      });

      it('uses it after', () => {
        wykop
          .request({
            methods: ['Entries', 'Hot'],
            namedParams: { page: 1, period: 6 },
          })
          .then((res) => {
            expect(res.data.length).toEqual(3);
            expect(wykop.userkey).toEqual('userkey');
          });
        const firstRequestInfo = mockAxios.lastReqGet();

        mockAxios.mockResponse({
          data: {
            data: [1, 2, 3],
          },
        });
        expect(firstRequestInfo.url).toEqual(
          'https://a2.wykop.pl/Entries/Hot/page/1/period/6/appkey/asdnasdnad/userkey/userkey/',
        );
      });
    });
  });

  it('returns response if appKey is providen and valid', () => {
    const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd' });

    wykop
      .request({
        methods: ['Entries', 'Hot'],
        namedParams: { page: 1, period: 6 },
        apiParams: ['tag'],
      })
      .then((res) => {
        expect(res.data.length).toBeGreaterThan(0);
      });

    const firstRequestInfo = mockAxios.lastReqGet();

    mockAxios.mockResponse({
      data: {
        data: [1, 2, 3],
      },
    });

    expect(firstRequestInfo.url).toEqual(
      'https://a2.wykop.pl/Entries/Hot/page/1/period/6/tag/appkey/asdnasdnad/',
    );
  });

  it('returns error if something went wrong', () => {
    const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd' });

    const error = new Error('something went wrong');

    wykop
      .request({
        methods: ['Entries', 'Hot'],
        namedParams: { page: 1, period: 6 },
      })
      .catch((err) => {
        expect(err).toBe(error);
      });

    const firstRequestInfo = mockAxios.lastReqGet();

    mockAxios.mockError(error);

    expect(firstRequestInfo.url).toEqual(
      'https://a2.wykop.pl/Entries/Hot/page/1/period/6/appkey/asdnasdnad/',
    );
  });

  it('can reorder params', () => {
    const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd' });

    wykop
      .request({
        methods: ['Entries', 'Hot'],
        namedParams: { page: 1, period: 6 },
        apiParams: ['1111'],
        reorderParams: true,
      })
      .then((res) => {
        expect(res.data.length).toBeGreaterThan(0);
      });

    const firstRequestInfo = mockAxios.lastReqGet();

    mockAxios.mockResponse({
      data: {
        data: [1, 2, 3],
      },
    });

    expect(firstRequestInfo.url).toEqual(
      'https://a2.wykop.pl/Entries/Hot/1111/page/1/period/6/appkey/asdnasdnad/',
    );
  });

  describe('returns corect data with postParams', () => {
    test('without embed', () => {
      const wykop = new Wykop({ appKey: 'aaa', appSecret: 'aaa' });

      wykop
        .request({
          methods: ['Login', 'Index'],
          postParams: { login: 'ASD', token: 'ASD' },
        })
        .then((res) => expect(res.data.user.login).toEqual('QWERTY'));
      const firstRequestInfo = mockAxios.lastReqGet();

      mockAxios.mockResponse({
        data: {
          data: { user: { login: 'QWERTY' } },
        },
      });

      expect(firstRequestInfo.url).toEqual('https://a2.wykop.pl/Login/Index/appkey/aaa/');

      if (firstRequestInfo.config.headers) {
        expect(firstRequestInfo.config.headers['Content-Type']).toEqual(
          'application/x-www-form-urlencoded',
        );
      }
    });
    test('with embed', () => {
      const wykop = new Wykop({ appKey: 'aaa', appSecret: 'aaa' });
      const file = fileMock.create();

      wykop
        .request({
          methods: ['Login', 'Index'],
          postParams: { login: 'ASD', token: 'ASD', embed: file },
        })
        .then((res) => expect(res.data.user.login).toEqual('QWERTY'));

      const firstRequestInfo = mockAxios.lastReqGet();

      mockAxios.mockResponse({
        data: {
          data: { user: { login: 'QWERTY' } },
        },
      });
      expect(firstRequestInfo.url).toEqual('https://a2.wykop.pl/Login/Index/appkey/aaa/');

      if (firstRequestInfo.config.headers) {
        expect(firstRequestInfo.config.headers.apisign).toEqual('cdd16ee0beb50ed2f8b24bb9a8c87176');
        expect(firstRequestInfo.config.headers['Content-Type']).toBeUndefined();
      }
    });
  });
});
