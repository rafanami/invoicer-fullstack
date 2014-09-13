'use strict';

angular.module('invoicerApp')
  .service('localStore', function ($q) {
    var self = this;

    self.setItem = function(key, obj){
      var str;
      if(_.isString(obj)){
        str = obj;
      }
      else{
        str = JSON.stringify(obj);
      }
      localStorage.setItem(key, str);
    };

    self.save = function(key, obj){
      self.setItem(key, obj);
      return $q.when(obj);
    };

    self.getItem = function(key){
      var obj = localStorage.getItem(key);
      try{
        return JSON.parse(obj);
      }
      catch(e){
        return obj;
      }
    };

    self.load = function(key){
      var deferred = $q.defer(),
          obj = self.getItem(key);

      if(obj === null){
        deferred.reject('key: ' + key + ' not found!');
      }
      else{
        deferred.resolve(obj);
      }
      return deferred.promise;
    };

    self.remove = function(key){
      return self.load(key)
        .then(function(obj){
          delete localStorage[key];
          return obj;
        });
    };

    return self;
  });
