/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/* eslint-env mocha, browser */
/* global chai, workbox */

'use strict';

describe('queue-utils test', () => {
  const queueUtils = workbox.backgroundSync.test.QueueUtils;
  const maxAgeTimeStamp = 1000*60*60*24;
  const config = {
    maxAge: maxAgeTimeStamp,
  };

  beforeEach(function() {
    const idbHelper = new workbox.backgroundSync.test.IdbHelper(
      'bgQueueSyncDB', 1, 'QueueStore');
    return idbHelper.getAllKeys()
    .then((keys) => {
      keys.forEach((key) => {
        idbHelper.delete(key);
      });
    });
  });

  it('test queueableRequest', () => {
    const request = new Request('http://localhost:3001/__echo/date-with-cors/random');
    return queueUtils.getQueueableRequest({
      request,
      config,
    }).then((reqObj) => {
      chai.assert.isObject(reqObj);
      chai.assert.isObject(reqObj.config);
      chai.assert.isObject(reqObj.request);

      chai.assert.equal(reqObj.config.maxAge, maxAgeTimeStamp);
      chai.assert.equal(reqObj.request.url, request.url);
      chai.assert.equal(reqObj.request.mode, request.mode);
      chai.assert.equal(reqObj.request.method, request.method);
      chai.assert.equal(reqObj.request.redirect, request.redirect);
    });
  });

  it('test fetchableRequest', () => {
    const reqObj = {
      'url': 'http://localhost:3001/__echo/date-with-cors/random',
      'headers': '[]',
      'mode': 'cors',
      'method': 'GET',
      'redirect': 'follow',
    };

    return queueUtils.getFetchableRequest({idbRequestObject: reqObj})
      .then( (request) => {
        chai.assert.equal(reqObj.url, request.url);
        chai.assert.equal(reqObj.mode, request.mode);
        chai.assert.equal(reqObj.method, request.method);
        chai.assert.equal(reqObj.redirect, request.redirect);
      });
  });
});
