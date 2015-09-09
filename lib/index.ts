import fetch, { Headers } from 'node-fetch';
// eslint-disable-next-line no-unused-vars
import { INamedParams, IData, IConfig } from './models';
import { md5 } from './utils';
// // import omit from 'lodash/omit';

export default class Wykop {
  private readonly config: IConfig;

  // eslint-disable-next-line no-unused-vars, no-useless-constructor, no-empty-function
  constructor(config: Pick<IConfig, 'appKey' | 'appSecret'>) {
    this.config = {
      ssl: true,
      wykopUrl: 'a2.wykop.pl',
      ...config,
    };
  }

  private static parseNamedParams(namedParams: Partial<INamedParams>): string {
    let parsedNamedParams: string = '';
    Object.entries(namedParams).forEach(([key, value]) => {
      parsedNamedParams += `${key}/${value}/`;
    });
    return parsedNamedParams;
  }

  public request(apiParams: string[], namedParams: Partial<INamedParams>): Promise<any> {
    const parsedNamedParams: string = Wykop.parseNamedParams(namedParams);
    const { ssl, wykopUrl, appKey } = this.config;
    const protocol = ssl ? 'https' : 'http';
    const joinedApiParams = apiParams.join('/');
    const url = `${protocol}://${wykopUrl}/${joinedApiParams}/${parsedNamedParams}appkey/${appKey}`;
    const apisign = md5(this.config.appSecret, url);
    const headers = new Headers({ apisign });
    return new Promise((resolve, reject) => {
      fetch(url, { headers })
        .then((res) => res.json())
        .then((data: IData) => {
          if (data.error) {
            return reject(data.error);
          }
          return resolve(data);
        })
        .catch((error: Error) => reject(error));
    });
  }
}
