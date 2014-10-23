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
    });

function logBeforeAndAfter(before){
  return function(){};
  /*
  return function(){
    before.constructor
      .findByIdAsync(before._id)
      .then(function(after){
        console.log('BEFORE item: ', before);
        console.log('AFTER item: ', after);
      });
  };
  */
}

function update(item, updates){
  //use the updateAsync to bypass the pre/post save hooks
  return item.constructor
    .updateAsync({_id:item._id}, updates)
    .then(logBeforeAndAfter(item));
}

function updateGroupHours(startValue){
  return function(items){

    //calc the groupHours
    var groupHours = startValue;
    items.forEach(function(item){
      groupHours += item.hours;
    });

    //set the groupHours to all others
    var promises = items.map(function(item){
      return update(item, { groupHours: groupHours });
    });

    return Promise.all(promises)
      .then(function(){
        return groupHours;
      });
  };
}

function checkNameChanged(newItem){
  return function(old){

    if(!old){
      console.log('checkNameChanged() - it is a new Item');
    }
    else if(old.name === newItem.name){
      console.log('checkNameChanged() - name did NOT change');
      return newItem;
    }
    else{
      console.log('checkNameChanged() - name has changed, we will update items with the old name');
      return querySiblings(old)
        .then(updateGroupHours(0));
    }
  };
}

function setGroupHours(source){
  return function(groupHours){
    var updates = {groupHours : groupHours};
    return update(source, updates);
  };
}

//return Siblings with the same name, workstream and same userId, but different Item id
function querySiblings(source){
  return source.constructor
    .find({name:source.name, workStream:source.workStream, userId:source.userId})
    .ne('_id', source._id)
    .execAsync();
}

//update the whole group (items with the same name)
function updateGroup(source){
  //calculate groupHours
  return querySiblings(source)
    .then(updateGroupHours(source.hours))
    .then(setGroupHours(source))
    .catch(function(err){
      console.log('ERROR: Could not calculate groupHours - error: ', err);
      throw new Error('Could not calculate groupHours');
    });
}

/**
 * Pre-save hook
 */
ItemSchema.pre('save', function(next) {

  var item = this;

  if (!item.dateTime) {
    item.dateTime = new Date();
  }

  item.constructor
    .findByIdAsync(item._id)
    .then(checkNameChanged(item))
    .then(next);
});


/**
 * Post save.. calculate group hours
 */
ItemSchema.post('save', function(item) {
  updateGroup(item)
    .then(logBeforeAndAfter(item));
});

module.exports = mongoose.model('Item', ItemSchema);

//functions exported for unit testing
module.exports.__ = {
  querySiblings:querySiblings
};
