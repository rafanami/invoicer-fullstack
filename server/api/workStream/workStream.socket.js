/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Workstream = require('./workStream.model');

exports.register = function(socket) {
  Workstream.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Workstream.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('workStream:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('workStream:remove', doc);
}