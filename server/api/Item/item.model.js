'use strict';

var mongoose = require('mongoose-q')(require('mongoose')),
    Schema = mongoose.Schema,
    Q = require('Q');

var ItemSchema = new Schema({
  description: String,
  dateTime: Date,
  hours: Number,
  groupHours: Number,
  groupHoursUpdateState: Number,
  workstream : { type: Schema.Types.ObjectId, ref: 'Workstream' },
});


var GROUP_HOURS_BEING_UPDATED = 1;
/**
 * Pre-save hook
 */
ItemSchema
  .pre('save', function(next) {

    var self = this;

    console.log('item pre save -> for id: ' + self._id + ' desc: ' + self.description);

    if (!self.dateTime) self.dateTime = new Date();

    if (self.groupHoursUpdateState !== GROUP_HOURS_BEING_UPDATED){

      console.log('item pre save -> for id: ' + self._id + ' desc: ' + self.description + ' is updating groupHours ');

      //calculate groupHours
      self.constructor
        .findQ({description:self.description})
        .then(function(others){

          console.log('item pre save -> found # ' + others.length + ' others.');

          //calc the groupHours
          var groupHours = self.hours;
          others.forEach(function(item){
            console.log('item pre save -> other id: ' + item._id + ' desc: ' + item.description + '` hours: ' + item.hours);
            groupHours += item.hours;
          });

          console.log('item pre save -> groupHours: ' + groupHours);

          //set the groupHours to all others
          var promises = others.map(function(item){
            if( ! item._id.equals( self._id ) ){
              item.groupHours = groupHours;
              item.groupHoursUpdateState = GROUP_HOURS_BEING_UPDATED;
              return item.saveQ().done();
            }
          });

          console.log('item pre save -> list of promises to update the groupHours on other items: ' + promises);

          self.groupHours = groupHours;

          return Q.all(promises);
        })
        .then(function(){
          console.log('item pre save -> all done :-)');
          next();
        })
        .fail(function(err){
          console.log('ERROR: Item pre save: ' + err);
          next(new Error('Could not calculate groupHours'));
        })
        .done();
      }
      else{
        console.log('item pre save -> for ' + self._id + ' WILL NOT update groupHours ');
        next();
      }

  });

module.exports = mongoose.model('Item', ItemSchema);
