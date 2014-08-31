'use strict';

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
//var should = require('should');
var app = require('../../app');
var request = require('supertest');
var mongoose = require('mongoose-bird')();
var CurrentTask = require('./currentTask.model');
var Promise = require('bluebird');

describe('currentTask API', function() {

  beforeEach(function(){
    //remove all
    CurrentTask.find({}).removeAsync();
  });

  describe('currentTask Model', function() {

    it('should return one item using findOne', function(done) {

      CurrentTask
        .createAsync({name:'test_task'})
        .then(function(){

          CurrentTask.findOne({name:'test_task'})
            .execAsync()
            .then(function(taskFound){
              taskFound.should.not.be.null;
              taskFound.name.should.equal('test_task');

              done();
            });

        });

    });

    it('should return an array of items using find', function(done) {

      var userId = new mongoose.Types.ObjectId();

      CurrentTask
        .createAsync([{name:'test_task_1', userId:userId}, {name:'test_task_2', userId:userId}])
        .then(function(){

          CurrentTask.find({userId:userId})
            .execAsync()
            .then(function(tasks){
              tasks.should.not.be.null;
              tasks.should.be.instanceof(Array);
              tasks.length.should.equal(2);

              done();
            });

        });

    });

  });

  describe('/api/currentTasks', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/currentTasks')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          done();
        });
    });

    it('/api/currentTasks/find', function(done) {
      var userId = new mongoose.Types.ObjectId();

      CurrentTask.createAsync([
          {
            name:'task1',
            userId:userId
          },
          {
            name:'task2',
            userId:userId
          }
      ])
      .then(function(){
        request(app)
          .get('/api/currentTasks/find?userId=' + userId)
          .expect(200)
          .end(function(err, res) {
            res.body.should.not.be.null;
            res.body.should.be.instanceof(Array);
            res.body.length.should.equal(2);

            done();
          });
      });

    });

    it('/api/currentTasks/findOne', function(done) {
      var userId = new mongoose.Types.ObjectId();

      CurrentTask.createAsync([
          {
            name:'test_task_1',
            userId:userId
          },
          {
            name:'test_task_2'
          }
      ])
      .then(function(){
        request(app)
          .get('/api/currentTasks/findOne?userId=' + userId)
          .expect(200)
          .end(function(err, res) {
            console.log('res.body -> ', res.body);
            res.body.name.should.be.equal('test_task_1');
            done();
          });
      });

    });

    it('should respond with 404 not found for an invalid id', function(done) {
      request(app)
        .get('/api/currentTasks/520169c8f727f28610e3395f')
        .expect(404, done);
    });
  });

});
