'use strict';

var mongoose = require('mongoose-bird')(),
    Schema = mongoose.Schema;

var WorkstreamSchema = new Schema({
  name: String,
  items : [{ type: Schema.Types.ObjectId, ref: 'Item' }]
});

module.exports = mongoose.model('Workstream', WorkstreamSchema);
