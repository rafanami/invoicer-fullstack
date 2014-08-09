'use strict';

describe('Controller: WorkStreamCtrl', function () {

  // load the controller's module
  beforeEach(module('invoicerApp'));

  var WorkstreamCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WorkstreamCtrl = $controller('WorkStreamCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
