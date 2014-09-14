'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var mongoose = require('mongoose-bird')();
var Item = mongoose.model('Item');
var Promise = require("bluebird");
var WorkStream = require('../workStream/workStream.model');

describe('Item model', function() {

  function createItem(workStream, userId, name, hours){
    return Item.createAsync({
      name:name,
      hours:hours,
      workStream:workStream,
      userId:userId
    });
  }

  function createWorkStream(name){
    return WorkStream.createAsync({
      name: name
    });
  }

  function validateItems(workStream, userId, name, length, groupHours){
    return Item.findAsync({workStream:workStream, name:name, userId:userId})
      .then(function(items){
        should.exist(items);
        items.should.be.instanceof(Array);
        items.length.should.be.equal(length);
        items.forEach(function(item){
          item.should.have.property('groupHours', groupHours);
        });
      });
  }


  xit('should querySiblings of the same name, workStream and userid', function(done){

    var user1 = new mongoose.Types.ObjectId();
    var user2 = new mongoose.Types.ObjectId();

    Promise.all([
      createWorkStream('ws1'),
      createWorkStream('ws2')
    ])
    .spread(function(ws1, ws2){

      return Promise.all([
        //group 1
        createItem(ws1, user1, 'item1', 1.2),
        createItem(ws1, user1, 'item1', 2.8),

        //group 2
        createItem(ws1, user2, 'item1', 6),

        //group 3
        createItem(ws2, user1, 'item1', 4)
      ])
      .spread(function(group1_1, group1_2, group2_1, group3_1){
        //test querySiblings function

        return Promise.all([
          //group 1
          Item.__.querySiblings(group1_1).then(function(siblings){
            should.exist(siblings);
            siblings.should.be.instanceof(Array);
            siblings.length.should.be.equal(1);
            siblings[0].should.have.property('name', 'item1');
            siblings[0].should.have.property('hours', 2.8);
          }),

          Item.__.querySiblings(group1_2).then(function(siblings){
            should.exist(siblings);
            siblings.should.be.instanceof(Array);
            siblings.length.should.be.equal(1);
            siblings[0].should.have.property('name', 'item1');
            siblings[0].should.have.property('hours', 1.2);
          }),


          Item.__.querySiblings(group2_1).then(function(siblings){
            should.exist(siblings);
            siblings.should.be.instanceof(Array);
            siblings.length.should.be.equal(0);
          }),

          Item.__.querySiblings(group3_1).then(function(siblings){
            should.exist(siblings);
            siblings.should.be.instanceof(Array);
            siblings.length.should.be.equal(0);
          })

        ])
        .then(function(){
          //return null so the then(done) bellow passes null to the done function.
          return null;
        });

      });

    })
    .then(done)
    .catch(done);

  });

  xit('should update GroupHours for 2 items with the same name and workStream', function(done) {

    var user1 = new mongoose.Types.ObjectId();

    Promise.all([
      createWorkStream('ws1')
    ])
    .spread(function(ws1){

      var itemName = 'xptoz6';

      return Promise.all([
        createItem(ws1, user1, itemName, 1.2),
        createItem(ws1, user1, itemName, 2.8)// 4
      ])

      //delay a bit enought to have the post hook complete
      .delay(100)

      .spread(function(item1_1, item1_2){
        return Promise.all([
          validateItems(ws1, user1, itemName, 2, 4)
        ])
        .then(function(){
          done();
        })
        .catch(done);
      });

    });

  });

  it('should update GroupHours for items with the same name and workStream', function(done) {

    var user1 = new mongoose.Types.ObjectId();

    Promise.all([
      createWorkStream('ws1'),
      createWorkStream('ws2')
    ])
    .spread(function(ws1, ws2){

      return Promise.all([
        createItem(ws1, user1, 'item1', 1.2),
        createItem(ws1, user1, 'item1', 2.8),
        createItem(ws1, user1, 'item1', 0.1),// 4.1

        createItem(ws2, user1, 'item1', 0.5),
        createItem(ws2, user1, 'item1', 8.7),// 9.2 -> a different workStream

        createItem(ws1, user1, 'item2', 4.5),
        createItem(ws1, user1, 'item2', 0.5)//5
      ])

      //delay a bit enought to have the post hook complete
      .delay(500)

      .spread(function(){
        return Promise.all([
          validateItems(ws1, user1, 'item1', 3, 4.1),
          validateItems(ws2, user1, 'item1', 2, 9.2),
          validateItems(ws1, user1, 'item2', 2, 9.2)
        ]);

      });

    })
    .then(done)
    .catch(done);

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
