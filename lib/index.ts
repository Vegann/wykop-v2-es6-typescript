// eslint-disable-next-line no-unused-vars
import { stringify } from 'query-string';
import axios, { AxiosRequestConfig } from 'axios';
import * as FormData from 'form-data';
import { md5, convertToFormData } from './utils';

export default class Wykop {
  // eslint-disable-next-line no-undef
  private readonly config: IConfig;

  private readonly protocol: string;

  private readonly baseUrl: string;

  private readonly appKeyUrl: string;

  userkey?: string;

  // eslint-disable-next-line no-undef
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

  // eslint-disable-next-line no-undef
  private generateHeaders(url: string, postParams?: IPostParams): WHeaders {
    // eslint-disable-next-line no-undef
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

  // eslint-disable-next-line no-undef
  private static parseNamedParams(namedParams: INamedParams): string {
    const parsedNamedParams: string = Object.keys(namedParams)
      .map((key) => `${key}/${namedParams[key]}`)
      .join('/');
    return `${parsedNamedParams}/`;
  }

  // eslint-disable-next-line no-undef
  private static bodyFromPostParams(postParams?: IPostParams): undefined | string | FormData {
    if (!postParams) return undefined;

    if (!postParams.embed || typeof postParams.embed === 'string') {
      return stringify(postParams);
    }
    return convertToFormData(postParams);
  }

  // eslint-disable-next-line no-undef
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
  }: // eslint-disable-next-line no-undef
  IRequestParams): Promise<any> {
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

    let method: AxiosRequestConfig['method'] = 'GET';
    const body = Wykop.bodyFromPostParams(postParams);

    if (body) {
      method = 'POST';
    }

    return new Promise((resolve, reject) => {
      axios({ url, method, headers, data: body })
        // eslint-disable-next-line no-undef
        .then(({ data }: { data: IData }) => {
          if (data?.error) return reject(data.error);
          if (data?.data.userkey) {
            this.userkey = data.data.userkey;
          }

          return resolve(data);
        })
        .catch((error: Error) => reject(error));
    });
  }
}
