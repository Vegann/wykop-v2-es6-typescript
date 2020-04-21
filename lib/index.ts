import fetch, { Headers } from 'node-fetch';
import { md5 } from './utils';
// eslint-disable-next-line no-unused-vars
import { INamedParams, IData, IConfig } from './models';
// // import omit from 'lodash/omit';

export default class Wykop {
  private readonly config: IConfig;

  private readonly protocol: string;

  private readonly baseUrl: string;

  // eslint-disable-next-line no-unused-vars, no-useless-constructor, no-empty-function
  constructor(config: Pick<IConfig, 'appKey' | 'appSecret'>) {
    this.config = {
      ssl: true,
      wykopUrl: 'a2.wykop.pl',
      ...config,
    };
    this.protocol = this.config.ssl ? 'https' : 'http';
    this.baseUrl = `${this.protocol}://${this.config.wykopUrl}`;
  }

  private static parseNamedParams(namedParams: INamedParams): string {
    let parsedNamedParams: string = '';
    Object.entries(namedParams).forEach(([key, value]) => {
      parsedNamedParams += `${key}/${value}/`;
    });
    return parsedNamedParams;
  }

  public wykopConnectLink(redirect: string | undefined) {
    const {
      baseUrl,
      config: { appKey, appSecret },
    } = this;

    let url: string = `${baseUrl}/login/connect/appkey/${appKey}`;
    if (redirect) {
      const encodedUri = encodeURI(redirect);
      const secure = md5(appSecret + redirect);
      url += `/redirect/${encodedUri}/secure/${secure}`;
    }
    return url;
  }

  public request(apiParams: string[], namedParams: INamedParams): Promise<any> {
    const {
      baseUrl,
      config: { appKey },
    } = this;

    const parsedNamedParams: string = Wykop.parseNamedParams(namedParams);
    const joinedApiParams = apiParams.join('/');
    const url = `${baseUrl}/${joinedApiParams}/${parsedNamedParams}appkey/${appKey}/`;
    const headers = new Headers({
      apisign: md5(this.config.appSecret + url),
      'User-Agent': 'wykop-v2-typescript',
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return new Promise((resolve, reject) => {
      fetch(url, { method: 'GET', headers })
        .then((res) => res.json())
        .then((data: IData) => {
          if (data.error) return reject(data.error);
          return resolve(data);
        })
        .catch((error: Error) => reject(error));
    });
  }
}
