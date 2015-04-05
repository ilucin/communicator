'use strict';

var _ = require('lodash');
var PouchDb = require('pouchdb');
// var Promise = require('lie');

var remoteDb;
var localDb;

function Db() {
  remoteDb = new PouchDb('http://localhost:5984/communicator');
  localDb = new PouchDb('communicator');
}

Db.prototype.init = function() {
  return new Promise(function(resolve, reject) {
    localDb.sync(remoteDb).on('complete', function() {
      console.log('db has init');
      resolve();
    }).on('error', function(err) {
      console.log('db sync error');
      reject();
    });
  });
};

module.exports = Db;
