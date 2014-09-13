'use strict';

var mongoose = require('mongoose-bird')(),
    Schema = mongoose.Schema,
    Promise = require("bluebird"),

    ItemSchema = new Schema({
      name: { type: String, required: true },
      dateTime: Date,
      hours: Number,
      groupHours: Number,
      groupHoursUpdateState: Number,
      workStream : Schema.Types.ObjectId,
      userId: Schema.Types.ObjectId
    }),

    GROUP_HOURS_BEING_UPDATED = 1;

function updateGroupHours(startValue){
  return function(items){

    //calc the groupHours
    var groupHours = startValue;
    items.forEach(function(item){
      groupHours += item.hours;
    });

    console.log('updateGroupHours() - items.length: ' + items.length + ' groupHours: ' + groupHours + ' startValue: ' + startValue);

    //set the groupHours to all others
    var promises = items.map(function(item){
      item.groupHours = groupHours;

      //TODO: remove GROUP_HOURS_BEING_UPDATED since it is no longer required
      item.groupHoursUpdateState = GROUP_HOURS_BEING_UPDATED;

      //use the findByIdAndUpdate to bypass the pre save middleware (http://mongoosejs.com/docs/middleware.html)
      return item.constructor
        .findByIdAndUpdate(item._id, item)
        .execAsync();
      //return item.saveAsync();
    });

    return Promise.all(promises)
      .then(function(){
        console.log('updateGroupHours() - all items updated!');
        return groupHours;
      })
      .catch(function(error){
        console.log('updateGroupHours() - error: ', error);
        throw error;
      });
  };
}

function checkNameChanged(newItem){
  return function(old){

    console.log('checkNameChanged() - newItem.name: ' + newItem.name + ' old: ', old);
    if(!old || old.name === newItem.name){
      console.log('checkNameChanged() - name did NOT change OR there is no old');
      return newItem;
    }
    else{
      console.log('checkNameChanged() - name has changed, we will update items with the old name');

      return querySiblings(old)
        .then(updateGroupHours(0))
        .then(function(){
          return newItem;
        });
    }
  };
}

function setGroupHours(source){
  return function(groupHours){
    console.log('setGroupHours() - groupHours: ' + groupHours + ' source: ', source);
    source.groupHours = groupHours;
  };
}

//return Siblings with the same name, but different id and not in update mode
function querySiblings(source){
  return source.constructor
    .find({name:source.name})
    .ne('_id', source._id)
    .execAsync()
    .catch(function(error){
      console.log('querySiblings() - error: ', error);
      throw error;
    });
}

//update the whole group (items with the same name)
function updateGroup(source, next){
  return function(){
    //calculate groupHours
    querySiblings(source)
      .then(updateGroupHours(source.hours))
      .then(setGroupHours(source))
      .then(next)
      .catch(function(err){
        console.log('ERROR: Item pre save: ', err);
        next(new Error('Could not calculate groupHours'));
      });
  };
}


/**
 * Pre-save hook
 */
ItemSchema
  .pre('save', function(next) {

    var item = this;

    if (!item.dateTime) {
      item.dateTime = new Date();
    }

    console.log('pre save -> item: ', item);

    if (item.groupHoursUpdateState === GROUP_HOURS_BEING_UPDATED){
      console.log('pre save -> item already in update mode ... skiping');
      //reset the state
      item.groupHoursUpdateState = 0;
      next();
    }
    else{
      item.constructor.findByIdAsync(item._id)
        .then(checkNameChanged(item))
        .then(updateGroup(item, next));
    }

  });

module.exports = mongoose.model('Item', ItemSchema);
