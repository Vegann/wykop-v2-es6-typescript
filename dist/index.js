"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle */
// import { strict as assert } from 'assert';
// import { createHash } from 'crypto';
var node_fetch_1 = require("node-fetch");
// // import omit from 'lodash/omit';
// function md5(secret: string, url: string, sortedPost: string = ''): string {
//   const string = `${secret}${url}${sortedPost}`;
//   const buffer = Buffer.from(string, 'utf-8');
//   return createHash('md5').update(buffer).digest('hex');
// }
var Wykop = /** @class */ (function () {
    function Wykop() {
        this.wykopUrl = 'a2.wykop.pl/';
        this.ssl = true;
    }
    Wykop.prototype.request = function (apiParams) {
        var secured = this.ssl ? 'https' : 'http';
        var joinedApiParams = apiParams.join('/');
        var url = secured + "://" + this.wykopUrl + joinedApiParams + "/page/1/period/6";
        return new Promise((function (resolve, reject) {
            node_fetch_1.default(url).then(function (res) { return resolve(res); }, function (error) { return reject(error); });
        }));
    };
    return Wykop;
}());
exports.default = Wykop;
