// eslint-disable-next-line no-unused-vars
import { stringify } from 'querystring';
import axios, { AxiosRequestConfig } from 'axios';
import * as FormData from 'form-data';
import { md5, convertToFormData } from './utils';
import {
  INamedParams,
  IData,
  IConfig,
  IPostParams,
  IWykopConnect,
  IRequestParams,
  WHeaders,
} from './models';

export default class Wykop {
  private readonly config: IConfig;

  private readonly protocol: string;

  private readonly baseUrl: string;

  private readonly appKeyUrl: string;

  private userkeyUrl: string = '';

  userkey?: string;

  // eslint-disable-next-line no-unused-vars, no-useless-constructor, no-empty-function
  constructor(config: IConfig, userkey?: string) {
    this.config = {
      ssl: config.ssl || true,
      wykopUrl: config.wykopUrl || 'a2.wykop.pl',
      userAgent: config.userAgent || 'wykop-v2-typescript',
      appKey: config.appKey,
      appSecret: config.appSecret,
    };
    this.protocol = this.config.ssl ? 'https' : 'http';
    this.baseUrl = `${this.protocol}://${this.config.wykopUrl}`;
    this.appKeyUrl = `appkey/${config.appKey}/`;
    if (userkey) {
      this.userkey = userkey;
      this.generateUserkeyUrl();
    }
  }

  private generateUserkeyUrl() {
    this.userkeyUrl = `userkey/${this.userkey}/`;
  }

  private generateHeaders(url: string, postParams?: IPostParams): WHeaders {
    const headers: WHeaders = {
      apisign: md5(this.config.appSecret + url, postParams),
      'User-Agent': this.config.userAgent!,
    };

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

  public request({
    methods,
    namedParams,
    apiParams,
    postParams,
    reorderParams = false,
  }: IRequestParams): Promise<any> {
    const { baseUrl, appKeyUrl, userkeyUrl } = this;

    let parsedNamedParams: string = '';
    if (namedParams) parsedNamedParams = Wykop.parseNamedParams(namedParams);

    let joinedApiParams: string = '';
    if (apiParams) joinedApiParams = `${apiParams.join('/')}/`;

    const joinedMethods = `${methods.join('/')}/`;
    let url: string;
    if (reorderParams) {
      url = `${baseUrl}/${joinedMethods}${joinedApiParams}${parsedNamedParams}${appKeyUrl}${userkeyUrl}`;
    } else {
      url = `${baseUrl}/${joinedMethods}${parsedNamedParams}${joinedApiParams}${appKeyUrl}${userkeyUrl}`;
    }
    const headers = this.generateHeaders(url, postParams);

    let method: AxiosRequestConfig['method'] = 'GET';
    const body = Wykop.bodyFromPostParams(postParams);

    if (body) {
      method = 'POST';
    }

    return new Promise((resolve, reject) => {
      axios({ url, method, headers, data: body })
        .then(({ data }: { data: IData }) => {
          if (data?.error) return reject(data.error);
          if (data?.data.userkey) {
            this.userkey = data.data.userkey;
            this.generateUserkeyUrl();
          }

          return resolve(data);
        })
        .catch((error: Error) => reject(error));
    });
  }
}
