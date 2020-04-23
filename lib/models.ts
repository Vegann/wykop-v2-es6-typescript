export interface INamedParams {
  [key: string]: any;
}
export interface IPostParams {
  [key: string]: any;
}

export interface IWykopConnect {
  url: string;
  secure: string | undefined;
}

/* eslint-disable camelcase */
export interface IError {
  code: number;
  field: any;
  message_en: string;
  message_pl: string;
}
/* eslint-enable camelcase */

export interface IData {
  [key: string]: any;
  error: IError;
}

export interface IConfig {
  appKey: string;
  appSecret: string;
  wykopUrl: string;
  ssl: boolean;
}

export interface IRequestParams {
  apiParams: string[];
  namedParams?: INamedParams | undefined;
  postParams?: IPostParams | undefined;
}
