/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var WorkStream = require('../api/workStream/workStream.model');
var Item = require('../api/item/item.model');
var Q = require('Q');

WorkStream.find({}).remove(function() {
  WorkStream.createQ({
    name: 'Steroids-js'
  })
  .then(function(workStream){

    Item.find({}).remove(function() {
      var ps = [];
      ps.push(
        Item.createQ({
          description: 'Unit test runner can be started for different runtimes',
          dateTime: new Date(),
          hours: 0.9,
          groupHours: 2.2,
          workstream: workStream
        }),
        Item.createQ({
          description: 'Daily with Petrus',
          dateTime: new Date(),
          hours: 0.5,
          groupHours: 2.2,
          workstream: workStream
        })
      );

      Q.all(ps).then(function(newItems){
        console.log('created the new items: ' + newItems);
        workStream.items = newItems;
        workStream.saveQ()
        .then(function(){
          console.log('workStream saved: ' + newItems);
        });
      })
      .done();

    });

  })
  .done();
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
