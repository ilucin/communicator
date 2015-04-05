'use strict';

var _ = require('lodash');
var Backbone = require('backbone');

var submodules = require('modules/submodules');

function initSubmodules(instance, config) {
  _.each(config, function(submoduleConfig, submoduleName) {
    if (submodules[submoduleName]) {
      instance.addSubmodule(submodules[submoduleName], submoduleConfig);
    } else {
      console.warn('Could not load submodule: ' + submoduleName);
    }
  });
}

function callOnSubmodules(module, method, args) {
  var submodule;
  for (var i = 0, l = module._submodules.length; i < l; i++) {
    submodule = module._submodules[i];
    if (submodule[method]) {
      submodule[method].apply(module, args);
    }
  }
}

var BaseModule = function(module) {
  this.id = module.id;
  delete module.id;
  this._submodules = [];
  initSubmodules(this, module);
  this.onCreate(module);
};

_.extend(BaseModule.prototype, Backbone.Events);

BaseModule.prototype.createModule = function(config) {
  return new BaseModule(config);
};

BaseModule.prototype.addSubmodule = function(submodule, submoduleConfig) {
  this._submodules.push(submodule);
  if (submodule.api) {
    _.each(submodule.api, function(method, methodName) {
      this[methodName] = method;
    }, this);
  }
  submodule.init.call(this, submoduleConfig);
};

BaseModule.prototype.trigger = function(ev, data) {
  // console.log('BaseModule.trigger', this.id, ev, data);
  Backbone.Events.trigger.apply(this, arguments);
};

BaseModule.prototype.on = function(ev) {
  // console.log('BaseModule.on', this.id, ev);
  Backbone.Events.on.apply(this, arguments);
};

BaseModule.prototype.onCreate = function() {
  callOnSubmodules(this, 'onCreate');
};

BaseModule.prototype.onDisplay = function() {
  callOnSubmodules(this, 'onDisplay');
};

BaseModule.prototype.onDataChange = function() {
  callOnSubmodules(this, 'onDataChange');
};

BaseModule.prototype.destroy = function() {
  this.onDestroy();
};

BaseModule.prototype.onDestroy = function() {
  callOnSubmodules(this, 'onDestroy');
};

module.exports = BaseModule;
