'use strict';

describe('Directive: taskPanel', function () {

  // load the directive's module and view
  beforeEach(module('invoicerApp'));
  beforeEach(module('components/taskPanel/taskPanel.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  function start(){
    angular.element(element.find('#task_start')[0]).click();
    scope.$apply();
  }

  function stop(){
    angular.element(element.find('#task_stop')[0]).click();
    scope.$apply();
  }

  function build(){
    inject(function ($compile) {
      element = angular.element('<task-panel></task-panel>');
      element = $compile(element)(scope);
      scope.$apply();

      assertDisplay('0:00:00');
    });
  }

  function assertDisplay(value){
    expect(element.find('.hoursDisplay').text()).toBe(value);
  }

  it('should start timer with 0:00:00', inject(function ($compile) {
    build();

    assertDisplay('0:00:00');
  }));

  it('should be 0:00:01 after a second', function(done){

      build();

      start();

      setTimeout(function(){

        assertDisplay('0:00:01');

        done();
      }, 1100);

  });

  it('should be 0:10:00 after 10 minutes', function(){

    Timecop.install();

    build();

    start();

    //travel 10 min into the future
    Timecop.travel(moment().add(10, 'm').toDate());

    stop();

    assertDisplay('0:10:00');

    Timecop.uninstall();
  });

  it('should be 1:59:59', function(){

    Timecop.install();

    build();

    start();

    //travel into the future
    Timecop.travel(moment()
      .add(1, 'h')
      .add(59, 'm')
      .add(59, 's')
      .toDate());

    stop();

    assertDisplay('1:59:59');

    Timecop.uninstall();
  });

  it('should calculate time with pause intervals', function(){

    Timecop.install();

    build();

    start();

    //travel into the future
    Timecop.travel(moment()
      .add(15, 'm')
      .add(30, 's')
      .toDate());

    stop();

    assertDisplay('0:15:30');

    start();

    //travel into the future
    Timecop.travel(moment()
      .add(5, 'm')
      .toDate());

    stop();

    assertDisplay('0:20:30');

    Timecop.uninstall();
  });

});
