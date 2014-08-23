'use strict';

describe('Service: localStore', function () {

  // load the service's module
  beforeEach(module('invoicerApp'));

  // instantiate service
  var localStore, rootScope;
  beforeEach(inject(function (_localStore_, $rootScope) {
    localStore = _localStore_;
    rootScope = $rootScope;
  }));

  it('save obj and restore', function (done) {
    var obj = {
      x:'hello',
      y:'world'
    };

    localStore.save('key', obj)
      .then(function(savedObj){
        expect(savedObj).not.toBeNull();
        return localStore.load('key');
      })
      .then(function(loadedObj){
        expect(loadedObj).not.toBeNull();
        expect(loadedObj.x).toBe('hello');
        expect(loadedObj.y).toBe('world');

        done();
      });

      rootScope.$apply();

  });

});
