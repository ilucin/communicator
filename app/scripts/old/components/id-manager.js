'use strict';

var _ = require('lodash');

var IdManager = function() {
  this.initialize.apply(this, arguments);
};

_.extend(IdManager.prototype, {
  initialize: function() {
    this._data = {
      action: {
        counters: {},
        ids: {}
      },
      object: {
        counters: {},
        ids: {}
      },
      trigger: {
        counters: {},
        ids: {}
      }
    };
  },

  getNewTriggerId: function(actionId) {
    return this._getNewId('trigger', actionId);
  },

  getNewObjectId: function(type) {
    return this._getNewId('object', type);
  },

  registerObjectId: function(type, id) {
    return this._registerId('object', type, id);
  },

  getNewActionId: function(objectId) {
    return this._getNewId('action', objectId);
  },


  isObjectIdTaken: function(type, id) {
    return this._isIdTaken('object', type, id);
  },

  isActionIdTaken: function(objectId, actionId) {
    return this._isIdTaken('action', objectId, actionId);
  },

  _getNewId: function(type, key) {
    this._createKeyIfNotExist(type, key);
    var id;
    do {
      this._data[type].counters[key] += 1;
      id = type + '_' + key + '_' + this._data[type].counters[key];
    } while (this._isIdTaken(type, key, id));

    this._data[type].ids[key].push(id);
    return id;
  },

  _registerId: function(type, key, id) {
    if (!this._isIdTaken(type, key, id)) {
      this._createKeyIfNotExist(type, key);
      this._data[type].ids[key].push(id);
      this._data[type].counters[key] ++;
    }
  },

  _createKeyIfNotExist: function(type, key) {
    if (!this._data[type].ids.hasOwnProperty(key)) {
      this._data[type].ids[key] = [];
      this._data[type].counters[key] = 0;
    }
  },

  _isIdTaken: function(type, key, id) {
    var result;
    if (this._data[type].ids.hasOwnProperty(key)) {
      result = this._data[type].ids[key].indexOf(id) >= 0;
    }
    return !!result;
  }
});

export default IdManager;
