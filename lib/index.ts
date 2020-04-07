/* eslint-disable no-underscore-dangle */
// import { strict as assert } from 'assert';
// import { createHash } from 'crypto';
import fetch from 'node-fetch';

// // import omit from 'lodash/omit';


// function md5(secret: string, url: string, sortedPost: string = ''): string {
//   const string = `${secret}${url}${sortedPost}`;
//   const buffer = Buffer.from(string, 'utf-8');
//   return createHash('md5').update(buffer).digest('hex');
// }

export default class Wykop {
  private readonly wykopUrl: string = 'a2.wykop.pl/'

  private readonly ssl: boolean = true

  request(apiParams: string[]) {
    const secured = this.ssl ? 'https' : 'http';
    const joinedApiParams = apiParams.join('/');
    const url = `${secured}://${this.wykopUrl}${joinedApiParams}/page/1/period/6`;
    return new Promise(((resolve, reject) => {
      fetch(url).then((res: any) => resolve(res), (error: Error) => reject(error));
    }));
  }
}
