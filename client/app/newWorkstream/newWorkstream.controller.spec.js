'use strict';

describe('Controller: NewWorkstreamCtrl', function () {

  // load the controller's module
  beforeEach(module('invoicerApp'));

  var NewworkstreamCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewworkstreamCtrl = $controller('NewWorkstreamCtrl', {
      $scope: scope,
      $modalInstance : {}
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
