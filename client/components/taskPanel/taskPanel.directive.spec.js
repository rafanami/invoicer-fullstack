'use strict';

describe('Directive: taskPanel', function () {

  // load the directive's module and view
  beforeEach(module('invoicerApp'));
  beforeEach(module('components/taskPanel/taskPanel.html'));

  var element, scope, httpBackend,
    userId = '1234567890',
    Auth;

  beforeEach(inject(function ($rootScope, $httpBackend, _Auth_) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    Auth = _Auth_;

    Auth.getCurrentUser = function(){
      return {_id:userId};
    }

    httpBackend.whenGET('/api/workStreams')
      .respond([{_id:100, name:'workstream 01'}]);

  }));

  function expectSaveRequest(){
    httpBackend.expectPOST('/api/currentTask/')
      .respond([{_id:100, name:'task xyz'}]);
  }

  function expectFindRequest(withSavedTask){

    if(withSavedTask){
      httpBackend.expectGET('/api/currentTask/findOne?userId=' + userId)
        .respond([{_id:200, name:'saved task', userId:userId}]);
    }
    else{
      //TODO: I need to respond with an error here..
      //so the directive does not load a previous task.
    }
  }

  function start(){
    angular.element(element.find('#task_start')[0]).click();
    scope.$apply();
  }

  function stop(){
    expectSaveRequest();

    angular.element(element.find('#task_stop')[0]).click();
    scope.$apply();
  }

  function build(){
    inject(function ($compile) {

      expectFindRequest();

      element = angular.element('<task-panel></task-panel>');
      element = $compile(element)(scope);
      scope.$apply();

      assertDisplay('0:00:00');
    });
  }

  function assertDisplay(value){
    expect(element.find('.hoursDisplay').text()).toBe(value);
  }

  describe('Compact Task Panel', function () {

    it('should start timer with 0:00:00', inject(function ($compile) {
      build();

      assertDisplay('0:00:00');
    }));

    it('should be 0:00:01 after a second', function(done){

        build();

        expectSaveRequest();

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

  describe('Edit Task Modal', function () {
    function openModal(){
      httpBackend.expectGET('/api/workStreams');

      angular.element(element.find('#open_task_modal')[0]).click();
      scope.$apply();

      httpBackend.flush();
    }

    it('should open modal', function(){

      build();

      openModal();

    });
  });



});
