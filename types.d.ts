/* eslint-disable no-unused-vars */
interface INamedParams {
  [key: string]: any;
}
interface IPostParams {
  [key: string]: any;
}

interface IWykopConnect {
  url: string;
  secure: string | undefined;
}

/* eslint-disable camelcase */
interface IError {
  code: number;
  field: any;
  message_en: string;
  message_pl: string;
}

interface IData {
  [key: string]: any;
  error: IError;
}

interface IConfig {
  appKey: string;
  appSecret?: string;
  wykopUrl?: string;
  ssl?: boolean;
  userAgent?: string;
}

interface IRequestParams {
  methods: string[];
  namedParams?: INamedParams;
  apiParams?: string[];
  postParams?: IPostParams;
  reorderParams?: boolean;
}
interface WHeaders {
  apisign?: string;
  'User-Agent'?: string;
  'Content-Type'?: string;
}
