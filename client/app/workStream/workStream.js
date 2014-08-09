'use strict';

angular.module('invoicerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/workStream', {
        templateUrl: 'app/workStream/workStream.html',
        controller: 'WorkStreamCtrl'
      });
  });
