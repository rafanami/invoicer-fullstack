'use strict';

var mongoose = require('mongoose-bird')(),
    Schema = mongoose.Schema;

var WorkstreamSchema = new Schema({
  name: String
});

module.exports = mongoose.model('Workstream', WorkstreamSchema);
