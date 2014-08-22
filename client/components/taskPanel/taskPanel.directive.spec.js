'use strict';

describe('Directive: taskPanel', function () {

  // load the directive's module and view
  beforeEach(module('invoicerApp'));
  beforeEach(module('components/taskPanel/taskPanel.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should start timer with 0:00:00', inject(function ($compile) {
    element = angular.element('<task-panel></task-panel>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.find('.hoursDisplay').text()).toBe('0:00:00');
  }));

  it('should after a second be 0:00:01', function(done){

    inject(function ($compile) {
      element = angular.element('<task-panel></task-panel>');
      element = $compile(element)(scope);
      scope.$apply();

      angular.element(element.find('button')[0]).click();

      expect(element.find('.hoursDisplay').text()).toBe('0:00:00');

      done();

    });
  });

});
