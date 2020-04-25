import fetch, { Headers } from 'node-fetch';
// eslint-disable-next-line no-unused-vars
import * as FormData from 'form-data';
import { stringify } from 'querystring';
import { md5, convertToFormData } from './utils';
// eslint-disable-next-line no-unused-vars
import { INamedParams, IData, IConfig, IPostParams, IWykopConnect, IRequestParams } from './models';

export default class Wykop {
  private readonly config: IConfig;

  private readonly protocol: string;

  private readonly baseUrl: string;

  private readonly appKeyUrl: string;

  // eslint-disable-next-line no-unused-vars, no-useless-constructor, no-empty-function
  constructor(config: Pick<IConfig, 'appKey' | 'appSecret'>) {
    this.config = {
      ssl: true,
      wykopUrl: 'a2.wykop.pl',
      ...config,
    };
    this.protocol = this.config.ssl ? 'https' : 'http';
    this.baseUrl = `${this.protocol}://${this.config.wykopUrl}`;
    this.appKeyUrl = `appkey/${config.appKey}/`;
  }

  private generateHeaders(url: string, postParams?: IPostParams): Headers {
    const headers = new Headers({
      apisign: md5(this.config.appSecret + url, postParams),
      'User-Agent': 'wykop-v2-typescript',
    });

    if (postParams && typeof postParams.embed !== 'object') {
      headers.set('Content-Type', 'application/x-www-form-urlencoded');
    }

    return headers;
  }

  private static parseNamedParams(namedParams: INamedParams): string {
    const parsedNamedParams: string = Object.keys(namedParams)
      .map((key) => `${key}/${namedParams[key]}`)
      .join('/');
    return `${parsedNamedParams}/`;
  }

  private static bodyFromPostParams(postParams?: IPostParams): undefined | string | FormData {
    if (!postParams) return undefined;

    if (!postParams.embed || typeof postParams.embed === 'string') {
      return stringify(postParams);
    }
    return convertToFormData(postParams);
  }

  public wykopConnectLink(redirect?: string): IWykopConnect {
    const {
      baseUrl,
      appKeyUrl,
      config: { appSecret },
    } = this;

    let url: string = `${baseUrl}/login/connect/${appKeyUrl}`;
    let secure: undefined | string;
    if (redirect) {
      const redirectBuffer = Buffer.from(redirect, 'utf-8');
      const encodedUri = encodeURI(redirectBuffer.toString('base64'));
      secure = md5(appSecret + redirect);
      url += `redirect/${encodedUri}/secure/${secure}/`;
    }
    return { url, secure };
  }

  public request({ methods, namedParams, apiParams, postParams }: IRequestParams): Promise<any> {
    const { baseUrl, appKeyUrl } = this;

    let parsedNamedParams: string = '';
    if (namedParams) parsedNamedParams = Wykop.parseNamedParams(namedParams);

    let joinedApiParams: string = '';
    if (apiParams) joinedApiParams = `${apiParams.join('/')}/`;

    const joinedMethods = `${methods.join('/')}/`;
    const url = `${baseUrl}/${joinedMethods}${parsedNamedParams}${joinedApiParams}${appKeyUrl}`;
    const headers = this.generateHeaders(url, postParams);

    let method: string = 'GET';
    const body = Wykop.bodyFromPostParams(postParams);

    if (body) {
      method = 'POST';
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
