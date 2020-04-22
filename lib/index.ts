import fetch, { Headers } from 'node-fetch';
import { stringify } from 'querystring';
import { md5 } from './utils';
// eslint-disable-next-line no-unused-vars
import { INamedParams, IData, IConfig, IPostParams } from './models';
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

  public wykopConnectLink(redirect?: string): string {
    const {
      baseUrl,
      config: { appKey, appSecret },
    } = this;

    let url: string = `${baseUrl}/login/connect/appkey/${appKey}`;
    if (redirect) {
      const redirectBuffer = Buffer.from(redirect, 'utf-8');
      const encodedUri = encodeURI(redirectBuffer.toString('base64'));
      const secure = md5(appSecret + redirect);
      url += `/redirect/${encodedUri}/secure/${secure}`;
    }
    return url;
  }

  public request(
    apiParams: string[],
    namedParams?: INamedParams | undefined,
    postParams?: IPostParams | undefined,
  ): Promise<any> {
    const {
      baseUrl,
      config: { appKey, appSecret },
    } = this;

    let parsedNamedParams: string = '';
    if (namedParams) {
      parsedNamedParams = Wykop.parseNamedParams(namedParams);
    }

    const joinedApiParams = apiParams.join('/');
    const url = `${baseUrl}/${joinedApiParams}/${parsedNamedParams}appkey/${appKey}/`;
    let method: string = 'GET';
    let body: string | undefined;
    const headers = new Headers({
      apisign: md5(appSecret + url, postParams),
      'User-Agent': 'wykop-v2-typescript',
    });

    if (postParams) {
      method = 'POST';
      body = stringify(postParams);
      headers.set('Content-Type', 'application/x-www-form-urlencoded');
    }

    return new Promise((resolve, reject) => {
      fetch(url, { method, headers, body })
        .then((res) => res.json())
        .then((data: IData) => {
          if (data.error) return reject(data.error);
          return resolve(data);
        })
        .catch((error: Error) => reject(error));
    });
  }
}
