'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var mongoose = require('mongoose-bird')();
var Item = mongoose.model('Item');
var Promise = require("bluebird");
var WorkStream = require('../workStream/workStream.model');

describe('Item model', function() {

  function createItem(workStream, name, hours){
    return Item.createAsync({
      name:name,
      hours:hours,
      workStream:workStream
    });
  }

  function createWorkStreams(names){
    return Promise.all(names.map(function(name){
      return WorkStream.createAsync({
        name: name
      });
    }));
  }

  xit('should update GroupHours for items with the same name and workStream', function(done) {

    createWorkStreams(['ws1', 'ws2'])
      .then(function(workStreams){

        var ws1 = workStreams[0];
        var ws2 = workStreams[1];

        Promise.all([
          createItem(ws1, 'item1', 1.2),
          createItem(ws1, 'item1', 2.8),
          createItem(ws1, 'item1', 0.1),// 4.1

          createItem(ws2, 'item1', 0.5),
          createItem(ws2, 'item1', 8.7),// 9.2 -> a different workStream

          createItem(ws1, 'item2', 4.5),
          createItem(ws1, 'item2', 0.5)//5
        ])
          .then(function(createdItems){

            Promise.all([
              validateItems(ws1, 'item1', 3, 4.1),
              validateItems(ws2, 'item1', 2, 9.2),
              validateItems(ws1, 'item2', 2, 9.2)
            ])
            .then(done);

          });
      });

  });



});

describe('GET /api/items', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/items')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
