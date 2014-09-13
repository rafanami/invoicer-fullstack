'use strict';

angular.module('invoicerApp')
  .directive('taskPanel', function ($modal,
    $http, localStore, $log, Auth) {
    return {
      templateUrl: 'components/taskPanel/taskPanel.html',
      restrict: 'EA',
      link: function (scope) {
        scope.task = {
          name:'',
          editHour:false,
          started:false,
          time:'0:00',
          seconds:'00',
          totalSeconds:0,
          moment:null,
          date: new Date(),
          userId: Auth.getCurrentUser()._id
        };

        var url = '/api/currentTask/';

        function restoreTaskFromServer(currentTask){
          scope.task.id = currentTask._id;
          $log.debug('task restored from server -> currentTask: ', currentTask);
        }

        function restoreTaskFromLocalStore(storedTask){
          scope.task = storedTask;
          $log.debug('task restored from localStore -> storedTask: ', storedTask);
        }

        function loadTaskFromServer(){
          $log.debug('load current task for user', scope.task.userId);

          $http.get(url + 'findOne?userId=' + scope.task.userId)
            .success(restoreTaskFromServer)
            .error(function() {
              $log.debug('could not find current task for user, will try to recover from localStore');

              localStore.load('currentTask')
                .then(restoreTaskFromLocalStore);

            });
        }

        loadTaskFromServer();

        scope.task.editTime = function(){
          scope.task.editingTime = true;

          scope.task.stop();

          scope.task.timeValue = scope.task.time;
        };

        var hourMatch = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

        scope.task.doneEditTime = function(){
          var newTime = hourMatch.exec(scope.task.timeValue);

          if(newTime){
            scope.task.editingTime = false;
            scope.task.invalidTime = false;

            var hours = parseInt(newTime[1]),
                minutes = parseInt(newTime[2]);

            scope.task.totalSeconds = (hours * 60 * 60);
            scope.task.totalSeconds += (minutes * 60);
            scope.task.totalSeconds += parseInt(scope.task.seconds);

            adjustMoment();

            formatTime();

            scope.task.timeValue = null;
          }
          else{
            scope.task.invalidTime = true;
          }
        };

        function adjustMoment(){
          scope.task.moment = moment();
          if(scope.task.totalSeconds && scope.task.totalSeconds > 0){
            scope.task.moment.add(-(scope.task.totalSeconds), 's');
          }
        }

        scope.task.start = function(){
          scope.task.started = true;

          adjustMoment();

          formatTime();
          tick();
        };

        scope.task.stop = function(){
          if(scope.task.started){
            scope.task.started = false;

            if(timerRef){
              clearTimeout(timerRef);
            }

            if(!scope.task.moment){
              scope.task.moment = moment();
            }

            formatTime();

            scope.task.totalSeconds = moment().unix() - scope.task.moment.unix();

            saveTime();
          }
        };

        var TaskModalCtrl = function($scope, $modalInstance, task) {
          $scope.task = task;
          $scope.saveTask = function () {
            $modalInstance.close($scope.task);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          $scope.calendarOpened = false;

          $scope.openCalendar = function($event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.calendarOpened = true;
          };

          $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
          };

          $http.get('/api/workStreams').success(function(workStreams) {
            $scope.workStreams = workStreams;
          });

        };

        scope.task.openTaskeModal = function(){
          var taskModal = $modal.open({
            templateUrl: 'saveTaskModal.html',
            controller: TaskModalCtrl,
            backdrop: 'static',
            resolve: {
              task: function () {
                return scope.task;
              }
            }
          });

          taskModal.result.then(function () {

            saveTask();

          }, function () {
            $log.info('Modal dismissed at: ' + new Date());

          });
        };

        function saveTask(form){
          if( ! form.$invalid){

          }
        }

        var timerRef = null;
        function tick(){
          timerRef = setTimeout(function(){
            formatTime();
            saveTime();

            if(scope.task.started){
              tick();
            }

            scope.$apply();
          }, 1000);
        }

        function formatTime(){
          var diff = moment().subtract(scope.task.moment);
          scope.task.time = diff.format('H:mm');
          scope.task.seconds = diff.format('ss');
        }

        function saveToServer(){
          var objToSave = {
            name: scope.task.name,
            totalSeconds: scope.task.totalSeconds,
            date: scope.task.date
          };

          if(scope.task.id){
            return $http.put(url + scope.task.id, objToSave)
            .error(function() {
              $log.debug('could not update task');
            });
          }
          else{
            return $http.post(url, objToSave)
              .success(function(addedTask){
                scope.task.id = addedTask._id;
              })
              .error(function() {
                $log.debug('could not save new task');
              });
          }
        }

        //save the current task to local storage
        function saveTime(){
          return localStore.save('currentTask', scope.task)
            .then(saveToServer)
            .catch(function(err){
              //error
              $log.error('Error saving current task: ' + err);
            });
        }

      }
    };
  });
