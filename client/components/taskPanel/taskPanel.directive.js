'use strict';

angular.module('invoicerApp')
  .directive('taskPanel', function ($timeout) {
    return {
      templateUrl: 'components/taskPanel/taskPanel.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        scope.task = {
          name:'',
          editHour:false,
          started:false,
          time:'0:00',
          seconds:'00'
        };

        scope.task.start = function(){
          scope.task.started = true;
          startTimer();
        };

        scope.task.stop = function(){
          scope.task.started = false;
        };

        function startTimer(){

          setInterval(function(){}, 1000);

        }

      }
    };
  });
