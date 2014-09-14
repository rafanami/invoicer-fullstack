'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var WorkStream = require('./workStream.model');
var Item = require('../item/item.model');
var Promise = require("bluebird");

function debug(msg, param){
  return;

  if(param){
    console.log('DEBUG : ' + msg, param);
  }
  else{
    console.log('DEBUG : ' + msg);
  }
}

describe('workStream model', function() {

  before(function(done) {
    // Clear WorkStreams before testing
    WorkStream.remove().exec().then(function() {
      done();
    });
    Item.remove().exec().then(function() {
      done();
    });

    //disable

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

  it('should add a workStream and 2 items', function(done) {

    var workStream;
    WorkStream
      .createAsync({name: 'Test WorkStream'})
      .then(function(newWorkStream){
        should.exist(newWorkStream);
        newWorkStream.should.have.property('name', 'Test WorkStream');

        debug('newWorkStream created');

        return newWorkStream;
      })
      .then(function(newWorkStream){

        workStream = newWorkStream;

        should.exist(workStream);
        workStream.should.have.property('name', 'Test WorkStream');

        return Promise.all(
          [
            Item.createAsync({
              name: 'workStream_item1',
              dateTime: new Date(),
              hours: 0.9,
              workStream: workStream
            }),
            Item.createAsync({
              name: 'workStream_item1',
              dateTime: new Date(),
              hours: 2.1,
              workStream: workStream
            }),
            Item.createAsync({
              name: 'workStream_item2',
              dateTime: new Date(),
              hours: 4.5,
              workStream: workStream
            })
          ]
        );

      })
      .then(function(newItems){
        should.exist(newItems);
        newItems.should.be.instanceof(Array);
        newItems.length.should.be.equal(3);


        debug('find items related to the workStream');
        return Item.findAsync({workStream:workStream});
      })
      .then(function(itemsByWorkstream){

        debug('items related to the workStream : ', itemsByWorkstream);

        should.exist(itemsByWorkstream);
        itemsByWorkstream.should.be.instanceof(Array);
        itemsByWorkstream.length.should.be.equal(3);

        debug('found items related to the workStream');
        done();
      })
      .catch(function(err){
        debug('ERROR: ', err);
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

  it('should respond with 404 not found for an invalid id', function(done) {
    request(app)
      .get('/api/workStreams/520169c8f727f28610e3395f')
      .expect(404, done);
  });

});
