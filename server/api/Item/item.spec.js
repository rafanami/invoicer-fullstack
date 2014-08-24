'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var mongoose = require('mongoose-bird')();
var Item = mongoose.model('Item');


describe('Item model', function() {




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
