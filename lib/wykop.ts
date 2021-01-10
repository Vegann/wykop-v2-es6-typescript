import fetch from 'node-fetch';
import * as FormData from 'form-data';
import { md5, convertToFormData, stringify } from './utils';

import {
  IConfig,
  IData,
  INamedParams,
  IPostParams,
  IRequestParams,
  IWykopConnect,
  WHeaders,
} from './types';

export default class Wykop {
  private readonly config: IConfig;

  private readonly protocol: string;

  private readonly baseUrl: string;

  private readonly appKeyUrl: string;

  userkey?: string;

  constructor(config: IConfig, userkey?: string) {
    this.config = {
      ssl: config.ssl || true,
      wykopUrl: config.wykopUrl || 'a2.wykop.pl',
      userAgent: config.userAgent,
      appKey: config.appKey,
      appSecret: config.appSecret,
    };
    this.protocol = this.config.ssl ? 'https' : 'http';
    this.baseUrl = `${this.protocol}://${this.config.wykopUrl}`;
    this.appKeyUrl = `appkey/${config.appKey}/`;
    if (userkey) {
      this.userkey = userkey;
    }
  }

  private userkeyUrl() {
    return this.userkey ? `userkey/${this.userkey}/` : '';
  }

  private generateHeaders(url: string, postParams?: IPostParams): WHeaders {
    const headers: WHeaders = {};
    if (this.config.appSecret) {
      headers.apisign = md5(this.config.appSecret + url, postParams);
    }
    if (this.config.userAgent) {
      headers['User-Agent'] = this.config.userAgent;
    }

    if (postParams && typeof postParams.embed !== 'object') {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
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

    const secret = appSecret || '';

    let url: string = `${baseUrl}/login/connect/${appKeyUrl}`;
    let secure: undefined | string;
    if (redirect) {
      const redirectBuffer = Buffer.from(redirect, 'utf-8');
      const encodedUri = encodeURI(redirectBuffer.toString('base64'));
      secure = md5(secret + redirect);
      url += `redirect/${encodedUri}/secure/${secure}/`;
    }
    return { url, secure };
  }

  public request({
    methods,
    namedParams,
    apiParams,
    postParams,
    reorderParams = false,
  }: IRequestParams): Promise<any> {
    const { baseUrl, appKeyUrl } = this;

    let parsedNamedParams: string = '';
    if (namedParams) parsedNamedParams = Wykop.parseNamedParams(namedParams);

    let joinedApiParams: string = '';
    if (apiParams) joinedApiParams = `${apiParams.join('/')}/`;

    const joinedMethods = `${methods.join('/')}/`;
    let url: string;
    if (reorderParams) {
      url = `${baseUrl}/${joinedMethods}${joinedApiParams}${parsedNamedParams}${appKeyUrl}${this.userkeyUrl()}`;
    } else {
      url = `${baseUrl}/${joinedMethods}${parsedNamedParams}${joinedApiParams}${appKeyUrl}${this.userkeyUrl()}`;
    }
    const headers = this.generateHeaders(url, postParams);

    let method = 'GET';
    const body = Wykop.bodyFromPostParams(postParams);

    if (body) {
      method = 'POST';
    }

    return new Promise((resolve, reject) => {
      fetch(url, { method, headers, body })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Network problem');
        })
        .then((result: { data: IData }) => {
          if (result?.data?.error) return reject(result.data.error);
          if (result?.data?.userkey) {
            this.userkey = result.data.userkey;
          }

          return resolve(result);
        })
        .catch((error: Error) => reject(error));
    });
  }
}
