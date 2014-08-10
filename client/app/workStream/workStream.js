'use strict';

angular.module('invoicerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/workStream/:id', {
        templateUrl: 'app/workStream/workStream.html',
        controller: 'WorkStreamCtrl'
      });
  });
