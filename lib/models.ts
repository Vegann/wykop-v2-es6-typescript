export interface INamedParams {
  [key: string]: any;
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
