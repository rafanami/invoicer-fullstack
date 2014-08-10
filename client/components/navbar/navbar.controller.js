'use strict';

angular.module('invoicerApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $http) {

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

    $http.get("/api/workStreams").success(function(workStreams) {
      $scope.workStreams = workStreams.map(function(item){
        return {
          url: "/workStream/" + item._id,
          title: item.name
        };
      });
    });

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

  });
