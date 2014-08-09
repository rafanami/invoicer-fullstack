'use strict';

var _ = require('lodash');
var Workstream = require('./workStream.model');

// Get list of workStreams
exports.index = function(req, res) {
  Workstream
    .find()
    .populate('items')
    .exec(function (err, workStreams) {
      if(err) { return handleError(res, err); }
      return res.json(200, workStreams);
    });
};

// Get a single workStream
exports.show = function(req, res) {
  Workstream
    .findById(req.params.id)
    .populate('items')
    .exec(function (err, workStream) {
      if(err) { return handleError(res, err); }
      if(!workStream) { return res.send(404); }
      return res.json(workStream);
    });
};

// Creates a new workStream in the DB.
exports.create = function(req, res) {
  Workstream.create(req.body, function(err, workStream) {
    if(err) { return handleError(res, err); }
    return res.json(201, workStream);
  });
};

// Updates an existing workStream in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Workstream.findById(req.params.id, function (err, workStream) {
    if (err) { return handleError(res, err); }
    if(!workStream) { return res.send(404); }
    var updated = _.merge(workStream, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, workStream);
    });
  });
};

// Deletes a workStream from the DB.
exports.destroy = function(req, res) {
  Workstream.findById(req.params.id, function (err, workStream) {
    if(err) { return handleError(res, err); }
    if(!workStream) { return res.send(404); }
    workStream.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
