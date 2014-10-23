'use strict';

angular.module('invoicerApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $http, $modal, socket) {

    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },
    {
      'title': 'Invoices',
      'link': '/invoices'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    function loadWorkStreams(workStreams) {
      $scope.workStreams = workStreams.map(function(item){
        return {
          url: '/workStream/' + item._id,
          title: item.name
        };
      });
    }

    $http.get('/api/workStreams').success(function(list){
      loadWorkStreams(list);

      socket.syncUpdates('workStream', list, function(event, item, array){
        loadWorkStreams(array);
      });
    });

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.newWorkstream = function(){
      $modal.open({
        templateUrl: 'app/newWorkstream/newWorkstream.html',
        controller: 'NewWorkstreamCtrl',
        backdrop: 'static'
      });
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('workStream');
    });

  });
