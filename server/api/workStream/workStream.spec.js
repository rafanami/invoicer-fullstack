'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var WorkStream = require('./workStream.model');
var Item = require('../item/item.model');


var item1 = {
  description: 'Unit test runner can be started for different runtimes',
  dateTime: new Date(),
  hours: 0.9
};

describe('workStream model', function() {

  before(function(done) {
    // Clear WorkStreams before testing
    WorkStream.remove().exec().then(function() {
      done();
    });
    Item.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    WorkStream.remove().exec().then(function() {
      done();
    });
    Item.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no WorkStreams', function(done) {
    WorkStream
      .findAsync({})
      .then(function (workStreams) {
        workStreams.should.have.length(0);
        done();
      })
      .done();
  });

  it('should add a workStream with an item', function(done) {

    var workStream;
    WorkStream
      .createAsync({name: 'Test WorkStream'})
      .then(function(newWorkStream){
        should.exist(newWorkStream);
        newWorkStream.should.have.property('name', 'Test WorkStream');

        console.log('newWorkStream created');

        return newWorkStream;
      })
      .then(function(newWorkStream){

        workStream = newWorkStream;

        should.exist(workStream);
        workStream.should.have.property('name', 'Test WorkStream');

        item1.workstream = workStream;

        console.log('workStream assigned to item1');

        return Item
          .createAsync(item1);
      })
      .then(function(newItem){
        should.exist(newItem);
        newItem.should.have.property('hours', 0.9);

        workStream.items = [newItem];

        console.log('will additem1 to workStream items');
        return workStream.saveAsync();
      })
      .spread(function(newWorkStream){
        should.exist(newWorkStream);
        newWorkStream.should.have.property('items');
        newWorkStream.items.should.be.instanceof(Array);

        console.log('item1 added to workStream items');
        done();
      });

  });

});

describe('GET /api/workStreams', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/workStreams')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

});
