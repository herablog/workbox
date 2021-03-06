importScripts('/__test/mocha/sw-utils.js');
importScripts('/__test/bundle/workbox-sw');

/**
 *
 *
 * This is a seperate test because adding activate and install events and
 * relying on it results in multiple event listeners being added and responding
 * to test cases.
 *
 * Seperating into files results in custom scopes and isolation for each test.
 *
 *
 */

describe('Clients Claim parameter', function() {
  let stubs = [];

  afterEach(function() {
    stubs.forEach((stub) => {
      stub.restore();
    });
    stubs = [];
  });

  it('should claim when passed in true (clientsClaim)', function() {
    let called = false;
    const claimStub = sinon.stub(self.clients, 'claim').callsFake(() => {
      called = true;
      return Promise.resolve();
    });
    stubs.push(claimStub);
    new WorkboxSW({
      clientsClaim: true,
    });
    return new Promise((resolve, reject) => {
      const activateEvent = new Event('activate');
      activateEvent.waitUntil = (promiseChain) => {
        promiseChain.then(() => {
          if (called === true) {
            resolve();
          } else {
            reject('Client.claim() was NOT called.');
          }
        });
      };
      self.dispatchEvent(activateEvent);
    });
  });
});
