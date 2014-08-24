/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var WorkStream = require('../api/workStream/workStream.model');
var Item = require('../api/item/item.model');
var Promise = require("bluebird");

var workStream, items = [];

function removeAllItems(){
  return Item.find({}).removeAsync();
}

function createItem(item){
  return function(workStream){
    item.workstream =  workStream;
    item.dateTime = new Date();
    return Item.createAsync(item);
  };
}

function getWorkStream(_workStream){
  workStream = _workStream;
  return workStream;
}

function getItem(item){
  items.push(item);
  return item;
}

function createWorkStream(){
  return WorkStream.createAsync({
    name: 'Steroids-js'
  });
}

function mapItemsToWorkStream(){
  workStream.items = items;
  return workStream.saveAsync();
}


WorkStream.find({}).remove(function() {
  Item.find({}).removeAsync()
    .then(createWorkStream)
    .then(getWorkStream)
    .then(createItem({
      description: 'Unit test runner can be started for different runtimes',
      hours: 0.9,
      groupHours: 2.2
    }))
    .then(getItem)
    .then(createItem({
      description: 'Daily with Petrus',
      hours: 0.5,
      groupHours: 2.2
    }))
    .then(getItem)
    .then(mapItemsToWorkStream)
    .then(function(){
      console.log('all saved !');
    });
});


User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});
