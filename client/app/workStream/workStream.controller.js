'use strict';

angular.module('invoicerApp')
  .controller('WorkStreamCtrl', function ($scope, $http, socket) {

    var uri = '/api/workStreams';

    $scope.workStreamCtrl = {};
    $scope.workStreamCtrl.list = [];

    function cleanUp(item){
      delete item.editMode;
    }

    function editableItem(item){
      item.editMode = false;
      item.edit = function () {
        item.editMode = true;
      };
      item.cancel = function () {
        item.editMode = false;
      };
      item.save = function () {
        $http.put(uri + '/' + item._id, cleanUp(item));
        item.editMode = false;
      };
      item.delete = function(){
        $http.delete(uri + '/' + item._id);
      };
      return item;
    }

    $http.get(uri).success(function(list) {
      $scope.workStreamCtrl.list = list.map(function(item){
        return editableItem(item);
      });
      socket.syncUpdates('workStream', $scope.workStreamCtrl.list);
    });

    $scope.addItem = function() {
      if($scope.newItem === '') {
        return;
      }
      $http.post(uri, { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('workStream');
    });

  });
