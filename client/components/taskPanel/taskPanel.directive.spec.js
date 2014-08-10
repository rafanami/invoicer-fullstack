'use strict';

describe('Directive: taskPanel', function () {

  // load the directive's module and view
  beforeEach(module('invoicerApp'));
  beforeEach(module('components/taskPanel/taskPanel.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<task-panel></task-panel>');
    element = $compile(element)(scope);
    scope.$apply();
    //expect(element.text()).toBe('this is the taskPanel directive');
  }));
});
