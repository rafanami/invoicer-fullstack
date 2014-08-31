/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Currenttask = require('./currentTask.model');

exports.register = function(socket) {
  Currenttask.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Currenttask.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('currentTask:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('currentTask:remove', doc);
}