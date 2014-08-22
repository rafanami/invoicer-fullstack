'use strict';

angular.module('invoicerApp')
  .directive('taskPanel', function ($timeout) {
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
          totalSeconds:0
        };

        scope.task.start = function(){
          scope.task.started = true;
          tick();
        };

        scope.task.stop = function(){
          scope.task.started = false;
        };

        function tick(){
          $timeout(function(){
            scope.task.totalSeconds++;
            formatTime();
            saveTask();
            if(scope.task.started){
              tick();
            }
          }, 1000);
        }

        function formatTime(){

        }

        function saveTask(){

        }

      }
    };
  });
