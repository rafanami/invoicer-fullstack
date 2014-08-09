'use strict';

angular.module('invoicerApp')
  .filter('HoursFraction', function () {
    return function (fraction) {
      var hours = Math.floor(fraction); // extract the hours (in 24 hour format)
      var mins = 60 * (fraction - hours);

      mins = Math.floor(mins);
      if(mins < 10){
        mins = mins + '0';
      }
      
      return hours + ':' + mins + ' hs.';
    };
  });
