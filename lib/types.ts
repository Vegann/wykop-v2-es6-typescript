/* eslint-disable no-unused-vars */
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

export interface IData {
  [key: string]: any;
  error: IError;
}

export interface IConfig {
  appKey: string;
  appSecret?: string;
  wykopUrl?: string;
  ssl?: boolean;
  userAgent?: string;
}

export interface IRequestParams {
  methods: string[];
  namedParams?: INamedParams;
  apiParams?: string[];
  postParams?: IPostParams;
  reorderParams?: boolean;
}
export interface WHeaders {
  apisign?: string;
  'User-Agent'?: string;
  'Content-Type'?: string;
}
