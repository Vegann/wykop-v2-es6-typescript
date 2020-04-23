import fetchMock from 'jest-fetch-mock';
import Wykop from '../lib/index';

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
        apiParams: ['Entries', 'Hot'],
        namedParams: { page: 1, period: 6 },
      })
      .catch((err) => {
        expect(err.message_en).toBe('Invalid API key');
        expect(err.code).toBe(1);
      });

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(
      'https://a2.wykop.pl/Entries/Hot/page/1/period/6/appkey/asdnasdnad/',
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
        apiParams: ['Entries', 'Hot'],
        namedParams: { page: 1, period: 6 },
      })
      .then((res) => {
        expect(res.data.length).toBeGreaterThan(0);
      });

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(
      'https://a2.wykop.pl/Entries/Hot/page/1/period/6/appkey/asdnasdnad/',
    );
  });

  it('returns error if something went wrong', () => {
    const wykop = new Wykop({ appKey: 'asdnasdnad', appSecret: 'sdakdsajd' });

    const error = new Error('something went wrong');

    fetchMock.mockRejectOnce(error);

    wykop
      .request({
        apiParams: ['Entries', 'Hot'],
        namedParams: { page: 1, period: 6 },
      })
      .catch((err) => {
        expect(err).toBe(error);
      });

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(
      'https://a2.wykop.pl/Entries/Hot/page/1/period/6/appkey/asdnasdnad/',
    );
  });

  it('returns corect data with postParams', () => {
    const wykop = new Wykop({ appKey: 'aaa', appSecret: 'aaa' });
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: { user: { login: 'QWERTY' } },
      }),
    );

    wykop
      .request({
        apiParams: ['Login', 'Index'],
        postParams: { login: 'ASD', token: 'ASD' },
      })
      .then((res) => expect(res.data.user).toEqual('QWERTY'));

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual('https://a2.wykop.pl/Login/Index/appkey/aaa/');
  });
});
