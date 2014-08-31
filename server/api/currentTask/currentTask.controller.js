'use strict';

var _ = require('lodash');

var Currenttask = require('./currentTask.model');

function handleError(res, statusCode){
  statusCode = statusCode || 500;
  return function(err){
    res.send(statusCode, err);
  };
}

function responseWithResult(res, statusCode){
  statusCode = statusCode || 200;
  return function(entity){
    if(entity){
      return res.json(statusCode, entity);
    }
  };
}

function handleEntityNotFound(res){
  return function(entity){
    if(!entity){
      res.send(404);
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates){
  return function(entity){
    var updated = _.merge(entity, updates);
    return updated.saveAsync(function () {
      return updated;
    });
  };
}

function removeEntity(res){
  return function (entity) {
    if(entity){
      return entity.removeAsync()
        .then(function() {
          return res.send(204);
        });
    }
  };
}

// Get list of currentTasks
exports.index = function(req, res) {
  Currenttask.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

exports.findOne = function(req, res) {
  Currenttask.findOne(req.query)
    .execAsync()
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

exports.find = function(req, res) {
  Currenttask.find(req.query)
    .execAsync()
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Get a single currentTask
exports.show = function(req, res) {
  Currenttask.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new currentTask in the DB.
exports.create = function(req, res) {
  Currenttask.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing currentTask in the DB.
exports.update = function(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  Currenttask.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a currentTask from the DB.
exports.destroy = function(req, res) {
  Currenttask.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
