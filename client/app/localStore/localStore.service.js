'use strict';

angular.module('invoicerApp')
  .service('localStore', function ($q) {
    var self = this;

    self.save = function(key, obj){
      var str,
          deferred = $q.defer();

      if(_.isString(obj)){
        str = obj;
      }
      else{
        str = JSON.stringify(obj);
      }
      
      localStorage.setItem(key, str);
      deferred.resolve(obj);
      return deferred.promise;
    };

    self.load = function(key){
      var obj = localStorage.getItem(key),
          deferred = $q.defer();

      if(obj === null){
        deferred.reject('key: ' + key + ' not found!');
      }
      else{
        obj = JSON.parse(obj);
        deferred.resolve(obj);
      }
      return deferred.promise;
    };

    return self;
  });
