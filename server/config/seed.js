/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var WorkStream = require('../api/workStream/workStream.model');
var Item = require('../api/item/item.model');

WorkStream.find({}).remove(function() {
  WorkStream.create({
    name: 'Steroids-js'
  }, function(err, workStream){
    var steroidsWorkStream = workStream;

    Item.find({}).remove(function() {

      Item.create({
        description: 'Unit test runner can be started for different runtimes',
        dateTime: new Date(),
        hours: 0.9,
        groupHours: 2.2,
        workstream: steroidsWorkStream
      },
      {
        description: 'Daily with Petrus',
        dateTime: new Date(),
        hours: 0.5,
        groupHours: 2.2,
        workstream: steroidsWorkStream
      }, function(err, newItems){

        steroidsWorkStream.items = newItems;
        steroidsWorkStream.save(function(err){
          if(err){
            console.log('error saving workstream with items');
          }
        });

      });

    });

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
