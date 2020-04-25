import fetchMock from 'jest-fetch-mock';
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
    fetchMock.resetMocks();
  });

  it('returns error if appKey is wrong', () => {
    const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd' });

    fetchMock.mockResponseOnce(
      JSON.stringify({ error: { message_en: 'Invalid API key', code: 1 } }),
    );

    wykop
      .request({
        methods: ['Entries', 'Hot'],
        namedParams: { page: 1, period: 6 },
      })
      .catch((err) => {
        expect(err.message_en).toBe('Invalid API key');
        expect(err.code).toBe(1);
      });

    expect(fetchMock).toBeCalled();
    expect(fetchMock).toBeCalledWith(
      'https://a2.wykop.pl/Entries/Hot/page/1/period/6/appkey/asdnasdnad/',
      expect.any(Object),
    );
  });

  it('returns response if appKey is providen and valid', () => {
    const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd' });

    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: [1, 2, 3],
      }),
    );

    wykop
      .request({
        methods: ['Entries', 'Hot'],
        namedParams: { page: 1, period: 6 },
        apiParams: ['tag'],
      })
      .then((res) => {
        expect(res.data.length).toBeGreaterThan(0);
      });

    expect(fetchMock).toBeCalled();
    expect(fetchMock).toBeCalledWith(
      'https://a2.wykop.pl/Entries/Hot/page/1/period/6/tag/appkey/asdnasdnad/',
      expect.any(Object),
    );
  });

  it('returns error if something went wrong', () => {
    const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd' });

    const error = new Error('something went wrong');

    fetchMock.mockRejectOnce(error);

    wykop
      .request({
        methods: ['Entries', 'Hot'],
        namedParams: { page: 1, period: 6 },
      })
      .catch((err) => {
        expect(err).toBe(error);
      });

    expect(fetchMock).toBeCalled();
    expect(fetchMock).toBeCalledWith(
      'https://a2.wykop.pl/Entries/Hot/page/1/period/6/appkey/asdnasdnad/',
      expect.any(Object),
    );
  });

  describe('returns corect data with postParams', () => {
    test('without embed', () => {
      const wykop = new Wykop({ appKey: 'aaa', appSecret: 'aaa' });
      fetchMock.mockResponseOnce(
        JSON.stringify({
          data: { user: { login: 'QWERTY' } },
        }),
      );

      wykop
        .request({
          methods: ['Login', 'Index'],
          postParams: { login: 'ASD', token: 'ASD' },
        })
        .then((res) => expect(res.data.user.login).toEqual('QWERTY'));

      expect(fetchMock).toBeCalled();
      expect(fetchMock).toBeCalledWith(
        'https://a2.wykop.pl/Login/Index/appkey/aaa/',
        expect.any(Object),
      );

      // eslint-disable-next-line no-undef
      if (fetchMock.mock.calls[0][1]?.headers instanceof Headers) {
        expect(fetchMock.mock.calls[0][1]?.headers.get('Content-Type')).toEqual(
          'application/x-www-form-urlencoded',
        );
      }
    });
    test('with embed', () => {
      const wykop = new Wykop({ appKey: 'aaa', appSecret: 'aaa' });
      const file = fileMock.create();
      fetchMock.mockResponseOnce(
        JSON.stringify({
          data: { user: { login: 'QWERTY' } },
        }),
      );

      wykop
        .request({
          methods: ['Login', 'Index'],
          postParams: { login: 'ASD', token: 'ASD', embed: file },
        })
        .then((res) => expect(res.data.user.login).toEqual('QWERTY'));

      expect(fetchMock).toBeCalled();
      expect(fetchMock).toBeCalledWith(
        'https://a2.wykop.pl/Login/Index/appkey/aaa/',
        expect.any(Object),
      );

      // eslint-disable-next-line no-undef
      if (fetchMock.mock.calls[0][1]?.headers instanceof Headers) {
        expect(fetchMock.mock.calls[0][1]?.headers.get('apisign')).toEqual(
          'cdd16ee0beb50ed2f8b24bb9a8c87176',
        );
        expect(fetchMock.mock.calls[0][1]?.headers.get('Content-Type')).toBeNull();
      }
    });
  });
});
