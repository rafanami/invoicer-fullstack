'use strict';

describe('Directive: taskPanel', function () {

  // load the directive's module and view
  beforeEach(module('invoicerApp'));
  beforeEach(module('components/taskPanel/taskPanel.html'));

  var element, scope, httpBackend,
    userId = '1234567890',
    Auth, $log, localStore;

  beforeEach(inject(function ($rootScope, $httpBackend, _Auth_, _$log_, _localStore_) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    Auth = _Auth_;
    $log = _$log_;
    localStore = _localStore_;

    Auth.getCurrentUser = function(){
      return {_id:userId};
    }

    httpBackend.whenGET('/api/workStreams')
      .respond([{_id:100, name:'workStream 01'}]);

    delete localStorage['currentTask_user_' + userId];
  }));

  beforeEach(function(){
    function autoFlush(prop){
      var original = $log[prop];
      if(original.AUTO_FLUSH === true){
        return;
      }

      $log[prop] = function (msg, param){
        if(param){
          original(msg, param);
          console[prop](msg, param);
        }
        else{
          original(msg);
          console[prop](msg);
        }
      };

      $log[prop].logs = original.logs;

      $log[prop].AUTO_FLUSH = true;
    }

    autoFlush('debug');
    autoFlush('log');
    autoFlush('info');
    autoFlush('warn');
    autoFlush('error');

  });

  function expectSaveRequest(){
    httpBackend.expectPOST('/api/currentTasks')
      .respond([{_id:100, name:'task xyz'}]);
  }

  function expectFindRequest(withSavedTask){
    if(withSavedTask){
      httpBackend.expectGET('/api/currentTasks/findOne?userId=' + userId)
        .respond(200, {_id:87654, name:'saved task', userId:userId});
    }
    else{
      //Respond with an error here..
      //so the directive does not load a previous task.
      httpBackend.expectGET('/api/currentTasks/findOne?userId=' + userId)
        .respond(404, '');
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

  function build(withSavedTask){
    inject(function ($compile) {

      expectFindRequest(withSavedTask);

      element = angular.element('<task-panel></task-panel>');
      element = $compile(element)(scope);
      scope.$apply();

      assertDisplay('0:00:00');

      httpBackend.flush();
    });
  }

  function assertDisplay(value){
    expect(element.find('.hoursDisplay').text()).toBe(value);
  }

  describe('Compact Task Panel', function () {

    it('should start timer with 0:00:00', function () {
      build();

      assertDisplay('0:00:00');
    });

    it('should not load an existing current task', function () {
      build();

      expect(scope.task.id).toBeFalsy();
    });

    it('should load an existing current task from server', function () {
      build(true);

      expect(scope.task.id).toBe(87654);
    });

    it('should load the task from localStore when the server calls fails', function () {

      localStore.setItem('currentTask_user_' + userId, {
        name:'saved on localStore',
        editHour:false,
        started:false,
        time:'1:20',
        seconds:'35',
        totalSeconds:0,
        date: new Date(),
        userId: userId
      });

      build();

      expect(scope.task.name).toBe('saved on localStore');
      expect(scope.task.time).toBe('1:20');
      expect(scope.task.seconds).toBe('35');

    });

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
